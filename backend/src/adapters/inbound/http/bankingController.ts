import { Request, Response, Router } from 'express';
import { ApplyBanked, BankSurplus } from '../../../core/application/banking.js';
import { BankingRepository, ComplianceRepository } from '../../../core/ports/repositories.js';

export function createBankingRouter(bankingRepo: BankingRepository, complianceRepo: ComplianceRepository) {
	const router = Router();

	router.get('/records', async (req: Request, res: Response) => {
		const shipId = String(req.query.shipId ?? 'S001');
		const year = Number(req.query.year ?? '2025');
		const entries = await bankingRepo.getBanked(shipId, year);
		res.json(entries);
	});

	router.post('/bank', async (req: Request, res: Response) => {
		try {
			const { shipId, year, cb } = req.body as { shipId: string; year: number; cb: number };
			const usecase = new BankSurplus(bankingRepo);
			const entry = await usecase.execute({ shipId, year, cb });
			res.status(201).json(entry);
		} catch (e: any) {
			res.status(400).json({ error: e.message });
		}
	});

	router.post('/apply', async (req: Request, res: Response) => {
		try {
			const { shipId, year, amount } = req.body as { shipId: string; year: number; amount: number };
			const usecase = new ApplyBanked(bankingRepo, complianceRepo);
			const kpis = await usecase.execute({ shipId, year, amount });
			res.status(200).json(kpis);
		} catch (e: any) {
			res.status(400).json({ error: e.message });
		}
	});

	return router;
}



