import { describe, it, expect } from 'vitest';
import { ComputeCB } from '../src/core/application/computeCB.js';
import { InMemoryComplianceRepository } from '../src/adapters/outbound/inmemory.js';

describe('ComputeCB', () => {
	it('computes positive CB when actual < target', async () => {
		const repo = new InMemoryComplianceRepository();
		const uc = new ComputeCB(repo);
		const res = await uc.execute({ shipId: 'S1', year: 2025, actualGhgIntensity: 88, fuelConsumptionTon: 1 });
		expect(res.cbGco2eq).toBeGreaterThan(0);
	});
	it('computes negative CB when actual > target', async () => {
		const repo = new InMemoryComplianceRepository();
		const uc = new ComputeCB(repo);
		const res = await uc.execute({ shipId: 'S1', year: 2025, actualGhgIntensity: 95, fuelConsumptionTon: 1 });
		expect(res.cbGco2eq).toBeLessThan(0);
	});
});



