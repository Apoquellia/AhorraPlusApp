//1. Import: Zona de declaraciones

import React from 'react';
import MenuTemporal from './screens/MenuTemporal';
import { SafeAreaProvider } from 'react-native-safe-area-context';


//2. Main: Zona de componentes
export default function App() {

  return (
<SafeAreaProvider>
  <MenuTemporal/>
</SafeAreaProvider>
  );
}
