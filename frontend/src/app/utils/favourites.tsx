import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_KEY = 'favouriteNoodleIds';

export const getFavourites = async (): Promise<string[]> => {
  try {
    const value = await AsyncStorage.getItem(FAVOURITES_KEY);
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error("Error reading favourites from AsyncStorage:", e);
    return [];
  }
};

export const addFavourite = async (id: string) => {
  try {
    const favourites = await getFavourites();
    if (!favourites.includes(id)) {
      await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify([...favourites, id]));
    }
  } catch (e) {
    console.error("Error adding favourite to AsyncStorage:", e);
  }
};

export const removeFavourite = async (id: string) => {
  try {
    const favourites = await getFavourites();
    const filtered = favourites.filter(f => f !== id);
    await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Error removing favourite from AsyncStorage:", e);
  }
};

export const isFavourite = async (id: string): Promise<boolean> => {
  try {
    const favourites = await getFavourites();
    return favourites.includes(id);
  } catch (e) {
    console.error("Error checking favourite in AsyncStorage:", e);
    return false;
  }
};
