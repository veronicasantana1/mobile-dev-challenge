import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { GET_NOODLE_BY_ID } from "../queries";

export default function NoodlesDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_NOODLE_BY_ID, {
    variables: { id },
    skip: !id,
  });
  const [bookmark, setBookmark] = useState<boolean>(false);

  useEffect(() => {
    const checkBookmark = async () => {
      if (!id) return;
      try {
        const bookmarksString = await AsyncStorage.getItem("bookmarks");
        const bookmarks: string[] = bookmarksString ? JSON.parse(bookmarksString) : [];
        setBookmark(bookmarks.includes(id));
      } catch (error) {
        console.error("Error checking bookmark:", error);
      }
    };
    checkBookmark();
  }, [id]);


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

  const toggleBookmark = async (itemId: string) => {
    try {
      const bookmarksString = await AsyncStorage.getItem("bookmarks");
      let bookmarks: string[] = bookmarksString ? JSON.parse(bookmarksString) : [];
      
      const isBookmarked = bookmarks.includes(itemId);
      
      if (isBookmarked) {
        bookmarks = bookmarks.filter(id => id !== itemId);
        await AsyncStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        setBookmark(false);
        alert("Removed from favorites!");
      } else {
        bookmarks = [...bookmarks, itemId];
        await AsyncStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        setBookmark(true);
        alert("Added to favorites!");
      }
    } catch (error) {
      alert("Error toggling bookmark. Please try again.");
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: noodle.name, 
        headerRight: () => (
          <TouchableOpacity onPress={() =>toggleBookmark(noodle.id)}>
            <Text style={{ fontSize: 24, color: "red" }}>{bookmark ? "♥" : "♡"}</Text>
          </TouchableOpacity>
        ),
       }} />

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
});
