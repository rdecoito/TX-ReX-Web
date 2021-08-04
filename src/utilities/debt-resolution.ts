import { Group, Debt, Person } from '../types/models';

export function convertCentsToCurrency(cents: number): string {
	const valueStr = Math.abs(cents).toString();
	const dollarStr = Math.floor(Math.abs(cents) / 100).toString();
	const centsStr = valueStr.substring(valueStr.length - 2);
	return `${cents < 0 ? '-' : ''}$${dollarStr}.${centsStr}`;
}

export function generateNetWorths(debts: Debt[]): WeakMap<Person, number> {
	const netWorthMap = new WeakMap();
	debts.forEach((debt) => {
		const debteeNetWorth = netWorthMap.get(debt.debtee);
		const debtorNetWorth = netWorthMap.get(debt.debtor);

		netWorthMap.set(debt.debtee, (debteeNetWorth ?? 0) - debt.amount);
		netWorthMap.set(debt.debtor, (debtorNetWorth ?? 0) + debt.amount);
	});
	return netWorthMap;
}

export function simplifyDebts(group: Group): Debt[] {
	const { debts, people } = group;
	if (people.length < 2) {
		throw TypeError('group must have at least 2 Persons');
	}
	if (debts.length == 0) {
		throw TypeError('group must have at least 1 Debt');
	}

	const netWorthMap = generateNetWorths(debts);

	const simplifiedDebts: Array<Debt> = [];
	const sortedPeople: Array<Person> = people.filter((person) => netWorthMap.get(person) !== 0);
	sortedPeople.sort((a, b) => netWorthMap.get(a) - netWorthMap.get(b));

	while (sortedPeople.length !== 0) {
		/* eslint-disable-next-line prefer-destructuring */
		const debtee = sortedPeople[0];
		const debteeNw = netWorthMap.get(debtee);
		const debtor = sortedPeople[sortedPeople.length - 1];
		const debtorNw = netWorthMap.get(debtor);
		
		const newDebt: Debt = {
			debtor,
			debtee,
			amount: Math.min(Math.abs(debteeNw), debtorNw)
		};
		simplifiedDebts.push(newDebt);

		netWorthMap.set(debtee, debteeNw + newDebt.amount);
		netWorthMap.set(debtor, debtorNw - newDebt.amount);

		if (netWorthMap.get(debtee) === 0) {
			sortedPeople.splice(0, 1);
		}
		if (netWorthMap.get(debtor) === 0) {
			sortedPeople.splice(sortedPeople.length - 1, 1);
		}
	}

	return simplifiedDebts;
}
