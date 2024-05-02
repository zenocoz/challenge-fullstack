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
exports.fetchPrices = exports.writeDB = exports.readDB = void 0;
const axios_1 = __importDefault(require("axios"));
const { readJson, writeJson } = require("fs-extra");
const db_1 = require("../db");
const readDB = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileJSON = yield readJson(filePath);
        return fileJSON;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.readDB = readDB;
const writeDB = (filePath, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield writeJson(filePath, data);
    }
    catch (error) {
        // throw new Error(error);
        console.log(error);
    }
});
exports.writeDB = writeDB;
// Fetch cryptocurrency prices from CoinGecko API
const apiKey = "CG-BLuWEHHr6LZFB8917hbYWncw";
const coingeckoApi = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=eur";
const fetchPrices = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(coingeckoApi, {
            headers: {
                accept: "application/json",
                "x-cg-demo-api-key": apiKey,
            },
        });
        const updatedPrices = yield response.data;
        const historyDb = yield (0, exports.readDB)(db_1.inMemoryDbPath);
        historyDb.push(updatedPrices);
        yield (0, exports.writeDB)(db_1.inMemoryDbPath, historyDb);
    }
    catch (error) {
        console.error("Error fetching data:", error);
    }
});
exports.fetchPrices = fetchPrices;
