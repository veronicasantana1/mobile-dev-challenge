import React, { useState } from "react";
import { useFilter } from '@/app/context/Filter';

import {
  View,
  Text as RNText,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@apollo/client";
import { GET_NOODLES } from "./queries";
import { NoodleItem } from "./components/NoodleItem";
import { Stack, router } from "expo-router";

const originCountryOptions = [
  { label: "All", value: "" },
  { label: "South Korea", value: "south_korea" },
  { label: "Indonesia", value: "indonesia" },
  { label: "Malaysia", value: "malaysia" },
  { label: "Thailand", value: "thailand" },
  { label: "Japan", value: "japan" },
  { label: "Singapore", value: "singapore" },
  { label: "Vietnam", value: "vietnam" },
  { label: "China", value: "china" },
  { label: "Taiwan", value: "taiwan" },
  { label: "Philippines", value: "philippines" },
];

export default function NoodleListScreen() {
  const {
    spicinessLevel,
    setSpicinessLevel,
    originCountry,
    setOriginCountry,
  } = useFilter();

  const filters = [];
  if (spicinessLevel !== undefined) {
    filters.push({ spicinessLevel: { equals: spicinessLevel } });
  }
  if (originCountry) {
    filters.push({ originCountry: { equals: originCountry } });
  }

  const variables = filters.length > 0 ? { where: { AND: filters } } : {};

  const { loading, error, data } = useQuery(GET_NOODLES, {
    variables,
    fetchPolicy: "network-only",
  });


  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Noodles",
          headerRight: () => (
            <Pressable
              onPress={() => router.push("./favourites")}
              style={({ pressed }) => ({
                padding: 10,
                opacity: pressed ? 0.5 : 1,
              })}
              accessibilityLabel="Go to favourites"
            >
              <RNText style={{ fontSize: 20, color: "#007AFF" }}>❤️</RNText>
            </Pressable>
          ),
        }}
      />

      {loading && <ActivityIndicator style={styles.loader} size="large" />}
      {error && <RNText style={styles.error}>Error: {error.message}</RNText>}

      {!loading && !error && (
        <>
          <View style={styles.filters}>
            <RNText>Spiciness Level (1-5):</RNText>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              placeholder="Enter spiciness"
              value={spicinessLevel?.toString() || ""}
              onChangeText={(text) => {
                const val = parseInt(text, 10);
                setSpicinessLevel(val >= 1 && val <= 5 ? val : undefined);
              }}
            />

            <RNText>Origin Country:</RNText>
            <Picker
              selectedValue={originCountry}
              onValueChange={(value: string) => setOriginCountry(value)}
              style={styles.picker}
            >
              {originCountryOptions.map(({ label, value }) => (
                <Picker.Item key={value} label={label} value={value} />
              ))}
            </Picker>
          </View>

          <FlatList
            data={data?.instantNoodles || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <NoodleItem {...item} />}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            directionalLockEnabled
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", padding: 16 },
  filters: { marginBottom: 16 },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 12,
    marginTop: 8,
  },
});
