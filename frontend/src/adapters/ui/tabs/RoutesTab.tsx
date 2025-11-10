import React, { useEffect, useMemo, useState } from 'react';
import { httpRoutes } from '../../infrastructure/httpApi';

export const RoutesTab: React.FC = () => {
	const [routes, setRoutes] = useState<any[]>([]);
	const [filters, setFilters] = useState({ vesselType: '', fuelType: '', year: '' });

	useEffect(() => {
		httpRoutes.getRoutes().then(setRoutes);
	}, []);

	const filtered = useMemo(() => {
		return routes.filter((r) => {
			return (!filters.vesselType || r.vesselType === filters.vesselType) &&
				(!filters.fuelType || r.fuelType === filters.fuelType) &&
				(!filters.year || String(r.year) === filters.year);
		});
	}, [routes, filters]);

	const unique = (key: string) => Array.from(new Set(routes.map((r: any) => r[key])));

	return (
		<div className="space-y-4">
			<div className="flex gap-2">
				<select className="border p-2 rounded" value={filters.vesselType} onChange={e => setFilters({ ...filters, vesselType: e.target.value })}>
					<option value="">All Vessel Types</option>
					{unique('vesselType').map((v: string) => <option key={v} value={v}>{v}</option>)}
				</select>
				<select className="border p-2 rounded" value={filters.fuelType} onChange={e => setFilters({ ...filters, fuelType: e.target.value })}>
					<option value="">All Fuel Types</option>
					{unique('fuelType').map((v: string) => <option key={v} value={v}>{v}</option>)}
				</select>
				<select className="border p-2 rounded" value={filters.year} onChange={e => setFilters({ ...filters, year: e.target.value })}>
					<option value="">All Years</option>
					{unique('year').map((v: number) => <option key={v} value={String(v)}>{v}</option>)}
				</select>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="text-left border-b">
							<th className="p-2">Baseline</th>
							<th className="p-2">routeId</th>
							<th className="p-2">vesselType</th>
							<th className="p-2">fuelType</th>
							<th className="p-2">year</th>
							<th className="p-2">ghgIntensity</th>
							<th className="p-2">fuelConsumption (t)</th>
							<th className="p-2">distance (km)</th>
							<th className="p-2">totalEmissions (t)</th>
							<th className="p-2">Action</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map(r => (
							<tr key={r.routeId} className="border-b">
								<td className="p-2">{r.isBaseline ? '✅' : ''}</td>
								<td className="p-2">{r.routeId}</td>
								<td className="p-2">{r.vesselType}</td>
								<td className="p-2">{r.fuelType}</td>
								<td className="p-2">{r.year}</td>
								<td className="p-2">{r.ghgIntensity}</td>
								<td className="p-2">{r.fuelConsumptionTon}</td>
								<td className="p-2">{r.distanceKm}</td>
								<td className="p-2">{r.totalEmissionsTon}</td>
								<td className="p-2">
									<button className="px-2 py-1 bg-blue-600 text-white rounded"
										onClick={async () => { await httpRoutes.setBaseline(r.routeId); const data = await httpRoutes.getRoutes(); setRoutes(data); }}>
										Set Baseline
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};



