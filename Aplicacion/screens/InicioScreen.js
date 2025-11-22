import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const transactions = [
  { id: '2', date: '16 de septiembre de 2025', title: 'Comida', amount: '-$200.00', type: 'gasto', icon: 'fast-food-outline' },
  { id: '1', date: '15 de septiembre de 2025', title: 'Transporte', amount: '-$350.00', type: 'gasto', icon: 'car-outline' },
];

export default function InicioScreen() {
  
  const renderTransaction = (item) => {
    const amountStyle = item.type === 'ingreso' ? styles.amountGain : styles.amountLoss;
    const iconColor = item.type === 'ingreso' ? '#4CAF50' : '#FF6B6B';

    return (
      <TouchableOpacity style={styles.transactionCard}>
        <Text style={styles.date}>{item.date}</Text>
        <View style={styles.row}>
          <View style={styles.iconText}>
            <Ionicons name={item.icon} size={20} color={iconColor} />
            <Text style={styles.titleText}>{item.title}</Text>
          </View>
          <Text style={amountStyle}>{item.amount}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Inicio</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={28} color="white" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
        <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => alert("Ir a Configuración/Perfil")}
        >
            <Ionicons name="person-circle-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        
        <Text style={styles.sectionTitle}>Resumen del Mes</Text>
        <View style={styles.heroContainer}>
          <Text style={styles.heroBalanceLabel}>Balance Total</Text>
          <Text style={styles.heroBalanceText}>$3,350.00</Text>
          <View style={styles.heroRow}>
            <View style={styles.heroBox}>
              <Ionicons name="arrow-up-circle-outline" size={20} color="#4CAF50" />
              <View style={styles.heroBoxText}>
                <Text style={styles.heroBoxLabel}>Ingresos</Text>
                <Text style={styles.heroBoxAmount}>$5,000.00</Text>
              </View>
            </View>
            <View style={styles.heroBox}>
              <Ionicons name="arrow-down-circle-outline" size={20} color="#FF6B6B" />
              <View style={styles.heroBoxText}>
                <Text style={styles.heroBoxLabel}>Egresos</Text>
                <Text style={styles.heroBoxAmount}>$1,650.00</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis Presupuestos</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <View style={styles.miniBudgetCard}>
            <Text style={styles.miniBudgetTitle}>Comida</Text>
            <Text style={styles.miniBudgetAmount}>$200 / $400</Text>
            <View style={styles.progressBarBackground}><View style={[styles.progressBarFill, {width: '50%', backgroundColor: '#4A90E2'}]} /></View>
          </View>
          <View style={styles.miniBudgetCard}>
            <Text style={styles.miniBudgetTitle}>Vivienda</Text>
            <Text style={styles.miniBudgetAmount}>$1100 / $1200</Text>
            <View style={styles.progressBarBackground}><View style={[styles.progressBarFill, {width: '91.6%', backgroundColor: '#FFD700'}]} /></View>
          </View>
          <View style={styles.miniBudgetCard}>
            <Text style={styles.miniBudgetTitle}>Transporte</Text>
            <Text style={styles.miniBudgetAmount}>$350 / $500</Text>
            <View style={styles.progressBarBackground}><View style={[styles.progressBarFill, {width: '70%', backgroundColor: '#4A90E2'}]} /></View>
          </View>
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transacciones Recientes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        {renderTransaction(transactions[0])}
        {renderTransaction(transactions[1])}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Resumen Gráfico</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>Ver más</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.graphCard}>
          <Image source={require('../assets/grafica.png')} style={styles.chartImage} />
          <Text style={styles.cardText}>Gastos por Categoría</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212',
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
    right: 60,
    top: 16, 
  },
  profileButton: {
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  heroContainer: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  heroBalanceLabel: {
    fontSize: 16,
    color: '#aaa',
  },
  heroBalanceText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  heroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 8,
    width: '48%',
  },
  heroBoxText: {
    marginLeft: 10,
  },
  heroBoxLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  heroBoxAmount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  seeAllButton: {
    color: '#6200ee',
    fontSize: 14,
    fontWeight: 'bold',
  },
  horizontalScroll: {
    paddingLeft: 0,
  },
  miniBudgetCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    width: 160,
    marginRight: 10,
    marginTop: 10,
  },
  miniBudgetTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  miniBudgetAmount: {
    color: '#aaa',
    fontSize: 14,
    marginVertical: 5,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    overflow: 'hidden', 
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  transactionCard: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  date: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleText: {
    color: '#fff',
    fontSize: 16,
  },
  amountGain: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountLoss: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  graphCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    height: 300,
    marginBottom: 20,
  },
  chartImage: {
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
    opacity: 0.7,
  },
  footerButtonTextActive: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});