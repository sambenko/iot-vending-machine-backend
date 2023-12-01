import express from 'express';
import router from './src/api/routes/routes';
import dotenv from 'dotenv';
dotenv.config();

import { runSample } from "./src/mqtt/mqttClient";


async function main() {
    console.log("Starting the application...");
    await runSample();
    console.log("MQTT Client is running. Press CTRL+C to exit.");

    let app = express();
    const port = 3001;

    const cors = require('cors');

    const corsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));
    
    app.use(express.json());
    app.use('/api', router);

    app.get('/', (req, res) => {
        res.send('Backend running!');
    });

    app.listen(port, () => {
        console.log(`Express server running on http://localhost:${port}`);
    });

    

    process.on('SIGINT', () => {
        console.log("Received SIGINT. Gracefully shutting down.");
        process.exit(0);
    });
}

main().catch((error) => {
    console.error("Error in main:", error);
    process.exit(1);
});
