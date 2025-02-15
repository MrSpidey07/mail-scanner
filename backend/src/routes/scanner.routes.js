import { Router } from "express";
import {
  getScannedReport,
  getURLScan,
} from "../controllers/scanner.controller.js";

const route = Router();

route.post("/scan", getScannedReport);
route.post("/scanurl", getURLScan);

export default route;
