export interface Debt {
    debtor: Person;
    debtee: Person;
    amount: number;
}

export interface Group {
    people: Array<Person>;
    debts: Array<Debt>;
}

export interface Person {
    name: string;
}
