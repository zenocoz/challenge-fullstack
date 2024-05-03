import { CryptoPrices } from "../interfaces";
import axios from "axios";
import fsExtra from "fs-extra";
import { inMemoryDbPath } from "../db";

const { writeJson, readJson } = fsExtra;

export const readDB = async (filePath: string) => {
	try {
		const fileJSON = await readJson(filePath);
		return fileJSON;
	} catch (error: any) {
		throw new Error(error);
	}
};

export const writeDB = async (filePath: string, data: any) => {
	try {
		await writeJson(filePath, data);
	} catch (error: any) {
		// throw new Error(error);
		console.log(error);
	}
};

// Fetch cryptocurrency prices from CoinGecko API
const apiKey = "CG-BLuWEHHr6LZFB8917hbYWncw";
const coingeckoApi =
	"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=eur";

export const fetchPrices = async (): Promise<void> => {
	try {
		const response = await axios.get<CryptoPrices>(coingeckoApi, {
			headers: {
				accept: "application/json",
				"x-cg-demo-api-key": apiKey,
			},
		});

		const updatedPrices = await response.data;
		const historyDb = await readDB(inMemoryDbPath);
		historyDb.push(updatedPrices);

		await writeDB(inMemoryDbPath, historyDb);
	} catch (error) {
		console.error("Error fetching data:", error);
	}
};
