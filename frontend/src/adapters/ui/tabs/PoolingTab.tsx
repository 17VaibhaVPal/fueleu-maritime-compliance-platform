import React, { useMemo, useState } from 'react';
import { httpPooling } from '../../infrastructure/httpApi';

type MemberInput = { shipId: string; cb: number };

export const PoolingTab: React.FC = () => {
	const [year, setYear] = useState(2025);
	const [members, setMembers] = useState<MemberInput[]>([{ shipId: 'S001', cb: -1000 }, { shipId: 'S002', cb: 1200 }]);
	const [error, setError] = useState('');
	const [result, setResult] = useState<any | null>(null);

	const sum = useMemo(() => members.reduce((acc, m) => acc + m.cb, 0), [members]);
	const valid = sum >= 0 &&
		members.every(m => m.shipId.trim().length > 0) &&
		members.length >= 2;

	const updateMember = (idx: number, patch: Partial<MemberInput>) => {
		setMembers(ms => ms.map((m, i) => i === idx ? { ...m, ...patch } : m));
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<input className="border p-2 rounded w-28" type="number" value={year} onChange={e => setYear(Number(e.target.value))} />
				<button className="px-2 py-1 bg-gray-600 text-white rounded" onClick={() => setMembers(ms => [...ms, { shipId: `S${ms.length + 1}`, cb: 0 }])}>Add Member</button>
			</div>
			<div className="space-y-2">
				{members.map((m, idx) => (
					<div key={idx} className="flex gap-2 items-center">
						<input className="border p-2 rounded" value={m.shipId} onChange={e => updateMember(idx, { shipId: e.target.value })} />
						<input className="border p-2 rounded w-40" type="number" value={m.cb} onChange={e => updateMember(idx, { cb: Number(e.target.value) })} />
						<button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => setMembers(ms => ms.filter((_, i) => i !== idx))}>Remove</button>
					</div>
				))}
			</div>

			<div className={`p-3 border rounded ${sum >= 0 ? 'border-green-600' : 'border-red-600'}`}>
				Pool Sum: <b className={sum >= 0 ? 'text-green-700' : 'text-red-700'}>{sum.toFixed(2)}</b>
			</div>

			<button
				className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
				disabled={!valid}
				onClick={async () => {
					setError('');
					setResult(null);
					const res = await httpPooling.createPool({ year, members });
					if ((res as any).error) setError(res.error);
					else setResult(res);
				}}
			>
				Create Pool
			</button>

			{error && <div className="text-red-600">{error}</div>}

			{result && (
				<div className="space-y-2">
					<div className="font-semibold">Result Members</div>
					<ul className="list-disc pl-6">
						{result.members?.map((m: any, idx: number) => (
							<li key={idx}>{m.shipId}: before {m.cbBefore}, after {m.cbAfter}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};



