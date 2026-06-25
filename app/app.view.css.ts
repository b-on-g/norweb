namespace $ {
	$mol_style_define( $bog_ragufront_app, {
		height: '100vh',
		width: '100%',
		background: { color: '#e9e8e6' },
		color: '#44403c',
		overflow: 'hidden',
		font: {
			family: 'system-ui, -apple-system, sans-serif',
		},
		flex: {
			direction: 'row',
		},
		Main: {
			flex: {
				grow: 1,
				shrink: 1,
				direction: 'column',
			},
			minWidth: 0,
		},
		Body: {
			display: 'flex',
			flex: { grow: 1, shrink: 1, direction: 'column' },
			align: { items: 'stretch' },
			minHeight: 0,
			minWidth: 0,
		},
	} )
}
