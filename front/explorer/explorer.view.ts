namespace $.$$ {

	export class $raggu_web_front_explorer extends $.$raggu_web_front_explorer {

		// Cast to extended class to access TS-only methods (selected_node/selected_color/...)
		graph_view() {
			return this.Graph() as $.$$.$raggu_web_front_explorer_forcegraph
		}

		// Selected node, mirrors $raggu_web_front_explorer_forcegraph internals
		selected() {
			return this.graph_view().selected_node()
		}

		// Aside text — fall back to placeholder when nothing selected
		entity_name() {
			return this.selected()?.label ?? this.aside_empty_text()
		}

		entity_type() {
			return this.selected()?.type ?? ''
		}

		entity_desc() {
			const n = this.selected()
			if ( !n ) return ''
			return `Mock entity of type ${ n.type }, connected to ${ n.degree } other nodes.`
		}

		relations_title() {
			const n = this.selected()
			if ( !n ) return ''
			return this.relations_title_template().replace( '%s', String( n.degree ) )
		}

		rels(): Array< { relation: string, target_label: string } > {
			return this.graph_view().selected_relations().slice( 0, 5 )
		}

		rel_rows() {
			return this.rels().map( ( _, i ) => this.Rel( i ) )
		}

		rel_type( i: number ) { return this.rels()[ i ]?.relation ?? '' }
		rel_target( i: number ) { return this.rels()[ i ]?.target_label ?? '' }

		// Entity_dot color reflects type of selected node
		Entity_dot() {
			const dot = super.Entity_dot()
			dot.style = () => ( {
				background: this.graph_view().selected_color(),
			} )
			return dot
		}

	}

}
