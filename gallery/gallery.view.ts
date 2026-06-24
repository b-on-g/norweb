namespace $.$$ {

	type Dataset = {
		id: string
		title: string
		domain: string
		desc: string
		nodes: string
		edges: string
		comms: string
	}

	const DATASETS: readonly Dataset[] = [
		{ id: 'law', title: 'Кодексы и законы РФ', domain: 'Право', desc: 'Сеть норм, отсылок, органов и понятий российского права.', nodes: '18.4k', edges: '52k', comms: '210' },
		{ id: 'un', title: 'Устав ООН + резолюции', domain: 'Международное право', desc: 'Органы, государства, статьи и ключевые резолюции ООН.', nodes: '9.1k', edges: '27k', comms: '96' },
		{ id: 'papers', title: 'Наша статья + цитируемые', domain: 'Наука', desc: 'Авторы, методы, бенчмарки и цитирования — граф про сам GraphRAG.', nodes: '1.2k', edges: '3.4k', comms: '24' },
		{ id: 'medical', title: 'GraphRAG-Bench Medical', domain: 'Медицина', desc: 'Биомедицинский корпус из бенчмарков — рядом метрики качества.', nodes: '6.7k', edges: '19k', comms: '71' },
		{ id: 'wiki', title: 'Википедия: писатели', domain: 'Биографии', desc: 'Связный тематический срез: персоны, события, награды.', nodes: '2.4k', edges: '7.1k', comms: '38' },
		{ id: 'own', title: '＋ Загрузить свой', domain: '—', desc: 'Документ или готовый индекс — построим граф на лету.', nodes: '—', edges: '—', comms: '—' },
	]

	export class $bog_ragufront_gallery extends $.$bog_ragufront_gallery {

		datasets() { return DATASETS as readonly Dataset[] as Dataset[] }

		rows() {
			return this.datasets().map( ds => this.Card( ds.id ) )
		}

		dataset( id: string ): Dataset {
			return this.datasets().find( d => d.id === id ) ?? DATASETS[ 0 ]
		}

		card_id( id: string ) { return this.dataset( id ).id }
		card_title( id: string ) { return this.dataset( id ).title }
		card_domain( id: string ) { return this.dataset( id ).domain }
		card_desc( id: string ) { return this.dataset( id ).desc }
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
