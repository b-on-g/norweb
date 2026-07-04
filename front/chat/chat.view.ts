namespace $.$$ {

	export type Raggu_chat_role = 'user' | 'assistant'

	export type Raggu_chat_item = {
		role: Raggu_chat_role
		text: string
	}

	export class $bog_norweb_front_chat extends $.$bog_norweb_front_chat {

		@ $mol_mem
		history( next?: Raggu_chat_item[] ): Raggu_chat_item[] {
			const stored = this.$.$mol_state_session.value( '$bog_norweb_front_chat.history', next as any ) as Raggu_chat_item[] | null
			if( stored ) return stored
			return [
				{ role: 'user', text: this.seed_user_text() },
				{ role: 'assistant', text: this.seed_assistant_text() },
			]
		}

		override prompt_text( next?: string ) {
			return this.$.$mol_state_session.value( '$bog_norweb_front_chat.prompt_text', next ) ?? ''
		}

		@ $mol_mem
		llm() {
			// GitHub Models API forces response_format: json_object и требует чтобы
			// слово "json" присутствовало в messages — иначе 400 Bad Request.
			// Инструктируем модель отвечать одним JSON-полем reply, чтобы потом
			// вытащить чистый текст.
			return $mol_github_model.make({
				$: this.$,
				rules: () => 'Ты русскоязычный чат-ассистент. Отвечай ВСЕГДА строго валидным JSON вида {"reply": "<твой ответ обычным текстом>"}. Никаких других полей, никаких префиксов, только этот JSON.',
			})
		}

		@ $mol_mem
		override rows() {
			return this.history().map( ( _, i ) => this.Message( i ) )
		}

		// Автоскролл вниз при появлении нового сообщения.
		// auto() вызывается $mol_view.dom_tree после render — DOM уже актуален.
		override auto() {
			void this.history()
			const el = this.Body().dom_node() as HTMLElement
			el.scrollTop = el.scrollHeight
			return [] as any
		}

		message_text( index: number ) {
			return this.history()[ index ]?.text ?? ''
		}

		message_role( index: number ) {
			return this.history()[ index ]?.role ?? 'user'
		}

		@ $mol_action
		override prompt_submit() {
			const text = this.prompt_text().trim()
			if( !text ) return null
			this.history( [ ... this.history(), { role: 'user', text } ] )
			this.prompt_text( '' )
			// LLM в detached wire — не блокирует action, не мутирует state внутри fiber body,
			// сам ретаинится при suspension от model.response().
			$mol_wire_async( this ).ask_llm( text )
			return null
		}

		// Скелет виден когда мы ждём ответа LLM: последнее сообщение = user.
		// Реактивно, без ловли suspension: ask_llm сам мутирует history когда ответ придёт,
		// last=assistant → is_communicating становится false → скелет скрывается.
		is_communicating(): boolean {
			const h = this.history()
			if( h.length === 0 ) return false
			return h[ h.length - 1 ].role === 'user'
		}

		// Запуск LLM в detached wire. Аргумент text — для уникальности fiber-slot
		// в $mol_wire_async cache, чтобы разные запросы не переиспользовали один слот.
		// model.response() кинет Promise → wire ретаинится, при resolve дожмёт ветку с writeback.
		ask_llm( text: string ) {
			const history = this.history()
			const model = this.llm().fork()
			for( const item of history ) {
				if( item.role === 'user' ) model.ask( [ item.text ] )
				else model.tell( [ item.text ] )
			}
			try {
				const resp = model.response() as { reply?: string } | string
				const reply = typeof resp === 'string' ? resp : resp?.reply ?? JSON.stringify( resp, null, 2 )
				this.history( [ ... this.history(), { role: 'assistant', text: reply } ] )
			} catch( error: any ) {
				if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
				if( $mol_fail_log( error ) ) {
					this.history( [ ... this.history(), { role: 'assistant', text: '📛 ' + ( error.message || String( error ) ) } ] )
				}
			}
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
