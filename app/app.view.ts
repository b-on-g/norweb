namespace $.$$ {

	export class $bog_ragufront_app extends $.$bog_ragufront_app {

		body() {
			switch( this.screen() ) {
				case 'gallery': return [ this.Gallery() ]
				case 'explorer': return [ this.Explorer() ]
				case 'chat': return [ this.Chat() ]
				case 'dashboard': return [ this.Dashboard() ]
			}
			return []
		}

		@$mol_action
		open_settings() {
			this.settings_open( true )
			return null
		}

		@$mol_action
		select_dataset( id: string ) {
			this.dataset_id( id )
			this.screen( 'explorer' )
			return null
		}

	}

}
