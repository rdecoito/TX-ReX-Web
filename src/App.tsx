import { simplifyDebts } from './utilities/debt-resolution';
import { Group, Person } from './types/models';
import { PersonView } from './components/Views';

const group: Group = {
	debts: [],
	people: []
};

const [lando, sarah, john, aaron, meatshark] = [
	'lando',
	'sarah',
	'john',
	'aaron',
	'meatshark'
].map((name) => {
	const person = {
		name
	};
	group.people.push(person);
	return person;
});

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

function App() {
	const simpleDebts = simplifyDebts(group);
	return (<>
		{group.people.map((person) => (
			<PersonView
				key={person.name}
				person={person}
				debts={simpleDebts.filter((debt) => debt.debtor === person || debt.debtee === person)}
			/>
		))}
	</>);
}

export default App;
