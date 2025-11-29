import React, { useState } from 'react';
import { Text, StyleSheet, View, Button, ScrollView } from 'react-native';
import PresupuestoScreen from './PresupuestoScreen';
import InicioSesion from './InicioSesionScreen';
import NotificacionesScreen from './NotificacionesScreen';
import GraficosScreen from './GraficasScreen';
import ConfiguracionScreen from './ConfiguracionScreen';
import TransaccionesScreen from './TransaccionesScreen';
import InicioScreen from './InicioScreen';
import RegistroScreen from './RegistroScreen'

export default function MenuTemporal() {
  const [screen, setScreen] = useState('menu');

  switch (screen) {
    case 'inicioSesion':
      return <InicioSesion />;
    case 'registro':
      return <RegistroScreen/>;
    case 'inicio':
      return <InicioScreen />;
    case 'presupuesto':
      return <PresupuestoScreen />;
    case 'notificaciones':
      return <NotificacionesScreen />;
    case 'graficas':
      return <GraficosScreen />;
    case 'configuracion':
      return <ConfiguracionScreen />;
    case 'transacciones':
      return <TransaccionesScreen />;
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.titulo}>Menú temporal para visualizar nuestras interfaces</Text>
          <ScrollView>
            <View style={styles.contenedorBotones}>
              <Button onPress={() => setScreen('inicioSesion')} title="Screen Inicio de Sesión" />
              <Button onPress={() => setScreen('registro')} title="Screen de Registro de Usuario" />              
              <Button onPress={() => setScreen('inicio')} title="Screen de inicio" />
              <Button onPress={() => setScreen('transacciones')} title="Screen de Transacciones" />
              <Button onPress={() => setScreen('presupuesto')} title="Screen de Presupuesto" />
              <Button onPress={() => setScreen('graficas')} title="Screen de Graficas" />
              <Button onPress={() => setScreen('configuracion')} title="Screen de Configuracion" />
              <Button onPress={() => setScreen('notificaciones')} title="Screen de Notificaciones" />
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
    justifyContent: 'flex-start', 
    paddingTop: 60, 
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  contenedorBotones: {
    marginTop: 10,
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
