import React, { useState, useEffect } from 'react'; 
import { 
  Text, 
  StyleSheet, 
  View, 
  TouchableOpacity,
  ScrollView,
  Modal,  
  Image   
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { Dimensions } from 'react-native'; //importaciones para las graficas
import { PieChart, BarChart } from 'react-native-chart-kit';
import { getTotalsByCategory, getMonthlyTotals } from '../database/queries'; 

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

  // Cargar datos al montar
  useEffect(() => {
    const loadCharts = async () => {
      try {
        // formato mes: 'YYYY-MM' 
        const hoy = new Date();
        const monthKey = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2,'0')}`;

        const byCategory = await getTotalsByCategory(monthKey);
        // byCategory espera filas con {categoria, tipo, total}
        const gastos = byCategory.filter(r => r.tipo === 'gasto').map(r => ({ name: r.categoria, amount:Number(r.total) }));
        const ingresos = byCategory.filter(r => r.tipo === 'ingreso').map(r => ({ name: r.categoria, amount: Number(r.total) }));

        setExpensesByCategory(gastos);
        setIncomesByCategory(ingresos);

        const monthly = await getMonthlyTotals(monthKey);
        setMonthlySummary(monthly);
      } catch (err) {
        console.log('Error cargando datos de gráficas:', err);
      }
    };

    loadCharts();
  }, []);


  const openGraphModal = (title, imageSource) => {
    setSelectedGraph({ title: title, image: imageSource });
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      
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

        {/* Comparación mes: ingresos vs gastos */}
        <View style={[styles.card, { padding: 12, marginBottom: 12 }]}>
          <Text style={{ color: '#fff', fontSize: 18, marginBottom: 8, textAlign: 'center' }}>
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
              backgroundGradientFrom: '#222',
              backgroundGradientTo: '#222',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(200,200,200, ${opacity})`
            }}
            style={{ borderRadius: 8 }}
            fromZero
          />
        </View>

        {/* Gastos por categoría (Pie) */}
        <View style={[styles.card, { padding: 12, marginBottom: 12 }]}>
          <Text style={{ color: '#fff', fontSize: 18, marginBottom: 8, textAlign: 'center' }}>
            Gastos por Categoría — Mes actual
          </Text>
          
          {expensesByCategory.length === 0 ? (
            <Text style={{ color: '#aaa', textAlign: 'center' }}>No hay gastos para el mes</Text>
          ) : (
            <PieChart
              data={expensesByCategory.map((c, i) => ({
                name: c.name,
                population: Number(c.amount),
                color: ['#FF6384', '#36A2EB', '#FFCE56', '#8AFFC1', '#B19CD9'][i % 5],
                legendFontColor: '#fff',
                legendFontSize: 12
              }))}
              width={Math.min(screenWidth - 40, 600)}
              height={220}
              accessor={'population'}
              backgroundColor={'transparent'}
              paddingLeft={'15'}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
              }}
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
  settingItem: {
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
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
    height: 400, 
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