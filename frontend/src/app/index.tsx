import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_NOODLES } from "./queries";
import { NoodleItem } from "./components/NoodleItem";
import { Stack } from "expo-router";
import { originCountryOptions as originCountryOptionsFromShared } from "@mobile-dev-challenge/shared";
import { Stepper } from "./components/Stepper";
import { ActionSheetSelector } from "./components/ActionSheetSelector";
import { Noodle } from "./types";
import { moderateScale } from "react-native-size-matters";


const originCountryOptions = [...originCountryOptionsFromShared];

export default function NoodleListScreen() {
  const [spicinessLevel, setSpicinessLevel] = useState<number | undefined>(undefined);
  const [originCountry, setOriginCountry] = useState<string>("");

  const variables = useMemo(() => (
    spicinessLevel !== undefined || originCountry
      ? {
          where: {
            AND: [
              ...(spicinessLevel !== undefined
                ? [{ spicinessLevel: { equals: spicinessLevel } }]
                : []),
              ...(originCountry
                ? [{ originCountry: { equals: originCountry } }]
                : []),
            ],
          },
        }
      : {}
  ), [spicinessLevel, originCountry]);

  const { data, loading, error, previousData } = useQuery(GET_NOODLES, {
    variables,
    fetchPolicy: "cache-and-network",
  });

  const noodles = data?.instantNoodles || previousData?.instantNoodles || [];

  const renderItem = useCallback(
    ({ item }: { item: Noodle }) => (
      <NoodleItem
        id={item.id}
        name={item.name}
        spicinessLevel={item.spicinessLevel}
        originCountry={item.originCountry}
        imageURL={item.imageURL}
      />
    ),
    []
  );

  if (error) {
    return <Text style={styles.error}>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Noodles" }} />
      <View style={styles.filters}>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>
            {`Spiciness Level: ${spicinessLevel ?? "Any"}`}
          </Text>
          <Stepper
            value={spicinessLevel}
            onChange={setSpicinessLevel}
            onClear={() => setSpicinessLevel(undefined)}
          />
        </View>
        <ActionSheetSelector
          label="Origin Country"
          options={originCountryOptions}
          selectedValue={originCountry}
          onSelect={setOriginCountry}
          onClear={() => setOriginCountry("")}
          placeholder="Any country"
          buttonColor="#ff4500"
          selectButtonLabel="Select Country"
        />
      </View>
      {loading && noodles.length === 0 && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ff4500" />
        </View>
      )}
      <FlatList
        data={noodles}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: moderateScale(16) 
  },
  loader: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  error: {
    color: "red",
    padding: moderateScale(16),
    textAlign: "center",
    marginTop: moderateScale(20),
  },
  filters: {
    marginBottom: moderateScale(16),
  },
  sliderContainer: {
    alignItems: "center",
    marginBottom: moderateScale(16),
  },
  sliderLabel: {
    fontSize: moderateScale(16),
    fontWeight: "500",
    marginBottom: moderateScale(8),
  },
  loadingIndicator: {
    padding: moderateScale(8),
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(40),
  },
});