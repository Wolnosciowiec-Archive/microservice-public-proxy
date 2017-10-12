http       = require('http');
httpProxy  = require('http-proxy');
ConfLoader = require('./src/Service/ConfigurationLoader.js');
Matcher    = require('./src/Service/RouteMatcher.js');

/**
 * @type {ConfigurationLoader} config
 * @type {RouteMatcher|*} matcher
 */
config = new ConfLoader;
config.compile();
matcher = new Matcher(config);

require('./src/Service/Serve.js');
