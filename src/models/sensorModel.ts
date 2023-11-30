import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '..', '..', 'data', 'sensorData.db');
const db = new sqlite3.Database(dbPath);

export class SensorModel {
    // Insert a new sensor data record
    insertSensorData(deviceId: string, sensorType: string, value: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO sensor_data (deviceId, sensorType, value) VALUES (?, ?, ?)`;
            db.run(query, [deviceId, sensorType, value], (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.deleteOldSensorData();
                    resolve();
                }
            });
        });
    }

    deleteOldSensorData(): void {
        const deleteQuery = `DELETE FROM sensor_data WHERE timestamp < datetime('now', '-1 day')`;
        db.run(deleteQuery, (err) => {
            if (err) console.error('Error deleting old sensor data:', err);
        });
    }


    // Retrieve sensor data
    getSensorData(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM sensor_data", [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Retrieve sensor data for a specific device
    getSensorDataByDevice(deviceId: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const query = "SELECT sensorType, value FROM sensor_data WHERE deviceId = ?";
            db.all(query, [deviceId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}
