//Tools and Middleware
import express, { Request, Response, NextFunction } from "express";
import { CryptoPrices, SingleCryptoInfo, SingleValue } from "../interfaces";
import { inMemoryDbPath } from "../db";
import { readDB } from "./utilities";
import { param, validationResult } from "express-validator";

//router
const router = express.Router();

//check errors
const isValidCryptoSymbol = (value: string) => {
	return ["bitcoin", "ethereum", "dogecoin"].includes(value);
};

//filter prices
const filterPrices = (
	symbol: string,
	pricesArray: CryptoPrices[],
	minutes: number
) => {
	const length: number =
		minutes > pricesArray.length ? pricesArray.length : minutes;

	const historicalValues: SingleValue[] = pricesArray
		.slice(0, length)
		.map((cr: any) => cr[symbol]);

	//average price
	const sum = historicalValues.reduce((acc, val) => acc + val.eur, 0);
	const average = sum / historicalValues.length;

	const latestPrice = historicalValues[historicalValues.length - 1].eur;

	const result: SingleCryptoInfo = {
		symbol,
		latestPrice,
		average,
		historicalValues,
		count: length < minutes ? length : null,
	};

	return result;
};

router.get(
	"/:symbol",
	[
		param("symbol")
			.custom((value) => isValidCryptoSymbol(value))
			.withMessage(
				'Invalid crypto symbol. Must be "bitcoin", "ethereum", or "dogecoin'
			),
	],
	async (req: Request, res: Response, next: NextFunction) => {
		// Check for validation errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const symbol: string = req.params.symbol.toLowerCase();
		const minutes: number = parseInt(req.query.minutes as string) || 60; //default 60 minutes

		try {
			const prices = await readDB(inMemoryDbPath);

			const cryptoInfo: SingleCryptoInfo = filterPrices(
				symbol,
				prices,
				minutes
			);

			res.status(200).send(cryptoInfo);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
);

export default router;
