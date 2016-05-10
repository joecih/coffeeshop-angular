var finalhandler = require('finalhandler');
var http = require('http');
var serveStatic = require('serve-static');
var liveServer = require('live-server');
const DEV_MODE = true;

var os = require('os');
var ifaces = os.networkInterfaces();
var _ip = "127.0.0.1";

Object.keys(ifaces).forEach(function(ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function(iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }

        if (alias >= 1) {
            // this single interface has multiple ipv4 addresses
            console.log("Multiple ipv4's" + ifname + ':' + alias, iface.address);
        } else {
            // this interface has only one ipv4 adress
            console.log("Only One ipv4: " + ifname, iface.address);
            _ip = iface.address;
        }
        ++alias;
    });
});

if (DEV_MODE) {
    var params = {
        port: 8081, // Set the server port. Defaults to 8080.
        host: _ip, // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
        root: __dirname, // Set root directory that's being server. Defaults to cwd.
        open: false, // When false, it won't load your browser by default.
        //ignore: 'scss,my/templates', // comma-separated string for paths to ignore
        //file: "index.html", // When set, serve this file for every 404 (useful for single-page applications)
        wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
        // mount: [
        //     ['/components', './node_modules']
        // ], // Mount a directory to a route.
        logLevel: 2 // 0 = errors only, 1 = some, 2 = lots
    };
    // Listen
    console.log("Running server from port: 8081");
    liveServer.start(params);

} else {
    // Serve up public/ftp folder
    var serve = serveStatic('./', {
        'index': ['index.html', 'index.htm']
    })

    // Create server
    var server = http.createServer(function(req, res) {
        var done = finalhandler(req, res)
        serve(req, res, done)
    })

    // Listen
    console.log("Running server from port: 8081");
    server.listen(8081)
}
