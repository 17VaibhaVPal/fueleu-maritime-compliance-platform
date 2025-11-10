import React, { useEffect, useState } from 'react';
import { httpRoutes } from '../../infrastructure/httpApi';

export const CompareTab: React.FC = () => {
	const [rows, setRows] = useState<any[]>([]);

	useEffect(() => {
		httpRoutes.getComparison().then(setRows);
	}, []);

	return (
		<div className="space-y-4">
			<div className="overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="text-left border-b">
							<th className="p-2">routeId</th>
							<th className="p-2">baseline (gCO₂e/MJ)</th>
							<th className="p-2">comparison (gCO₂e/MJ)</th>
							<th className="p-2">% difference</th>
							<th className="p-2">compliant</th>
						</tr>
					</thead>
					<tbody>
						{rows.map(r => (
							<tr key={r.routeId} className="border-b">
								<td className="p-2">{r.routeId}</td>
								<td className="p-2">{r.baseline.toFixed(3)}</td>
								<td className="p-2">{r.comparison.toFixed(3)}</td>
								<td className="p-2">{r.percentDiff.toFixed(2)}%</td>
								<td className="p-2">{r.compliant ? '✅' : '❌'}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{/* Minimal inline "chart": bars */}
			<div className="grid gap-2">
				{rows.map(r => (
					<div key={`bar-${r.routeId}`} className="flex items-center gap-2">
						<div className="w-24 text-xs">{r.routeId}</div>
						<div className="flex-1 h-3 bg-gray-200 rounded relative">
							<div className="absolute left-0 top-0 h-3 bg-blue-500 rounded" style={{ width: `${Math.min(100, r.baseline)}%` }} />
							<div className="absolute left-0 top-0 h-3 bg-green-500 rounded opacity-60" style={{ width: `${Math.min(100, r.comparison)}%` }} />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};



