import React, { useState } from 'react';
import { Text, StyleSheet, View, Button, ScrollView } from 'react-native';
import PresupuestoScreen from './PresupuestoScreen';
import InicioSesion from './InicioSesionScreen';
import NotificacionesScreen from './NotificacionesScreen';

export default function MenuTemporal() {
  const [screen, setScreen] = useState('menu');

  switch (screen) {
    case 'inicioSesion':
      return <InicioSesion />;

    case 'presupuesto':
      return <PresupuestoScreen />;

    case 'notificaciones':
      return <NotificacionesScreen />;

    default:
      return (
        <View style={styles.container}>
          <Text>Menú temporal para visualizar nuestras interfaces</Text>
          <ScrollView>
            <View style={styles.contenedorBotones}>
              <Button
                onPress={() => setScreen('inicioSesion')}
                title="Screen Inicio De Sesión"
              />
              <Button
                onPress={() => setScreen('presupuesto')}
                title="Screen de Presupuesto"
              />
              <Button
                onPress={() => setScreen('notificaciones')}
                title="Screen de Notificaciones"
              />
            </View>
          </ScrollView>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenedorBotones: {
    marginTop: 25,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
});
