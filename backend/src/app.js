import express from "express";
import dotenv from "dotenv";
import scannerRoute from "./routes/scanner.routes.js";
import cors from "cors";
import errorHandler from "./utils/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1", scannerRoute);

//app.use(errorHandler());

app.listen(port, () => {
  console.log("Server is running on port http://localhost/" + port);
});
