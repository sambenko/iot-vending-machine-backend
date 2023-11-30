import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '..', '..', 'data', 'sensorData.db');
const db = new sqlite3.Database(dbPath);

export class InventoryModel {
    // Insert a new inventory record
    insertInventoryItem(deviceId: string, itemName: string, quantity: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO inventory (deviceId, itemName, quantity) VALUES (?, ?, ?)`;
            db.run(query, [deviceId, itemName, quantity], (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.deleteOldInventoryData();
                    resolve();
                }
            });
        });
    }

    deleteOldInventoryData(): void {
        const deleteQuery = `DELETE FROM inventory WHERE timestamp < datetime('now', '-1 day')`;
        db.run(deleteQuery, (err) => {
            if (err) console.error('Error deleting old inventory data:', err);
        });
    }

    // Retrieve inventory data
    getInventory(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM inventory", [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Retrieve inventory data for a specific device
    getInventoryByDevice(deviceId: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const query = "SELECT itemName, quantity FROM inventory WHERE deviceId = ?";
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
