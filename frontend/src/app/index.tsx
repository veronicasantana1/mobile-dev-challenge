import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_NOODLES } from "./queries";
import { NoodleItem } from "./components/NoodleItem";
import { Stack, useRouter } from "expo-router";
import { useFilters } from "./FilterContext";

export default function NoodleListScreen() {
  const { loading, error, data } = useQuery<{
    instantNoodles: { id: string; name: string }[];
  }>(GET_NOODLES);

  const router = useRouter();
  const { searchTerm, setSearchTerm } = useFilters();

  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
  if (error) return <Text style={styles.error}>Error: {error.message}</Text>;

  const filteredNoodles = data?.instantNoodles.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Noodles",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/favourites")}>
              <Text style={{ fontSize: 24, color: "red", marginRight: 10 }}>♥</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <TextInput
        placeholder="Search by name"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredNoodles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoodleItem {...item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", padding: 16 },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
});
