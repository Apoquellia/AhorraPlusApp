import React from 'react';
import { 
  Text, 
  StyleSheet, 
  View, 
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 

export function HeaderApp() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Gráficas</Text>

      <TouchableOpacity style={styles.notificationButton}>
        <Ionicons name="notifications-outline" size={28} color="white" />
        <View style={styles.notificationBadge} />
      </TouchableOpacity>
    </View>
  );
}

export function FooterApp() {
  return (
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
        <Ionicons name="stats-chart" size={24} color="white" />
        <Text style={styles.footerButtonTextActive}>Gráficas</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.footerButton}>
        <Ionicons name="settings-outline" size={24} color="white" />
        <Text style={styles.footerButtonText}>Ajustes</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function GraficosScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderApp />

      <ScrollView style={styles.content}>

        <Text style={styles.title}>Ingresos y Egresos por Mes</Text>

        <View style={styles.card}>
          <Image
            source={require('../assets/grafica2.png')} 
            style={styles.chartImage}
          />
          <Text style={styles.cardText}>Balance General</Text>
          <Text style={styles.cardSubtitle}>Ingresos: $3,000.00</Text>
        </View>

        <Text style={styles.title}>Ingresos y Egresos por Categoría</Text>
        
        <View style={styles.card}>
          <Image
            source={require('../assets/grafica3.png')} 
            style={styles.chartImage}
          />
          <Text style={styles.cardText}>Categorías con riesgo de exceso</Text>
          <Text style={styles.cardSubtitle}>Comida, Entretenimiento y Salud.</Text>
        </View>

      </ScrollView>

      <FooterApp />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212',
    justifyContent: 'space-between',
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
  notificationButton: {
    position: 'absolute',
    right: 16,
    top: 16, 
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'white',
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

  },
  footerButtonTextActive: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    
    // --- CORREGIDO ---
    height: 400,
  },
  
  chartImage: {
    // --- CORREGIDO ---
    width: '100%',
    flex: 1, 
    
    resizeMode: 'contain', 
    marginBottom: 15,
  },

  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 5,
  }
});