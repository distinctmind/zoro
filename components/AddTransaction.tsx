import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import Card from "./ui/Card";
import { Transaction } from "../types";
import { useState } from "react";

export default function AddTransaction({insertTransaction}: {insertTransaction(transaction: Transaction): Promise<void>}){
    const [showNewEntryModal, setShowNewEntryModal] = useState(false);
    return (
        <TouchableOpacity onPress={() => setShowNewEntryModal(true)}>
            <Card style={styles.container}>
                <View style={styles.row}>
                    <AntDesign name="pluscircleo" size={20} color="#1987ff" />
                    <Text style={styles.text}>New Entry</Text>
                </View>
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#cce4ff",
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