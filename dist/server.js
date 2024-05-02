"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const utilities_1 = require("./src/price/utilities");
//For env File
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json()); //???
//Routes
const priceRoutes = require("./src/price");
app.use("/price", priceRoutes);
// Set up an interval to call the fetchData function every 60 seconds
setInterval(utilities_1.fetchPrices, 10000); // 60000 milliseconds = 60 seconds
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
