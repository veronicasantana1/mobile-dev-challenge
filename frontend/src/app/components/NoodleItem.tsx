import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { moderateScale, scale } from "react-native-size-matters";

type Props = {
  id: string;
  name: string;
  spicinessLevel: number;
  originCountry: string;
  imageURL?: string;
};

export function NoodleItem({ id, name, spicinessLevel, originCountry, imageURL }: Props) {
  const handlePress = React.useCallback(() => {
    router.push(`/noodle-details/${id}?name=${name}`);
  }, [id, name]);

  return (
    <Pressable
      style={styles.pressable}
      onPress={handlePress}
    >
      {imageURL ? (
        <ImageBackground
          source={{ uri: imageURL }}
          style={styles.imageBackground}
          resizeMode="stretch"
        >
          <View style={styles.overlay}>
            <Text style={styles.spicinessText}>
              {"🔥".repeat(spicinessLevel)}
            </Text>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.countryText}>{`#${originCountry}`}</Text>
          </View>
        </ImageBackground>
      ) : (
        <View style={[styles.imageBackground, { backgroundColor: '#e0e0e0' }]}>
          <Text style={styles.nameText}>{name}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    padding: scale(8),
  },
  pressable: {
    flex: 1,
    padding: scale(8),
  },
  imageBackground: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#00000099",
    padding: moderateScale(12),
  },
  spicinessText: {
    fontSize: moderateScale(12),
    color: "white",
    textAlign: "center",
  },
  nameText: {
    fontSize: moderateScale(18),
    color: "white",
    textAlign: "center",
  },
  countryText: {
    fontSize: moderateScale(12),
    color: "white",
    textAlign: "center",
  },
});
