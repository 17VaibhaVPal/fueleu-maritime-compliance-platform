export type Route = {
	id: string; // DB id or routeId canonical
	routeId: string;
	vesselType: string;
	fuelType: string;
	year: number;
	ghgIntensity: number; // gCO2e/MJ
	fuelConsumptionTon: number;
	distanceKm: number;
	totalEmissionsTon: number;
	isBaseline?: boolean;
};

export type ShipCompliance = {
	id: string;
	shipId: string;
	year: number;
	cbGco2eq: number;
};

export type BankEntry = {
	id: string;
	shipId: string;
	year: number;
	amountGco2eq: number;
	createdAt: Date;
};

export type Pool = {
	id: string;
	year: number;
	createdAt: Date;
};

export type PoolMember = {
	poolId: string;
	shipId: string;
	cbBefore: number;
	cbAfter: number;
};



