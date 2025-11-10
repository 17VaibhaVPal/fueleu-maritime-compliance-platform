export interface RoutesPort {
	getRoutes(): Promise<any[]>;
	setBaseline(routeId: string): Promise<void>;
	getComparison(): Promise<any[]>;
}

export interface CompliancePort {
	getCB(shipId: string, year: number): Promise<any>;
	getAdjustedCB(shipId: string, year: number): Promise<any>;
}

export interface BankingPort {
	getRecords(shipId: string, year: number): Promise<any[]>;
	bank(payload: { shipId: string; year: number; cb: number }): Promise<any>;
	apply(payload: { shipId: string; year: number; amount: number }): Promise<any>;
}

export interface PoolingPort {
	createPool(payload: { year: number; members: { shipId: string; cb: number }[] }): Promise<any>;
}



