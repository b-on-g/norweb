namespace $.$$ {

	type DatasetStats = { id: string; nodes: string; edges: string; comms: string }

	const DATASETS: readonly DatasetStats[] = [
		{ id: 'law', nodes: '18.4k', edges: '52k', comms: '210' },
		{ id: 'un', nodes: '9.1k', edges: '27k', comms: '96' },
		{ id: 'papers', nodes: '1.2k', edges: '3.4k', comms: '24' },
		{ id: 'medical', nodes: '6.7k', edges: '19k', comms: '71' },
		{ id: 'wiki', nodes: '2.4k', edges: '7.1k', comms: '38' },
		{ id: 'own', nodes: '—', edges: '—', comms: '—' },
	]

	export class $raggu_web_gallery extends $.$raggu_web_gallery {

		datasets() { return DATASETS as DatasetStats[] }

		rows() {
			return this.datasets().map( ds => this.Card( ds.id ) )
		}

		dataset( id: string ): DatasetStats {
			return this.datasets().find( d => d.id === id ) ?? DATASETS[ 0 ]
		}

		dataset_text( id: string, suffix: string ) {
			return this.$.$mol_locale.text( `$raggu_web_app_dataset_${ id }_${ suffix }` ) || ''
		}

		card_id( id: string ) { return id }
		card_title( id: string ) { return this.dataset_text( id, 'title' ) }
		card_domain( id: string ) { return this.dataset_text( id, 'domain' ) }
		card_desc( id: string ) { return this.dataset_text( id, 'desc' ) }
		card_nodes( id: string ) { return this.dataset( id ).nodes }
		card_edges( id: string ) { return this.dataset( id ).edges }
		card_comms( id: string ) { return this.dataset( id ).comms }

		@$mol_action
		click( id: string ) {
			this.select_dataset( id )
			return null
		}

	}

}
