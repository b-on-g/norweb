namespace $.$$ {

	const SCREEN_TITLES: Record< string, string > = {
		gallery: 'Датасеты',
		explorer: 'Граф знаний',
		chat: 'Чат с агентом',
		dashboard: 'Дашборд',
	}

	const DATASET_NAMES: Record< string, string > = {
		law: 'Кодексы и законы РФ',
		un: 'Устав ООН + резолюции',
		papers: 'Наша статья + цитируемые',
		medical: 'GraphRAG-Bench Medical',
		wiki: 'Википедия: писатели',
		own: 'Свой корпус',
	}

	export class $bog_ragufront_topbar extends $.$bog_ragufront_topbar {

		screen_title() { return SCREEN_TITLES[ this.screen() ] ?? '' }
		dataset_name() { return DATASET_NAMES[ this.dataset_id() ] ?? '' }

		is_fast() { return this.preset() === 'fast' }
		is_accurate() { return this.preset() === 'accurate' }
		is_demo() { return this.preset() === 'demo' }

		@$mol_action click_fast() { this.preset( 'fast' ); return null }
		@$mol_action click_accurate() { this.preset( 'accurate' ); return null }
		@$mol_action click_demo() { this.preset( 'demo' ); return null }

	}

}
