const middleware = require('./middleware')

middleware.listening();

middleware.serviceDiscovery();

middleware.bind();

process.openStdin().addListener("data", (msg) => {
    if (msg.toString().trim() == "exit") {
        return process.exit();
    }
    middleware.sendMessage(msg.toString().trim());
});