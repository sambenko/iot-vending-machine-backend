import { Request, Response } from 'express';
import { InventoryModel } from '../../models/inventoryModel';
import { InventoryItem } from '../types/inventoryItem';

const inventoryModel = new InventoryModel();

export const getInventoryByDevice = async (req: Request, res: Response) => {
    try {
        const deviceId = req.params.deviceId;
        const inventory = await inventoryModel.getInventoryByDevice(deviceId);
        const latestInventory = getLatestEntries<InventoryItem>(inventory, 'itemName');
        res.status(200).json(latestInventory);
    } catch (error) {
        // Error handling
    }
};

function getLatestEntries<T>(dataArray: T[], typeKey: keyof T): T[] {
    const latestEntriesMap = new Map<string, T>();

    dataArray.forEach(item => {
        const key = item[typeKey] as unknown as string;
        latestEntriesMap.set(key, item);
    });

    return Array.from(latestEntriesMap.values());
}
