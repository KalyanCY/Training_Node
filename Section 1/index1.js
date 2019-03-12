// Depdencies 
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder');
var config = require('./config')

var server = http.createServer(function( req, res) {
    var decoder = new StringDecoder('utf-8');
    let postDataPayload = '';
    let parsedUrl = url.parse(req.url, true); 
    let path = parsedUrl.pathname;
    let cleanedPath = path.replace(/^\/+|\/+$/g, '');
    
    let queri = parsedUrl.query;
    
    
    req.on('data', function(data) {
        postDataPayload += decoder.write(data); 
    } );
    req.on('end', function() {
        postDataPayload += decoder.end();
    
        // Handler to go :
        
        var chosenController = typeof(router[cleanedPath]) === 'undefined' ? handlers.notFound : router[cleanedPath];
        
        
        var data = {
            'trimmedPath' : cleanedPath,
            'queryStringObject' : queri,
            'method' : req.method,
            'headers' : req.headers,
            'payload' : postDataPayload
        };
            
        chosenController(data, function(statusCode, payload){
            
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};
            
            let payloadString = JSON.stringify(payload);
            
            res.setHeader('content-type', 'Application/json');
            res.writeHead(statusCode)
            res.end(payloadString);
           console.log ('Response payload ', statusCode, payloadString);

        });
        
        console.log ('Requested payload from ', postDataPayload);
    } );
   // console.log ('Requested path: ' + cleanedPath + ' Method: ' + req.method + ' Query Params: ', queri);
});

server.listen(config.port, function() { 
    console.log ( 'The server is listenining on port ' + config.port +' env '+config.envName);
});

var handlers = {};

handlers.sample = function(data, callback) { 
callback(200, {'name' : 'handler sample : ok' });
};

handlers.notFound = function(data, callback) { 
callback(404);
};

// routers Def
 var router = {
     'sample' : handlers.sample,
     'pathRequest' : handlers.sample
 }