/** @see $bog_builderui_tokens */
namespace $ {

	const { radial_gradient } = $mol_style_func

	const dot_base = {
		minWidth: '9px',
		maxWidth: '9px',
		height: '9px',
		border: { radius: '50%' },
	} as const

	const legend_row = {
		flex: { direction: 'row' },
		align: { items: 'center' },
		gap: '8px',
		padding: {
			top: '2px',
			bottom: '2px',
		},
	} as const

	const legend_label = {
		font: {
			family: 'ui-monospace, monospace',
			weight: 500,
			size: '10px',
		},
		color: $bog_builderui_tokens.shade,
	} as const

	const relation_card = {
		border: { width: '1px', style: 'solid', color: $bog_builderui_tokens.line, radius: '6px' },
		padding: {
			top: '8px',
			bottom: '8px',
			left: '10px',
			right: '10px',
		},
		margin: { bottom: '6px' },
		font: { size: '11px' },
		flex: { direction: 'column' },
	} as const

	const relation_type = {
		font: {
			family: 'ui-monospace, monospace',
			weight: 600,
			size: '10px',
		},
		color: $bog_builderui_tokens.current,
	} as const

	const relation_target = {
		color: $bog_builderui_tokens.shade,
		margin: { top: '2px' },
	} as const

	$mol_style_define( $bog_norweb_front_explorer, {
		flex: { direction: 'row', shrink: 1 },
		minWidth: 0,
		height: '100%',

		Canvas: {
			flex: { grow: 1, shrink: 1, direction: 'column' },
			position: 'relative',
			background: { color: $bog_builderui_tokens.back },
			minWidth: 0,
		},
		Canvas_bg: {
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			align: { items: 'center' },
			justify: { content: 'center' },
			background: {
				image: [
					[ radial_gradient( 'circle at 35% 40%, #5b5bd62e, transparent 45%' ) ],
					[ radial_gradient( 'circle at 70% 65%, #d65b8c24, transparent 45%' ) ],
				],
			},
		},
		Filters: {
			position: 'absolute',
			top: '14px',
			left: '14px',
			flex: { direction: 'row' },
			flexWrap: 'wrap',
			gap: '8px',
			maxWidth: '62%',
		},
		Filter_search: {
			background: { color: $bog_builderui_tokens.field },
			color: $bog_builderui_tokens.text,
			border: { radius: '7px' },
			padding: {
				top: '8px',
				bottom: '8px',
				left: '11px',
				right: '11px',
			},
			font: { size: '11px', weight: 600 },
			flex: { direction: 'row' },
			align: { items: 'center' },
			gap: '7px',
		},
		Filter_type: {
			background: { color: $bog_builderui_tokens.field },
			color: $bog_builderui_tokens.text,
			border: { radius: '7px' },
			padding: {
				top: '8px',
				bottom: '8px',
				left: '11px',
				right: '11px',
			},
			font: { size: '11px', weight: 600 },
		},
		Filter_thresh: {
			background: { color: $bog_builderui_tokens.field },
			color: $bog_builderui_tokens.text,
			border: { radius: '7px' },
			padding: {
				top: '8px',
				bottom: '8px',
				left: '11px',
				right: '11px',
			},
			font: { size: '11px', weight: 600 },
		},
		Filter_comm: {
			background: { color: $bog_builderui_tokens.current },
			color: '#ffffff',
			border: { radius: '7px' },
			padding: {
				top: '8px',
				bottom: '8px',
				left: '11px',
				right: '11px',
			},
			font: { size: '11px', weight: 600 },
		},

		Legend: {
			position: 'absolute',
			top: '14px',
			right: '14px',
			background: { color: '#1c1b1ae6' },
			border: { width: '1px', style: 'solid', color: '#3a3937', radius: '8px' },
			padding: {
				top: '11px',
				bottom: '11px',
				left: '13px',
				right: '13px',
			},
			width: '150px',
			flex: { direction: 'column' },
		},
		Legend_title: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 700,
				size: '10px',
			},
			color: $bog_builderui_tokens.line,
			textTransform: 'uppercase',
			letterSpacing: '0.6px',
			margin: { bottom: '8px' },
		},
		Legend_person: legend_row,
		Legend_org: legend_row,
		Legend_loc: legend_row,
		Legend_event: legend_row,
		Legend_date: legend_row,
		Legend_work: legend_row,
		Legend_law: legend_row,
		Legend_person_dot: { ...dot_base, background: { color: '#e0524f' } },
		Legend_org_dot: { ...dot_base, background: { color: '#4f8ee0' } },
		Legend_loc_dot: { ...dot_base, background: { color: '#3fb56b' } },
		Legend_event_dot: { ...dot_base, background: { color: '#d97ad9' } },
		Legend_date_dot: { ...dot_base, background: { color: '#e0a73f' } },
		Legend_work_dot: { ...dot_base, background: { color: '#7c6ce0' } },
		Legend_law_dot: { ...dot_base, background: { color: '#3fb8b8' } },
		Legend_person_label: legend_label,
		Legend_org_label: legend_label,
		Legend_loc_label: legend_label,
		Legend_event_label: legend_label,
		Legend_date_label: legend_label,
		Legend_work_label: legend_label,
		Legend_law_label: legend_label,

