import { useEffect, useState, useCallback } from 'react';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { getFavourites, removeFavourite } from '../utils/favourites';
import NoodleItem from '../components/NoodleItem';
import { useFocusEffect, Stack, useRouter, usePathname } from 'expo-router';  // Import useRouter e usePathname aqui
import { Ionicons } from '@expo/vector-icons';
import { useFilter } from '../context/Filter';
import FilterControls from '../components/FilterControls';

const GET_ALL_NOODLES = gql`
  query GetAllNoodles {
    instantNoodles {
      id
      name
      brand
      imageURL
      reviewsCount
      spicinessLevel
      originCountry
    }
  }
`;

export default function FavouritesPage() {
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);
  const { spicinessLevel, originCountry } = useFilter();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      getFavourites().then(setFavouriteIds);
    }, [])
  );

  const { data, loading, error } = useQuery(GET_ALL_NOODLES);
  const pathname = usePathname();

  const handleRemoveFavourite = async (id: string) => {
    await removeFavourite(id);
    setFavouriteIds(prev => prev.filter(favId => favId !== id));
  };

  const favouriteNoodles = (data?.instantNoodles || []).filter((noodle: {
    id: string;
    spicinessLevel: number;
    originCountry: string;
  }) => {
    const isFavourite = favouriteIds.includes(noodle.id);
    const matchSpice = spicinessLevel === undefined || noodle.spicinessLevel === spicinessLevel;
    const matchCountry = !originCountry || noodle.originCountry === originCountry;
    return isFavourite && matchSpice && matchCountry;
  });
  if (loading) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>Loading...</Text></View>;
  if (error) return <Text style={{ color: "red", padding: 16 }}>Error loading noodles.</Text>;

  const isFavourites = pathname === '/favourites'; 

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Stack.Screen
        options={{
          headerTitle: "Favourites",
          headerLeft: isFavourites
            ? () => (
                <TouchableOpacity onPress={() => router.push('/')} style={{ paddingHorizontal: 16 }}>
                  <Ionicons name="arrow-back" size={24} />
                </TouchableOpacity>
              )
            : undefined,
        }}
      />
      <View style={{ marginBottom: 16 }}>
        <FilterControls />
      </View>
      {favouriteNoodles.length === 0 ? (
        <Text style={{ padding: 16 }}>No favourites yet.</Text>
      ) : (
        <FlatList
          data={favouriteNoodles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoodleItem 
              {...item} 
              onRemoveFavourite={() => handleRemoveFavourite(item.id)} 
              isFavourite={true} 
            />
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
