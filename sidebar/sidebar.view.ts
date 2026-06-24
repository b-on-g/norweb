namespace $.$$ {

	const DATASET_NAMES: Record< string, string > = {
		law: 'Кодексы и законы РФ',
		un: 'Устав ООН + резолюции',
		papers: 'Наша статья + цитируемые',
		medical: 'GraphRAG-Bench Medical',
		wiki: 'Википедия: писатели',
		own: 'Свой корпус',
	}

	export class $bog_ragufront_sidebar extends $.$bog_ragufront_sidebar {

		dataset_name() {
			return DATASET_NAMES[ this.dataset_id() ] ?? ''
		}

		is_gallery() { return this.screen() === 'gallery' }
		is_explorer() { return this.screen() === 'explorer' }
		is_chat() { return this.screen() === 'chat' }
		is_dashboard() { return this.screen() === 'dashboard' }

		is_en() { return this.lang() === 'EN' }
		is_ru() { return this.lang() === 'RU' }

		@$mol_action click_gallery() { this.screen( 'gallery' ); return null }
		@$mol_action click_explorer() { this.screen( 'explorer' ); return null }
		@$mol_action click_chat() { this.screen( 'chat' ); return null }
		@$mol_action click_dashboard() { this.screen( 'dashboard' ); return null }

		@$mol_action click_en() { this.lang( 'EN' ); return null }
		@$mol_action click_ru() { this.lang( 'RU' ); return null }

	}

}
