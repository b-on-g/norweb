/** @see $bog_builderui_tokens */
namespace $ {

	const mode_pill = {
		background: { color: $bog_builderui_tokens.field },
		border: { width: '1px', style: 'solid', color: $bog_builderui_tokens.line, radius: '6px' },
		padding: {
			top: '5px',
			bottom: '5px',
			left: '10px',
			right: '10px',
		},
		font: { size: '11px', weight: 600 },
		color: $bog_builderui_tokens.shade,
		cursor: 'pointer',
		'@': {
			raggu_chat_mode_active: {
				true: {
					background: { color: $bog_builderui_tokens.current },
					color: '#ffffff',
					border: { color: $bog_builderui_tokens.current },
				},
			},
		},
	} as const

	const chip = {
		background: { color: $bog_builderui_tokens.field },
		color: $bog_builderui_tokens.current,
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
		color: $bog_builderui_tokens.shade,
	} as const

	const suggestion = {
		border: { width: '1px', style: 'dashed', color: $bog_builderui_tokens.line, radius: '14px' },
		padding: {
			top: '5px',
			bottom: '5px',
			left: '11px',
			right: '11px',
		},
		font: { size: '11px' },
		color: $bog_builderui_tokens.shade,
		cursor: 'pointer',
	} as const

	$mol_style_define( $raggu_web_front_chat, {
		flex: { direction: 'column', shrink: 1 },
		minWidth: 0,
		minHeight: 0,
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
				bottom: { width: '1px', style: 'solid', color: $bog_builderui_tokens.line },
			},
		},
		Modes_label: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '10px',
			},
			color: $bog_builderui_tokens.shade,
			textTransform: 'uppercase',
		},
		Modes: {
			flex: { direction: 'row' },
			gap: '5px',
		},
		Mode_llm: mode_pill,
		Mode_local: mode_pill,
		Mode_global: mode_pill,
		Mode_mix: mode_pill,
		Mode_plan: mode_pill,

		Clear: {
			marginLeft: 'auto',
			minWidth: '40px',
			height: '26px',
			padding: {
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
			},
			align: { items: 'center' },
			justify: { content: 'center' },
			border: { width: '1px', style: 'solid', color: $bog_builderui_tokens.line, radius: '6px' },
			color: $bog_builderui_tokens.shade,
			font: { size: '14px', weight: 500 },
			lineHeight: '1',
		},

		Body: {
			flex: { grow: 1, direction: 'column' },
			overflow: 'auto',
			// min-height: 0 обязателен для flex-child с overflow:auto,
			// иначе элемент раздувается до scrollHeight и внешний контейнер скроллится вместо него.
			minHeight: 0,
			padding: {
				top: '22px',
				bottom: '22px',
				left: '22px',
				right: '22px',
			},
		},
		Messages: {
			gap: '16px',
		},

		Message: {
			flex: { direction: 'column' },
			maxWidth: '78%',
			'@': {
				raggu_role: {
					user: {
						align: { self: 'flex-end' },
						maxWidth: '70%',
					},
					assistant: {
						align: { self: 'flex-start' },
					},
				},
			},
		},
		Message_text: {
			font: { size: '13px' },
			lineHeight: '1.55',
			'@': {
				raggu_role: {
					user: {
						background: { color: $bog_builderui_tokens.current },
						color: '#ffffff',
						borderRadius: '12px 12px 3px 12px',
						padding: {
							top: '11px',
							bottom: '11px',
							left: '15px',
							right: '15px',
						},
					},
					assistant: {
						background: { color: $bog_builderui_tokens.card },
						border: { width: '1px', style: 'solid', color: $bog_builderui_tokens.line },
						borderRadius: '12px 12px 12px 3px',
						padding: {
							top: '13px',
							bottom: '13px',
							left: '16px',
							right: '16px',
						},
						color: $bog_builderui_tokens.text,
					},
				},
			},
		},
		Message_trace: {
			margin: { top: '8px' },
			border: { width: '1px', style: 'solid', color: $bog_builderui_tokens.line, radius: '9px' },
			background: { color: $bog_builderui_tokens.back },
			overflow: 'hidden',
			flex: { direction: 'column' },
			'@': {
				raggu_visible: {
					false: {
						display: 'none',
					},
				},
			},
		},
		Message_trace_head: {
			flex: { direction: 'row' },
			align: { items: 'center' },
			gap: '7px',
			cursor: 'pointer',
			userSelect: 'none',
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
			color: $bog_builderui_tokens.current,
		},
		Message_trace_head_meta: {
			marginLeft: 'auto',
			color: $bog_builderui_tokens.shade,
			font: { weight: 500 },
		},
		Message_trace_body: {
			padding: {
				top: '11px',
				bottom: '11px',
				left: '13px',
				right: '13px',
			},
			gap: '8px',
			border: {
				top: { width: '1px', style: 'solid', color: $bog_builderui_tokens.line },
			},
			// По дефолту скрыт. Показываем только когда trace_expanded=true.
			// Boolean false → mol удаляет атрибут → CSS [attr="false"] не сработает.
			display: 'none',
			'@': {
				raggu_expanded: {
					true: {
						display: 'flex',
						flexDirection: 'column',
					},
				},
			},
		},
		Message_trace_label: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '10px',
			},
			color: $bog_builderui_tokens.shade,
		},
		Message_trace_chips: {
			flex: { direction: 'row' },
			flexWrap: 'wrap',
			gap: '5px',
		},
		Message_trace_chip_one: chip,
		Message_trace_chip_two: chip,
		Message_trace_chip_three: chip,
		Message_trace_stats: {
			flex: { direction: 'row' },
			gap: '14px',
			margin: { top: '2px' },
		},
		Message_trace_stat_chunks: trace_stat,
		Message_trace_stat_comms: trace_stat,
		Message_trace_stat_retr: trace_stat,
		Message_trace_stat_gen: trace_stat,
		Message_trace_stat_power: trace_stat,
		Message_trace_link: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 500,
				size: '10px',
			},
			color: $bog_builderui_tokens.current,
		},

		Footer: {
			padding: {
				top: '14px',
				bottom: '14px',
				left: '22px',
				right: '22px',
			},
			border: {
				top: { width: '1px', style: 'solid', color: $bog_builderui_tokens.line },
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
			gap: '8px',
			border: { width: '1px', style: 'solid', color: $bog_builderui_tokens.line, radius: '10px' },
			padding: {
				top: '8px',
				bottom: '8px',
				left: '12px',
				right: '8px',
			},
			color: $bog_builderui_tokens.shade,
			font: { size: '13px' },
		},
		Prompt: {
			flex: { grow: 1 },
			border: { width: 0 },
			background: { color: 'transparent' },
			minHeight: '24px',
			color: $bog_builderui_tokens.text
		},
		Input_send: {
			background: { color: $bog_builderui_tokens.current },
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
