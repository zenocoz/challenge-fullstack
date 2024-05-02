//interfaces
export interface CryptoPrices {
	bitcoin: {
		eur: number;
	};
	ethereum: {
		eur: number;
	};
	dogecoin: {
		eur: number;
	};
}

export interface SingleValue {
	eur: number;
}

export interface SingleCryptoInfo {
	symbol: string;
	latestPrice: number;
	average: number;
	historicalValues: SingleValue[];
}
