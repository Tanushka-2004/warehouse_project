import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from "react-native";

type Item = {
  id: number;
  name: string;
  description: string;
};

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const BASE_URL = "http://192.168.136.226:3001"; 

  const fetchItems = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/rows`);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  const addItem = () => {
    fetch(`${BASE_URL}/api/rows`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc }),
    })
      .then(res => res.json())
      .then(data => {
        console.log("✅ Added:", data);
        fetchItems(); // refresh list
        setNewName("");
        setNewDesc("");
      })
      .catch(err => {
        console.error("❌ Error adding item:", err);
        Alert.alert("Error", "Error adding item: " + err.message);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={newName}
        onChangeText={setNewName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={newDesc}
        onChangeText={setNewDesc}
        style={styles.input}
      />
      <Button title="Add Item" onPress={addItem} />

      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.id}. {item.name} - {item.description}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 5 },
});
