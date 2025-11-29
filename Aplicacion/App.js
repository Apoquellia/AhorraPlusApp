//1. Import: Zona de declaraciones

import React from 'react';
import NavegacionMain from './source/screens/NavegacionMain';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

//2. Main: Zona de componentes
export default function App() {

  return (
<SafeAreaProvider>
  <StatusBar barStyle="light-content" />
  <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
  <NavegacionMain/>
  </SafeAreaView>
</SafeAreaProvider>
  );
}
