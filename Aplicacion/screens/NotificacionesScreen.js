import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NotificacionesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notificaciones</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        
        <View style={styles.notificationCard}>
          <Ionicons name="warning-outline" size={32} color="#FFD700" style={styles.notificationIcon} />
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Presupuesto de Vivienda al 91.6%</Text>
            <Text style={styles.notificationSubtitle}>Has gastado $1100.00 de $1200.00</Text>
          </View>
          <View style={styles.notificationDot} />
        </View>

        <View style={styles.notificationCard}>
          <Ionicons name="checkmark-circle-outline" size={32} color="#4CAF50" style={styles.notificationIcon} />
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Pago de Transporte Registrado</Text>
            <Text style={styles.notificationSubtitle}>Se registró un gasto de $50.00 en Transporte.</Text>
          </View>
          <View style={styles.notificationDot} />
        </View>

        <View style={[styles.notificationCard, styles.notificationRead]}>
          <Ionicons name="fast-food-outline" size={32} color="#aaa" style={styles.notificationIcon} />
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Resumen de Comida</Text>
            <Text style={styles.notificationSubtitle}>Tu gasto en comida está al 50%.</Text>
          </View>
        </View>

        <View style={[styles.notificationCard, styles.notificationRead]}>
          <Ionicons name="information-circle-outline" size={32} color="#aaa" style={styles.notificationIcon} />
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Bienvenido a tu App de Presupuesto</Text>
            <Text style={styles.notificationSubtitle}>Comienza añadiendo tus categorías.</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="stats-chart-outline" size={24} color="white" />
          <Text style={styles.footerButtonText}>Gráficas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="cash-outline" size={24} color="white" />
          <Text style={styles.footerButtonText}>Ingresos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="wallet-outline" size={24} color="white" />
          <Text style={styles.footerButtonText}>Gastos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="settings-outline" size={24} color="white" />
          <Text style={styles.footerButtonText}>Ajustes</Text>
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
    alignItems: 'center' 
  },
  headerText: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingVertical: 10, 
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
  },
  
  notificationCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationRead: {
    opacity: 0.6,
  },
  notificationIcon: {
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationSubtitle: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 2,
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6200ee',
    marginLeft: 10,
  },
});