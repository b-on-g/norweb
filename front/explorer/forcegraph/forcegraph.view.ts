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

	const BOUND_RADIUS = 280
	const FORCE_K = 60

	// One Fruchterman-Reingold iteration. Pure function — takes positions dict,
	// returns updated positions. `pinned_id` (if set) stays put.
	export function tick_layout(
		nodes: GraphNode[],
		edges: GraphEdge[],
		positions: Record< string, { x: number, y: number } >,
		pinned_id: string,
		temp: number,
	): Record< string, { x: number, y: number } > {
		const k = FORCE_K
		const k2 = k * k
		const dispX: Record< string, number > = {}
		const dispY: Record< string, number > = {}
		for ( const n of nodes ) { dispX[ n.id ] = 0; dispY[ n.id ] = 0 }

		// Repulsion
		for ( let i = 0; i < nodes.length; i++ ) {
			for ( let j = i + 1; j < nodes.length; j++ ) {
				const a = nodes[ i ].id, b = nodes[ j ].id
				const dx = positions[ a ].x - positions[ b ].x
				const dy = positions[ a ].y - positions[ b ].y
				const dist2 = dx * dx + dy * dy || 0.01
				const force = k2 / dist2
				const fx = dx * force, fy = dy * force
				dispX[ a ] += fx; dispY[ a ] += fy
				dispX[ b ] -= fx; dispY[ b ] -= fy
			}
		}
		// Attraction
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
		// Apply, capped by temp; clamp into a circle of radius BOUND_RADIUS; skip pinned
		const out: Record< string, { x: number, y: number } > = {}
		for ( const n of nodes ) {
			if ( n.id === pinned_id ) {
				out[ n.id ] = positions[ n.id ]
				continue
			}
			const dlen = Math.sqrt( dispX[ n.id ] ** 2 + dispY[ n.id ] ** 2 ) || 0.01
			let x = positions[ n.id ].x + ( dispX[ n.id ] / dlen ) * Math.min( dlen, temp )
			let y = positions[ n.id ].y + ( dispY[ n.id ] / dlen ) * Math.min( dlen, temp )
			const r = Math.sqrt( x * x + y * y )
			if ( r > BOUND_RADIUS ) {
				x = x * BOUND_RADIUS / r
				y = y * BOUND_RADIUS / r
			}
			out[ n.id ] = { x, y }
		}
		return out
	}

	export function build_initial_positions( nodes: GraphNode[], edges: GraphEdge[] ): Record< string, { x: number, y: number } > {
		let positions: Record< string, { x: number, y: number } > = {}
		for ( const n of nodes ) positions[ n.id ] = { x: n.x, y: n.y }
		let temp = 60
		for ( let i = 0; i < 120; i++ ) {
			positions = tick_layout( nodes, edges, positions, '', temp )
			temp *= 0.96
		}
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

		// Mouse-wheel zoom centered on viewport
		@$mol_action
		wheel( event?: WheelEvent ) {
			if ( !event ) return
			event.preventDefault()
			const factor = event.deltaY > 0 ? 1.1 : 1 / 1.1
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

			// Node drag: shift the dragged node by pointer delta
			if ( this.drag_id() ) {
				// Kick off continuous sim on first real drag movement (idempotent)
				this.start_sim()
				const id = this.drag_id()
				const cur = this.pos( id )
				let nx = cur.x + dx
				let ny = cur.y + dy
				// Clamp dragged node into the circular bound — keeps it inside frame
				const r = Math.sqrt( nx * nx + ny * ny )
				if ( r > BOUND_RADIUS ) {
					nx = nx * BOUND_RADIUS / r
					ny = ny * BOUND_RADIUS / r
				}
				this.positions( { ... this.positions(), [ id ]: { x: nx, y: ny } } )
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

		@$mol_mem
		mock(): { nodes: GraphNode[], edges: GraphEdge[] } {
			return build_mock()
		}

		nodes() { return this.mock().nodes }
		edges() { return this.mock().edges }

		// Initial positions seeded by full FR layout. Stored back into positions cell
		// on first access — subsequent ticks mutate positions live.
		ensure_positions(): Record< string, { x: number, y: number } > {
			let p = this.positions()
			if ( Object.keys( p ).length === 0 ) {
				p = build_initial_positions( this.nodes(), this.edges() )
				this.positions( p )
			}
			return p
		}

		// One sim tick — called from the RAF loop while dragging or in cooldown.
		@$mol_action
		tick() {
			const positions = this.ensure_positions()
			const next = tick_layout( this.nodes(), this.edges(), positions, this.drag_id(), 6 )
			this.positions( next )
		}

		// Continuous simulation loop driven by requestAnimationFrame.
		// Runs while user is dragging; keeps running ~60 frames after release
		// (cooldown) so the rest of the graph settles into a new equilibrium.
		sim_running = false
		sim_cooldown = 0
		readonly SIM_COOLDOWN_FRAMES = 60

		start_sim() {
			if ( this.sim_running ) return
			if ( typeof window === 'undefined' ) return
			this.sim_running = true
			const loop = () => {
				if ( !this.sim_running ) return
				try { this.tick() } catch {}
				if ( this.drag_id() ) this.sim_cooldown = this.SIM_COOLDOWN_FRAMES
				else this.sim_cooldown--
				if ( this.sim_cooldown <= 0 && !this.drag_id() ) {
					this.sim_running = false
					return
				}
				requestAnimationFrame( loop )
			}
			requestAnimationFrame( loop )
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

		// Effective node position: user-dragged override OR layout output
		pos( id: string ) {
			return this.positions()[ id ] ?? this.node_by_id()[ id ]
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
