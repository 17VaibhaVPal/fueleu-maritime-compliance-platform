import { BankingPort, CompliancePort, PoolingPort, RoutesPort } from '../../core/ports/api';

export const httpRoutes: RoutesPort = {
	async getRoutes() {
		const res = await fetch('/routes');
		return res.json();
	},
	async setBaseline(routeId: string) {
		await fetch(`/routes/${routeId}/baseline`, { method: 'POST' });
	},
	async getComparison() {
		const res = await fetch('/routes/comparison');
		return res.json();
	},
};

export const httpCompliance: CompliancePort = {
	async getCB(shipId: string, year: number) {
		const res = await fetch(`/compliance/cb?shipId=${encodeURIComponent(shipId)}&year=${year}`);
		return res.json();
	},
	async getAdjustedCB(shipId: string, year: number) {
		const res = await fetch(`/compliance/adjusted-cb?shipId=${encodeURIComponent(shipId)}&year=${year}`);
		return res.json();
	},
};

export const httpBanking: BankingPort = {
	async getRecords(shipId: string, year: number) {
		const res = await fetch(`/banking/records?shipId=${encodeURIComponent(shipId)}&year=${year}`);
		return res.json();
	},
	async bank(payload) {
		const res = await fetch('/banking/bank', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
		return res.json();
	},
	async apply(payload) {
		const res = await fetch('/banking/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
		return res.json();
	},
};

export const httpPooling: PoolingPort = {
	async createPool(payload) {
		const res = await fetch('/pools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
		return res.json();
	},
};



