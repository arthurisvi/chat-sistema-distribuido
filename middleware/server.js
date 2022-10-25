const SRC_PORT = 6025;
const dgram = require("dgram");
const server = dgram.createSocket("udp4");

function run(multicastAddress, port) {
    server.bind(SRC_PORT, () => {
        setInterval(multicastNew, 2000);
    });

    const multicastNew = () => {
        let message = Buffer.from("ssdp:server");
        server.send(message, 0, message.length, port, multicastAddress, () => {
            console.log("Keep-alive to client: '" + message + "'");
        });
    };

    server.on("message", (message, rinfo) => {
        console.log(`${rinfo.address}:${rinfo.port} - ${message}`);
        message = `{"ip":"${rinfo.address}", "port":"${rinfo.port}", "message":"${message}", "protocol":"ssdp:chat"}`;
        server.send(message, 0, message.length, port, multicastAddress, () => {});
    });
}

module.exports = {
    run,
};