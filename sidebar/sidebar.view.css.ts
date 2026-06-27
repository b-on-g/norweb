namespace $ {
	$mol_style_define( $raggu_web_sidebar, {
		minWidth: '228px',
		maxWidth: '228px',
		background: { color: '#f5f4f2' },
		border: {
			right: { width: '1px', style: 'solid', color: '#d6d3d1' },
		},
		flex: { direction: 'column' },
		padding: {
			top: '1.125rem',
			bottom: '1.125rem',
			left: '0.875rem',
			right: '0.875rem',
		},

		Brand: {
			flex: { direction: 'row' },
			align: { items: 'center' },
			gap: '0.5625rem',
			padding: {
				top: '0.25rem',
				bottom: '1.125rem',
				left: '0.375rem',
				right: '0.375rem',
			},
		},
		Brand_logo: {
			minWidth: '26px',
			maxWidth: '26px',
			height: '26px',
			border: { width: '2px', style: 'solid', color: '#5b5bd6', radius: '6px' },
			align: { items: 'center' },
			justify: { content: 'center' },
			font: { weight: 800, size: '14px' },
			color: '#5b5bd6',
		},
		Brand_title: {
			font: { weight: 700, size: '16px' },
			letterSpacing: '0.3px',
		},
		Brand_badge: {
			marginLeft: 'auto',
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '9px',
			},
			color: '#a8a29e',
			border: { width: '1px', style: 'solid', color: '#d6d3d1', radius: '4px' },
			padding: {
				top: '2px',
				bottom: '2px',
				left: '5px',
				right: '5px',
			},
		},

		Sections_label: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '10px',
			},
			color: '#a8a29e',
			textTransform: 'uppercase',
			letterSpacing: '0.8px',
			padding: {
				top: 0,
				bottom: '0.5rem',
				left: '0.375rem',
				right: '0.375rem',
			},
		},

		Nav: {
			flex: { direction: 'column' },
			gap: '0.25rem',
		},

		Spacer: {
			flex: { grow: 1 },
		},

		Footer: {
			flex: { direction: 'column' },
			gap: '0.625rem',
		},
		Corpus_label: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '10px',
			},
			color: '#a8a29e',
			textTransform: 'uppercase',
			letterSpacing: '0.8px',
			padding: {
				left: '0.375rem',
				right: '0.375rem',
			},
		},
		Corpus_card: {
			background: { color: '#ffffff' },
			border: { width: '1px', style: 'solid', color: '#d6d3d1', radius: '6px' },
			padding: {
				top: '0.5625rem',
				bottom: '0.5625rem',
				left: '0.6875rem',
				right: '0.6875rem',
			},
			flex: { direction: 'column' },
			gap: '0.1875rem',
		},
		Corpus_name: {
			font: { weight: 600, size: '13px' },
		},
		Corpus_meta: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 500,
				size: '10px',
			},
			color: '#a8a29e',
		},

		Lang_row: {
			flex: { direction: 'row' },
			gap: '0.375rem',
			align: { items: 'center' },
			padding: {
				top: '2px',
				bottom: '2px',
				left: '4px',
				right: '4px',
			},
		},
		Lang_label: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '10px',
			},
			color: '#a8a29e',
			marginRight: 'auto',
		},
	} )
}
