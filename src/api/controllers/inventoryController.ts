import { Request, Response } from 'express';
import { InventoryModel } from '../../models/inventoryModel';

const inventoryModel = new InventoryModel();

export const getInventoryByDevice = async (req: Request, res: Response) => {
    try {
        const deviceId = req.params.deviceId; // Ensure deviceId is passed as a URL parameter
        const inventory = await inventoryModel.getInventoryByDevice(deviceId);
        res.status(200).json(inventory);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
