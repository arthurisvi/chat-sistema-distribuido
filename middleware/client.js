const dgram = require("dgram");
const client = dgram.createSocket("udp4");
const ip = require("ip");

let servers = [];
let logs = [];
let pendingMessages = []

function run(multicastAddress, port) {
    client.on("listening", () => {
        client.setBroadcast(true);
        let address = client.address();
        console.log("UDP Client listening on " + ip.address() + ":" + address.port);
    });

    client.bind(port, () => {
        client.addMembership(multicastAddress);
    });

    client.on("message", (message, rinfo) => {
        // if (ip.address() !== rinfo.address) {
        //     console.log(
        //         "Message from: " + rinfo.address + ":" + rinfo.port + " - " + message
        //     );
        // }
        if (pendingMessages.length > 0 && servers.length > 0) {
            for (message in pendingMessages) {
                client.send(Buffer.from(pendingMessages[message]), servers[0].port, servers[0].ip);
                console.log(`Sua mensagem "${pendingMessages[message]}" foi reenviada com sucesso!`)
            }
            pendingMessages = []
        }

        if (message.includes("{")) {
            let convertMessage = JSON.parse(message);
            let ipMessage = convertMessage.ip;
            let portMessage = convertMessage.port;
            message = convertMessage.message;

            if (ipMessage !== ip.address()) {
                console.log(`[${ipMessage}:${portMessage}] - ${message}`);
            }
        }

        if (message.includes("ssdp:server")) {
            // console.log(
            //     "Keep-alive from: " + rinfo.address + ":" + rinfo.port + " - " + message
            // );

            let ips = servers.map((server) => server.ip);

            if (!ips.includes(rinfo.address)) {
                servers.push({
                    serverOn: true,
                    ip: rinfo.address,
                    port: rinfo.port,
                    time: new Date(),
                });
            }

            logs.push({
                ip: rinfo.address,
                port: rinfo.port,
                time: new Date(),
            });
        }
    });
}

const sendMessage = (message) => {
    let serversOn = verifyServerOn(servers, logs);

    if (serversOn.length > 0) {
        client.send(Buffer.from(message), servers[0].port, servers[0].ip);
    } else {
        console.log(
            "Conex??o inst??vel, n??o foi poss??vel enviar sua mensagem. Ela ser?? reenviada novamente em alguns segundos."
        );
        if (!pendingMessages.includes(message)) pendingMessages.push(message)
    }
};

const verifyServerOn = (servers, serversLog) => {
    let count = 0;
    let serversLogLast = [];

    if (serversLog.length > 0 && servers.length > 0) {
        serversLog.map((log, i) => {
            if (log.ip === servers[0].ip) {
                serversLogLast.push(log);
                count++;
            }
        });
    }

    if (count >= 3) {
        let last = serversLogLast[count - 1].time;
        let time = new Date();
        let diff = time - last;

        if (diff > 6100) servers.shift();
    }

    return servers;
};

module.exports = {
    run,
    sendMessage,
};