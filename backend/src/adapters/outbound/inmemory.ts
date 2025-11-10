import { randomUUID } from 'node:crypto';
import { BankEntry, Pool, PoolMember, Route, ShipCompliance } from '../../core/domain/models.js';
import { BankingRepository, ComplianceRepository, PoolingRepository, RoutesRepository } from '../../core/ports/repositories.js';

export class InMemoryRoutesRepository implements RoutesRepository {
	private routes: Route[] = [];
	async getAll(): Promise<Route[]> {
		return this.routes;
	}
	async setBaseline(routeId: string): Promise<void> {
		this.routes = this.routes.map(r => ({ ...r, isBaseline: r.routeId === routeId }));
	}
	async getBaseline(): Promise<Route | undefined> {
		return this.routes.find(r => r.isBaseline);
	}
	async seed(routes: Route[]): Promise<void> {
		this.routes = routes;
	}
}

export class InMemoryComplianceRepository implements ComplianceRepository {
	private records: ShipCompliance[] = [];
	async saveSnapshot(record: Omit<ShipCompliance, 'id'>): Promise<ShipCompliance> {
		const created: ShipCompliance = { id: randomUUID(), ...record };
		this.records.push(created);
		return created;
	}
	async getLatest(shipId: string, year: number): Promise<ShipCompliance | undefined> {
		const list = this.records.filter(r => r.shipId === shipId && r.year === year);
		return list.at(-1);
	}
}

export class InMemoryBankingRepository implements BankingRepository {
	private entries: BankEntry[] = [];
	async getBanked(shipId: string, year: number): Promise<BankEntry[]> {
		return this.entries.filter(e => e.shipId === shipId && e.year === year);
	}
	async addBankEntry(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry> {
		const created: BankEntry = { id: randomUUID(), createdAt: new Date(), ...entry };
		this.entries.push(created);
		return created;
	}
	async getAvailableAmount(shipId: string, year: number): Promise<number> {
		const entries = await this.getBanked(shipId, year);
		const total = entries.reduce((acc, e) => acc + e.amountGco2eq, 0);
		// applyAmount stores usage as negative entries
		return total;
	}
	async applyAmount(shipId: string, year: number, amount: number): Promise<void> {
		// store as negative bank entry
		await this.addBankEntry({ shipId, year, amountGco2eq: -amount });
	}
}

export class InMemoryPoolingRepository implements PoolingRepository {
	private pools: Pool[] = [];
	private members: PoolMember[] = [];
	async createPool(pool: Omit<Pool, 'id' | 'createdAt'>, members: Omit<PoolMember, 'poolId'>[]) {
		const createdPool: Pool = { id: randomUUID(), year: pool.year, createdAt: new Date() };
		const createdMembers: PoolMember[] = members.map(m => ({ ...m, poolId: createdPool.id }));
		this.pools.push(createdPool);
		this.members.push(...createdMembers);
		return { pool: createdPool, members: createdMembers };
	}
}



