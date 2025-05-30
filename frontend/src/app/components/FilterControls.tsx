import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useFilter } from "@/app/context/Filter";

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

export default function FilterControls() {
  const { spicinessLevel, originCountry, setSpicinessLevel, setOriginCountry } = useFilter();

  return (
    <View style={{ marginBottom: 16 }}>
      <Text>Spiciness Level (1-5):</Text>
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

      <Text>Origin Country:</Text>
      <Picker
        selectedValue={originCountry}
        onValueChange={(value) => setOriginCountry(value)}
        style={styles.picker}
      >
        {originCountryOptions.map(({ label, value }) => (
          <Picker.Item key={value} label={label} value={value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
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