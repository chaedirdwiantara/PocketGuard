export type RootStackParamList = {
    Dashboard: undefined;
    AddTransaction: { transaction?: any }; // weak type first to avoid import cycles, or import Transaction model
    Welcome: undefined;
    BudgetSetup: { income: number };
};
