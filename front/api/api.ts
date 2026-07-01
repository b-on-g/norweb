namespace $ {

	/**
	 * Operation descriptor produced by the generator in `-openapi/*.ts`.
	 * Each entry carries HTTP method, route template with `{placeholders}`,
	 * plus typed `params` / `query` / `body` / `out` marker fields.
	 */
	export type $raggu_web_front_api_operation = {
		method: string
		route: string
		params: any
		query: any
		body: any
		out: any
	}

	/** Options passed alongside operation call. */
	export type $raggu_web_front_api_options< Op extends $raggu_web_front_api_operation > = {
		params?: Op[ 'params' ]
		query?: Op[ 'query' ]
		body?: Op[ 'body' ]
	}

	/** Build final URL: substitute `{placeholders}` in route, append querystring. */
	function $raggu_web_front_api_url(
		endpoint: string,
		route: string,
		params: Record< string, any > | undefined,
		query: Record< string, any > | undefined,
	): string {
		let path = route
		if ( params ) {
			for ( const key in params ) {
				path = path.replace( `{${ key }}`, encodeURIComponent( String( params[ key ] ) ) )
			}
		}
		const qs: string[] = []
		if ( query ) {
			for ( const key in query ) {
				const val = query[ key ]
				if ( val === undefined || val === null ) continue
				if ( Array.isArray( val ) ) {
					for ( const item of val ) qs.push( `${ encodeURIComponent( key ) }=${ encodeURIComponent( String( item ) ) }` )
				} else {
					qs.push( `${ encodeURIComponent( key ) }=${ encodeURIComponent( String( val ) ) }` )
				}
			}
		}
		const suffix = qs.length ? `?${ qs.join( '&' ) }` : ''
		return `${ endpoint }${ path }${ suffix }`
	}

	/**
	 * Typed REST client factory for OpenAPI-generated operation descriptors.
	 *
	 * Returns a callable that takes an operation constant plus options and
	 * synchronously (via wire) returns the parsed JSON body. Any network
	 * error propagates as an exception so `$mol_view` shows an error plate.
	 *
	 * Endpoint host is baseline `http://localhost:8000` because operation `route`s
	 * already carry the `/api/v1/...` prefix from FastAPI's OpenAPI dump.
	 */
	export const $raggu_web_front_api = ( () => {
		const endpoint = 'http://localhost:8000'
		const init: RequestInit = {
			credentials: 'omit',
			cache: 'no-cache',
		}
		return function call< Op extends $raggu_web_front_api_operation >(
			op: Op,
			opts: $raggu_web_front_api_options< Op > = {},
		): Op[ 'out' ] {
			const url = $raggu_web_front_api_url( endpoint, op.route, opts.params, opts.query )
			const req: RequestInit = { ... init, method: op.method }
			if ( opts.body !== undefined ) {
				req.headers = { ... ( init.headers ?? {} ), 'content-type': 'application/json' }
				req.body = JSON.stringify( opts.body )
			}
			return $mol_fetch.json( url, req ) as Op[ 'out' ]
		}
	} )()

}
