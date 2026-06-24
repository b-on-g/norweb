namespace $ {
	$mol_style_define( $bog_ragufront_settings_group, {
		flex: { direction: 'column' },

		Head: {
			flex: { direction: 'row' },
			align: { items: 'center' },
			gap: '8px',
		},
		Step: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 700,
				size: '10px',
			},
			color: '#5b5bd6',
			textTransform: 'uppercase',
			letterSpacing: '0.6px',
		},
		Reindex: {
			background: { color: '#fdf0e6' },
			color: '#c2691a',
			border: { radius: '4px' },
			padding: {
				top: '2px',
				bottom: '2px',
				left: '6px',
				right: '6px',
			},
			font: { size: '9px', weight: 600 },
			display: 'none',
			'@': {
				bog_ragufront_settings_group_reindex: {
					true: { display: 'flex' },
				},
			},
		},
		Title: {
			font: { weight: 600, size: '13px' },
			margin: { top: '5px' },
		},
		Opts: {
			font: { size: '11px' },
			color: '#78716c',
			lineHeight: '1.5',
			margin: { top: '4px' },
		},
		Control: {
			height: '30px',
			margin: { top: '8px' },
			border: { width: '1px', style: 'solid', color: '#e7e4e0', radius: '6px' },
			background: { color: '#faf9f8' },
			align: { items: 'center' },
			padding: {
				left: '10px',
				right: '10px',
			},
			font: {
				family: 'ui-monospace, monospace',
				weight: 500,
				size: '10px',
			},
			color: '#a8a29e',
		},
	} )
}
