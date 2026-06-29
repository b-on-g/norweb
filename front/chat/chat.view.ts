namespace $.$$ {

	export type Raggu_chat_role = 'user' | 'assistant'

	export type Raggu_chat_item = {
		role: Raggu_chat_role
		text: string
		trace?: boolean
	}

	export class $raggu_web_front_chat extends $.$raggu_web_front_chat {

		@ $mol_mem
		history( next?: Raggu_chat_item[] ): Raggu_chat_item[] {
			const stored = this.$.$mol_state_session.value( '$raggu_web_front_chat.history', next as any ) as Raggu_chat_item[] | null
			if( stored ) return stored
			return [
				{ role: 'user', text: this.seed_user_text() },
				{ role: 'assistant', text: this.seed_assistant_text(), trace: true },
			]
		}

		override prompt_text( next?: string ) {
			return this.$.$mol_state_session.value( '$raggu_web_front_chat.prompt_text', next ) ?? ''
		}

		override rows() {
			return this.history().map( ( _, i ) => this.Message( i ) )
		}

		message_text( index: number ) {
			return this.history()[ index ]?.text ?? ''
		}

		message_role( index: number ) {
			return this.history()[ index ]?.role ?? 'user'
		}

		message_with_trace( index: number ) {
			return Boolean( this.history()[ index ]?.trace )
		}

		@ $mol_action
		override prompt_submit() {
			const text = this.prompt_text().trim()
			if( !text ) return null
			const next: Raggu_chat_item[] = [ ... this.history(), { role: 'user', text } ]
			this.history( next )
			this.prompt_text( '' )
			const mock = `${ this.mock_prefix_text() } "${ text }". ${ this.mock_suffix_text() }`
			setTimeout( () => {
				const cur = this.history()
				this.history( [ ... cur, { role: 'assistant', text: mock, trace: true } ] )
			}, 500 )
			return null
		}

		@ $mol_action
		override use_sug_one() {
			this.prompt_text( this.sug_one_text() )
			return null
		}

		@ $mol_action
		override use_sug_two() {
			this.prompt_text( this.sug_two_text() )
			return null
		}

	}

}
