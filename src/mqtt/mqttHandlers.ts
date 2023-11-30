import { SensorModel } from '../models/sensorModel';
import { InventoryModel } from '../models/inventoryModel';

const sensorModel = new SensorModel();
const inventoryModel = new InventoryModel();

function getDevkitNameFromTopic(topic: string): string {
    const parts = topic.split('/');
    return parts[0];
}

function getCategory(topic: string): string {
    const parts = topic.split('/');
    return parts[1];
}

function getValueType(topic: string): string {
    const parts = topic.split('/');
    return parts[2];
}

function handleSensorData(devkitName: string, valueType: string, payload: string) {
    const value = parseFloat(payload);
    if (!isNaN(value)) {
        sensorModel.insertSensorData(devkitName, valueType, value)
            .then(() => console.log(`${valueType} data saved for ${devkitName}`))
            .catch(error => console.error(`Error saving ${valueType} data: ${error}`));
    }
}

function handleInventoryData(devkitId: string, itemName: string, payload: string) {
    const quantity = parseInt(payload, 10);
    if (!isNaN(quantity)) {
        inventoryModel.insertInventoryItem(devkitId, itemName, quantity)
            .then(() => console.log(`${itemName} data saved for ${devkitId}`))
            .catch(error => console.error(`Error saving ${itemName} data: ${error}`));
    }
}

// General message handler
export function handleMessage(topic: string, payload: string) {
    const devkitName = getDevkitNameFromTopic(topic);
    const mainCategory = getCategory(topic);

    if (mainCategory === "sensor") {
        const valueType = getValueType(topic); // Temperature, Pressure, Humidity, Gas
        handleSensorData(devkitName, valueType, payload);
    } else if (mainCategory === "inventory") {
        const itemName = getValueType(topic); // Hotdog, Sandwich, Energy Drink
        handleInventoryData(devkitName, itemName, payload);
    } else {
        console.log("Unhandled main category:", mainCategory);
    }
}
