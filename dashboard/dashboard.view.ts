namespace $.$$ {

	type Metric = { id: string; name: string; value: string; pct: string }
	type Stage = { id: string; name: string; time: string; pct: string }

	const METRICS: readonly Metric[] = [
		{ id: 'correctness', name: 'Answer Correctness', value: '59.0', pct: '59%' },
		{ id: 'recall', name: 'Evidence Recall', value: '84.2', pct: '84%' },
		{ id: 'relevancy', name: 'Context Relevancy', value: '90.8', pct: '91%' },
	]

	const STAGES: readonly Stage[] = [
		{ id: 'chunking', name: 'Chunking', time: '1.2с', pct: '15%' },
		{ id: 'extraction', name: 'Extraction', time: '8.4с', pct: '70%' },
		{ id: 'summarization', name: 'Summarization', time: '3.1с', pct: '38%' },
		{ id: 'communities', name: 'Communities', time: '2.0с', pct: '26%' },
		{ id: 'refinement', name: 'Refinement', time: '0.6с', pct: '9%' },
	]

	export class $bog_ragufront_dashboard extends $.$bog_ragufront_dashboard {

		metrics() { return METRICS as readonly Metric[] as Metric[] }
		stages() { return STAGES as readonly Stage[] as Stage[] }

		metric_rows() { return this.metrics().map( m => this.Metric( m.id ) ) }
		stage_rows() { return this.stages().map( s => this.Stage( s.id ) ) }

		metric( id: string ) { return this.metrics().find( m => m.id === id ) ?? METRICS[ 0 ] }
		stage( id: string ) { return this.stages().find( s => s.id === id ) ?? STAGES[ 0 ] }

		metric_name( id: string ) { return this.metric( id ).name }
		metric_value( id: string ) { return this.metric( id ).value }
		metric_pct( id: string ) { return this.metric( id ).pct }

		stage_name( id: string ) { return this.stage( id ).name }
		stage_time( id: string ) { return this.stage( id ).time }
		stage_pct( id: string ) { return this.stage( id ).pct }

	}

}
