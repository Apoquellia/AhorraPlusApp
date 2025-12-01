//1. Import: Zona de declaraciones
import React, { useEffect } from 'react';  // Agregado useEffect
import NavegacionMain from './source/screens/NavegacionMain';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { initDB } from './source/database/database';  

//2. Main: Zona de componentes
export default function App() {
  // Inicializar la BD al montar la app
  useEffect(() => {
    initDB()
      .then(() => console.log('Base de datos inicializada'))
      .catch((error) => console.error('Error inicializando BD:', error));
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <NavegacionMain />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
