const middleware = require('../middleware/main')

middleware.start('client');

process.openStdin().addListener("data", (msg) => {
    if (msg.toString().trim() == "exit") {
        return process.exit();
    }
    middleware.clientSendMessage(msg.toString().trim());
});