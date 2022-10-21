var dgram = require("dgram");
var client = dgram.createSocket("udp4");
var ip = require("ip");

var servers = [];

function run(multicastAddress, port) {
    client.on("listening", () => {
        client.setBroadcast(true);
        var address = client.address();
        console.log(
            "UDP Client listening on " + ip.address() + ":" + address.port
        );
    });

    client.bind(port, () => {
        client.addMembership(multicastAddress);
    });

    client.on("message", (message, rinfo) => {
        if (ip.address() !== rinfo.address) {
            console.log(
                "Message from: " + rinfo.address + ":" + rinfo.port + " - " + message
            );
        }
        if (message.includes("{")) {
            let convertMessage = JSON.parse(message)
            let ipMessage = convertMessage.ip
            let portMessage = convertMessage.port
            message = convertMessage.message;

            if (ipMessage !== ip.address()) {
                console.log(`[${ipMessage}:${portMessage}] - ${message}`);
            }
        }

        if (message.includes("ssdp:server")) {
            console.log(
                "Keep-alive from: " + rinfo.address + ":" + rinfo.port + " - " + message
            );
            let ips = servers.map((server) => server.ip);

            if (!ips.includes(rinfo.address)) {
                servers.push({
                    serverOn: true,
                    ip: rinfo.address,
                    port: rinfo.port,
                });
            }
        }
    });
}

const sendMessage = (message) => {
    if (servers.length > 0) {
        client.send(Buffer.from(message), servers[0].port, servers[0].ip);
    } else {
        console.log("Não tem servidor registrado");
    }
};

module.exports = {
    run,
    sendMessage,
};