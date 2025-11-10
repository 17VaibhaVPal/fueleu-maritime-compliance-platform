import express from 'express';
import cors from 'cors';
import { InMemoryBankingRepository, InMemoryComplianceRepository, InMemoryPoolingRepository, InMemoryRoutesRepository } from '../../adapters/outbound/inmemory.js';
import { createRoutesRouter } from '../../adapters/inbound/http/routesController.js';
import { createComplianceRouter } from '../../adapters/inbound/http/complianceController.js';
import { createBankingRouter } from '../../adapters/inbound/http/bankingController.js';
import { createPoolsRouter } from '../../adapters/inbound/http/poolsController.js';

async function bootstrap() {
	const app = express();
	app.use(cors());
	app.use(express.json());

	// Repositories
	const routesRepo = new InMemoryRoutesRepository();
	const complianceRepo = new InMemoryComplianceRepository();
	const bankingRepo = new InMemoryBankingRepository();
	const poolRepo = new InMemoryPoolingRepository();

	// Seed routes
	await routesRepo.seed([
		{ id: 'R001', routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 91.0, fuelConsumptionTon: 5000, distanceKm: 12000, totalEmissionsTon: 4500, isBaseline: true },
		{ id: 'R002', routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 88.0, fuelConsumptionTon: 4800, distanceKm: 11500, totalEmissionsTon: 4200 },
		{ id: 'R003', routeId: 'R003', vesselType: 'Tanker', fuelType: 'MGO', year: 2024, ghgIntensity: 93.5, fuelConsumptionTon: 5100, distanceKm: 12500, totalEmissionsTon: 4700 },
		{ id: 'R004', routeId: 'R004', vesselType: 'RoRo', fuelType: 'HFO', year: 2025, ghgIntensity: 89.2, fuelConsumptionTon: 4900, distanceKm: 11800, totalEmissionsTon: 4300 },
		{ id: 'R005', routeId: 'R005', vesselType: 'Container', fuelType: 'LNG', year: 2025, ghgIntensity: 90.5, fuelConsumptionTon: 4950, distanceKm: 11900, totalEmissionsTon: 4400 },
	]);

	// Routers
	app.use('/routes', createRoutesRouter(routesRepo));
	app.use('/compliance', createComplianceRouter(complianceRepo, routesRepo));
	app.use('/banking', createBankingRouter(bankingRepo, complianceRepo));
	app.use('/pools', createPoolsRouter(poolRepo));

	// Root health/info
	app.get('/', (_req, res) => {
		res.json({
			name: 'Fuel EU backend',
			status: 'ok',
			endpoints: ['/routes', '/routes/comparison', '/compliance/cb', '/compliance/adjusted-cb', '/banking/records', '/banking/bank', '/banking/apply', '/pools'],
		});
	});

	const port = Number(process.env.PORT ?? 4000);
	app.listen(port, () => {
		console.log(`Fuel EU backend listening on http://localhost:${port}`);
	});
}

bootstrap();



