namespace $ {
	$mol_style_define( $bog_ragufront_gallery, {
		flex: { direction: 'column' },
		padding: {
			top: '1.5rem',
			bottom: '1.5rem',
			left: '1.75rem',
			right: '1.75rem',
		},

		Header: {
			flex: { direction: 'row' },
			align: { items: 'flex-end' },
			gap: '0.875rem',
			margin: { bottom: '1.25rem' },
		},
		Header_text: {
			flex: { direction: 'column' },
		},
		Header_title: {
			font: { weight: 700, size: '20px' },
		},
		Header_subtitle: {
			font: { size: '13px' },
			color: '#78716c',
			margin: { top: '3px' },
		},
		Spacer: {
			flex: { grow: 1 },
		},
		Upload_doc: {
			border: { width: '1px', style: 'dashed', color: '#b8b4b0', radius: '8px' },
			padding: {
				top: '10px',
				bottom: '10px',
				left: '16px',
				right: '16px',
			},
			font: { size: '12px', weight: 600 },
			color: '#57534e',
			background: { color: '#ffffff' },
			cursor: 'pointer',
		},
		Upload_idx: {
			border: { width: '1px', style: 'dashed', color: '#b8b4b0', radius: '8px' },
			padding: {
				top: '10px',
				bottom: '10px',
				left: '16px',
				right: '16px',
			},
			font: { size: '12px', weight: 600 },
			color: '#57534e',
			background: { color: '#ffffff' },
			cursor: 'pointer',
		},

		Grid: {
			display: 'grid',
			gridTemplateColumns: 'repeat(3, 1fr)',
			gap: '16px',
		},
	} )
}
