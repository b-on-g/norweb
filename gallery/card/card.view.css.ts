namespace $ {
	const tag_style = {
		font: {
			family: 'ui-monospace, monospace',
			weight: 600,
			size: '10px',
		},
		color: '#57534e',
		background: { color: '#f5f4f2' },
		border: { radius: '5px' },
		padding: {
			top: '3px',
			bottom: '3px',
			left: '7px',
			right: '7px',
		},
	} as const

	$mol_style_define( $bog_ragufront_gallery_card, {
		background: { color: '#ffffff' },
		border: { width: '1px', style: 'solid', color: '#d6d3d1', radius: '10px' },
		padding: {
			top: '13px',
			bottom: '13px',
			left: '13px',
			right: '13px',
		},
		flex: { direction: 'column' },
		cursor: 'pointer',

		Preview: {
			height: '118px',
			border: { radius: '7px' },
			align: { items: 'center' },
			justify: { content: 'center' },
			position: 'relative',
		},
		Preview_label: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '10px',
			},
			color: '#a8a29e',
		},
		Domain_badge: {
			position: 'absolute',
			top: '8px',
			left: '8px',
			background: { color: '#ffffff' },
			border: { width: '1px', style: 'solid', color: '#d6d3d1', radius: '5px' },
			padding: {
				top: '2px',
				bottom: '2px',
				left: '7px',
				right: '7px',
			},
			font: { size: '10px' },
			color: '#57534e',
		},

		Title: {
			font: { weight: 700, size: '14px' },
			margin: { top: '11px' },
		},
		Desc: {
			font: { size: '11px' },
			color: '#78716c',
			margin: { top: '4px' },
			lineHeight: '1.4',
		},

		Tags: {
			flex: { direction: 'row' },
			flexWrap: 'wrap',
			gap: '6px',
			margin: { top: '10px' },
		},
		Tag_nodes: tag_style,
		Tag_edges: tag_style,
		Tag_comms: tag_style,
	} )
}
