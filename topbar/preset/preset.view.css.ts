namespace $ {
	$mol_style_define( $bog_ragufront_topbar_preset, {
		font: { size: '11px', weight: 600 },
		padding: {
			top: '5px',
			bottom: '5px',
			left: '10px',
			right: '10px',
		},
		border: { radius: '5px' },
		cursor: 'pointer',
		color: '#78716c',
		'@': {
			bog_ragufront_topbar_preset_active: {
				true: {
					background: { color: '#ffffff' },
					color: '#44403c',
					box: {
						shadow: [ {
							x: 0,
							y: '1px',
							blur: '2px',
							spread: 0,
							color: '#00000014',
						} ],
					},
				},
			},
		},
	} )
}
