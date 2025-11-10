export type Route = {
	routeId: string;
	vesselType: string;
	fuelType: string;
	year: number;
	ghgIntensity: number;
	fuelConsumptionTon: number;
	distanceKm: number;
	totalEmissionsTon: number;
	isBaseline?: boolean;
};

export type ComparisonRow = {
	routeId: string;
	baseline: number;
	comparison: number;
	percentDiff: number;
	compliant: boolean;
};

export type CBRecord = {
	shipId: string;
	year: number;
	cbGco2eq: number;
};



