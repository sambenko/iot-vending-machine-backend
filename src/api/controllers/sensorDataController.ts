import { Request, Response } from 'express';
import { SensorModel } from '../../models/sensorModel';
import { SensorDataItem } from '../types/sensorDataItem';

const sensorModel = new SensorModel();

export const getSensorDataByDevice = async (req: Request, res: Response) => {
    try {
        const deviceId = req.params.deviceId;
        const sensorData = await sensorModel.getSensorDataByDevice(deviceId);
        const latestSensorData = getLatestEntries<SensorDataItem>(sensorData, 'sensorType');
        res.status(200).json(latestSensorData);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
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
