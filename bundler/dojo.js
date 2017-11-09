// This is a minimal shim for loading Dojo using SystemJS.

exports = {
	translate: function(spec, foo) {
		if(this.builder) {
			const config = {
				'touch': true,
				'config-deferredInstrumentation': false,
				'dom-addeventlistener': true,
				'host-browser': true
			};

			// These kludges support enough AMD loader syntax to make dgrid work.

			// Map "has!condition?yes:no" tests using condition values listed above.
			spec.source = spec.source.replace(/(['"])[^'"]+\/has!([^?'"]*)\?([^:'"]*):?([^'"]*)/g, function(match, quote, condition, yes, no) {
				return(quote + ((config[condition] ? yes : no) || 'undefined'));
			// Map "selector/loader!default" to "selector/lite.js".
			}).replace(/(['"][^'"]+\/selector\/)_loader!([^'"]*)/, function(match, prefix) {
				return(prefix + 'lite.js');
			}).replace(/['"]require['"]/, '"dojoRequire"');
		}
	},

	fetch: function(spec, fetch) {
		const name = spec.name.replace(System.baseURL, '').replace(/node_modules\/(dojo\/.*)\.js/, '$1');

		if(typeof(require) == 'function' && require.cache) {
			// Dojo require function was found.

			return(new Promise(function(resolve) {
				require([ name ], function(module) {
					spec.dojo = module;
					resolve('');
				});
			}).catch(function(err) { console.log(err); }));
		} else if(this.builder) {
			// systemjs-builder support.
			return(fetch(spec));
		}
	},

	instantiate: function(spec, instantiate) {
		return(spec.dojo);
	}
};
