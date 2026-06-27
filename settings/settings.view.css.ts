/** @see $bog_builderui_tokens */
namespace $ {
	$mol_style_define( $raggu_web_settings, {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		display: 'none',
		zIndex: 40,
		'@': {
			raggu_web_settings_showed: {
				true: { display: 'flex' },
			},
		},

		Backdrop: {
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			background: { color: '#1c1b1a59' },
		},

		Panel: {
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			width: '380px',
			background: { color: $bog_builderui_tokens.card },
			border: {
				left: { width: '1px', style: 'solid', color: $bog_builderui_tokens.line },
			},
			zIndex: 1,
			flex: { direction: 'column' },
			box: {
				shadow: [ {
					x: '-12px',
					y: 0,
					blur: '40px',
					spread: 0,
					color: '#0000001f',
				} ],
			},
		},

		Header: {
			padding: {
				top: '18px',
				bottom: '18px',
				left: '20px',
				right: '20px',
			},
			border: {
				bottom: { width: '1px', style: 'solid', color: $bog_builderui_tokens.line },
			},
			flex: { direction: 'row' },
			align: { items: 'center' },
		},
		Header_text: {
			flex: { direction: 'column' },
		},
		Header_title: {
			font: { weight: 700, size: '16px' },
		},
		Header_sub: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 500,
				size: '10px',
			},
			color: $bog_builderui_tokens.shade,
			margin: { top: '2px' },
		},
		Spacer: {
			flex: { grow: 1 },
		},
		Close_btn: {
			minWidth: '30px',
			maxWidth: '30px',
			height: '30px',
			border: { width: '1px', style: 'solid', color: $bog_builderui_tokens.line, radius: '7px' },
			align: { items: 'center' },
			justify: { content: 'center' },
			cursor: 'pointer',
			font: { size: '15px' },
		},

		Body: {
			padding: {
				top: '18px',
				bottom: '18px',
				left: '20px',
				right: '20px',
			},
			display: 'flex',
			flex: { direction: 'column' },
			gap: '18px',
		},
	} )
}
