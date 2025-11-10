import React, { useEffect, useState } from 'react';
import { httpBanking, httpCompliance } from '../../infrastructure/httpApi';

export const BankingTab: React.FC = () => {
	const [shipId, setShipId] = useState('S001');
	const [year, setYear] = useState(2025);
	const [cb, setCb] = useState<number>(0);
	const [records, setRecords] = useState<any[]>([]);
	const [applyAmount, setApplyAmount] = useState<number>(0);
	const [error, setError] = useState<string>('');

	const refresh = async () => {
		setError('');
		const res = await httpCompliance.getCB(shipId, year);
		setCb(res.cbGco2eq ?? 0);
		const rec = await httpBanking.getRecords(shipId, year);
		setRecords(rec);
	};

	useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shipId, year]);

	const available = records.reduce((acc, r) => acc + r.amountGco2eq, 0);

	return (
		<div className="space-y-4">
			<div className="flex gap-2 items-center">
				<input className="border p-2 rounded" value={shipId} onChange={e => setShipId(e.target.value)} />
				<input className="border p-2 rounded w-28" type="number" value={year} onChange={e => setYear(Number(e.target.value))} />
				<button className="px-3 py-2 bg-gray-600 text-white rounded" onClick={refresh}>Refresh</button>
			</div>

			<div className="p-3 border rounded">
				<div className="font-semibold mb-2">KPIs</div>
				<div className="grid grid-cols-3 gap-4">
					<div>cb_before: <b>{cb.toFixed(2)}</b></div>
					<div>banked available: <b>{available.toFixed(2)}</b></div>
					<div>cb_after: <i>after actions</i></div>
				</div>
			</div>

			<div className="flex gap-2">
				<button className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
					disabled={cb <= 0}
					onClick={async () => {
						setError('');
						const res = await httpBanking.bank({ shipId, year, cb });
						if ((res as any).error) setError(res.error);
						await refresh();
					}}>
					Bank Positive CB
				</button>
				<input className="border p-2 rounded w-40" type="number" value={applyAmount} onChange={e => setApplyAmount(Number(e.target.value))} />
				<button className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50"
					disabled={available <= 0 || applyAmount <= 0}
					onClick={async () => {
						setError('');
						const res = await httpBanking.apply({ shipId, year, amount: applyAmount });
						if ((res as any).error) setError(res.error);
						await refresh();
					}}>
					Apply Banked
				</button>
			</div>

			{error && <div className="text-red-600">{error}</div>}

			<div>
				<div className="font-semibold mb-2">Banking Records</div>
				<ul className="list-disc pl-6">
					{records.map((r, idx) => (
						<li key={idx}>amount: {r.amountGco2eq} ({new Date(r.createdAt).toLocaleString?.() || 'now'})</li>
					))}
				</ul>
			</div>
		</div>
	);
};



