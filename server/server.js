var SRC_PORT = 6025;
var PORT = 1900;
var MULTICAST_ADDR = '239.255.255.250';
var dgram = require('dgram');
var server = dgram.createSocket("udp4");

server.bind(SRC_PORT, function() {
    setInterval(multicastNew, 4000);
});

function multicastNew() {
    var message = new Buffer("Teste multicast!");
    server.send(message, 0, message.length, PORT, MULTICAST_ADDR, function() {
        console.log("Teste mensagem '" + message + "'");
    });
}