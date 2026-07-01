namespace $.$$ {

	export class $raggu_web_front_app extends $.$raggu_web_front_app {

		body() {
			// Без выбранного датасета всегда показываем Gallery — остальные экраны бессмысленны.
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
