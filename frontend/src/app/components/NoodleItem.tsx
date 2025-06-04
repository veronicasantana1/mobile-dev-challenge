import { useQuery, gql } from "@apollo/client";
import {
  View,
  Text,
  ImageBackground,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { Noodle } from "../types";
import { router } from "expo-router";
import { moderateScale, scale } from "react-native-size-matters";

const GET_NOODLE_DETAILS = gql`
  query GetNoodleDetails($id: ID!) {
    instantNoodle(where: { id: $id }) {
      name
      spicinessLevel
      originCountry
      imageURL
    }
  }
`;

type Props = {
  id: string;
  name: string;
};

export function NoodleItem({ id, name }: Props) {
  const { loading, data } = useQuery<{ instantNoodle: Noodle }>(
    GET_NOODLE_DETAILS,
    {
      variables: { id },
    }
  );

  const noodle = data?.instantNoodle;

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );

  if (!noodle) return null;

  return (
    <Pressable
      style={styles.pressable}
      onPress={() => router.push(`/noodle-details/${id}?name=${name}`)}
    >
      {noodle.imageURL && (
        <ImageBackground
          source={{ uri: noodle.imageURL }}
          style={styles.imageBackground}
          resizeMode="stretch"
        >
          <View style={styles.overlay}>
            <Text style={styles.spicinessText}>
              {"🔥".repeat(noodle.spicinessLevel)}
            </Text>
            <Text style={styles.nameText}>{noodle.name}</Text>
            <Text style={styles.countryText}>{`#${noodle.originCountry}`}</Text>
          </View>
        </ImageBackground>
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
