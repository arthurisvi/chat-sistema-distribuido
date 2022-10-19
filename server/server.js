const SRC_PORT = 6025;
const PORT = 1900;
const MULTICAST_ADDR = '239.255.255.250';
var dgram = require('dgram');
var server = dgram.createSocket("udp4");

server.bind(SRC_PORT, () => {
    setInterval(multicastNew, 7000);
});


const multicastNew = () => {
    let message = Buffer.from('ssdp:server')
    server.send(message, 0, message.length, PORT, MULTICAST_ADDR, () => {
        console.log("Keep-alive to client: '" + message + "'");
    });
}

server.on("message", (message, rinfo) => {
    console.log(`${rinfo.address}:${rinfo.port} - ${message}`)
})