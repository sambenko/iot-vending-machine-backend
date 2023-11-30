import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Path to store the SQLite database file
const dbPath = path.join(__dirname, 'data', 'sensorData.db');

// Function to initialize the database
function initializeDatabase() {
    // Check if the 'data' directory exists, create it if it doesn't
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Create a new database instance
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
            return;
        }
        console.log('Connected to the SQLite database.');

        createTables(db);
    });

    return db;
}

// Function to create tables
function createTables(db: sqlite3.Database) {
    // SQL statements to create tables
    const createSensorDataTable = `
        CREATE TABLE IF NOT EXISTS sensor_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            deviceId TEXT,
            sensorType TEXT,
            value REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`;

    const createInventoryTable = `
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            deviceId TEXT,
            itemName TEXT,
            quantity INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`;

    // Execute the SQL statements to create the tables
    db.serialize(() => {
        db.run(createSensorDataTable);
        db.run(createInventoryTable);
    });

    // Close the database connection
    db.close(() => {
        console.log('Database and tables created successfully');
    });
}

// Initialize the database
const db = initializeDatabase();
