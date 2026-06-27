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
			const rule = style_rule( '$raggu_web_app', 'raggu_web_app_body' )
			$mol_assert_equal( /display: flex/.test( rule ), true )
			$mol_assert_equal( /flex-direction: column/.test( rule ), true )
		},

		'settings.Body: $mol_scroll override is flex column'( $ ) {
			const rule = style_rule( '$raggu_web_settings', 'raggu_web_settings_body' )
			$mol_assert_equal( /display: flex/.test( rule ), true )
			$mol_assert_equal( /flex-direction: column/.test( rule ), true )
		},

		'settings: 6 distinct groups + presets row under Body'( $ ) {
			const v = $raggu_web_settings.make({ $ })
			v.showed( true )
			// 1 presets row + 6 step groups
			$mol_assert_equal( v.Body().sub().length, 7 )
		},

		'app: every screen exists as sub-view'( $ ) {
			const v = $raggu_web_app.make({ $ })
			$mol_assert_equal( v.Gallery() instanceof $raggu_web_gallery, true )
			$mol_assert_equal( v.Explorer() instanceof $raggu_web_explorer, true )
			$mol_assert_equal( v.Chat() instanceof $raggu_web_chat, true )
			$mol_assert_equal( v.Dashboard() instanceof $raggu_web_dashboard, true )
		},

		'app.body: switches by screen()'( $ ) {
			const v = $raggu_web_app.make({ $ })
			v.screen( 'gallery' )
			$mol_assert_equal( v.body()[0], v.Gallery() )
			v.screen( 'explorer' )
			$mol_assert_equal( v.body()[0], v.Explorer() )
			v.screen( 'chat' )
			$mol_assert_equal( v.body()[0], v.Chat() )
			v.screen( 'dashboard' )
			$mol_assert_equal( v.body()[0], v.Dashboard() )
		},

		'dashboard: metric and stage rows match data'( $ ) {
			const v = $raggu_web_dashboard.make({ $ })
			$mol_assert_equal( v.Metric_rows().sub().length, 3 )
			$mol_assert_equal( v.Stage_rows().sub().length, 5 )
		},

		'gallery: 6 dataset cards render'( $ ) {
			const v = $raggu_web_gallery.make({ $ })
			$mol_assert_equal( v.Grid().sub().length, 6 )
		},

		'url state: screen / preset / dataset_id round-trip through $mol_state_arg'( $ ) {
			const app = $raggu_web_app.make({ $ })
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
			const app = $raggu_web_app.make({ $ })

			// initial: gallery screen, 6 dataset cards
			$mol_assert_equal( app.screen(), 'gallery' )
			$mol_assert_equal( app.body()[0], app.Gallery() )
			$mol_assert_equal( app.Gallery().Grid().sub().length, 6 )

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

			// user navigates back to Датасеты and clicks a card → explorer + dataset selected
			app.Sidebar().click_gallery()
			$mol_assert_equal( app.screen(), 'gallery' )
			app.Gallery().click( 'law' )
			$mol_assert_equal( app.screen(), 'explorer' )
			$mol_assert_equal( app.dataset_id(), 'law' )

			// user switches language EN — re-renders all @-strings via $mol_locale
			app.Sidebar().click_en()
			$mol_assert_equal( $.$mol_locale.lang(), 'en' )

			// user picks preset
			$mol_assert_equal( app.preset(), 'demo' )
			app.Topbar().click_fast()
			$mol_assert_equal( app.preset(), 'fast' )
		},

	} )

	// Visual e2e demo: runs only in the browser (test.html) after app mounts.
	// Drives the live Root(0) so the user watches the flow with 1s pauses.
	// Skipped in node — would hit $mol_test's 1s per-test timeout.
	if ( typeof window !== 'undefined' ) {
		setTimeout( async () => {
			const sleep = ( ms: number ) => new Promise( r => setTimeout( r, ms ) )
			const app = $raggu_web_app.Root( 0 )

			const initial = {
				screen: app.screen(),
				preset: app.preset(),
				dataset_id: app.dataset_id(),
				settings_open: app.settings_open(),
			}

			console.log( '▸ ragufront e2e visual demo: start' )

			// await sleep( 1000 )
			app.Sidebar().click_explorer()
			// await sleep( 1000 )
			app.Sidebar().click_chat()
			// await sleep( 1000 )
			app.Sidebar().click_dashboard()
			// await sleep( 1000 )
			app.open_settings()
			// await sleep( 1000 )
			app.Settings().close()
			// await sleep( 1000 )
			app.Sidebar().click_gallery()
			// await sleep( 1000 )
			app.Gallery().click( 'law' )
			// await sleep( 1000 )

			// restore initial state so the user can interact afterwards
			app.screen( initial.screen )
			app.preset( initial.preset )
			app.dataset_id( initial.dataset_id )
			app.settings_open( initial.settings_open )

			console.log( '✓ ragufront e2e visual demo: done' )
		}, 2000 )
	}

}
