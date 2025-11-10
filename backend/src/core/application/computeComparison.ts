import { RoutesRepository } from '../ports/repositories.js';

export class ComputeComparison {
	constructor(private readonly routesRepo: RoutesRepository) {}

	async execute() {
		const routes = await this.routesRepo.getAll();
		const baseline = routes.find(r => r.isBaseline);
		if (!baseline) {
			return [];
		}
		const baselineVal = baseline.ghgIntensity;
		return routes
			.filter(r => r.routeId !== baseline.routeId)
			.map(r => {
				const percentDiff = ((r.ghgIntensity / baselineVal) - 1) * 100;
				const compliant = r.ghgIntensity <= baselineVal;
				return {
					routeId: r.routeId,
					baseline: baselineVal,
					comparison: r.ghgIntensity,
					percentDiff,
					compliant,
				};
			});
	}
}



