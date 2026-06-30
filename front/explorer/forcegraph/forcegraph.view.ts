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

	function build_mock( seed = 42, n_nodes = 80, n_edges = 130 ): { nodes: GraphNode[], edges: GraphEdge[] } {
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

	// Fruchterman-Reingold force-directed layout.
	// Mutates node x/y in place.
	function layout( nodes: GraphNode[], edges: GraphEdge[], iterations = 120 ) {
		const k = 60
		const k2 = k * k
		const area = 600 * 600
		let temp = Math.sqrt( area ) / 10

		for ( let it = 0; it < iterations; it++ ) {
			// Repulsion: O(n²)
			const dispX = new Float64Array( nodes.length )
			const dispY = new Float64Array( nodes.length )

			for ( let i = 0; i < nodes.length; i++ ) {
				for ( let j = i + 1; j < nodes.length; j++ ) {
					const dx = nodes[ i ].x - nodes[ j ].x
					const dy = nodes[ i ].y - nodes[ j ].y
					const dist2 = dx * dx + dy * dy || 0.01
					const force = k2 / dist2
					const fx = dx * force
					const fy = dy * force
					dispX[ i ] += fx
					dispY[ i ] += fy
					dispX[ j ] -= fx
					dispY[ j ] -= fy
				}
			}

			// Attraction along edges
			const idx: Record< string, number > = {}
			nodes.forEach( ( n, i ) => idx[ n.id ] = i )
			for ( const e of edges ) {
				const i = idx[ e.source ], j = idx[ e.target ]
				const dx = nodes[ i ].x - nodes[ j ].x
				const dy = nodes[ i ].y - nodes[ j ].y
				const dist = Math.sqrt( dx * dx + dy * dy ) || 0.01
				const force = ( dist * dist ) / k * e.strength
				const fx = ( dx / dist ) * force
				const fy = ( dy / dist ) * force
				dispX[ i ] -= fx
				dispY[ i ] -= fy
				dispX[ j ] += fx
				dispY[ j ] += fy
			}

			// Apply displacement, capped by temp; cool down
			for ( let i = 0; i < nodes.length; i++ ) {
				const dlen = Math.sqrt( dispX[ i ] ** 2 + dispY[ i ] ** 2 ) || 0.01
				nodes[ i ].x += ( dispX[ i ] / dlen ) * Math.min( dlen, temp )
				nodes[ i ].y += ( dispY[ i ] / dlen ) * Math.min( dlen, temp )
				// Soft bounding to area
				nodes[ i ].x = Math.max( -280, Math.min( 280, nodes[ i ].x ) )
				nodes[ i ].y = Math.max( -280, Math.min( 280, nodes[ i ].y ) )
			}
			temp *= 0.96
		}
	}

	export class $raggu_web_front_explorer_forcegraph extends $.$raggu_web_front_explorer_forcegraph {

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

		// Drag-to-pan: track last pointer position when not on a node
		dragging = false
		last_x = 0
		last_y = 0

		@$mol_action
		pan_start( event?: PointerEvent ) {
			if ( !event ) return
			const target = event.target as Element
			const node_id = target.getAttribute( 'data-node-id' )
			const svg = this.dom_node() as unknown as Element
			try { svg.setPointerCapture( event.pointerId ) } catch {}
			if ( node_id ) {
				this.drag_id( node_id )
				return
			}
			this.dragging = true
			this.last_x = event.clientX
			this.last_y = event.clientY
		}

		@$mol_action
		pan_move( event?: PointerEvent ) {
			if ( !event ) return

			// Node drag: move the dragged node in svg-space
			if ( this.drag_id() ) {
				const pt = this.client_to_svg( event )
				const id = this.drag_id()
				this.positions( { ... this.positions(), [ id ]: pt } )
				return
			}

			if ( !this.dragging ) return
			const dx = event.clientX - this.last_x
			const dy = event.clientY - this.last_y
			this.last_x = event.clientX
			this.last_y = event.clientY
			const svg = this.dom_node() as unknown as SVGSVGElement
			const scale = ( 600 / this.zoom() ) / svg.clientWidth
			this.pan_x( this.pan_x() - dx * scale )
			this.pan_y( this.pan_y() - dy * scale )
		}

		@$mol_action
		pan_end() {
			this.dragging = false
			if ( this.drag_id() ) {
				this.just_dragged = this.drag_id()
				this.drag_id( '' )
			}
		}

		// Convert pointer client coords → svg coords accounting for current view_box.
		// Use dom_node() rather than event.currentTarget — the latter is reset to null
		// once event dispatch returns from inside @$mol_action's fiber.
		client_to_svg( event: PointerEvent ): { x: number, y: number } {
			const svg = this.dom_node() as unknown as SVGSVGElement
			const rect = svg.getBoundingClientRect()
			const z = Math.max( 0.2, Math.min( 5, this.zoom() ) )
			const size = 600 / z
			const px = ( event.clientX - rect.left ) / rect.width
			const py = ( event.clientY - rect.top ) / rect.height
			return {
				x: -size / 2 + this.pan_x() + px * size,
				y: -size / 2 + this.pan_y() + py * size,
			}
		}

		@$mol_mem
		mock(): { nodes: GraphNode[], edges: GraphEdge[] } {
			const g = build_mock()
			layout( g.nodes, g.edges )
			return g
		}

		nodes() { return this.mock().nodes }
		edges() { return this.mock().edges }

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
