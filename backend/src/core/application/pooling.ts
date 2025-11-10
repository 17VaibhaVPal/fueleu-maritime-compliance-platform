export type PoolMemberInput = { shipId: string; cb: number };

export class CreatePool {
	async execute(input: { year: number; members: PoolMemberInput[] }) {
		const sum = input.members.reduce((acc, m) => acc + m.cb, 0);
		if (sum < 0) {
			throw new Error('Sum(adjustedCB) must be ≥ 0');
		}
		// Greedy: sort by CB desc (surplus first)
		const sorted = [...input.members].sort((a, b) => b.cb - a.cb);
		const deficits = sorted.filter(m => m.cb < 0).map(m => ({ shipId: m.shipId, need: -m.cb }));
		const surplus = sorted.filter(m => m.cb > 0).map(m => ({ shipId: m.shipId, have: m.cb }));

		// Allocate
		const transfers: Record<string, number> = Object.fromEntries(sorted.map(m => [m.shipId, 0]));
		let d = 0;
		for (let s = 0; s < surplus.length && d < deficits.length; s++) {
			while (surplus[s].have > 0 && d < deficits.length) {
				const amt = Math.min(surplus[s].have, deficits[d].need);
				surplus[s].have -= amt;
				deficits[d].need -= amt;
				transfers[surplus[s].shipId] -= amt;
				transfers[deficits[d].shipId] += amt;
				if (deficits[d].need === 0) d++;
			}
		}

		// Build cbAfter, enforce constraints
		const after = input.members.map(m => {
			const t = transfers[m.shipId] ?? 0;
			const cbAfter = m.cb + t;
			return { shipId: m.shipId, cbBefore: m.cb, cbAfter };
		});

		// Validate constraints
		for (const m of after) {
			const before = input.members.find(x => x.shipId === m.shipId)!.cb;
			if (before < 0 && m.cbAfter < before) {
				throw new Error('Deficit ship exits worse');
			}
			if (before > 0 && m.cbAfter < 0) {
				throw new Error('Surplus ship exits negative');
			}
		}

		return { year: input.year, members: after };
	}
}



