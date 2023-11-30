import dotenv from 'dotenv';
dotenv.config();

import { runSample } from "./src/mqtt/mqttClient";


async function main() {
    console.log("Starting the application...");
    await runSample();
    console.log("MQTT Client is running. Press CTRL+C to exit.");

    process.on('SIGINT', () => {
        console.log("Received SIGINT. Gracefully shutting down.");
        process.exit(0);
    });
}

main().catch((error) => {
    console.error("Error in main:", error);
    process.exit(1);
});
