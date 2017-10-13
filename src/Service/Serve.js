proxy = httpProxy.createProxyServer();

/**
 * Error handling
 */
proxy.on('error', function (e, request, response) {
   const MessagesMapping = {
       'socket hang up': 'Timeout while processing the request, upstream didnt respond in time'
   };

   let message = MessagesMapping.hasOwnProperty(e.message) ? MessagesMapping[e.message] : e.message;

   response.writeHead(503, { 'Content-Type': 'application/json', 'X-Origin-Url': request.url });
   response.write(JSON.stringify({"code": 503, "message": "Service temporary unavailable", "details": message}));
   response.end();
});

/**
 * Serving the proxy
 *
 * @type {Object|*}
 */
server = http.createServer(function(request, response) {
    let body = '';

    request.on('data', function (chunk) {
        body += chunk;
    });

    request.on('end', function () {
        let supportedRoute = router.match(request.url);

        if (supportedRoute) {
            try {
                payloadChecker.match(body);

            } catch (e) {
                response.writeHead(403, { 'Content-Type': 'application/json', 'X-Origin-Url': request.url });
                response.write(JSON.stringify({"code": 403, "message": "Forbidden, the request was denied by the application firewall", "details": e.message}));
                response.end();
                return;
            }

            return proxy.web(request, response, {
                target: supportedRoute,
                proxyTimeout: 1000 * 30
            });
        }
        response.writeHead(403, {'Content-Type': 'application/json', 'X-Origin-Url': request.url});
        response.write('{"code": 403, "message": "Forbidden, the request was denied by the application firewall"}');
        response.end();
    });
});

console.log('[Serve] Listening on 0.0.0.0:8444');
server.listen(8444);
