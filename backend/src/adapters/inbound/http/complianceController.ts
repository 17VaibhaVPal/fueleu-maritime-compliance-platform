import { Request, Response, Router } from 'express';
import { ComplianceRepository, RoutesRepository } from '../../../core/ports/repositories.js';
import { ComputeCB } from '../../../core/application/computeCB.js';

export function createComplianceRouter(complianceRepo: ComplianceRepository, routesRepo: RoutesRepository) {
	const router = Router();

	router.get('/cb', async (req: Request, res: Response) => {
		const shipId = String(req.query.shipId ?? 'S001');
		const year = Number(req.query.year ?? '2025');

		// For demo: compute CB using baseline route data if exists
		const routes = await routesRepo.getAll();
		const r = routes.find(x => x.year === year) ?? routes[0];
		const actual = r?.ghgIntensity ?? 91.16;
		const fuel = r?.fuelConsumptionTon ?? 5000;

		const usecase = new ComputeCB(complianceRepo);
		const out = await usecase.execute({
			shipId,
			year,
			actualGhgIntensity: actual,
			fuelConsumptionTon: fuel,
		});
		res.json(out);
	});

	// adjusted-cb demo: return latest snapshot
	router.get('/adjusted-cb', async (req: Request, res: Response) => {
		const shipId = String(req.query.shipId ?? 'S001');
		const year = Number(req.query.year ?? '2025');
		const latest = await complianceRepo.getLatest(shipId, year);
		res.json(latest ?? { shipId, year, cbGco2eq: 0 });
	});

	return router;
}



