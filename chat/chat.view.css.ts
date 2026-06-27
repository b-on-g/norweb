namespace $ {

	const mode_pill_inactive = {
		background: { color: '#f5f4f2' },
		border: { width: '1px', style: 'solid', color: '#d6d3d1', radius: '6px' },
		padding: {
			top: '5px',
			bottom: '5px',
			left: '10px',
			right: '10px',
		},
		font: { size: '11px', weight: 600 },
		color: '#78716c',
	} as const

	const chip = {
		background: { color: '#ece9fb' },
		color: '#5b5bd6',
		border: { radius: '5px' },
		padding: {
			top: '3px',
			bottom: '3px',
			left: '8px',
			right: '8px',
		},
		font: {
			family: 'ui-monospace, monospace',
			weight: 600,
			size: '10px',
		},
	} as const

	const trace_stat = {
		font: {
			family: 'ui-monospace, monospace',
			weight: 500,
			size: '10px',
		},
		color: '#78716c',
	} as const

	const suggestion = {
		border: { width: '1px', style: 'dashed', color: '#c7c3bf', radius: '14px' },
		padding: {
			top: '5px',
			bottom: '5px',
			left: '11px',
			right: '11px',
		},
		font: { size: '11px' },
		color: '#78716c',
	} as const

	$mol_style_define( $raggu_web_chat, {
		flex: { direction: 'column', shrink: 1 },
		minWidth: 0,
		height: '100%',

		Modes_bar: {
			flex: { direction: 'row' },
			align: { items: 'center' },
			gap: '9px',
			padding: {
				top: '14px',
				bottom: '14px',
				left: '22px',
				right: '22px',
			},
			border: {
				bottom: { width: '1px', style: 'solid', color: '#e7e4e0' },
			},
		},
		Modes_label: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '10px',
			},
			color: '#a8a29e',
			textTransform: 'uppercase',
		},
		Modes: {
			flex: { direction: 'row' },
			gap: '5px',
		},
		Mode_local: {
			background: { color: '#5b5bd6' },
			color: '#ffffff',
			border: { radius: '6px' },
			padding: {
				top: '5px',
				bottom: '5px',
				left: '10px',
				right: '10px',
			},
			font: { size: '11px', weight: 600 },
		},
		Mode_global: mode_pill_inactive,
		Mode_mix: mode_pill_inactive,
		Mode_plan: mode_pill_inactive,

		Body: {
			flex: { grow: 1, direction: 'column' },
			overflow: 'auto',
			padding: {
				top: '22px',
				bottom: '22px',
				left: '22px',
				right: '22px',
			},
			gap: '16px',
		},
		Msg_user: {
			align: { self: 'flex-end' },
			maxWidth: '70%',
			background: { color: '#5b5bd6' },
			color: '#ffffff',
			borderRadius: '12px 12px 3px 12px',
			padding: {
				top: '11px',
				bottom: '11px',
				left: '15px',
				right: '15px',
			},
			font: { size: '13px' },
		},
		Msg_assistant_wrap: {
			align: { self: 'flex-start' },
			maxWidth: '78%',
			flex: { direction: 'column' },
		},
		Msg_assistant: {
			background: { color: '#ffffff' },
			border: { width: '1px', style: 'solid', color: '#e7e4e0' },
			borderRadius: '12px 12px 12px 3px',
			padding: {
				top: '13px',
				bottom: '13px',
				left: '16px',
				right: '16px',
			},
			font: { size: '13px' },
			lineHeight: '1.55',
			color: '#44403c',
		},
		Trace: {
			margin: { top: '8px' },
			border: { width: '1px', style: 'solid', color: '#d6d3d1', radius: '9px' },
			background: { color: '#faf9f8' },
			overflow: 'hidden',
			flex: { direction: 'column' },
		},
		Trace_head: {
			flex: { direction: 'row' },
			align: { items: 'center' },
			gap: '7px',
			padding: {
				top: '9px',
				bottom: '9px',
				left: '13px',
				right: '13px',
			},
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '11px',
			},
			color: '#5b5bd6',
			border: {
				bottom: { width: '1px', style: 'solid', color: '#e7e4e0' },
			},
		},
		Trace_head_meta: {
			marginLeft: 'auto',
			color: '#a8a29e',
			font: { weight: 500 },
		},
		Trace_body: {
			padding: {
				top: '11px',
				bottom: '11px',
				left: '13px',
				right: '13px',
			},
			flex: { direction: 'column' },
			gap: '8px',
		},
		Trace_label: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '10px',
			},
			color: '#a8a29e',
		},
		Trace_chips: {
			flex: { direction: 'row' },
			flexWrap: 'wrap',
			gap: '5px',
		},
		Trace_chip_one: chip,
		Trace_chip_two: chip,
		Trace_chip_three: chip,
		Trace_stats: {
			flex: { direction: 'row' },
			gap: '14px',
			margin: { top: '2px' },
		},
		Trace_stat_chunks: trace_stat,
		Trace_stat_comms: trace_stat,
		Trace_stat_retr: trace_stat,
		Trace_stat_gen: trace_stat,
		Trace_stat_power: trace_stat,
		Trace_link: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 500,
				size: '10px',
			},
			color: '#5b5bd6',
		},

		Footer: {
			padding: {
				top: '14px',
				bottom: '14px',
				left: '22px',
				right: '22px',
			},
			border: {
				top: { width: '1px', style: 'solid', color: '#e7e4e0' },
			},
			flex: { direction: 'column' },
		},
		Suggestions: {
			flex: { direction: 'row' },
			flexWrap: 'wrap',
			gap: '7px',
			margin: { bottom: '10px' },
		},
		Sug_one: suggestion,
		Sug_two: suggestion,
		Input_row: {
			flex: { direction: 'row' },
			align: { items: 'center' },
			border: { width: '1px', style: 'solid', color: '#d6d3d1', radius: '10px' },
			padding: {
				top: '12px',
				bottom: '12px',
				left: '15px',
				right: '15px',
			},
			color: '#a8a29e',
			font: { size: '13px' },
		},
		Input_spacer: {
			flex: { grow: 1 },
		},
		Input_send: {
			background: { color: '#5b5bd6' },
			color: '#ffffff',
			border: { radius: '7px' },
			padding: {
				top: '6px',
				bottom: '6px',
				left: '14px',
				right: '14px',
			},
			font: { size: '12px', weight: 600 },
		},
	} )
}
