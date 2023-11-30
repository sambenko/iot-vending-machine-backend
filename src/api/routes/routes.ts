import express from 'express';
import * as sensorDataController from '../controllers/sensorDataController';
import * as inventoryController from '../controllers/inventoryController';

const router = express.Router();

// Sensor data routes
router.get('/sensor/:deviceId', sensorDataController.getSensorDataByDevice);

// Inventory routes
router.get('/inventory/:deviceId', inventoryController.getInventoryByDevice);

export default router;
