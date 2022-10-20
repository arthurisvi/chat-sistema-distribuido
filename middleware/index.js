const PORT = 1900;
const MULTICAST_ADDR = "239.255.255.250";
const SRC_PORT = 6025;
var dgram = require("dgram");
var client = dgram.createSocket("udp4");
var server = dgram.createSocket("udp4");
var servers = [];

function start(type) {
    if (type === "client") {
        client.on("listening", () => {
            client.setBroadcast(true);
            var address = client.address();
            console.log(
                "UDP Client listening on " + address.address + ":" + address.port
            );
        });

        client.bind(PORT, () => {
            client.addMembership(MULTICAST_ADDR);
        });

        client.on("message", (message, rinfo) => {
            // console.log(
            //     "Message from: " + rinfo.address + ":" + rinfo.port + " - " + message
            // );

            if (message.includes("ssdp:server")) {
                console.log(
                    "Keep-alive from: " +
                    rinfo.address +
                    ":" +
                    rinfo.port +
                    " - " +
                    message
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
    } else if (type === "server") {
        server.bind(SRC_PORT, () => {
            setInterval(multicastNew, 7000);
        });

        const multicastNew = () => {
            let message = Buffer.from("ssdp:server");
            server.send(message, 0, message.length, PORT, MULTICAST_ADDR, () => {
                console.log("Keep-alive to client: '" + message + "'");
            });
        };

        server.on("message", (message, rinfo) => {
            console.log(`${rinfo.address}:${rinfo.port} - ${message}`);
        });
    }
}

const sendMessage = (message) => {
    if (servers.length > 0) {
        client.send(Buffer.from(message), servers[0].port, servers[0].ip);
    } else {
        console.log("Não tem servidor registrado");
    }
};

module.exports = {
    start,
    sendMessage,
};