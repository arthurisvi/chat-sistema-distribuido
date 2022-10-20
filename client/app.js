const middleware = require('../middleware/index')

middleware.start('client');

process.openStdin().addListener("data", (msg) => {
    if (msg.toString().trim() == "exit") {
        return process.exit();
    }
    middleware.sendMessage(msg.toString().trim());
});