import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch // Importamos Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ConfiguracionScreen() {
  // Estados "falsos" solo para la funcionalidad visual de los toggles
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [notificationsOn, setNotificationsOn] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Título de la nueva pantalla */}
        <Text style={styles.headerText}>Configuración</Text>
        
        {/* Quitamos la campana de aquí, no es común en la config */}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content} 
      >
        
        {/* --- SECCIÓN DE CUENTA --- */}
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="person-circle-outline" size={24} color="#fff" style={styles.settingIcon} />
          <Text style={styles.settingText}>Editar Perfil</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="lock-closed-outline" size={24} color="#fff" style={styles.settingIcon} />
          <Text style={styles.settingText}>Cambiar Contraseña</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#555" />
        </TouchableOpacity>

        {/* --- SECCIÓN DE PREFERENCIAS --- */}
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <View style={styles.settingItem}>
          <Ionicons name="moon-outline" size={24} color="#fff" style={styles.settingIcon} />
          <Text style={styles.settingText}>Modo Oscuro</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#6200ee' }}
            thumbColor={isDarkTheme ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={() => setIsDarkTheme(previousState => !previousState)}
            value={isDarkTheme}
          />
        </View>
        <View style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color="#fff" style={styles.settingIcon} />
          <Text style={styles.settingText}>Notificaciones</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#6200ee' }}
            thumbColor={notificationsOn ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={() => setNotificationsOn(previousState => !previousState)}
            value={notificationsOn}
          />
        </View>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="cash-outline" size={24} color="#fff" style={styles.settingIcon} />
          <Text style={styles.settingText}>Moneda Principal (USD)</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#555" />
        </TouchableOpacity>

        {/* --- SECCIÓN DE SALIR --- */}
        <Text style={styles.sectionTitle}>Sesión</Text>
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FF6347" style={styles.settingIcon} />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* Versión de la App */}
        <Text style={styles.versionText}>AhorraPulsApp v1.0.0</Text>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="receipt-outline" size={24} color="white" />
          <Text style={styles.footerButtonText}>Transacciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="wallet-outline" size={24} color="white" />
          <Text style={styles.footerButtonText}>Presupuestos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="stats-chart-outline" size={24} color="white" />
          <Text style={styles.footerButtonText}>Gráficas</Text>
        </TouchableOpacity>
        {/* Botón de Ajustes "Activo" */}
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="settings" size={24} color="white" />
          <Text style={styles.footerButtonTextActive}>Ajustes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212' 
  },
  header: { 
    backgroundColor: '#6200ee', 
    padding: 16, 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerText: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  footer: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.7, // Texto normal un poco opaco
  },
  footerButtonTextActive: {
    color: 'white', // Texto activo blanco y bold
    fontSize: 12,
    fontWeight: 'bold',
  },

  // --- NUEVOS ESTILOS PARA CONFIGURACIÓN ---
  sectionTitle: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  settingItem: {
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
  },
  settingIcon: {
    marginRight: 20,
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
    flex: 1, // Esto empuja el switch/chevron al final
  },
  logoutButton: {
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
  },
  logoutButtonText: {
    color: '#FF6347', // Color rojo para "peligro"
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  versionText: {
    color: '#777',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
});