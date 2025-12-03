import express from "express";
import {
    addTable,
    listTables,
    getAvailableTables,
    updateTableStatus,
    updateTable,
    toggleTableActive,
    deleteTable,
    getTable
} from "../controllers/tableController.js";

const tableRouter = express.Router();

// Admin routes
tableRouter.post("/add", addTable);
tableRouter.get("/list", listTables);
tableRouter.post("/status", updateTableStatus);
tableRouter.post("/update", updateTable);
tableRouter.post("/toggle", toggleTableActive);
tableRouter.post("/delete", deleteTable);

// User routes
tableRouter.get("/available", getAvailableTables);
tableRouter.get("/:tableId", getTable);

export default tableRouter;

