namespace $.$$ {

	export class $bog_norweb_front_app extends $.$bog_norweb_front_app {

		body() {
			// Сводка не зависит от датасета, для остальных экранов без него показываем Gallery.
			if( this.screen() === 'summary' ) return [ this.Summary() ]
			const s = this.dataset_id() ? this.screen() : 'gallery'
			switch( s ) {
				case 'gallery': return [ this.Gallery() ]
				case 'explorer': return [ this.Explorer() ]
				case 'chat': return [ this.Chat() ]
				case 'dashboard': return [ this.Dashboard() ]
			}
			return []
		}

		@$mol_mem
		lights_mode() {
			return this.Theme_auto().is_light_now() ? 'light' : 'dark'
		}

		// Попап деталей сводки рендерим на уровне app: внутри Body его ломает
		// contain:content у скролла — fixed-оверлей позиционируется не от вьюпорта.
		Summary_popup() {
			return this.Summary().Detail()
		}

		@$mol_action
		open_settings() {
			this.settings_open( true )
			return null
		}

		@$mol_action
		select_dataset( id: string ) {
			this.dataset_id( id )
			return null
		}

		@$mol_action
		ask_chat() {
			this.screen( 'chat' )
			return null
		}

		screen_title() {
			switch( this.screen() ) {
				case 'gallery': return this.screen_gallery_title()
				case 'explorer': return this.screen_explorer_title()
				case 'chat': return this.screen_chat_title()
				case 'dashboard': return this.screen_dashboard_title()
				case 'summary': return this.screen_summary_title()
			}
			return ''
		}

		dataset_title() {
			const id = this.dataset_id()
			if( !id ) return ''
			return this.Gallery().card_title( id )
		}

		arg_value( key: string, next: string | undefined, fallback: string ) {
			const arg = this.$.$mol_state_arg
			if ( next === undefined ) return arg.value( key ) ?? fallback
			arg.value( key, next === fallback ? null : next )
			return next
		}

		@$mol_mem
		screen( next?: string ) { return this.arg_value( 'screen', next, 'gallery' ) }

		@$mol_mem
		preset( next?: string ) { return this.arg_value( 'preset', next, 'demo' ) }

		@$mol_mem
		dataset_id( next?: string ) { return this.arg_value( 'ds', next, '' ) }

	}

}
