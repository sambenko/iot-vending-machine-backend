import { mqtt5, iot } from "aws-iot-device-sdk-v2";
import {ICrtError} from "aws-crt";
import {once} from "events";
import { toUtf8 } from '@aws-sdk/util-utf8-browser';
import { handleMessage } from "./mqttHandlers";

const ROOT_CA_PATH = './src/mqtt/secrets/AmazonRootCA1.pem';
const PRIVATE_KEY_PATH = './src/mqtt/secrets/BackendService-private.pem.key';
const CERTIFICATE_PATH = './src/mqtt/secrets/BackendService.pem.crt';
const CLIENT_ID = process.env.CLIENT_ID;
const ENDPOINT = process.env.ENDPOINT;

function createClientConfig(): mqtt5.Mqtt5ClientConfig {
    if (!ENDPOINT) {
        throw new Error('The AWS IoT endpoint is not defined in environment variables.');
    }
    const builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(
        ENDPOINT,
        CERTIFICATE_PATH,
        PRIVATE_KEY_PATH
    );

    builder.withConnectProperties(
        { 
            keepAliveIntervalSeconds: 1200,
            clientId: CLIENT_ID,
        });

    builder.withCertificateAuthorityFromPath(undefined, ROOT_CA_PATH);

    return builder.build();
}

async function createClient(): Promise<mqtt5.Mqtt5Client> {
    const clientConfig = createClientConfig();
    console.log("Creating client for " + clientConfig.hostName);
    const client = new mqtt5.Mqtt5Client(clientConfig);

    client.on("messageReceived", (eventData: mqtt5.MessageReceivedEvent): void => {
        const payloadString = eventData.message.payload 
            ? toUtf8(new Uint8Array(eventData.message.payload as ArrayBuffer))
            : 'No payload';
    
        handleMessage(eventData.message.topicName, payloadString);
    });

    client.on('attemptingConnect', (eventData: mqtt5.AttemptingConnectEvent) => {
        console.log("Attempting Connect event");
    });

    client.on('connectionSuccess', (eventData: mqtt5.ConnectionSuccessEvent) => {
        console.log("Connection Success event");
        console.log ("Connack: " + JSON.stringify(eventData.connack));
        console.log ("Settings: " + JSON.stringify(eventData.settings));
    });

    client.on('connectionFailure', (eventData: mqtt5.ConnectionFailureEvent) => {
        console.log("Connection failure event: " + eventData.error.toString());
        if (eventData.connack) {
            console.log ("Connack: " + JSON.stringify(eventData.connack));
        }
    });

    client.on('disconnection', (eventData: mqtt5.DisconnectionEvent) => {
        console.log("Disconnection event: " + eventData.error.toString());
        if (eventData.disconnect !== undefined) {
            console.log('Disconnect packet: ' + JSON.stringify(eventData.disconnect));
        }
    });

    client.on('stopped', (eventData: mqtt5.StoppedEvent) => {
        console.log("Stopped event");
    });

    client.on('error', (error: ICrtError) => {
        console.log("Error event: " + error.toString());
    });

    return client;
}

export async function runSample() {
    let client : mqtt5.Mqtt5Client = await createClient();

    const connectionSuccess = once(client, "connectionSuccess");

    client.start();

    await connectionSuccess;

    const suback = await client.subscribe({
        subscriptions: [
            { qos: mqtt5.QoS.AtLeastOnce, topicFilter: "espbox/sensor/+" },
            { qos: mqtt5.QoS.AtLeastOnce, topicFilter: "espboxlite/sensor/+" },
            { qos: mqtt5.QoS.AtLeastOnce, topicFilter: "espbox/inventory/+" },
            { qos: mqtt5.QoS.AtLeastOnce, topicFilter: "espboxlite/inventory/+" }
        ]
    });
    console.log('Suback result: ' + JSON.stringify(suback));
}