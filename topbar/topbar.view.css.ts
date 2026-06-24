namespace $ {
	$mol_style_define( $bog_ragufront_topbar, {
		height: '58px',
		minHeight: '58px',
		background: { color: '#ffffff' },
		border: {
			bottom: { width: '1px', style: 'solid', color: '#d6d3d1' },
		},
		flex: { direction: 'row' },
		align: { items: 'center' },
		gap: '0.875rem',
		padding: {
			left: '1.25rem',
			right: '1.25rem',
		},

		Title_block: {
			flex: { direction: 'column' },
		},
		Title: {
			font: { weight: 700, size: '15px' },
		},
		Subtitle: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 500,
				size: '10px',
			},
			color: '#a8a29e',
		},

		Spacer: {
			flex: { grow: 1 },
		},

		Preset_label: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '10px',
			},
			color: '#a8a29e',
			textTransform: 'uppercase',
		},

		Preset_group: {
			flex: { direction: 'row' },
			gap: '0.25rem',
			background: { color: '#f5f4f2' },
			border: { width: '1px', style: 'solid', color: '#d6d3d1', radius: '7px' },
			padding: {
				top: '3px',
				bottom: '3px',
				left: '3px',
				right: '3px',
			},
		},

		Settings_btn: {
			flex: { direction: 'row' },
			align: { items: 'center' },
			gap: '6px',
			background: { color: '#ffffff' },
			border: { width: '1px', style: 'solid', color: '#d6d3d1', radius: '7px' },
			padding: {
				top: '7px',
				bottom: '7px',
				left: '12px',
				right: '12px',
			},
			font: { size: '12px', weight: 600 },
			cursor: 'pointer',
		},

		Export_btn: {
			flex: { direction: 'row' },
			align: { items: 'center' },
			gap: '6px',
			background: { color: '#5b5bd6' },
			color: '#ffffff',
			border: { radius: '7px' },
			padding: {
				top: '7px',
				bottom: '7px',
				left: '12px',
				right: '12px',
			},
			font: { size: '12px', weight: 600 },
			cursor: 'pointer',
		},
	} )
}
