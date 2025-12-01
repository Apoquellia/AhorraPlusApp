import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';

import TransactionController from '../controllers/TransactionController';
import BudgetController from '../controllers/BudgetController';

export default function InicioScreen({ navigation }) {
  const [balance, setBalance] = useState(0);
  const [ingresos, setIngresos] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [presupuestos, setPresupuestos] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const loadData = async () => {
    try {
      // 1. Obtener resumen mensual (Balance, Ingresos, Gastos)
      // Asumimos userId = 1 por ahora, en una app real vendría del contexto de autenticación
      const userId = 1;
      const summaryResult = await TransactionController.obtenerResumenMensual(userId);

      if (summaryResult.success) {
        setIngresos(summaryResult.data.ingresos);
        setGastos(summaryResult.data.gastos);
        setBalance(summaryResult.data.balance);
      }

      // 2. Obtener presupuestos con estado
      const budgetsResult = await BudgetController.getBudgetsWithStatus(userId);
      if (budgetsResult.success) {
        setPresupuestos(budgetsResult.data);
      }

      // 3. Obtener transacciones recientes (limit 5)
      const transactionsResult = await TransactionController.obtenerTransacciones(userId, { limit: 5 });
      if (transactionsResult.success) {
        setRecentTransactions(transactionsResult.data);
      }

    } catch (error) {
      console.error('Error cargando datos de inicio:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const renderTransaction = (item) => {
    const isIngreso = item.tipo === 'ingreso';
    const amountStyle = isIngreso ? styles.amountGain : styles.amountLoss;
    const iconColor = isIngreso ? '#4CAF50' : '#FF6B6B';
    const iconName = isIngreso ? 'arrow-up-circle-outline' : 'arrow-down-circle-outline'; // Icono genérico si no hay específico

    // Formatear fecha
    const dateObj = new Date(item.fecha);
    const dateStr = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

    return (
      <TouchableOpacity key={item.id} style={styles.transactionCard}>
        <Text style={styles.date}>{dateStr}</Text>
        <View style={styles.row}>
          <View style={styles.iconText}>
            <Ionicons name={iconName} size={20} color={iconColor} />
            <Text style={styles.titleText}>{item.categoria} - {item.descripcion}</Text>
          </View>
          <Text style={amountStyle}>
            {isIngreso ? '+' : '-'}${item.monto.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Inicio</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notificaciones')}
        >
          <Ionicons name="notifications-outline" size={28} color="white" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Configuracion')}
        >
          <Ionicons name="person-circle-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>

        <Text style={styles.sectionTitle}>Resumen del Mes</Text>
        <View style={styles.heroContainer}>
          <Text style={styles.heroBalanceLabel}>Balance Total</Text>
          <Text style={styles.heroBalanceText}>${balance.toFixed(2)}</Text>
          <View style={styles.heroRow}>
            <View style={styles.heroBox}>
              <Ionicons name="arrow-up-circle-outline" size={20} color="#4CAF50" />
              <View style={styles.heroBoxText}>
                <Text style={styles.heroBoxLabel}>Ingresos</Text>
                <Text style={styles.heroBoxAmount}>${ingresos.toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.heroBox}>
              <Ionicons name="arrow-down-circle-outline" size={20} color="#FF6B6B" />
              <View style={styles.heroBoxText}>
                <Text style={styles.heroBoxLabel}>Egresos</Text>
                <Text style={styles.heroBoxAmount}>${gastos.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis Presupuestos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Presupuestos')}>
            <Text style={styles.seeAllButton}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {presupuestos.length === 0 ? (
            <Text style={{ color: '#aaa', padding: 10 }}>No hay presupuestos activos</Text>
          ) : (
            presupuestos.map((budget) => (
              <View key={budget.id} style={styles.miniBudgetCard}>
                <Text style={styles.miniBudgetTitle}>{budget.categoria}</Text>
                <Text style={styles.miniBudgetAmount}>${budget.totalGastado} / ${budget.monto_limite}</Text>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(budget.porcentaje, 100)}%`,
                        backgroundColor: budget.color || '#4A90E2'
                      }
                    ]}
                  />
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transacciones Recientes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transacciones')}>
            <Text style={styles.seeAllButton}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length === 0 ? (
          <Text style={{ color: '#aaa', padding: 10 }}>No hay transacciones recientes</Text>
        ) : (
          recentTransactions.map(renderTransaction)
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Resumen Gráfico</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Graficas')}>
            <Text style={styles.seeAllButton}>Ver más</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.graphCard}>
          <Image source={require('./../../assets/grafica.png')} style={styles.chartImage} />
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
});