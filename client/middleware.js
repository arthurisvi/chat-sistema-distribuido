const PORT = 1900;
const MULTICAST_ADDR = "239.255.255.250";
var dgram = require("dgram");
var client = dgram.createSocket("udp4");
var servers = [];

const listening = () => {
    client.on("listening", () => {
        client.setBroadcast(true);
        var address = client.address();
        console.log(
            "UDP Client listening on " + address.address + ":" + address.port
        );
    });
}

const bind = () => {
    client.bind(PORT, () => {
        client.addMembership(MULTICAST_ADDR);
    });
};

const serviceDiscovery = () => {
    client.on("message", (message, rinfo) => {
        // console.log(
        //     "Message from: " + rinfo.address + ":" + rinfo.port + " - " + message
        // );

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
        client.send(
            Buffer.from(message),
            servers[0].port,
            servers[0].ip
        );
    } else {
        console.log('Não tem servidor registrado')
    }
}

module.exports = {
    bind,
    listening,
    serviceDiscovery,
    servers,
    sendMessage,
};