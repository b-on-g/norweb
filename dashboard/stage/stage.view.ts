namespace $.$$ {

	export class $bog_ragufront_dashboard_stage extends $.$bog_ragufront_dashboard_stage {

		Bar_fill() {
			const fill = super.Bar_fill()
			fill.style = () => ( { width: this.pct() } )
			return fill
		}

	}

}
