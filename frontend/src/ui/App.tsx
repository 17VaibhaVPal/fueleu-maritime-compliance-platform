import React, { useState } from 'react';
import { RoutesTab } from '../adapters/ui/tabs/RoutesTab';
import { CompareTab } from '../adapters/ui/tabs/CompareTab';
import { BankingTab } from '../adapters/ui/tabs/BankingTab';
import { PoolingTab } from '../adapters/ui/tabs/PoolingTab';

const tabs = ['Routes', 'Compare', 'Banking', 'Pooling'] as const;
type Tab = typeof tabs[number];

export const App: React.FC = () => {
	const [tab, setTab] = useState<Tab>('Routes');
	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-bold">Fuel EU Compliance Dashboard</h1>
			<div className="flex gap-2">
				{tabs.map(t => (
					<button key={t} className={`px-3 py-2 rounded ${t === tab ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab(t)}>
						{t}
					</button>
				))}
			</div>
			<div>
				{tab === 'Routes' && <RoutesTab />}
				{tab === 'Compare' && <CompareTab />}
				{tab === 'Banking' && <BankingTab />}
				{tab === 'Pooling' && <PoolingTab />}
			</div>
		</div>
	);
};



