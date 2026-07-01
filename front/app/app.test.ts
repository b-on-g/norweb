namespace $.$$ {

	function style_rule( component: string, key: string ) {
		const el = $mol_dom_context.document.getElementById(
			`$mol_style_attach:${ component }`
		)
		const css = ( el?.textContent ?? '' ).replace( /\s+/g, ' ' )
		return css.match( new RegExp( `\\[${ key }\\][^{]*\\{[^}]*\\}` ) )?.[ 0 ] ?? ''
	}

	$mol_test( {

		'app.Body: $mol_scroll override is flex column'( $ ) {
			const rule = style_rule( '$raggu_web_front_app', 'raggu_web_front_app_body' )
			$mol_assert_equal( /display: flex/.test( rule ), true )
			$mol_assert_equal( /flex-direction: column/.test( rule ), true )
		},

		'settings.Body: $mol_scroll override is flex column'( $ ) {
			const rule = style_rule( '$raggu_web_front_settings', 'raggu_web_front_settings_body' )
			$mol_assert_equal( /display: flex/.test( rule ), true )
			$mol_assert_equal( /flex-direction: column/.test( rule ), true )
		},

		'settings: 6 distinct groups + presets row under Body'( $ ) {
			const v = $raggu_web_front_settings.make({ $ })
			v.showed( true )
			// 1 presets row + 6 step groups
			$mol_assert_equal( v.Body().sub().length, 7 )
		},

		'app: every screen exists as sub-view'( $ ) {
			const v = $raggu_web_front_app.make({ $ })
			$mol_assert_equal( v.Gallery() instanceof $raggu_web_front_gallery, true )
			$mol_assert_equal( v.Explorer() instanceof $raggu_web_front_explorer, true )
			$mol_assert_equal( v.Chat() instanceof $raggu_web_front_chat, true )
			$mol_assert_equal( v.Dashboard() instanceof $raggu_web_front_dashboard, true )
		},

		'app.body: switches by screen()'( $ ) {
			const v = $raggu_web_front_app.make({ $ })
			// body() forces Gallery when no dataset selected — задать датасет чтобы проверить остальные экраны
			v.dataset_id( 'wiki' )
			v.screen( 'gallery' )
			$mol_assert_equal( v.body()[0], v.Gallery() )
			v.screen( 'explorer' )
			$mol_assert_equal( v.body()[0], v.Explorer() )
			v.screen( 'chat' )
			$mol_assert_equal( v.body()[0], v.Chat() )
			v.screen( 'dashboard' )
			$mol_assert_equal( v.body()[0], v.Dashboard() )
		},

		'app.body: forces Gallery when no dataset selected'( $ ) {
			const v = $raggu_web_front_app.make({ $ })
			v.screen( 'explorer' )
			$mol_assert_equal( v.dataset_id(), '' )
			$mol_assert_equal( v.body()[0], v.Gallery() )
		},

		'dashboard: metric and stage rows match data'( $ ) {
			const v = $raggu_web_front_dashboard.make({ $ })
			$mol_assert_equal( v.Metric_rows().sub().length, 3 )
			$mol_assert_equal( v.Stage_rows().sub().length, 5 )
		},

		'gallery: 6 dataset cards render'( $ ) {
			// No live backend in node tests → force ?mock=1 so remote_datasets returns null
			// and falls back to BUILTIN; otherwise $mol_fetch leaks a pending promise.
			$.$mol_state_arg.value( 'mock', '1' )
			const v = $raggu_web_front_gallery.make({ $ })
			$mol_assert_equal( v.Grid().sub().length, 6 )
		},

		'url state: screen / preset / dataset_id round-trip through $mol_state_arg'( $ ) {
			const app = $raggu_web_front_app.make({ $ })
			const arg = $.$mol_state_arg

			// defaults are NOT written to URL (kept clean)
			$mol_assert_equal( app.screen(), 'gallery' )
			$mol_assert_equal( arg.value( 'screen' ), null )

			// non-default values land in $mol_state_arg
			app.screen( 'explorer' )
			$mol_assert_equal( arg.value( 'screen' ), 'explorer' )

			app.preset( 'fast' )
			$mol_assert_equal( arg.value( 'preset' ), 'fast' )

			app.dataset_id( 'law' )
			$mol_assert_equal( arg.value( 'ds' ), 'law' )

			// resetting to default removes from URL
			app.screen( 'gallery' )
			$mol_assert_equal( arg.value( 'screen' ), null )
		},

		'lang state: $mol_locale.lang() persists via $mol_state_local, NOT URL'( $ ) {
			$.$mol_locale.lang( 'en' )
			$mol_assert_equal( $.$mol_locale.lang(), 'en' )
			$mol_assert_equal( $.$mol_state_arg.value( 'lang' ), null )

			$.$mol_locale.lang( 'ru' )
			$mol_assert_equal( $.$mol_locale.lang(), 'ru' )
		},

		'e2e: full user flow through all screens'( $ ) {
			$.$mol_state_arg.value( 'mock', '1' )
			const app = $raggu_web_front_app.make({ $ })

			// initial: gallery screen, 6 dataset cards
			$mol_assert_equal( app.screen(), 'gallery' )
			$mol_assert_equal( app.body()[0], app.Gallery() )
			$mol_assert_equal( app.Gallery().Grid().sub().length, 6 )

			// user picks dataset first — иначе body() держит Gallery
			app.dataset_id( 'wiki' )

			// user clicks "Граф" in sidebar → explorer
			app.Sidebar().click_explorer()
			$mol_assert_equal( app.screen(), 'explorer' )
			$mol_assert_equal( app.body()[0], app.Explorer() )

			// user clicks "Чат" → chat
			app.Sidebar().click_chat()
			$mol_assert_equal( app.screen(), 'chat' )

			// user clicks "Дашборд" → dashboard
			app.Sidebar().click_dashboard()
			$mol_assert_equal( app.screen(), 'dashboard' )

			// user clicks "⚙ Настройки" in topbar → slide-over opens with 6 groups
			app.open_settings()
			$mol_assert_equal( app.settings_open(), true )
			$mol_assert_equal( app.Settings().showed(), true )
			$mol_assert_equal( app.Settings().Body().sub().length, 7 )

			// user clicks backdrop → slide-over closes
			app.Settings().close()
			$mol_assert_equal( app.settings_open(), false )
			$mol_assert_equal( app.Settings().showed(), false )

			// user navigates back to Датасеты and clicks a card → dataset selected, screen stays
			app.Sidebar().click_gallery()
			$mol_assert_equal( app.screen(), 'gallery' )
			app.Gallery().click( 'law' )
			$mol_assert_equal( app.screen(), 'gallery' )
			$mol_assert_equal( app.dataset_id(), 'law' )

			// user switches language EN — re-renders all @-strings via $mol_locale
			app.Sidebar().click_en()
			$mol_assert_equal( $.$mol_locale.lang(), 'en' )

			// user picks preset
			$mol_assert_equal( app.preset(), 'demo' )
			app.Topbar().click_fast()
			$mol_assert_equal( app.preset(), 'fast' )
		},

		// ---- gallery upload ----

		'gallery.start_upload: sets kind, opens panel'( $ ) {
			const g = $raggu_web_front_gallery.make({ $ })
			$mol_assert_equal( g.upload_showed(), false )
			g.start_upload( 'document' )
			$mol_assert_equal( g.upload_kind(), 'document' )
			$mol_assert_equal( g.upload_showed(), true )
		},

		'gallery.upload.start: small file → no error, step reset to 0'( $ ) {
			const g = $raggu_web_front_gallery.make({ $ })
			g.start_upload( 'document' )
			const up = g.Upload() as $.$$.$raggu_web_front_gallery_upload
			$mol_assert_equal( up.error(), '' )
			$mol_assert_equal( up.step(), 0 )
		},

		'gallery.upload.start: oversize → error truthy, no progress'( $ ) {
			const g = $raggu_web_front_gallery.make({ $ })
			g.upload_kind( 'index' )
			g.upload_showed( true )
			const up = g.Upload() as $.$$.$raggu_web_front_gallery_upload
			up.start( 12.5 )
			$mol_assert_equal( !! up.error(), true )
			$mol_assert_equal( up.step(), 0 )
		},

		'gallery.upload_complete: adds dataset, closes panel'( $ ) {
			$.$mol_state_arg.value( 'mock', '1' )
			const g = $raggu_web_front_gallery.make({ $ })
			$mol_assert_equal( g.extra_datasets().length, 0 )
			$mol_assert_equal( g.datasets().length, 6 )
			g.start_upload( 'document' )
			g.upload_complete()
			$mol_assert_equal( g.extra_datasets().length, 1 )
			$mol_assert_equal( g.datasets().length, 7 )
			$mol_assert_equal( g.upload_showed(), false )
			$mol_assert_equal( g.upload_kind(), '' )
		},

		// ---- settings real controls ----

		'settings.apply_preset(fast): key fields land at fast values'( $ ) {
			const s = $raggu_web_front_settings.make({ $ })
			s.apply_preset( 'fast' )
			$mol_assert_equal( s.chunking_strategy(), 'Simple' )
			$mol_assert_equal( s.chunking_size_str(), '256' )
			$mol_assert_equal( s.search_topk(), 5 )
			$mol_assert_equal( s.extraction_model(), 'meno-lite-7b' )
		},

		'settings.apply_preset(accurate): key fields land at accurate values'( $ ) {
			const s = $raggu_web_front_settings.make({ $ })
			s.apply_preset( 'accurate' )
			$mol_assert_equal( s.chunking_strategy(), 'SmartSemantic' )
			$mol_assert_equal( s.summarization_llm(), true )
			$mol_assert_equal( s.search_topk(), 10 )
			$mol_assert_equal( s.search_mode(), 'Mix' )
		},

		'settings.apply_preset(demo): key fields land at demo values'( $ ) {
			const s = $raggu_web_front_settings.make({ $ })
			s.apply_preset( 'demo' )
			$mol_assert_equal( s.chunking_size_str(), '512' )
			$mol_assert_equal( s.search_mode(), 'Local' )
			$mol_assert_equal( s.refinement_isolated(), true )
		},

		'settings: every group renders Controls array (sub > 0)'( $ ) {
			const s = $raggu_web_front_settings.make({ $ })
			$mol_assert_equal( s.Group_chunking().Controls().sub().length > 0, true )
			$mol_assert_equal( s.Group_extraction().Controls().sub().length > 0, true )
			$mol_assert_equal( s.Group_summarization().Controls().sub().length > 0, true )
			$mol_assert_equal( s.Group_communities().Controls().sub().length > 0, true )
			$mol_assert_equal( s.Group_refinement().Controls().sub().length > 0, true )
			$mol_assert_equal( s.Group_search().Controls().sub().length > 0, true )
			// chunking group: select + size_row + overlap_row = 3
			$mol_assert_equal( s.Group_chunking().Controls().sub().length, 3 )
		},

		// ---- dashboard energy formula ----

		'dashboard.pipeline_seconds: sum of STAGES.time'( $ ) {
			const d = $raggu_web_front_dashboard.make({ $ })
			// 1.2 + 8.4 + 3.1 + 2.0 + 0.6 = 15.3
			$mol_assert_equal( d.pipeline_seconds().toFixed( 1 ), '15.3' )
		},

		'dashboard.energy_kwh: TDP × time × PUE / 1000'( $ ) {
			const d = $raggu_web_front_dashboard.make({ $ })
			// 300 × (15.3 / 3600) × 1.4 / 1000 ≈ 0.001785
			const kwh = d.energy_kwh()
			$mol_assert_equal( kwh > 0.0017 && kwh < 0.0019, true )
			$mol_assert_equal( d.energy_kwh_val(), '0.00' )
		},

		'dashboard.energy_cost_val: formatted % vs gpt-4 baseline'( $ ) {
			const d = $raggu_web_front_dashboard.make({ $ })
			const val = d.energy_cost_val()
			$mol_assert_equal( /^[−+]\d+%$/.test( val ), true )
		},

		// ---- dashboard log expand ----

		'dashboard.log: default not expanded'( $ ) {
			const d = $raggu_web_front_dashboard.make({ $ })
			$mol_assert_equal( d.Log( 'q1' ).expanded(), false )
		},

		'dashboard.log.toggle: flips expanded'( $ ) {
			const d = $raggu_web_front_dashboard.make({ $ })
			const log = d.Log( 'q1' )
			$mol_assert_equal( log.expanded(), false )
			log.toggle()
			$mol_assert_equal( log.expanded(), true )
			log.toggle()
			$mol_assert_equal( log.expanded(), false )
		},

		'dashboard.log: Trace sub-view exists, attr reflects expanded state'( $ ) {
			const d = $raggu_web_front_dashboard.make({ $ })
			const log = d.Log( 'q1' )
			$mol_assert_equal( !! log.Trace(), true )
			$mol_assert_equal( log.attr().raggu_web_front_dashboard_log_expanded, false )
			log.toggle()
			$mol_assert_equal( log.attr().raggu_web_front_dashboard_log_expanded, true )
		},

		'dashboard.log.arrow: glyph depends on expanded'( $ ) {
			const d = $raggu_web_front_dashboard.make({ $ })
			const log = d.Log( 'q2' )
			$mol_assert_equal( log.arrow(), '▾' )
			log.toggle()
			$mol_assert_equal( log.arrow(), '▴' )
		},


		// ---- export ----

		'export.formats: explorer has 4 items'( $ ) {
			const ex = $raggu_web_front_export.make({ $ })
			ex.screen = () => 'explorer'
			$mol_assert_equal( ex.formats().length, 4 )
			$mol_assert_equal( ex.formats()[0].id, 'graphml' )
		},

		'export.formats: chat has 2 items'( $ ) {
			const ex = $raggu_web_front_export.make({ $ })
			ex.screen = () => 'chat'
			$mol_assert_equal( ex.formats().length, 2 )
			$mol_assert_equal( ex.formats()[0].id, 'md_chat' )
		},

		'export.formats: dashboard has 2 items'( $ ) {
			const ex = $raggu_web_front_export.make({ $ })
			ex.screen = () => 'dashboard'
			$mol_assert_equal( ex.formats().length, 2 )
			$mol_assert_equal( ex.formats()[0].id, 'csv_dash' )
		},

		'export.formats: gallery → empty list, Items renders Empty placeholder'( $ ) {
			const ex = $raggu_web_front_export.make({ $ })
			ex.screen = () => 'gallery'
			$mol_assert_equal( ex.formats().length, 0 )
			$mol_assert_equal( ex.items().length, 1 )
			$mol_assert_equal( ex.items()[0], ex.Empty() )
		},

		'export.items: count matches formats across screens'( $ ) {
			const ex = $raggu_web_front_export.make({ $ })
			ex.screen = () => 'explorer'
			$mol_assert_equal( ex.items().length, 4 )
			ex.screen = () => 'chat'
			$mol_assert_equal( ex.items().length, 2 )
		},

		'export.payload: returns Blob for each format id'( $ ) {
			const ex = $raggu_web_front_export.make({ $ })
			const ids = [
				'graphml', 'gexf', 'json_graph', 'png_graph',
				'md_chat', 'json_chat',
				'csv_dash', 'json_dash',
			] as const
			for ( const id of ids ) {
				const blob = ex.payload( id )
				$mol_assert_equal( blob instanceof Blob, true )
				$mol_assert_equal( blob.size > 0, true )
			}
		},

		// ---- chat ----

		'chat: default history has 2 seed messages'( $ ) {
			const c = $raggu_web_front_chat.make({ $ })
			const h = c.history()
			$mol_assert_equal( h.length, 2 )
			$mol_assert_equal( h[0].role, 'user' )
			$mol_assert_equal( h[1].role, 'assistant' )
			$mol_assert_equal( h[1].trace, true )
		},

		'chat.use_sug_one: prompt_text equals sug_one_text'( $ ) {
			const c = $raggu_web_front_chat.make({ $ })
			c.prompt_text( '' )
			c.use_sug_one()
			$mol_assert_equal( c.prompt_text(), c.sug_one_text() )
		},

		'chat.use_sug_two: prompt_text equals sug_two_text'( $ ) {
			const c = $raggu_web_front_chat.make({ $ })
			c.prompt_text( '' )
			c.use_sug_two()
			$mol_assert_equal( c.prompt_text(), c.sug_two_text() )
		},

		'chat.prompt_submit: history grows sync (user msg), prompt_text cleared'( $ ) {
			const c = $raggu_web_front_chat.make({ $ })
			c.prompt_text( '' )
			const before = c.history().length
			c.prompt_text( 'test query' )
			c.prompt_submit()
			// setTimeout(500) for assistant won't fire in test — only user msg sync
			$mol_assert_equal( c.history().length, before + 1 )
			$mol_assert_equal( c.history()[ before ].role, 'user' )
			$mol_assert_equal( c.history()[ before ].text, 'test query' )
			$mol_assert_equal( c.prompt_text(), '' )
		},

		'chat.prompt_submit: blank text is a no-op'( $ ) {
			const c = $raggu_web_front_chat.make({ $ })
			const before = c.history().length
			c.prompt_text( '   ' )
			c.prompt_submit()
			$mol_assert_equal( c.history().length, before )
		},

		'chat: trace label / chip texts are non-empty localized strings'( $ ) {
			const c = $raggu_web_front_chat.make({ $ })
			$mol_assert_equal( typeof c.trace_label_text() === 'string', true )
			$mol_assert_equal( c.trace_label_text().length > 0, true )
			$mol_assert_equal( typeof c.trace_chip_one_text() === 'string', true )
			$mol_assert_equal( c.trace_chip_one_text().length > 0, true )
		},

	} )

	// Visual e2e demo: runs only in the browser (test.html) after app mounts.
	// Drives the live Root(0) so the user watches the flow with 1s pauses.
	// Skipped in node — would hit $mol_test's 1s per-test timeout.
	if ( typeof window !== 'undefined' ) {
		setTimeout( async () => {
			const sleep = ( ms: number ) => new Promise( r => setTimeout( r, ms ) )
			const app = $raggu_web_front_app.Root( 0 )

			// Inject one-shot CSS for the click pulse (visual feedback for video).
			const style = document.createElement( 'style' )
			style.textContent = `
				@keyframes raggu_demo_pulse {
					0%   { box-shadow: 0 0 0 0 #5b5bd6cc, 0 0 0 0 #5b5bd644; }
					40%  { box-shadow: 0 0 0 6px #5b5bd600, 0 0 0 14px #5b5bd600; }
					100% { box-shadow: 0 0 0 6px #5b5bd600, 0 0 0 14px #5b5bd600; }
				}
				.raggu_demo_click {
					animation: raggu_demo_pulse 600ms ease-out;
					position: relative;
					z-index: 1;
				}
			`
			document.head.appendChild( style )

			// Pulse the DOM node of a view, then invoke the action ~150ms in
			// (so the highlight lands BEFORE the screen swap).
			const click = ( view: $mol_view, action: () => void ) => {
				const node = view.dom_node() as HTMLElement
				node.classList.add( 'raggu_demo_click' )
				setTimeout( action, 150 )
				setTimeout( () => node.classList.remove( 'raggu_demo_click' ), 700 )
			}

			
			const initial = {
				screen: app.screen(),
				preset: app.preset(),
				dataset_id: app.dataset_id(),
				settings_open: app.settings_open(),
			}

			// console.log( '▸ ragufront e2e visual demo: start' )

			// await sleep( 1000 )
			click( app.Sidebar().Nav_explorer(), () => app.Sidebar().click_explorer() )
			// await sleep( 1000 )
			click( app.Sidebar().Nav_chat(), () => app.Sidebar().click_chat() )
			// await sleep( 1000 )
			click( app.Sidebar().Nav_dashboard(), () => app.Sidebar().click_dashboard() )
			// await sleep( 1000 )
			click( app.Topbar().Settings_btn(), () => app.open_settings() )
			// await sleep( 1000 )
			click( app.Settings().Close_btn(), () => app.Settings().close() )
			// await sleep( 1000 )
			click( app.Sidebar().Nav_gallery(), () => app.Sidebar().click_gallery() )
			// await sleep( 1000 )
			click( app.Gallery().Card( 'law' ), () => app.Gallery().click( 'law' ) )
			// await sleep( 1000 )

			// Все click(...) выше шедулят setTimeout(action, 150) — если запустить
			// restore/dict({}) сейчас же, отложенные click-actions выполнятся ПОСЛЕ
			// и перезапишут URL. Ждём пока последний setTimeout(150) отработает.
			setTimeout( () => {
				app.screen( initial.screen )
				app.preset( initial.preset )
				app.dataset_id( initial.dataset_id )
				app.settings_open( initial.settings_open )
				$.$mol_state_arg.dict({})
			}, 200 )
		}, 2000 )
	}

}
