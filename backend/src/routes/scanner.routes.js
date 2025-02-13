import { Router } from "express";
import { getScannedReport } from "../controllers/scanner.controller.js";

const route = Router();

route.get("/scan", getScannedReport);

export default route;
