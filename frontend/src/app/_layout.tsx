import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router";
import client from "@/api/client";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

export default function RootLayout() {
  return (
    <ActionSheetProvider>
    <ApolloProvider client={client}>
      <Stack />
    </ApolloProvider>
    </ActionSheetProvider>
  );
}
