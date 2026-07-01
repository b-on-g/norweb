namespace $.$$ {

	type DatasetStats = {
		id: string
		nodes: string
		edges: string
		comms: string
		/** Dynamic title for user-uploaded datasets. Built-ins use $mol_locale. */
		dynamic?: { title: string; domain: string; desc: string }
	}

	const BUILTIN: readonly DatasetStats[] = [
		{ id: 'law', nodes: '18.4k', edges: '52k', comms: '210' },
		{ id: 'un', nodes: '9.1k', edges: '27k', comms: '96' },
		{ id: 'papers', nodes: '1.2k', edges: '3.4k', comms: '24' },
		{ id: 'medical', nodes: '6.7k', edges: '19k', comms: '71' },
		{ id: 'wiki', nodes: '2.4k', edges: '7.1k', comms: '38' },
		{ id: 'own', nodes: '—', edges: '—', comms: '—' },
	]

	function format_count( n: number ): string {
		if ( n >= 1000 ) {
			const k = n / 1000
			return ( k >= 10 ? k.toFixed( 1 ) : k.toFixed( 2 ) ) + 'k'
		}
		return String( n )
	}

	function random_stats( seed: number ) {
		const rng = ( m: number ) => Math.floor( ( Math.sin( seed++ ) * 10000 % m + m ) % m )
		const nodes = 800 + rng( 7200 )
		const edges = nodes * ( 2 + rng( 4 ) )
		const comms = 12 + rng( 80 )
		return {
			nodes: format_count( nodes ),
			edges: format_count( edges ),
			comms: String( comms ),
		}
	}

	export class $raggu_web_front_gallery extends $.$raggu_web_front_gallery {

		@$mol_mem
		extra_datasets( next?: DatasetStats[] ): DatasetStats[] {
			return next ?? []
		}

		// URL flag `?mock=1` (or missing $mol_state_arg in jsdom tests) → BUILTIN.
		mock_flag(): boolean {
			return this.$.$mol_state_arg.value( 'mock' ) === '1'
		}

		// Reactive fetch of preindexed datasets. Any transport error propagates
		// via $mol_wire so the view frame shows an error plate instead of moks.
		@$mol_mem
		remote_datasets(): DatasetStats[] | null {
			if ( this.mock_flag() ) return null
			const cards = this.$.$raggu_web_front_api(
				$raggu_web_front_api_ragu_list_datasets,
				{ query: { locale: 'ru' } },
			)
			return cards.map( ( c: any ) => ( {
				id: c.id,
				nodes: format_count( c.stats.nodes ),
				edges: format_count( c.stats.edges ),
				comms: String( c.stats.communities ),
				dynamic: { title: c.title, domain: c.domain, desc: c.description },
			} ) )
		}

		datasets() {
			const base = this.remote_datasets() ?? BUILTIN
			return [ ...base, ...this.extra_datasets() ]
		}

		rows() {
			return this.datasets().map( ds => this.Card( ds.id ) )
		}

		dataset( id: string ): DatasetStats {
			return this.datasets().find( d => d.id === id ) ?? BUILTIN[ 0 ]
		}

		dataset_text( id: string, suffix: string ) {
			return this.$.$mol_locale.text( `$raggu_web_front_app_dataset_${ id }_${ suffix }` ) || ''
		}

		card_id( id: string ) { return id }

		card_title( id: string ) {
			const ds = this.dataset( id )
			return ds.dynamic?.title ?? this.dataset_text( id, 'title' )
		}

		card_domain( id: string ) {
			const ds = this.dataset( id )
			return ds.dynamic?.domain ?? this.dataset_text( id, 'domain' )
		}

		card_desc( id: string ) {
			const ds = this.dataset( id )
			return ds.dynamic?.desc ?? this.dataset_text( id, 'desc' )
		}

		card_nodes( id: string ) { return this.dataset( id ).nodes }
		card_edges( id: string ) { return this.dataset( id ).edges }
		card_comms( id: string ) { return this.dataset( id ).comms }

		@$mol_action
		click( id: string ) {
			this.select_dataset( id )
			return null
		}

		/** Mock file size in MB for upload validation. */
		mock_file_size( kind: string ): number {
			// document = always small, index = sometimes too big to demo validation
			return kind === 'index' ? 4.2 : 2.8
		}

		@$mol_action
		upload_doc_click() {
			this.start_upload( 'document' )
			return null
		}

		@$mol_action
		upload_idx_click() {
			this.start_upload( 'index' )
			return null
		}

		@$mol_action
		start_upload( kind: 'document' | 'index' ) {
			this.upload_kind( kind )
			this.upload_showed( true )
			;( this.Upload() as $.$$.$raggu_web_front_gallery_upload ).start( this.mock_file_size( kind ) )
			return null
		}

		@$mol_action
		upload_complete() {
			const kind = this.upload_kind() || 'document'
			const list = this.extra_datasets()
			const idx = list.length + 1
			const id = `up-${ Date.now() }-${ idx }`
			const seed = Date.now() + idx
			const stats = random_stats( seed )
			const title_prefix = this.$.$mol_locale.text(
				kind === 'index'
					? '$raggu_web_front_gallery_uploaded_index_title'
					: '$raggu_web_front_gallery_uploaded_document_title'
			) || ( kind === 'index' ? 'Uploaded index' : 'Uploaded document' )
			const domain = this.$.$mol_locale.text( '$raggu_web_front_gallery_uploaded_domain' )
				|| 'User upload'
			const desc = this.$.$mol_locale.text( '$raggu_web_front_gallery_uploaded_desc' )
				|| 'Mock dataset built by the demo indexing pipeline.'
			this.extra_datasets( [
				...list,
				{
					id,
					nodes: stats.nodes,
					edges: stats.edges,
					comms: stats.comms,
					dynamic: { title: `${ title_prefix } #${ idx }`, domain, desc },
				},
			] )
			this.upload_showed( false )
			this.upload_kind( '' )
			return null
		}

		@$mol_action
		upload_close() {
			this.upload_showed( false )
			this.upload_kind( '' )
			return null
		}

	}

}
