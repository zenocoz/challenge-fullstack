import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import { fetchPrices } from "./price/utilities";
import bodyParser from "body-parser";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT;

// app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes

import priceRoutes from "./price";

// const priceRoutes = require("./price");
app.use("/price", priceRoutes);

setInterval(fetchPrices, 60000); // 60000 milliseconds = 60 seconds

app.listen(port, () => {
	console.log(`Server is running at port:${port}`);
});
