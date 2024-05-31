import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useSQLiteContext } from "expo-sqlite";

import Card from "./ui/Card";
import { Category, Transaction } from "../types";

export default function AddTransaction({insertTransaction}: {insertTransaction(transaction: Transaction): Promise<void>}){

    const [showNewEntryModal, setShowNewEntryModal] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [typeSelected, setTypeSelected] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Expense");
    const [categoryId, setCategoryId] = useState(1);
    const db = useSQLiteContext();

    const getCategoryType = (id: number) => {
        return id === 0 ? "Expense" : "Income";
    }

    useEffect(() => {
        getTransactionType();
    }, [currentTab])

    const getTransactionType = async () => {
        setCategory(getCategoryType(currentTab));
        const result = await db.getAllAsync<Category>(
            `SELECT * FROM Categories WHERE type = ?;`,
            [getCategoryType(currentTab)]
        );
        setCategories(result);
    }

    const handleSave = async () => {

        console.log({
            amount: Number(amount),
            description,
            category_id: categoryId,
            date: new Date().getTime() / 1000,
            type: category as "Expense" | "Income",
          });

         // @ts-ignore
        await insertTransaction({
            amount: Number(amount),
            description,
            category_id: categoryId,
            date: new Date().getTime() / 1000,
            type: category as "Expense" | "Income",
        });
        setAmount("");
        setDescription("");
        setCategory("Expense");
        setTypeSelected("");
        setCategoryId(1);
        setCurrentTab(0);
        setShowNewEntryModal(false);
    }

    return (
        <>
            <Modal style={{}} visible={showNewEntryModal} transparent={true} animationType="slide">
                <Card style={{backgroundColor: "white", marginBottom: 15, shadowOpacity: 0.1, height: "100%", top: 100, borderRadius: 12}}>
                    {/* <Text style={{fontSize: 28, fontWeight: "700", marginBottom: 20}}>Add Transaction</Text> */}
                    <TextInput 
                        placeholder="$ Amount" 
                        keyboardType="numeric" 
                        onChangeText={(input) => {
                            const numericValue = input.replace(/[^0-9.]/g, "");
                            setAmount(numericValue);
                        }}
                        style={{fontSize: 28, fontWeight: "bold", marginBottom: 10}} 
                    />
                    <TextInput 
                        multiline 
                        placeholder="Description" 
                        onChangeText={(input) => {
                            setDescription(input);
                        }}
                        style={{marginBottom: 15, minHeight: 25, fontSize: 16}} 
                    />
                    <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize: 16}}>Select an entry type</Text>
                    <SegmentedControl
                        style={{marginBottom: 10}} 
                        values={['Expense', 'Income']} 
                        selectedIndex={currentTab}
                        onChange={(event) => setCurrentTab(event.nativeEvent.selectedSegmentIndex)}
                    />

                    {categories.map((category) => (
                        <CategoryButton 
                            key={category.id}
                            id={category.id} 
                            title={category.name} 
                            isSelected={typeSelected === category.name} 
                            setCategoryId={setCategoryId} 
                            setTypeSelected={setTypeSelected}/>
                    ))}
                    <View style={{height: 10}} />
                    <View style={[styles.row, {height: 40, justifyContent: 'space-around' }]}>
                        <TouchableOpacity onPress={() => setShowNewEntryModal(false)}>
                            <Text style={{color: 'red'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave}>
                            <Text style={{color: '#1987ff'}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </Modal>
            <TouchableOpacity onPress={() => setShowNewEntryModal(true)}>
                <Card style={styles.container}>
                    <View style={[styles.row, { gap: 10}]}>
                        <AntDesign name="pluscircleo" size={20} color="#1987ff" />
                        <Text style={styles.text}>New Entry</Text>
                    </View>
                </Card>
            </TouchableOpacity>
        </>
    )
}

function CategoryButton({
    id,
    title,
    isSelected,
    setTypeSelected,
    setCategoryId,
  }: {
    id: number;
    title: string;
    isSelected: boolean;
    setTypeSelected: React.Dispatch<React.SetStateAction<string>>;
    setCategoryId: React.Dispatch<React.SetStateAction<number>>;
  }) {
    return (
      <TouchableOpacity
        onPress={() => {
          setTypeSelected(title);
          setCategoryId(id);
        }}
        activeOpacity={0.6}
        style={{
          height: 40,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isSelected ? "#007BFF20" : "#00000020",
          borderRadius: 15,
          marginBottom: 6,
        }}
      >
        <Text
          style={{
            fontWeight: "700",
            color: isSelected ? "#007BFF" : "#000000",
            marginLeft: 5,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        paddingHorizontal: 7,
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    text: {
        color: "#1987ff", 
        fontWeight:  "bold",
    }
})