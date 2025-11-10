import { BankingRepository, ComplianceRepository } from '../ports/repositories.js';

export class BankSurplus {
	constructor(private readonly bankingRepo: BankingRepository) {}

	async execute(input: { shipId: string; year: number; cb: number }) {
		if (input.cb <= 0) {
			throw new Error('No positive CB to bank');
		}
		return this.bankingRepo.addBankEntry({ shipId: input.shipId, year: input.year, amountGco2eq: input.cb });
	}
}

export class ApplyBanked {
	constructor(private readonly bankingRepo: BankingRepository, private readonly complianceRepo: ComplianceRepository) {}

	async execute(input: { shipId: string; year: number; amount: number }) {
		if (input.amount <= 0) {
			throw new Error('Amount must be positive');
		}
		const available = await this.bankingRepo.getAvailableAmount(input.shipId, input.year);
		if (input.amount > available) {
			throw new Error('Amount exceeds available banked');
		}
		const latest = await this.complianceRepo.getLatest(input.shipId, input.year);
		if (!latest) {
			throw new Error('No compliance snapshot found');
		}
		// Apply reduces deficit (negative CB) or reduces surplus (if applied arbitrarily)
		const cbAfter = latest.cbGco2eq + input.amount; // amount is a positive transfer from bank
		await this.bankingRepo.applyAmount(input.shipId, input.year, input.amount);
		await this.complianceRepo.saveSnapshot({ shipId: input.shipId, year: input.year, cbGco2eq: cbAfter });
		return { cb_before: latest.cbGco2eq, applied: input.amount, cb_after: cbAfter };
	}
}



