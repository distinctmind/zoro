import { ActivityIndicator, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { SQLiteProvider } from 'expo-sqlite/next'
import { Suspense, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Home from './screens/Home';

const Stack = createNativeStackNavigator();

const loadDatabase = async() => {
  const databaseName = "zoro.db";
  const databaseAsset = require("./assets/zoro.db");
  const databaseURI = Asset.fromModule(databaseAsset).uri;
  const databaseFilePath = `${FileSystem.documentDirectory}SQLite/${databaseName}`;

  const fileInfo = await FileSystem.getInfoAsync(databaseFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(databaseURI, databaseFilePath);
  }
}

export default function App() {
  const [databaseLoaded, setDatabaseLoaded] = useState(false);

  useEffect(() => {
    loadDatabase().then(() => setDatabaseLoaded(true)).catch((e) => console.error(e));
  }, []);

  if (!databaseLoaded) return (
    <View style={{flex: 1}}>
      <ActivityIndicator size="large" />
      <Text>Loading...</Text>
    </View>
  );
  return (
    <NavigationContainer>
      <Suspense fallback={
        <View style={{flex: 1}}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
      }>
        <SQLiteProvider useSuspense databaseName='zoro.db'>
          <Stack.Navigator>
            <Stack.Screen name='Home' component={Home} options={{
              headerTitle: "Zoro",
              headerLargeTitle: true,
            }} />
          </Stack.Navigator>
        </SQLiteProvider>
      </Suspense>
    </NavigationContainer>
  );
}