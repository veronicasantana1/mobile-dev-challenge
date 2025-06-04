// components/Stepper.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface StepperProps {
  value: number | undefined;
  onChange: (level: number) => void;
  onClear: () => void;
  levels?: number[]; 
}

export const Stepper: React.FC<StepperProps> = ({ 
  value, 
  onChange, 
  onClear,
  levels = [1, 2, 3, 4, 5] 
}) => {
  const handlePress = React.useCallback((level: number) => {
    if (value !== level) {
      onChange(level);
    }
  }, [value, onChange]);
  return (
    <View style={styles.container}>
      <View style={styles.stepper}>
        {levels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.step,
              value === level && styles.activeStep,
            ]}
            onPress={() => handlePress(level)}
          >
            <Text style={[
              styles.stepText,
              value === level && styles.activeStepText
            ]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {value !== undefined && (
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  stepper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320,
    gap: 12,
  },
  step: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  activeStep: {
    backgroundColor: '#ff4500',
    borderColor: '#ff4500',
    shadowOpacity: 0.15,
    elevation: 3,
  },
  stepText: {
    fontSize: 18,
    color: '#444',
    fontWeight: '500',
  },
  activeStepText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  clearButtonText: {
    marginTop: 10,
    color: '#ff4500',
    textDecorationLine: 'underline',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});