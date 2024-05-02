"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Tools and Middleware
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const utilities_1 = require("./utilities");
const express_validator_1 = require("express-validator");
// const { check, validationResult, matchedData } = require("express-validator");
// const multer = require("multer");
// const { pipeline } = require("stream");
//Middleware Instances
const router = express_1.default.Router();
// const upload = multer({});
const isValidCryptoSymbol = (value) => {
    return ["bitcoin", "ethereum", "doge"].includes(value);
};
//filter prices
const filterPrices = (symbol, pricesArray, minutes) => {
    const length = minutes > pricesArray.length ? pricesArray.length : minutes;
    const historicalValues = pricesArray
        .slice(0, length)
        .map((cr) => cr[symbol]);
    //average price
    const sum = historicalValues.reduce((acc, val) => acc + val.eur, 0);
    const average = sum / historicalValues.length;
    const latestPrice = historicalValues[historicalValues.length - 1].eur;
    const result = {
        symbol,
        latestPrice,
        average,
        historicalValues,
    };
    return result;
};
router.get("/:symbol", [
    (0, express_validator_1.param)("symbol")
        .custom((value) => isValidCryptoSymbol(value))
        .withMessage('Invalid crypto symbol. Must be "bitcoin", "ethereum", or "doge"'),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const symbol = req.params.symbol.toLowerCase();
    const minutes = parseInt(req.query.minutes) || 60; //default 60 minutes
    try {
        const prices = yield (0, utilities_1.readDB)(db_1.inMemoryDbPath);
        const cryptoInfo = filterPrices(symbol, prices, minutes);
        res.status(200).send(cryptoInfo);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
// router.get("/:id", async (req, res, next) => {
// 	try {
// 		const mediaDB = await readDB(mediaFilesPath);
// 		const mediumIndex = mediaDB.findIndex(
// 			(medium) => medium.imdbID === req.params.id
// 		);
// 		if (mediumIndex !== -1) {
// 			const response = await axios({
// 				method: "get",
// 				url: `http://www.omdbapi.com/?i=${req.params.id}&apikey=${process.env.OMDB_API_KEY}`,
// 			});
// 			const info = response.data;
// 			console.log(info);
// 			res.send(info);
// 		} else {
// 			const err = new Error("index not found");
// 			err.httpStatusCode = 404;
// 			next(err);
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// });
module.exports = router;
