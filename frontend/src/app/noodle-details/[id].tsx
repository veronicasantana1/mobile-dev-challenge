import { Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Button,
  Pressable,
} from "react-native";

import { useEffect, useState } from 'react';
import { addFavourite, removeFavourite, isFavourite } from '@/app/utils/favourites';

import { gql, useQuery, useMutation } from "@apollo/client";

const GET_NOODLE_DETAILS = gql`
  query GetNoodleDetails($id: ID!) {
    instantNoodle(where: { id: $id }) {
      id
      name
      brand
      spicinessLevel
      originCountry
      rating
      imageURL
      reviewsCount
      category {
        name
      }
    }
  }
`;

const UPDATE_REVIEWS_COUNT = gql`
  mutation UpdateReviewsCount($id: ID!, $newCount: Int!) {
    updateInstantNoodle(
      where: { id: $id }
      data: { reviewsCount: $newCount }
    ) {
      id
      reviewsCount
    }
  }
`;

export default function NoodlesDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
    if (id) {
      isFavourite(id).then(setFavourite);
    }
  }, [id]);
  
  const toggleFavourite = async () => {
    if (favourite) {
      await removeFavourite(id);
    } else {
      await addFavourite(id);
    }
    setFavourite(!favourite);
  };

  const { loading, error, data } = useQuery(GET_NOODLE_DETAILS, {
    variables: { id },
    skip: !id,
  });

  const [updateReviewsCount, { loading: updating }] = useMutation(UPDATE_REVIEWS_COUNT, {
    update(cache, { data: mutationData }) {
      const existing = cache.readQuery<{ instantNoodle?: any }>({
        query: GET_NOODLE_DETAILS,
        variables: { id },
      });

      if (existing?.instantNoodle && mutationData?.updateInstantNoodle) {
        cache.writeQuery({
          query: GET_NOODLE_DETAILS,
          variables: { id },
          data: {
            instantNoodle: {
              ...existing.instantNoodle,
              reviewsCount: mutationData.updateInstantNoodle.reviewsCount,
            },
          },
        });
      }
    },
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !data?.instantNoodle) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load noodle details.</Text>
      </View>
    );
  }

  const noodle = data.instantNoodle;

  const handleLeaveReview = () => {
    updateReviewsCount({
      variables: {
        id: noodle.id,
        newCount: noodle.reviewsCount + 1,
      },
      optimisticResponse: {
        updateInstantNoodle: {
          __typename: "InstantNoodle",
          id: noodle.id,
          reviewsCount: noodle.reviewsCount + 1,
        },
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: noodle.name }} />

      {noodle.imageURL && (
        <Image
          source={{ uri: noodle.imageURL }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <Text style={styles.title}>{noodle.name}</Text>
      <Text style={styles.subtitle}>Brand: {noodle.brand}</Text>

      <View style={styles.tags}>
        <Text style={styles.tag}>🌍 {noodle.originCountry}</Text>
        <Text style={styles.tag}>🔥{"🔥".repeat(noodle.spicinessLevel)}</Text>
        <Text style={styles.tag}>⭐ {noodle.rating}/10</Text>
        <Text style={styles.tag}>📦 {noodle.category?.name}</Text>
        <Text style={styles.tag}>📝 {noodle.reviewsCount} reviews</Text>
      </View>

      <View style={styles.reviewSection}>
        <Pressable
          onPress={toggleFavourite}
          style={[
            styles.button,
            favourite ? styles.removeButton : styles.addButton,
          ]}
        >
          <Text style={styles.buttonText}>
            {favourite ? 'Remove from Favourites' : 'Add to Favourites'}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleLeaveReview}
          disabled={updating}
          style={({ pressed }) => [
            styles.button,
            styles.reviewButton,
            updating && styles.disabledButton,
            pressed && !updating && styles.pressed,
          ]}
        >
          <Text style={styles.buttonText}>
            {updating ? 'Submitting...' : 'Leave Review'}
          </Text>
      </Pressable>
    </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  reviewSection: {
    marginTop: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007AFF", 
  },
  removeButton: {
    backgroundColor: "#FF3B30", 
  },
  reviewButton: {
    backgroundColor: "#34C759", 
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  pressed: {
    opacity: 0.7,
  },
});