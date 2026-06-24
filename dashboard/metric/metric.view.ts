namespace $.$$ {

	export class $bog_ragufront_dashboard_metric extends $.$bog_ragufront_dashboard_metric {

		Bar_fill() {
			const fill = super.Bar_fill()
			fill.style = () => ( { width: this.pct() } )
			return fill
		}

	}

}
