import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApolloClient } from "@apollo/client";
import { GET_NOODLE_BY_ID } from "../queries";
import { Noodle } from "../types";
import { Stack } from "expo-router";
import { useFilters } from "../FilterContext";
import { scale, moderateScale } from "react-native-size-matters";

export default function FavouritesScreen() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<Noodle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const client = useApolloClient();
  const { searchTerm, setSearchTerm } = useFilters();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem("bookmarks");
        const ids: string[] = stored ? JSON.parse(stored) : [];
        setFavoriteIds(ids);

        const responses = await Promise.all(
          ids.map((id) =>
            client.query({
              query: GET_NOODLE_BY_ID,
              variables: { id },
            })
          )
        );

        const noodles = responses.map((res) => res.data.instantNoodle);
        setBookmarks(noodles);
      } catch (err) {
        console.error("Error loading favourites:", err);
        setError("Failed to load favourites.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  });

  const removeFromFavorites = (idToRemove: string) => {
    Alert.alert(
      "Remove Favourite",
      "Are you sure you want to remove this favourite?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedIds = favoriteIds.filter((id) => id !== idToRemove);
              const updatedBookmarks = bookmarks.filter(
                (item) => item.id !== idToRemove
              );

              setFavoriteIds(updatedIds);
              setBookmarks(updatedBookmarks);

              await AsyncStorage.setItem("bookmarks", JSON.stringify(updatedIds));
              alert("Removed from favourites!");
            } catch (err) {
              console.error("Error removing favourite:", err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const filteredBookmarks = bookmarks.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Favourites" }} />
      <Text style={styles.title}>Favourites</Text>

      <TextInput
        placeholder="Search by name"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />

      {filteredBookmarks.length === 0 ? (
        <Text style={styles.message}>No favourites added yet.</Text>
      ) : (
        <FlatList
          data={filteredBookmarks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              {item.imageURL && (
                <Image source={{ uri: item.imageURL }} style={styles.image} />
              )}
              <View style={styles.textContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemBrand}>{item.brand}</Text>
                <Text>⭐ {item.rating}/10</Text>
              </View>
              <TouchableOpacity onPress={() => removeFromFavorites(item.id)}>
                <Text style={styles.removeButton}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: scale(16),
      backgroundColor: "#fff",
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorText: {
      color: "red",
      fontSize: moderateScale(16),
    },
    title: {
      fontSize: moderateScale(24),
      fontWeight: "bold",
      marginBottom: scale(16),
    },
    message: {
      fontSize: moderateScale(16),
      color: "#888",
      textAlign: "center",
      marginTop: scale(20),
    },
    searchInput: {
      height: scale(40),
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: scale(8),
      paddingHorizontal: scale(10),
      marginBottom: scale(16),
    },
    itemContainer: {
      flexDirection: "row",
      padding: scale(12),
      marginBottom: scale(12),
      backgroundColor: "#f5f5f5",
      borderRadius: scale(8),
    },
    image: {
      width: scale(80),
      height: scale(80),
      borderRadius: scale(8),
      marginRight: scale(12),
    },
    textContainer: {
      flex: 1,
      justifyContent: "center",
    },
    itemName: {
      fontSize: moderateScale(18),
      fontWeight: "bold",
    },
    itemBrand: {
      fontSize: moderateScale(14),
      color: "#666",
    },
    removeButton: {
      fontSize: moderateScale(15),
      color: "red",
      marginLeft: scale(10),
      alignSelf: "center",
    },
  });
  
