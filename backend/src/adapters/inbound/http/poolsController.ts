import { Request, Response, Router } from 'express';
import { CreatePool } from '../../../core/application/pooling.js';
import { PoolingRepository } from '../../../core/ports/repositories.js';

export function createPoolsRouter(poolRepo: PoolingRepository) {
	const router = Router();

	router.post('/', async (req: Request, res: Response) => {
		try {
			const { year, members } = req.body as { year: number; members: { shipId: string; cb: number }[] };
			const usecase = new CreatePool();
			const result = await usecase.execute({ year, members });
			const created = await poolRepo.createPool({ year }, result.members.map(m => ({ shipId: m.shipId, cbBefore: m.cbBefore, cbAfter: m.cbAfter })));
			res.status(201).json(created);
		} catch (e: any) {
			res.status(400).json({ error: e.message });
		}
	});

	return router;
}



