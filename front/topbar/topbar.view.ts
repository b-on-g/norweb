namespace $.$$ {

	export class $raggu_web_front_topbar extends $.$raggu_web_front_topbar {

		screen_title() {
			return this.$.$mol_locale.text( `$raggu_web_front_app_screen_${ this.screen() }_title` ) || ''
		}

		dataset_name() {
			return this.$.$mol_locale.text( `$raggu_web_front_app_dataset_${ this.dataset_id() }_title` ) || ''
		}

		is_fast() { return this.preset() === 'fast' }
		is_accurate() { return this.preset() === 'accurate' }
		is_demo() { return this.preset() === 'demo' }

		@$mol_action click_fast() { this.preset( 'fast' ); return null }
		@$mol_action click_accurate() { this.preset( 'accurate' ); return null }
		@$mol_action click_demo() { this.preset( 'demo' ); return null }

	}

}
