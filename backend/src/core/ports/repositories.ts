import { BankEntry, Pool, PoolMember, Route, ShipCompliance } from '../domain/models.js';

export interface RoutesRepository {
	getAll(): Promise<Route[]>;
	setBaseline(routeId: string): Promise<void>;
	getBaseline(): Promise<Route | undefined>;
	seed(routes: Route[]): Promise<void>;
}

export interface ComplianceRepository {
	saveSnapshot(record: Omit<ShipCompliance, 'id'>): Promise<ShipCompliance>;
	getLatest(shipId: string, year: number): Promise<ShipCompliance | undefined>;
}

export interface BankingRepository {
	getBanked(shipId: string, year: number): Promise<BankEntry[]>;
	addBankEntry(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry>;
	getAvailableAmount(shipId: string, year: number): Promise<number>;
	applyAmount(shipId: string, year: number, amount: number): Promise<void>;
}

export interface PoolingRepository {
	createPool(pool: Omit<Pool, 'id' | 'createdAt'>, members: Omit<PoolMember, 'poolId'>[]): Promise<{ pool: Pool; members: PoolMember[] }>;
}



