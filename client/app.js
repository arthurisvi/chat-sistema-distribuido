var PORT = 1900;
var MULTICAST_ADDR = '239.255.255.250';
var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var servers = [];

client.on('listening', function() {
    client.setBroadcast(true);
    var address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
});

client.on('message', function(message, rinfo) {

    if (message.includes('SERVER')) {
        servers.push(rinfo.address);
    }
    // console.log('Message from: ' + rinfo.address + ':' + rinfo.port + ' - ' + message);
    console.log(servers)
});

client.bind(PORT, function() {
    client.addMembership(MULTICAST_ADDR);
});