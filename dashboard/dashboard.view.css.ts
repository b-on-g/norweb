namespace $ {

	const card_label = {
		font: {
			family: 'ui-monospace, monospace',
			weight: 600,
			size: '11px',
		},
		color: '#a8a29e',
		textTransform: 'uppercase',
		letterSpacing: '0.6px',
	} as const

	const card = {
		background: { color: '#ffffff' },
		border: { width: '1px', style: 'solid', color: '#d6d3d1', radius: '10px' },
		padding: {
			top: '18px',
			bottom: '18px',
			left: '18px',
			right: '18px',
		},
		flex: { direction: 'column' },
	} as const

	const stat_val = {
		font: { weight: 800, size: '26px' },
	} as const

	const stat_lbl = {
		font: {
			family: 'ui-monospace, monospace',
			weight: 500,
			size: '10px',
		},
		color: '#a8a29e',
	} as const

	const log_row = {
		flex: { direction: 'row' },
		gap: '14px',
		font: {
			family: 'ui-monospace, monospace',
			weight: 500,
			size: '11px',
		},
		color: '#57534e',
		padding: {
			top: '8px',
			bottom: '8px',
			left: '10px',
			right: '10px',
		},
		background: { color: '#faf9f8' },
		border: { radius: '6px' },
	} as const

	const log_time = {
		color: '#a8a29e',
	} as const

	const log_text = {
		flex: { grow: 1 },
	} as const

	const log_dur = {
		color: '#1f8a5b',
	} as const

	$mol_style_define( $bog_ragufront_dashboard, {
		flex: { direction: 'column' },
		padding: {
			top: '1.5rem',
			bottom: '1.5rem',
			left: '1.75rem',
			right: '1.75rem',
		},

		Title: {
			font: { weight: 700, size: '20px' },
			margin: { bottom: '4px' },
		},
		Subtitle: {
			font: { size: '13px' },
			color: '#78716c',
			margin: { bottom: '20px' },
		},

		Grid: {
			display: 'grid',
			gridTemplateColumns: '1fr 1fr',
			gap: '16px',
		},

		Card_stats: card,
		Card_quality: card,
		Card_energy: card,
		Card_timings: card,
		Card_logs: { ...card, gridColumn: '1 / -1' },
		Card_stats_label: card_label,
		Card_quality_label: card_label,
		Card_energy_label: card_label,
		Card_timings_label: card_label,
		Card_logs_label: card_label,

		Stats_row: {
			flex: { direction: 'row' },
			gap: '22px',
			margin: { top: '14px' },
		},
		Stat_nodes: { flex: { direction: 'column' } },
		Stat_edges: { flex: { direction: 'column' } },
		Stat_comms: { flex: { direction: 'column' } },
		Stat_nodes_val: stat_val,
		Stat_edges_val: stat_val,
		Stat_comms_val: stat_val,
		Stat_nodes_lbl: stat_lbl,
		Stat_edges_lbl: stat_lbl,
		Stat_comms_lbl: stat_lbl,

		Stats_dist: {
			margin: { top: '14px' },
			height: '64px',
			border: { radius: '6px' },
			background: { color: '#e7e4e0' },
			align: { items: 'center' },
			justify: { content: 'center' },
			font: {
				family: 'ui-monospace, monospace',
				weight: 600,
				size: '10px',
			},
			color: '#a8a29e',
		},

		Metric_rows: { flex: { direction: 'column' } },

		Quality_footer: {
			font: {
				family: 'ui-monospace, monospace',
				weight: 500,
				size: '10px',
			},
			color: '#a8a29e',
			margin: { top: '12px' },
		},

		Energy_row: {
			flex: { direction: 'row' },
			gap: '22px',
			margin: { top: '14px' },
			align: { items: 'flex-end' },
		},
		Energy_kwh: { flex: { direction: 'column' } },
		Energy_cost: { flex: { direction: 'column' } },
		Energy_kwh_val: stat_val,
		Energy_cost_val: { ...stat_val, color: '#1f8a5b' },
		Energy_kwh_lbl: stat_lbl,
		Energy_cost_lbl: stat_lbl,

		Energy_note: {
			margin: { top: '12px' },
			font: {
				family: 'ui-monospace, monospace',
				weight: 500,
				size: '10px',
			},
			color: '#78716c',
			lineHeight: '1.5',
			background: { color: '#faf9f8' },
			border: { width: '1px', style: 'dashed', color: '#d6d3d1', radius: '6px' },
			padding: {
				top: '9px',
				bottom: '9px',
				left: '9px',
				right: '9px',
			},
			whiteSpace: 'pre-line',
		},

		Stage_rows: { flex: { direction: 'column' } },

		Log_list: {
			flex: { direction: 'column' },
			gap: '6px',
			margin: { top: '12px' },
		},
		Log_one: log_row,
		Log_two: log_row,
		Log_one_time: log_time,
		Log_two_time: log_time,
		Log_one_text: log_text,
		Log_two_text: log_text,
		Log_one_dur: log_dur,
		Log_two_dur: log_dur,
	} )
}
