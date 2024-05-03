"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const utilities_1 = require("./price/utilities");
//For env File
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json()); //???
//Routes
const priceRoutes = require("./price");
app.use("/price", priceRoutes);
setInterval(utilities_1.fetchPrices, 60000); // 60000 milliseconds = 60 seconds
app.listen(port, () => {
    console.log(`Server is running at port:${port}`);
});
//# sourceMappingURL=server.js.map