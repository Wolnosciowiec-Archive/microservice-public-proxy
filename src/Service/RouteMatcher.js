/**
 * Matches routes basing on configuration provided by the ConfigurationLoader
 */
class RouteMatcher {
    /**
     * @param {ConfigurationLoader} config
     */
    constructor(config) {
        this.config = config;
    }

    match(url) {
        for (let num in this.config.config) {
            let definition = this.config.config[num].definition;

            for (let routeNum in definition.config) {
                if (!definition.config.hasOwnProperty(routeNum)) {
                    continue;
                }

                let route   = definition.config[routeNum]['match'][0].$;
                let target = RouteMatcher._match_regexp(route, url);

                console.log(target);

                if (target) {
                    console.info('[RouteMatcher] Matched regexp route for "' + url + '"');
                    return target;
                }

                target = RouteMatcher._match_substring(route, url);

                if (target) {
                    console.info('[RouteMatcher] Matched substring route for "' + url + '"');
                    return target;
                }

                console.warn('[RouteMatcher] No matches found for url "' + url + '"');
            }
        }

        return '';
    }

    /**
     * Match the route by a regular expression
     *
     * @param {Array} route
     * @param {string} url
     *
     * @private
     * @returns {string}
     */
    static _match_regexp(route, url) {

        if (route.type !== 'regexp') {
            return '';
        }

        let regexp  = new RegExp(route.pattern);
        let target  = route.target;
        let matches = regexp.exec(url);

        if (matches !== null && matches.length > 0) {
            for (let num = 1; num < matches.length; num++) {
                target = target.replace(new RegExp('\\$' + num), matches[num]);
            }

            return target;
        }

        return '';
    }

    /**
     * Match by substring beginning of the string
     *
     * @param route
     * @param url
     *
     * @private
     * @returns {string}
     */
    static _match_substring(route, url) {
        if (route.type !== 'substring') {
            return '';
        }

        if (url.substr(0, route.pattern.length) === route.pattern) {
            return route.target;
        }

        return '';
    }
}

module.exports = RouteMatcher;
