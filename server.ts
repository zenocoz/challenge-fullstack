import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import { fetchPrices } from "./src/price/utilities";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT;

app.use(express.json()); //???

//Routes
const priceRoutes = require("./src/price");
app.use("/price", priceRoutes);

// Set up an interval to call the fetchData function every 60 seconds
setInterval(fetchPrices, 10000); // 60000 milliseconds = 60 seconds

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
