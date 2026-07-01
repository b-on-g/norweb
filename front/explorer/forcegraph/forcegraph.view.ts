namespace $.$$ {

	type NodeType = 'PERSON' | 'ORG' | 'LOC' | 'EVENT' | 'DATE' | 'WORK' | 'LAW'

	type GraphNode = {
		id: string
		label: string
		type: NodeType
		degree: number
		x: number
		y: number
	}

	type GraphEdge = {
		id: string
		source: string
		target: string
		strength: number
		relation: string
	}

	const RELATIONS = [
		'MENTIONS', 'CITES', 'WORKS_AT', 'LOCATED_IN', 'INVOLVES',
		'DATED', 'AUTHORED', 'PART_OF', 'REFERS_TO', 'CONTAINS',
	]

	const TYPE_COLOR: Record< NodeType, string > = {
		PERSON: '#e0524f',
		ORG: '#4f8ee0',
		LOC: '#3fb56b',
		EVENT: '#d97ad9',
		DATE: '#e0a73f',
		WORK: '#7c6ce0',
		LAW: '#3fb8b8',
	}

	const TYPES: NodeType[] = [ 'PERSON', 'ORG', 'LOC', 'EVENT', 'DATE', 'WORK', 'LAW' ]

	// Deterministic PRNG for stable mock graph between renders.
	function rand( seed: number ) {
		let s = seed
		return () => {
			s = ( s * 9301 + 49297 ) % 233280
			return s / 233280
		}
	}

	export function build_mock( seed = 42, n_nodes = 80, n_edges = 130 ): { nodes: GraphNode[], edges: GraphEdge[] } {
		const r = rand( seed )
		const nodes: GraphNode[] = []
		for ( let i = 0; i < n_nodes; i++ ) {
			const type = TYPES[ Math.floor( r() * TYPES.length ) ]
			nodes.push( {
				id: `n${ i }`,
				label: `${ type } ${ i }`,
				type,
				degree: 0,
				x: ( r() - 0.5 ) * 400,
				y: ( r() - 0.5 ) * 400,
			} )
		}
		const edges: GraphEdge[] = []
		const seen = new Set< string >()
		for ( let i = 0; i < n_edges; i++ ) {
			let a: number, b: number, key: string
			do {
				a = Math.floor( r() * n_nodes )
				b = Math.floor( r() * n_nodes )
				key = a < b ? `${ a }-${ b }` : `${ b }-${ a }`
			} while ( a === b || seen.has( key ) )
			seen.add( key )
			edges.push( {
				id: `e${ i }`,
				source: `n${ a }`,
				target: `n${ b }`,
				strength: 0.3 + r() * 0.7,
				relation: RELATIONS[ Math.floor( r() * RELATIONS.length ) ],
			} )
			nodes[ a ].degree++
			nodes[ b ].degree++
		}
		return { nodes, edges }
	}

	const FORCE_K = 60
	const THETA = 0.3   // Barnes-Hut opening angle. Smaller = more accurate, slower
	const THETA2 = THETA * THETA

	// Tunable physics params — passed into tick_layout every tick.
	// Defaults come from view.tree; demo playground overrides via bindings.
	export type LayoutParams = {
		gravity: number       // radial pull toward origin (ForceAtlas2 `gravity`)
		force_scale: number   // force → per-tick acceleration factor
		damping: number       // velocity persistence per tick (0..1, higher = springier)
		min_move: number      // smooth freeze gate midpoint (px/tick)
		max_speed: number     // tanh-saturated speed ceiling
	}

	// --- Barnes-Hut quadtree ------------------------------------------------
	// Instead of every-pair repulsion ( O(N²) ), aggregate distant groups of
	// nodes into a single "average" point ( center of mass ) and apply one
	// repulsion. Node A treats subtree S as one point iff size(S) / dist < θ.
	// Overall: O(N log N).
	type QuadCell = {
		x0: number, y0: number, size: number,
		com_x: number, com_y: number, count: number,
		node?: { id: string, x: number, y: number },   // leaf holder
		kids?: QuadCell[],                              // 4 quadrants when split
	}

	function make_cell( x0: number, y0: number, size: number ): QuadCell {
		return { x0, y0, size, com_x: 0, com_y: 0, count: 0 }
	}

	function insert( cell: QuadCell, node: { id: string, x: number, y: number }, depth: number ): void {
		cell.com_x += node.x
		cell.com_y += node.y
		cell.count++
		if ( depth > 20 ) return   // guard against coincident points
		if ( !cell.kids && !cell.node ) { cell.node = node; return }
		if ( cell.node ) {
			// Was a leaf — split, push old node down, then insert new
			const old = cell.node
			cell.node = undefined
			const h = cell.size / 2
			cell.kids = [
				make_cell( cell.x0,     cell.y0,     h ),
				make_cell( cell.x0 + h, cell.y0,     h ),
				make_cell( cell.x0,     cell.y0 + h, h ),
				make_cell( cell.x0 + h, cell.y0 + h, h ),
			]
			insert_child( cell, old, depth + 1 )
		}
		insert_child( cell, node, depth + 1 )
	}

	function insert_child( cell: QuadCell, node: { id: string, x: number, y: number }, depth: number ) {
		const mx = cell.x0 + cell.size / 2
		const my = cell.y0 + cell.size / 2
		const idx = ( node.x >= mx ? 1 : 0 ) + ( node.y >= my ? 2 : 0 )
		insert( cell.kids![ idx ], node, depth )
	}

	function accumulate_repulsion( cell: QuadCell, id: string, x: number, y: number, k2: number, out: { dx: number, dy: number } ): void {
		if ( cell.count === 0 ) return
		if ( cell.node && cell.node.id === id ) return
		const cx = cell.com_x / cell.count
		const cy = cell.com_y / cell.count
		const dx = x - cx
		const dy = y - cy
		const d2 = dx * dx + dy * dy || 0.01
		// Barnes-Hut criterion: if cell size² is small enough vs distance², treat as one aggregate mass
		if ( !cell.kids || cell.size * cell.size < THETA2 * d2 ) {
			const force = ( k2 * cell.count ) / d2
			out.dx += dx * force
			out.dy += dy * force
			return
		}
		for ( const kid of cell.kids ) accumulate_repulsion( kid, id, x, y, k2, out )
	}

	// Velocity-Verlet sim tick — d3-force / ForceAtlas2 style.
	//   v[i] = ( v[i] + acceleration[i] ) * damping     ← momentum with friction
	//   p[i] += v[i] * smoothstep_gate                  ← smooth freeze at low speed
	// Gives Obsidian-style feel on drag: perturbation ripples through edges
	// and dies via damping. Distant nodes have sub-threshold velocity →
	// gate closes, no whole-graph shake.
	// Repulsion via Barnes-Hut quadtree ( O(N log N) instead of naive O(N²) ).

	// Hermite smoothstep — C¹ continuous ramp from 0 at `a` to 1 at `b`.
	function smoothstep( a: number, b: number, x: number ): number {
		if ( x <= a ) return 0
		if ( x >= b ) return 1
		const t = ( x - a ) / ( b - a )
		return t * t * ( 3 - 2 * t )
	}

	export function tick_layout(
		nodes: GraphNode[],
		edges: GraphEdge[],
		positions: Record< string, { x: number, y: number } >,
		velocities: Record< string, { vx: number, vy: number } >,
		pinned_id: string,
		params: LayoutParams,
	): { positions: Record< string, { x: number, y: number } >, velocities: Record< string, { vx: number, vy: number } > } {
		const { gravity, force_scale, damping, min_move, max_speed } = params
		const k = FORCE_K
		const k2 = k * k
		const dispX: Record< string, number > = {}
		const dispY: Record< string, number > = {}

		// Bounds for quadtree — encompass all current node positions
		let min_x = Infinity, min_y = Infinity, max_x = -Infinity, max_y = -Infinity
		for ( const n of nodes ) {
			const p = positions[ n.id ]
			if ( p.x < min_x ) min_x = p.x
			if ( p.y < min_y ) min_y = p.y
			if ( p.x > max_x ) max_x = p.x
			if ( p.y > max_y ) max_y = p.y
		}
		const size = Math.max( max_x - min_x, max_y - min_y ) + 1
		const cx = ( min_x + max_x ) / 2
		const cy = ( min_y + max_y ) / 2
		const root = make_cell( cx - size / 2, cy - size / 2, size )
		for ( const n of nodes ) {
			const p = positions[ n.id ]
			insert( root, { id: n.id, x: p.x, y: p.y }, 0 )
		}

		// Repulsion — Barnes-Hut walk per node
		for ( const n of nodes ) {
			const p = positions[ n.id ]
			const out = { dx: 0, dy: 0 }
			accumulate_repulsion( root, n.id, p.x, p.y, k2, out )
			dispX[ n.id ] = out.dx
			dispY[ n.id ] = out.dy
		}
		// Attraction — exact, O(E)
		for ( const e of edges ) {
			const dx = positions[ e.source ].x - positions[ e.target ].x
			const dy = positions[ e.source ].y - positions[ e.target ].y
			const dist = Math.sqrt( dx * dx + dy * dy ) || 0.01
			const force = ( dist * dist ) / k * e.strength
			const fx = ( dx / dist ) * force
			const fy = ( dy / dist ) * force
			dispX[ e.source ] -= fx; dispY[ e.source ] -= fy
			dispX[ e.target ] += fx; dispY[ e.target ] += fy
		}
		// Gravity — soft radial pull toward origin
		for ( const n of nodes ) {
			const p = positions[ n.id ]
			dispX[ n.id ] -= p.x * gravity * k
			dispY[ n.id ] -= p.y * gravity * k
		}

		// Integrate: velocities accumulate + damp; position moves via smooth freeze gate.
		// No hard cutoffs — both the speed ceiling and freeze use C¹-continuous ramps
		// so nodes decelerate/stop imperceptibly instead of snapping.
		const next_pos: Record< string, { x: number, y: number } > = {}
		const next_vel: Record< string, { vx: number, vy: number } > = {}
		for ( const n of nodes ) {
			if ( n.id === pinned_id ) {
				next_pos[ n.id ] = positions[ n.id ]
				next_vel[ n.id ] = { vx: 0, vy: 0 }
				continue
			}
			const prev = velocities[ n.id ] || { vx: 0, vy: 0 }
			let vx = ( prev.vx + dispX[ n.id ] * force_scale ) * damping
			let vy = ( prev.vy + dispY[ n.id ] * force_scale ) * damping
			const speed = Math.sqrt( vx * vx + vy * vy )
			// Soft speed cap: tanh saturation. Below cap almost no effect,
			// above cap velocity asymptotically bounded to max_speed.
			if ( speed > 0 ) {
				const cap_scale = max_speed * Math.tanh( speed / max_speed ) / speed
				vx *= cap_scale
				vy *= cap_scale
			}
			// Soft freeze gate: position change fades smoothly to zero as velocity
			// drops below min_move. No visual snap-to-stop. Velocity itself
			// keeps damping toward zero so eventually gate*v goes to zero too.
			const gate = smoothstep( min_move * 0.3, min_move * 1.5, speed )
			next_pos[ n.id ] = { x: positions[ n.id ].x + vx * gate, y: positions[ n.id ].y + vy * gate }
			next_vel[ n.id ] = { vx, vy }
		}
		return { positions: next_pos, velocities: next_vel }
	}

	// Initial random positions from mock — no synchronous FR pre-compute.
	// The view auto-starts a live sim that visibly settles the graph
	// ( Obsidian-style spring-in ).
	export function build_initial_positions( nodes: GraphNode[], _edges: GraphEdge[] ): Record< string, { x: number, y: number } > {
		const positions: Record< string, { x: number, y: number } > = {}
		for ( const n of nodes ) positions[ n.id ] = { x: n.x, y: n.y }
		return positions
	}

	export class $raggu_web_front_explorer_forcegraph extends $.$raggu_web_front_explorer_forcegraph {

		// Plain non-reactive field overriding the auto-gen @$mol_mem drag_id.
		// The mem-cell version got invalidated between event-handler fibers
		// (wire_async destroys previous fiber on each event, which appears to
		// reset the subscribed cell back to its declared default '').
		// Plain field persists across calls without wire interference.
		drag_id_raw = ''
		override drag_id( next?: string ) {
			if ( next !== undefined ) this.drag_id_raw = next
			return this.drag_id_raw
		}

		// Pan/zoom state — fold into reactive view_box
		@$mol_mem
		computed_view_box() {
			const z = Math.max( 0.2, Math.min( 5, this.zoom() ) )
			const size = 600 / z
			const x = -size / 2 + this.pan_x()
			const y = -size / 2 + this.pan_y()
			return `${ x } ${ y } ${ size } ${ size }`
		}

		// Wheel / trackpad-pinch zoom.
		// Uses exp( -deltaY × sensitivity ) so many small deltaY events (trackpad
		// pinch) compose smoothly instead of stacking as 10% discrete jumps.
		@$mol_action
		wheel( event?: WheelEvent ) {
			if ( !event ) return
			event.preventDefault()
			const factor = Math.exp( -event.deltaY * 0.005 )
			this.zoom( this.zoom() * factor )
		}

		// Last pointer position (in client/screen pixels). Used by BOTH pan and node-drag
		// as the anchor for computing pixel-delta on each pointermove.
		dragging = false
		last_x = 0
		last_y = 0
		// Total movement during the current pointer-down session, in screen pixels.
		// Below DRAG_THRESHOLD it's a click, above it's a real drag (suppresses click).
		moved_px = 0
		// Where the pointer landed at pointerdown — for total-distance computation.
		start_x = 0
		start_y = 0

		// Minimum pixel distance to treat pointer interaction as drag (vs click).
		// Matches the $mol_touch convention of `>= 4`.
		readonly DRAG_THRESHOLD = 4

		@$mol_action
		pan_start( event?: PointerEvent ) {
			if ( !event ) return
			const target = event.target as Element
			const node_id = target.getAttribute( 'data-node-id' )
			this.last_x = event.clientX
			this.last_y = event.clientY
			this.start_x = event.clientX
			this.start_y = event.clientY
			this.moved_px = 0
			this.just_dragged = ''
			// Capture on the EVENT TARGET (the circle for node-drag, svg for pan).
			// Pointer events keep targeting that element until release — preserves
			// click dispatch on the circle and survives cursor leaving its bounds.
			try { target.setPointerCapture( event.pointerId ) } catch {}
			if ( node_id ) {
				this.drag_id( node_id )
				// Ensure initial positions are seeded before drag starts
				this.ensure_positions()
				// Don't start simulation here — wait until pan_move crosses threshold,
				// so a pure click doesn't trigger force-sim "shaking".
				return
			}
			this.dragging = true
		}

		// Returns svg-units per screen-pixel ratio for x/y. 1 if CTM missing.
		svg_scale(): { ax: number, ay: number } {
			const svg = this.dom_node() as unknown as SVGSVGElement
			const ctm = svg?.getScreenCTM?.()
			if ( !ctm || !ctm.a || !ctm.d ) return { ax: 1, ay: 1 }
			return { ax: 1 / ctm.a, ay: 1 / ctm.d }
		}

		@$mol_action
		pan_move( event?: PointerEvent ) {
			if ( !event ) return
			const dx_px = event.clientX - this.last_x
			const dy_px = event.clientY - this.last_y
			if ( dx_px === 0 && dy_px === 0 ) return
			this.last_x = event.clientX
			this.last_y = event.clientY

			// Track total distance from pointerdown to differentiate click from drag
			const total_dx = event.clientX - this.start_x
			const total_dy = event.clientY - this.start_y
			this.moved_px = Math.sqrt( total_dx * total_dx + total_dy * total_dy )

			// Below threshold while pressing on a node — treat as pending click, don't move
			if ( this.drag_id() && this.moved_px < this.DRAG_THRESHOLD ) return

			const { ax, ay } = this.svg_scale()
			const dx = dx_px * ax
			const dy = dy_px * ay

			// Node drag: shift the dragged node by pointer delta. No boundary clamp —
			// gravity in the sim brings released nodes back naturally.
			if ( this.drag_id() ) {
				// Kick off continuous sim on first real drag movement (idempotent)
				this.start_sim()
				const id = this.drag_id()
				const cur = this.pos( id )
				this.positions( { ... this.positions(), [ id ]: { x: cur.x + dx, y: cur.y + dy } } )
				return
			}

			if ( !this.dragging ) return
			// Pan: opposite direction (world stays under pointer)
			this.pan_x( this.pan_x() - dx )
			this.pan_y( this.pan_y() - dy )
		}

		@$mol_action
		pan_end() {
			this.dragging = false
			if ( this.drag_id() ) {
				if ( this.moved_px >= this.DRAG_THRESHOLD ) {
					this.just_dragged = this.drag_id()
				}
				this.drag_id( '' )
			}
		}

		// Convert pointer client coords → svg userspace via native CTM.
		// Handles viewBox + preserveAspectRatio + zoom/pan in one step.
		client_to_svg( event: PointerEvent ): { x: number, y: number } {
			const svg = this.dom_node() as unknown as SVGSVGElement
			const ctm = svg.getScreenCTM()
			if ( !ctm ) return { x: 0, y: 0 }
			const pt = svg.createSVGPoint()
			pt.x = event.clientX
			pt.y = event.clientY
			const local = pt.matrixTransform( ctm.inverse() )
			return { x: local.x, y: local.y }
		}

		// Node count via URL arg `graph_n` — e.g. `#!screen=explorer/graph_n=500`.
		// Round-trips like other app args (null when default → removed from URL).
		@$mol_mem
		graph_n( next?: number ) {
			const arg = this.$.$mol_state_arg
			const fallback = 80
			if ( next === undefined ) {
				const raw = arg.value( 'graph_n' )
				const parsed = raw ? Number( raw ) : 0
				return parsed > 0 ? parsed : fallback
			}
			arg.value( 'graph_n', next === fallback ? null : String( next ) )
			return next
		}

		@$mol_mem
		mock(): { nodes: GraphNode[], edges: GraphEdge[] } {
			const n = this.graph_n()
			return build_mock( 42, n, Math.round( n * 1.6 ) )
		}

		nodes() { return this.mock().nodes }
		edges() { return this.mock().edges }

		// Lazily-computed initial FR layout — memoized so first render already shows
		// nodes settled into the circular bound, not the raw square mock coords.
		@$mol_mem
		initial_positions(): Record< string, { x: number, y: number } > {
			return build_initial_positions( this.nodes(), this.edges() )
		}

		// Called by pan_start / tick_layout to make sure positions cell is populated
		// before we start mutating it live.
		ensure_positions(): Record< string, { x: number, y: number } > {
			let p = this.positions()
			if ( Object.keys( p ).length === 0 ) {
				p = { ... this.initial_positions() }
				this.positions( p )
			}
			return p
		}

		// Per-node velocity — the state that makes drags ripple through edges
		// then die via damping instead of shaking the whole graph each frame.
		velocities: Record< string, { vx: number, vy: number } > = {}

		// Bundle the tunable params ( declared as view.tree props with defaults ).
		layout_params(): LayoutParams {
			return {
				gravity: this.gravity(),
				force_scale: this.force_scale(),
				damping: this.damping(),
				min_move: this.min_move(),
				max_speed: this.max_speed(),
			}
		}

		// One sim tick.
		@$mol_action
		tick() {
			const positions = this.ensure_positions()
			const next = tick_layout( this.nodes(), this.edges(), positions, this.velocities, this.drag_id(), this.layout_params() )
			this.velocities = next.velocities
			this.positions( next.positions )
		}

		// Continuous simulation loop driven by requestAnimationFrame.
		// Runs until frame budget exhausted AND no drag is active. While the
		// user is dragging, budget is re-armed each frame so neighbors keep
		// settling smoothly around the moved node.
		sim_running = false
		sim_frames_left = 0
		readonly SIM_INITIAL_FRAMES = 260
		readonly SIM_DRAG_FRAMES = 60

		start_sim( frames: number = this.SIM_DRAG_FRAMES ) {
			this.sim_frames_left = Math.max( this.sim_frames_left, frames )
			if ( this.sim_running ) return
			if ( typeof window === 'undefined' ) return
			this.sim_running = true
			const loop = () => {
				if ( !this.sim_running ) return
				try { this.tick() } catch {}
				if ( this.drag_id() ) {
					this.sim_frames_left = Math.max( this.sim_frames_left, this.SIM_DRAG_FRAMES )
				}
				this.sim_frames_left--
				if ( this.sim_frames_left <= 0 && !this.drag_id() ) {
					this.sim_running = false
					return
				}
				requestAnimationFrame( loop )
			}
			requestAnimationFrame( loop )
		}

		// Kick off the initial spring-in exactly once, on first mount.
		initial_sim_started = false
		@$mol_mem
		override dom_tree() {
			const tree = super.dom_tree()
			if ( !this.initial_sim_started ) {
				this.initial_sim_started = true
				this.start_sim( this.SIM_INITIAL_FRAMES )
			}
			return tree
		}

		@$mol_mem
		node_by_id(): Record< string, GraphNode > {
			const m: Record< string, GraphNode > = {}
			for ( const n of this.nodes() ) m[ n.id ] = n
			return m
		}

		node_views() {
			return this.nodes().map( n => this.Node( n.id ) )
		}

		edge_views() {
			return this.edges().map( e => this.Edge( e.id ) )
		}

		// Effective node position: live positions cell (drag/sim output) first,
		// then the memoized initial FR layout, then raw mock as last resort.
		pos( id: string ) {
			const live = this.positions()[ id ]
			if ( live ) return live
			return this.initial_positions()[ id ] ?? this.node_by_id()[ id ]
		}

		// Used in view.tree as `data-node-id` attr so pan_start can identify node-target.
		node_id( id: string ) { return id }

		// Node accessors (keyed) — return strings, SVG attrs expect string
		node_x( id: string ) { return String( this.pos( id ).x ) }
		node_y( id: string ) { return String( this.pos( id ).y ) }
		node_radius( id: string ) {
			const n = this.node_by_id()[ id ]
			return String( 4 + Math.min( n.degree, 10 ) * 0.7 )
		}
		node_color( id: string ) { return TYPE_COLOR[ this.node_by_id()[ id ].type ] }
		node_stroke( id: string ) {
			if ( this.selected_id() === id ) return '#ffffff'
			if ( this.hovered_id() === id ) return '#ffffff'
			return 'transparent'
		}
		node_stroke_width( id: string ) {
			if ( this.selected_id() === id ) return '2.5'
			if ( this.hovered_id() === id ) return '1.5'
			return '0'
		}

		@$mol_action
		hover_enter( id: string ) {
			this.hovered_id( id )
			return null
		}

		@$mol_action
		hover_leave() {
			this.hovered_id( '' )
			return null
		}

		// Edge accessors (keyed)
		@$mol_mem
		edge_by_id(): Record< string, GraphEdge > {
			const m: Record< string, GraphEdge > = {}
			for ( const e of this.edges() ) m[ e.id ] = e
			return m
		}

		edge_x1( id: string ) { return String( this.pos( this.edge_by_id()[ id ].source ).x ) }
		edge_y1( id: string ) { return String( this.pos( this.edge_by_id()[ id ].source ).y ) }
		edge_x2( id: string ) { return String( this.pos( this.edge_by_id()[ id ].target ).x ) }
		edge_y2( id: string ) { return String( this.pos( this.edge_by_id()[ id ].target ).y ) }
		edge_width( id: string ) {
			const e = this.edge_by_id()[ id ]
			const base = e.strength * 1.5 + 0.4
			const incident = this.hovered_id() && ( e.source === this.hovered_id() || e.target === this.hovered_id() )
				|| this.selected_id() && ( e.source === this.selected_id() || e.target === this.selected_id() )
			return String( incident ? base * 2 : base )
		}
		edge_opacity( id: string ) {
			const e = this.edge_by_id()[ id ]
			const hid = this.hovered_id() || this.selected_id()
			if ( !hid ) return '0.55'
			return ( e.source === hid || e.target === hid ) ? '0.95' : '0.18'
		}
		edge_color( id: string ) {
			const e = this.edge_by_id()[ id ]
			const hid = this.hovered_id() || this.selected_id()
			if ( hid && ( e.source === hid || e.target === hid ) ) return '#ffffff'
			return '#7a7672'
		}

		// Suppress click that fires right after node-drag (drag_id was just released)
		just_dragged = ''

		@$mol_action
		click( id: string ) {
			if ( this.just_dragged === id ) {
				this.just_dragged = ''
				return null
			}
			this.selected_id( id )
			this.select( id )
			return null
		}

		// Background click (anywhere not on a node circle) → deselect
		@$mol_action
		bg_click( event?: MouseEvent ) {
			if ( !event ) return
			const target = event.target as Element
			if ( target.getAttribute( 'data-node-id' ) ) return
			this.selected_id( '' )
			this.select( '' )
			return null
		}

		// Tooltip — single floating label above hovered-OR-selected node
		active_id() { return this.hovered_id() || this.selected_id() }

		// Conditional sub-list — render bg+text only when an active node exists
		tooltip_sub(): readonly $mol_view[] {
			return this.active_id()
				? [ this.Tooltip_bg(), this.Tooltip_text() ]
				: []
		}

		tooltip_text() {
			const id = this.active_id()
			return id ? this.node_by_id()[ id ].label : ''
		}

		tooltip_font_size() {
			return String( Math.max( 6, Math.min( 12, 11 / Math.sqrt( this.zoom() ) ) ) )
		}

		// Position tooltip above the active node, in svg space
		tooltip_anchor() {
			const id = this.active_id()
			if ( !id ) return { x: 0, y: 0, r: 0 }
			const r = 4 + Math.min( this.node_by_id()[ id ].degree, 10 ) * 0.7
			return { x: this.pos( id ).x, y: this.pos( id ).y, r }
		}

		tooltip_x() {
			return String( this.tooltip_anchor().x )
		}
		// Text baseline is the middle of the bg box; sits above circle with padding
		tooltip_y() {
			const a = this.tooltip_anchor()
			const fs = parseFloat( this.tooltip_font_size() )
			return String( a.y - a.r - 6 - fs * 0.7 )
		}

		// Bg sized roughly by char-count × char-width
		tooltip_bg_w() {
			const text = this.tooltip_text()
			const fs = parseFloat( this.tooltip_font_size() )
			return String( text.length * fs * 0.6 + 10 )
		}
		tooltip_bg_h() {
			return String( parseFloat( this.tooltip_font_size() ) + 8 )
		}
		tooltip_bg_x() {
			return String( this.tooltip_anchor().x - parseFloat( this.tooltip_bg_w() ) / 2 )
		}
		tooltip_bg_y() {
			const a = this.tooltip_anchor()
			return String( a.y - a.r - 6 - parseFloat( this.tooltip_bg_h() ) )
		}

		// Selected-node helpers consumed by Aside
		selected_node(): GraphNode | null {
			const id = this.selected_id()
			return id ? this.node_by_id()[ id ] ?? null : null
		}

		selected_color() {
			const n = this.selected_node()
			return n ? TYPE_COLOR[ n.type ] : TYPE_COLOR.WORK
		}

		// Edges incident to selected node, with the OTHER node's label
		selected_relations(): Array< { relation: string, target_label: string } > {
			const id = this.selected_id()
			if ( !id ) return []
			const idx = this.node_by_id()
			return this.edges()
				.filter( e => e.source === id || e.target === id )
				.map( e => {
					const other_id = e.source === id ? e.target : e.source
					return { relation: e.relation, target_label: idx[ other_id ].label }
				} )
		}

	}

}
