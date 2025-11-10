import { Request, Response, Router } from 'express';
import { RoutesRepository } from '../../../core/ports/repositories.js';
import { ComputeComparison } from '../../../core/application/computeComparison.js';

export function createRoutesRouter(routesRepo: RoutesRepository) {
	const router = Router();

	router.get('/', async (_req: Request, res: Response) => {
		const all = await routesRepo.getAll();
		res.json(all);
	});

	router.post('/:id/baseline', async (req: Request, res: Response) => {
		await routesRepo.setBaseline(req.params.id);
		res.status(204).end();
	});

	router.get('/comparison', async (_req: Request, res: Response) => {
		const usecase = new ComputeComparison(routesRepo);
		const out = await usecase.execute();
		res.json(out);
	});

	return router;
}



