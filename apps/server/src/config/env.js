const path = require('path');
const dotenv = require('dotenv');
const { Stages } = require('../utils/constants');
const { ExitCodes } = require('../utils/gracefulShutdown');

const loadEnv = () => {
    const NODE_ENV = process.env.NODE_ENV || Stages.DEVELOPMENT;
    const envPath = path.resolve(__dirname, `../../../../environments/.env.${NODE_ENV}`);

    try {
        const result = dotenv.config({ path: envPath });

        if (result.error) {
            throw result.error;
        }

        console.log(`Loaded environment variables from ${envPath}`);
    } catch (error) {
        console.error(`Error loading environment variables: ${error.message}`);
        process.exit(ExitCodes.UNCAUGHT_FATAL_EXCEPTION);
    }
};

module.exports = loadEnv;