		Aside: {
			minWidth: '300px',
			maxWidth: '300px',
			background: { color: $bog_builderui_tokens.card },
			border: {
				left: { width: '1px', style: 'solid', color: $bog_builderui_tokens.line },
			},
			padding: {
				top: '18px',
				bottom: '18px',
				left: '18px',
				right: '18px',
			},
			overflow: 'auto',
			flex: { direction: 'column' },
		},
		Aside_title: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '10px',
			},
			color: $bog_builderui_tokens.shade,
			textTransform: 'uppercase',
			letterSpacing: '0.7px',
		},
		Entity_head: {
			flex: { direction: 'row' },
			align: { items: 'center' },
			gap: '8px',
			margin: { top: '11px' },
		},
		Entity_dot: {
			minWidth: '12px',
			maxWidth: '12px',
			height: '12px',
			border: { radius: '50%' },
			background: { color: '#7c6ce0' },
		},
		Entity_name: {
			font: { weight: 700, size: '16px' },
		},
		Entity_type: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '10px',
			},
			color: $bog_builderui_tokens.current,
			margin: { top: '6px' },
		},
		Entity_desc: {
			font: { size: '12px' },
			color: $bog_builderui_tokens.shade,
			lineHeight: '1.5',
			margin: { top: '10px' },
		},

		Relations_title: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '10px',
			},
			color: $bog_builderui_tokens.shade,
			textTransform: 'uppercase',
			margin: { top: '18px', bottom: '8px' },
		},
		Relations_list: {
			flex: { direction: 'column' },
		},
		Rel: relation_card,
		Rel_type: relation_type,
		Rel_target: relation_target,

		Sources_title: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '10px',
			},
			color: $bog_builderui_tokens.shade,
			textTransform: 'uppercase',
			margin: { top: '16px', bottom: '8px' },
		},
		Sources: {
			border: { width: '1px', style: 'dashed', color: $bog_builderui_tokens.line, radius: '6px' },
			padding: {
				top: '10px',
				bottom: '10px',
				left: '10px',
				right: '10px',
			},
			font: {
				family: 'ui-monospace, monospace',
				weight: 500,
				size: '10px',
			},
			color: $bog_builderui_tokens.shade,
			background: { color: $bog_builderui_tokens.back },
		},
		Ask_btn: {
			margin: { top: '16px' },
			background: { color: $bog_builderui_tokens.current },
			color: '#ffffff',
			border: { radius: '7px' },
			padding: {
				top: '10px',
				bottom: '10px',
				left: '10px',
				right: '10px',
			},
			textAlign: 'center',
			font: { size: '12px', weight: 600 },
			cursor: 'pointer',
		},

		'@media': {
			'(max-width: 720px)': {
				flex: { direction: 'column' },
				overflow: 'auto',
				Canvas: {
					minHeight: '55vh',
				},
				Aside: {
					minWidth: 0,
					maxWidth: '100%',
					border: {
						left: { width: 0 },
						top: { width: '1px', style: 'solid', color: $bog_builderui_tokens.line },
					},
					overflow: 'visible',
				},
				Filters: {
					maxWidth: $mol_style_func.calc( '100% - 28px' ),
				},
			},
		},
	} )
}
