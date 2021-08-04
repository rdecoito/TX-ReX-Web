import { useMemo } from 'react';
import styled from 'styled-components';
import { Debt, Person } from '../../types/models';
import { convertCentsToCurrency } from '../../utilities/debt-resolution';

const ParentDiv = styled.div(() => ({
	border: '1px solid gray',
	backgroundColor: 'darkgray'
}));

const FlexDiv = styled.div(() => ({
	display: 'flex',
	justifyContent: 'space-between'
}));

export interface PersonViewProps {
	person: Person;
	debts?: Debt[];
}

export const PersonView = (props: PersonViewProps) => {
	const { person, debts } = props;
	const [debtJsxList, netWorth] = useMemo(() => {
		const debtJsxList: JSX.Element[] = [];
		let netWorth = 0;
		debts.forEach((debt) => {
			if (debt.debtee === person) {
				debtJsxList.push(<li key={debt.debtor.name + debt.amount.toString()}>
					{`owes ${debt.debtor.name} ${convertCentsToCurrency(debt.amount)}`}
				</li>);
			}
			netWorth += (debt.debtee === person) ? -debt.amount : debt.amount;
		});
		return [debtJsxList, netWorth];
	}, [debts]);

	return (<ParentDiv>
		<FlexDiv>
			<div>{person.name}</div>
			<div>{convertCentsToCurrency(netWorth)}</div>
		</FlexDiv>
		<ul>
			{debtJsxList}
		</ul>
	</ParentDiv>);
};
