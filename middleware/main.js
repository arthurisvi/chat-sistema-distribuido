const PORT = 1900;
const MULTICAST_ADDR = "239.255.255.250";
const client = require("./client");
const server = require("./server");

const options = {
    client: () => client.run(MULTICAST_ADDR, PORT),
    server: () => server.run(MULTICAST_ADDR, PORT),
};

const start = (type) => options[type]();
const clientSendMessage = (message) => client.sendMessage(message);

module.exports = {
    start,
    clientSendMessage,
};