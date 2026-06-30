namespace $.$$ {

	// jsdom doesn't implement SVGSVGElement.getScreenCTM/createSVGPoint.
	// Stub with identity-like behavior so drag math runs as it would in a real browser
	// where 1 screen-pixel == 1 svg-unit.
	function stub_svg( g: $raggu_web_front_explorer_forcegraph ) {
		const svg = g.dom_node() as unknown as SVGSVGElement & {
			getScreenCTM: () => DOMMatrix
			createSVGPoint: () => DOMPoint
		}
		svg.getScreenCTM = () => ( {
			a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,
			inverse() { return this },
		} as unknown as DOMMatrix )
		svg.createSVGPoint = () => {
			const p: any = { x: 0, y: 0 }
			p.matrixTransform = ( m: DOMMatrix ) => ( {
				x: m.a * p.x + m.c * p.y + m.e,
				y: m.b * p.x + m.d * p.y + m.f,
			} )
			return p
		}
	}

	function pe( x: number, y: number, target?: any ): PointerEvent {
		return { clientX: x, clientY: y, pointerId: 1, target: target ?? null } as unknown as PointerEvent
	}

	function node_target( id: string ) {
		return { getAttribute: ( k: string ) => k === 'data-node-id' ? id : null }
	}

	$mol_test( {

		'pos(id): no override → layout coords'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			const n = g.nodes()[ 0 ]
			const p = g.pos( n.id )
			$mol_assert_equal( p.x, n.x )
			$mol_assert_equal( p.y, n.y )
		},

		// THE bug from user: 1-pixel pointer move ⇒ node travels exactly 1 pixel.
		// If the math is broken, the node "flies" elsewhere.
		'drag below threshold: node does NOT move (treated as pending click)'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			stub_svg( g )
			const n = g.nodes()[ 7 ]
			const x0 = n.x, y0 = n.y
			g.pan_start( pe( x0 + 5, y0 + 5, node_target( n.id ) ) )
			g.pan_move( pe( x0 + 5, y0 + 6 ) )  // 1px < threshold
			const p = g.pos( n.id )
			$mol_assert_equal( p.x, x0 )
			$mol_assert_equal( p.y, y0 )
		},

		'drag above threshold: node tracks pointer delta'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			stub_svg( g )
			const n = g.nodes()[ 3 ]
			const x0 = n.x, y0 = n.y
			g.pan_start( pe( 0, 0, node_target( n.id ) ) )
			g.pan_move( pe( 50, -30 ) )  // 58px ≫ 4
			const p = g.pos( n.id )
			$mol_assert_equal( p.x, x0 + 50 )
			$mol_assert_equal( p.y, y0 - 30 )
		},

		'drag multiple moves accumulate (above threshold)'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			stub_svg( g )
			const n = g.nodes()[ 2 ]
			const x0 = n.x, y0 = n.y
			g.pan_start( pe( 0, 0, node_target( n.id ) ) )
			g.pan_move( pe( 10, 10 ) )  // 14px > 4 — kicks in
			g.pan_move( pe( 25, 15 ) )
			g.pan_move( pe( 25, 25 ) )
			const p = g.pos( n.id )
			$mol_assert_equal( p.x, x0 + 25 )
			$mol_assert_equal( p.y, y0 + 25 )
		},


		'click without prior drag: selects'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			g.click( 'n3' )
			$mol_assert_equal( g.selected_id(), 'n3' )
		},

		// THE click-vs-drag boundary: tap that didn't move past threshold MUST select
		'click after press-without-move (tiny drag): NOT suppressed → selects'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			stub_svg( g )
			const n = g.nodes()[ 0 ]
			g.pan_start( pe( n.x, n.y, node_target( n.id ) ) )
			// User just clicked, didn't drag — pan_move never fires OR with delta < threshold
			g.pan_move( pe( n.x + 1, n.y ) )  // 1 pixel < 4
			g.pan_end()
			$mol_assert_equal( g.just_dragged, '' )  // no suppression
			g.click( n.id )
			$mol_assert_equal( g.selected_id(), n.id )  // selects normally
		},

		'click after real drag (>threshold): IS suppressed'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			stub_svg( g )
			const n = g.nodes()[ 0 ]
			g.pan_start( pe( n.x, n.y, node_target( n.id ) ) )
			g.pan_move( pe( n.x + 20, n.y + 20 ) )  // 28px ≫ 4
			g.pan_end()
			$mol_assert_equal( g.just_dragged, n.id )
			g.click( n.id )
			$mol_assert_equal( g.selected_id(), '' )
		},

		'bg_click on empty bg → deselect'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			g.selected_id( 'n3' )
			g.bg_click( { target: { getAttribute: () => null } } as unknown as MouseEvent )
			$mol_assert_equal( g.selected_id(), '' )
		},

		'bg_click on node circle → keep selection (per-node click handles it)'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			g.selected_id( 'n3' )
			g.bg_click( { target: { getAttribute: ( k: string ) => k === 'data-node-id' ? 'n7' : null } } as unknown as MouseEvent )
			$mol_assert_equal( g.selected_id(), 'n3' )
		},

		'pan (drag on bg): camera moves opposite to pointer'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			stub_svg( g )
			g.pan_start( pe( 0, 0, { getAttribute: () => null } ) )
			$mol_assert_equal( g.drag_id(), '' )
			g.pan_move( pe( 50, 30 ) )
			$mol_assert_equal( g.pan_x(), -50 )
			$mol_assert_equal( g.pan_y(), -30 )
		},

		'pan_move ignores no-move (same coords)'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			stub_svg( g )
			const n = g.nodes()[ 0 ]
			g.pan_start( pe( 10, 10, node_target( n.id ) ) )
			g.pan_move( pe( 10, 10 ) )
			// Position unchanged
			const p = g.pos( n.id )
			$mol_assert_equal( p.x, n.x )
			$mol_assert_equal( p.y, n.y )
		},

		'selected_node / selected_relations'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			const n = g.nodes()[ 3 ]
			g.selected_id( n.id )
			$mol_assert_equal( g.selected_node()?.id, n.id )
			$mol_assert_equal( g.selected_relations().length > 0, true )
		},

		// --- DOM integration: render → inspect → real events ---

		'DOM render: every circle has data-node-id attr'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			const svg = g.dom_tree() as unknown as SVGSVGElement
			const circles = svg.querySelectorAll( 'circle' )
			$mol_assert_equal( circles.length > 0, true )
			let with_attr = 0
			circles.forEach( c => {
				const id = c.getAttribute( 'data-node-id' )
				if ( id ) with_attr++
			} )
			$mol_assert_equal( with_attr, circles.length )
		},

		'DOM event flow: pointerdown on circle → drag mode'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			stub_svg( g )
			const svg = g.dom_tree() as unknown as SVGSVGElement
			const circle = svg.querySelector( 'circle' ) as SVGCircleElement
			const id = circle.getAttribute( 'data-node-id' )!
			$mol_assert_equal( !! id, true )

			// Synth pointerdown event with target=circle
			const ev = { clientX: 10, clientY: 20, pointerId: 1, target: circle } as unknown as PointerEvent
			g.pan_start( ev )
			$mol_assert_equal( g.drag_id(), id )
		},

		'reactive: positions write → node_x reflects new value'( $ ) {
			const g = $raggu_web_front_explorer_forcegraph.make({ $ })
			const n = g.nodes()[ 0 ]
			const x_before = g.node_x( n.id )
			g.positions( { [ n.id ]: { x: 42, y: 99 } } )
			const x_after = g.node_x( n.id )
			const y_after = g.node_y( n.id )
			$mol_assert_equal( x_after, '42' )
			$mol_assert_equal( y_after, '99' )
			$mol_assert_equal( x_after !== x_before, true )
		},

	} )

}
