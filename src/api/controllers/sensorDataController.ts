import { Request, Response } from 'express';
import { SensorModel } from '../../models/sensorModel';

const sensorModel = new SensorModel();

export const getSensorDataByDevice = async (req: Request, res: Response) => {
    try {
        const deviceId = req.params.deviceId;
        const sensorData = await sensorModel.getSensorDataByDevice(deviceId);
        res.status(200).json(sensorData);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
