// Depdencies 
var http = require('http');
const https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
const fs = require('fs');

var unfiedServer = function( req, res) {
    let decoder = new StringDecoder('utf-8');
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
};


var httpServer = http.createServer(function( req, res) {  
    unfiedServer(req, res)
});

httpServer.listen(config.port, function() { 
    console.log ( 'The server is listenining on port ' + config.port +' env '+config.envName);
});

//============================= Start : creating HTTPS Server ===================================
var httpServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'), 
    'cert': fs.readFileSync('./https/cert.pem')  
}
var httpsServer = https.createServer(httpServerOptions,function( req, res) {
    unfiedServer(req, res)
   // console.log ('Requested path: ' + cleanedPath + ' Method: ' + req.method + ' Query Params: ', queri);
});

httpsServer.listen(config.securePort, function() { 
    console.log ( 'The server is listenining on secure port ' + config.securePort +' env '+config.envName);
});


//============================= END : creating HTTPS Server ===================================


var handlers = {};

handlers.sample = function(data, callback) { 
callback(300, {'name' : 'handler sample : ok' });
};

handlers.ping = function(data, callback) { 
callback(200, {'status' : 'ok, Still alive' });
};

handlers.ping = function(data, callback) { 
callback(200, {'status' : 'Welcome' });
};

handlers.notFound = function(data, callback) { 
callback(404);
};

// routers Def
 var router = {
     'sample' : handlers.sample,
     'ping' : handlers.ping,
     'hello' : handlers.hello
 }