ExtendableError     = require('./src/Exception/ExtendableError.js');
DefinitionException = require('./src/Exception/DefinitionException.js');

http           = require('http');
httpProxy      = require('http-proxy');
ConfLoader     = require('./src/Service/ConfigurationLoader.js');
RoutingMatcher = require('./src/Service/RouteMatcher.js');
PayloadMatcher = require('./src/Service/PayloadMatcher.js');

/**
 * @type {ConfigurationLoader} config
 * @type {RouteMatcher|*} matcher
 */
config = new ConfLoader;
config.compile();
router = new RoutingMatcher(config);
payloadChecker = new PayloadMatcher(config);

require('./src/Service/Serve.js');
