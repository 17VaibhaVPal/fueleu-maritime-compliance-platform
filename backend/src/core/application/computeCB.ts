import { ComplianceRepository } from '../ports/repositories.js';
import { FUEL_ENERGY_MJ_PER_TON, TARGET_INTENSITY_2025 } from '../../shared/constants.js';

export type ComputeCBInput = {
	shipId: string;
	year: number;
	actualGhgIntensity: number; // gCO2e/MJ
	fuelConsumptionTon: number;
	targetGhgIntensity?: number;
};

export class ComputeCB {
	constructor(private readonly complianceRepo: ComplianceRepository) {}

	async execute(input: ComputeCBInput) {
		const target = input.targetGhgIntensity ?? TARGET_INTENSITY_2025;
		const energyMJ = input.fuelConsumptionTon * FUEL_ENERGY_MJ_PER_TON;
		const cb = (target - input.actualGhgIntensity) * energyMJ;
		const record = await this.complianceRepo.saveSnapshot({
			shipId: input.shipId,
			year: input.year,
			cbGco2eq: cb,
		});
		return record;
	}
}



