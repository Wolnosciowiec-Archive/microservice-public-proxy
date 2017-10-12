
proxy = httpProxy.createProxyServer()

proxy.on('error', function (e, request, response) {
   console.warn(e);

   response.writeHead(503, { 'Content-Type': 'application/json', 'X-Origin-Url': request.url });
   response.write('{"code": 500, "message": "Service temporary unavailable", "details": "' + e.message + '"}');
   response.end();
});

server = http.createServer(function(request, response) {
    request.headers.connection = "Close";

    let supportedRoute = matcher.match(request.url);

    if (supportedRoute) {
        return proxy.web(request, response, {
            target: supportedRoute
        });
    }

    response.writeHead(403, { 'Content-Type': 'application/json', 'X-Origin-Url': request.url });
    response.write('{"code": 403, "message": "Forbidden, the request was denied by the application firewall"}');
    response.end();
});

console.log('[Serve] Listening on 0.0.0.0:8444');
server.listen(8444);
