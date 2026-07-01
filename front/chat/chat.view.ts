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

		@ $mol_mem
		override mode( next?: string ): string {
			return this.$.$mol_state_session.value( '$raggu_web_front_chat.mode', next ) ?? 'llm'
		}

		is_llm() { return this.mode() === 'llm' }
		is_local() { return this.mode() === 'local' }
		is_global() { return this.mode() === 'global' }
		is_mix() { return this.mode() === 'mix' }
		is_plan() { return this.mode() === 'plan' }

		@ $mol_action override select_llm() { this.mode( 'llm' ); return null }
		@ $mol_action override select_local() { this.mode( 'local' ); return null }
		@ $mol_action override select_global() { this.mode( 'global' ); return null }
		@ $mol_action override select_mix() { this.mode( 'mix' ); return null }
		@ $mol_action override select_plan() { this.mode( 'plan' ); return null }

		@ $mol_mem
		llm() {
			return $mol_github_model.make({ $: this.$ })
		}

		override rows() {
			return this.history().map( ( _, i ) => this.Message( i ) )
		}
		
		@ $mol_mem
		scroll_height(): number {
			// Явная подписка на history — при новом сообщении канал инвалидируется,
			// тянет за собой dom_tree, и scroll_top получает свежее значение.
			void this.history()
			return this.Body().dom_node().scrollHeight
		}

		@ $mol_mem
		scroll_top( next?: number ): number {
			const el = this.Body().dom_node() as HTMLElement
			if( next !== undefined ) el.scrollTop = next
			return el.scrollTop
		}

		@ $mol_mem
		override dom_tree( next?: Element ): Element {
			const node = super.dom_tree( next )
			this.scroll_top( this.scroll_height() )
			return node
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
			if( this.mode() === 'llm' ) {
				// Real LLM через $mol_github_model — асинхронно, оборачиваем в fiber
				$mol_wire_async( this ).llm_reply( text )
			} else {
				// Мок для search-режимов
				const mock = `${ this.mock_prefix_text() } "${ text }". ${ this.mock_suffix_text() }`
				setTimeout( () => {
					const cur = this.history()
					this.history( [ ... cur, { role: 'assistant', text: mock, trace: true } ] )
				}, 500 )
			}
			return null
		}

		@ $mol_action
		llm_reply( text: string ) {
			const model = this.llm().fork()
			model.ask( [ text ] )
			const resp = model.response()
			const reply = typeof resp === 'string' ? resp : JSON.stringify( resp, null, 2 )
			this.history( [ ... this.history(), { role: 'assistant', text: reply } ] )
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

		@ $mol_action
		override clear_click() {
			this.history( [] )
			return null
		}

	}

}
