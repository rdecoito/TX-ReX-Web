import { Group, Person } from '../types/models';
import { convertCentsToCurrency, generateNetWorths, simplifyDebts } from './debt-resolution';

let group: Group;
let lando: Person, sarah: Person, john: Person, aaron: Person, meatshark: Person;

const resetValues = () => {
	group = {
		debts: [],
		people: []
	};

	[
		'lando',
		'sarah',
		'john',
		'aaron',
		'meatshark'
	].forEach((name) => {
		const person = { name };
		group.people.push(person);
	});

	[lando, sarah, john, aaron, meatshark] = group.people;

	[
		[lando, sarah, 10525],
		[aaron, sarah, 11165],
		[john, sarah, 10875],
		[meatshark, sarah, 5228],

		[sarah, lando, 5371],
		[john, lando, 6322],
		[aaron, lando, 5148],
		[meatshark, lando, 3588],

		[sarah, aaron, 170],
		[lando, aaron, 170],
		[meatshark, aaron, 170],
		[john, aaron, 170],

		[sarah, meatshark, 259],
		[lando, meatshark, 259],
		[aaron, meatshark, 259],
		[john, meatshark, 259],
	].forEach((debt) => {
		group.debts.push({
			debtee: debt[0] as Person,
			debtor: debt[1] as Person,
			amount: debt[2] as number
		});
	});
};

describe('generateNetWorths', () => {
	beforeEach(resetValues);

	it('should generate a WeakMap with correct net worths', () => {
		const weakMap = generateNetWorths(group.debts);

		expect(weakMap.get(lando)).toBe(9475);
		expect(weakMap.get(sarah)).toBe(31993);
		expect(weakMap.get(john)).toBe(-17626);
		expect(weakMap.get(aaron)).toBe(-15892);
		expect(weakMap.get(meatshark)).toBe(-7950);
	});
});

describe('simplifyDebts', () => {
	beforeEach(resetValues);

	it('should perform a basic calculation', () => {
		const simpleDebts = simplifyDebts(group);
		const debtMessages = simpleDebts.map((debt) => {
			return `${debt.debtee.name} pays ${debt.debtor.name} ${convertCentsToCurrency(debt.amount)}`;
		});

		expect(debtMessages).toEqual([
			'john pays sarah $176.26',
			'aaron pays sarah $143.67',
			'aaron pays lando $15.25',
			'meatshark pays lando $79.50'
		]);
	});
});
