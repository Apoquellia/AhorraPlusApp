import React, { useState, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Dimensions
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native'; // <--- IMPORTANTE

import TransactionController from '../controllers/TransactionController';

// Componente Header (se queda igual)
export function HeaderApp({ navigation }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Gráficas</Text>

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
  );
}

export default function GraficosScreen({ navigation }) {
  const screenWidth = Dimensions.get('window').width;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState({ title: '', image: null });

  // Datos para gráficas
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [incomesByCategory, setIncomesByCategory] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState({ ingresos: 0, gastos: 0 });

  // Paleta de colores para las gráficas
  const chartColors = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C',
    '#FF9F1C', '#C23B22', '#555555', '#9B5DE5', '#F15BB5'
  ];

  // Helper para dar formato a los datos del PieChart
  const formatChartData = (data) => {
    return data.map((item, index) => ({
      ...item,
      color: chartColors[index % chartColors.length], // Asignar color cíclico
      legendFontColor: "#FFF", // Texto blanco
      legendFontSize: 12
    }));
  };

  // --- CARGA DE DATOS (CON USEFOCUSEFFECT) ---
  useFocusEffect(
    useCallback(() => {
      const loadCharts = async () => {
        try {
          const hoy = new Date();
          const monthKey = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
          const userId = 1; // Ajustar según tu auth real

          // 1. Gastos por categoría
          const expensesResult = await TransactionController.obtenerTotalesPorCategoria(userId, monthKey, 'gasto');
          if (expensesResult.success) {
            // Aplicamos formato de colores
            setExpensesByCategory(formatChartData(expensesResult.data));
          }

          // 2. Ingresos por categoría
          const incomesResult = await TransactionController.obtenerTotalesPorCategoria(userId, monthKey, 'ingreso');
          if (incomesResult.success) {
            // Aplicamos formato de colores
            setIncomesByCategory(formatChartData(incomesResult.data));
          }

          // 3. Resumen mensual (Barras)
          const summaryResult = await TransactionController.obtenerResumenMensual(userId, monthKey);
          if (summaryResult.success) {
            setMonthlySummary(summaryResult.data);
          }

        } catch (err) {
          console.log('Error cargando datos de gráficas:', err);
        }
      };

      loadCharts();
    }, []) // El array vacío aquí es para el useCallback, no para el efecto
  );

  const chartConfig = {
    backgroundGradientFrom: '#1e1e1e', // Un poco más claro que el fondo
    backgroundGradientTo: '#1e1e1e',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Etiquetas blancas
    barPercentage: 0.7,
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Modal (sin cambios) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.card, styles.modalContent]}>
            <Text style={styles.title}>{selectedGraph.title}</Text>
            {selectedGraph.image && (
              <Image
                source={selectedGraph.image}
                style={styles.chartImage}
              />
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <HeaderApp navigation={navigation} />

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Reportes Gráficos</Text>

        {/* 1. Comparación Ingresos vs Gastos (Barras) */}
        <View style={[styles.card, { padding: 12, marginBottom: 12 }]}>
          <Text style={styles.cardTitle}>
            Ingresos vs Gastos — Mes actual
          </Text>

          <BarChart
            data={{
              labels: ['Ingresos', 'Gastos'],
              datasets: [{ data: [monthlySummary.ingresos || 0, monthlySummary.gastos || 0] }]
            }}
            width={Math.min(screenWidth - 40, 600)}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              ...chartConfig,
              // Personalizamos colores de barras si deseas
              fillShadowGradient: '#6200ee',
              fillShadowGradientOpacity: 1,
            }}
            style={{ borderRadius: 8 }}
            fromZero
            showValuesOnTopOfBars // Muestra el valor encima de la barra
          />
        </View>

        {/* 2. Gastos por categoría (Pie) */}
        <View style={[styles.card, { padding: 12, marginBottom: 12 }]}>
          <Text style={styles.cardTitle}>
            Gastos por Categoría
          </Text>

          {expensesByCategory.length === 0 ? (
            <Text style={styles.noDataText}>No hay gastos para el mes</Text>
          ) : (
            <PieChart
              data={expensesByCategory}
              width={Math.min(screenWidth - 40, 600)}
              height={220}
              accessor={'amount'}
              backgroundColor={'transparent'}
              paddingLeft={'15'}
              chartConfig={chartConfig}
              style={{ borderRadius: 8 }}
            />
          )}
        </View>

        {/* 3. Ingresos por categoría (Pie) */}
        <View style={[styles.card, { padding: 12, marginBottom: 12 }]}>
          <Text style={styles.cardTitle}>
            Ingresos por Categoría
          </Text>

          {incomesByCategory.length === 0 ? (
            <Text style={styles.noDataText}>No hay ingresos para el mes</Text>
          ) : (
            <PieChart
              data={incomesByCategory}
              width={Math.min(screenWidth - 40, 600)}
              height={220}
              accessor={'amount'}
              backgroundColor={'transparent'}
              paddingLeft={'15'}
              chartConfig={chartConfig}
              style={{ borderRadius: 8 }}
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => alert('Gráfica de Ahorro no disponible (aún)')}
        >
          <Ionicons name="leaf-outline" size={24} color="#fff" style={styles.settingIcon} />
          <Text style={styles.settingText}>Progreso de Ahorro</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#555" />
        </TouchableOpacity>

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
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  noDataText: {
    color: '#aaa',
    textAlign: 'center',
    marginVertical: 20
  },
  settingItem: {
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    marginBottom: 30
  },
  settingIcon: {
    marginRight: 20,
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  chartImage: {
    width: '100%',
    flex: 1,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  modalCloseButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});