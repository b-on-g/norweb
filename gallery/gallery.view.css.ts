namespace $ {
	$mol_style_define( $raggu_web_gallery, {
		flex: { direction: 'column', shrink: 1 },
		minWidth: 0,
		padding: {
			top: '1.5rem',
			bottom: '1.5rem',
			left: '1.75rem',
			right: '1.75rem',
		},

		Header: {
			flex: { direction: 'row' },
			flexWrap: 'wrap',
			align: { items: 'flex-end' },
			gap: '0.875rem',
			margin: { bottom: '1.25rem' },
		},
		Header_text: {
			flex: { direction: 'column', grow: 1, shrink: 1 },
			minWidth: 0,
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
			gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
			gap: '16px',
			minWidth: 0,
		},
	} )
}
