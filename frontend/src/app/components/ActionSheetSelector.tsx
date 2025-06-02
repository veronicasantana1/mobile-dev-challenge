// components/ActionSheetSelector.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";

interface Option {
  label: string;
  value: string;
}

interface ActionSheetSelectorProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  showClearButton?: boolean;
  buttonColor?: string;
  textColor?: string;
  selectButtonLabel?: string; 
}

export const ActionSheetSelector: React.FC<ActionSheetSelectorProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  onClear,
  placeholder = "Select an option",
  showClearButton = true,
  buttonColor = "#ff4500",
  textColor = "#fff",
  selectButtonLabel = "Select", 
}) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const openActionSheet = () => {
    const optionLabels = options.map(opt => opt.label);
    const values = options.map(opt => opt.value);
    const cancelButtonIndex = optionLabels.length;

    showActionSheetWithOptions(
      {
        options: [...optionLabels, "Cancel"],
        cancelButtonIndex,
      },
      (selectedIndex) => {
        if (selectedIndex !== undefined && selectedIndex !== cancelButtonIndex) {
          onSelect(values[selectedIndex]);
        }
      }
    );
  };

  const selectedLabel =
  options.find(opt => opt.value === selectedValue)?.label ||
  placeholder ||
  "None";


  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={[styles.selected, { color: buttonColor }]}> {selectedLabel}</Text>
      </View>

      <TouchableOpacity
        onPress={openActionSheet}
        style={[styles.selectButton, { backgroundColor: buttonColor }]}
      >
        <Text style={[styles.selectButtonText, { color: textColor }]}>
        {selectButtonLabel}
        </Text>
      </TouchableOpacity>

      {showClearButton && selectedValue !== "" && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Text style={[styles.clearText, { color: buttonColor }]}>Clear</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  labelRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  selected: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selectButton: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  selectButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  clearText: {
    fontSize: 15,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
