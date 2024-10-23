const ExitCodes = {
    NORMALLY_EXITS: 0,
    UNCAUGHT_FATAL_EXCEPTION: 1,
};

const TerminationSignalsCodes = {
    SIGINT: "SIGINT",
    SIGTERM: "SIGTERM",
    SIGHUP: "SIGHUP",
};

const handleGracefulShutdown = (server, mongodbConnection) => {
    for (const signal of Object.values(TerminationSignalsCodes)) {
        process.on(signal, async () => {
            console.log(`\nSignal ${signal} received, starting shutdown process`);
            if (mongodbConnection) {
                try {
                    console.log("Closing database connection");
                    await mongodbConnection.close();
                    console.log('MongoDB connection closed');
                } catch (error) {
                    console.error(`Error closing MongoDB connection: ${error}`);
                    process.exit(ExitCodes.UNCAUGHT_FATAL_EXCEPTION);
                }
            }
            if (server) {
                console.log('Shutting down server');
                server.close((error) => {
                    if (error) {
                        console.error(`Error closing server: ${error}`);
                        process.exit(ExitCodes.UNCAUGHT_FATAL_EXCEPTION);
                    }
                    console.log('Server closed');
                    process.exit(ExitCodes.NORMALLY_EXITS);
                });
            }

            // If the server takes too long to close, forcefully terminate it
            setTimeout(() => {
                console.error('Forcing server shutdown due to timeout');
                process.exit(ExitCodes.UNCAUGHT_FATAL_EXCEPTION);
            }, 10000); // 10 seconds timeout
        });
    }
};

module.exports = {
    handleGracefulShutdown,
    ExitCodes
}