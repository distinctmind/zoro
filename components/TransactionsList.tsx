import { Text, TouchableOpacity, View } from "react-native";
import { Category, Transaction } from "../types";
import TransactionListItem from "./TransactionListItem";

export default function Transactionlist({
    transactions,
    categories,
    deleteTransaction,
} : {
    transactions: Transaction[];
    categories: Category[];
    deleteTransaction: (id: number) => Promise<void>;
}) {

    return (
        <View style={{gap: 15, marginBottom: 10}}>
            {transactions.map((transaction) => {
                const categoryForCurrentItem = categories.find(
                    (category) => category.id === transaction.category_id
                )
                return (
                    <TouchableOpacity key={transaction.id} activeOpacity={0.7} onLongPress={() => deleteTransaction(transaction.id)}>
                        <TransactionListItem transaction={transaction} categoryInfo={categoryForCurrentItem} />
                    </TouchableOpacity>
                )
            })}
        </View>
    )

}