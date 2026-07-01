namespace $.$$ {

	const DEFAULTS = {
		graph_n: 80,
		gravity: 0.09,
		force_scale: 0.06,
		damping: 0.82,
		min_move: 0.15,
		max_speed: 12,
	}

	export class $raggu_web_front_explorer_forcegraph_demo extends $.$raggu_web_front_explorer_forcegraph_demo {

		@$mol_action
		reset() {
			this.graph_n( DEFAULTS.graph_n )
			this.gravity( DEFAULTS.gravity )
			this.force_scale( DEFAULTS.force_scale )
			this.damping( DEFAULTS.damping )
			this.min_move( DEFAULTS.min_move )
			this.max_speed( DEFAULTS.max_speed )
			return null
		}

	}

}
