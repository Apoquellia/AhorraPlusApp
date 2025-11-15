import React, { useState } from 'react'; 
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
          <Ionicons name="home-outline" size={24} color="white" />
          <Text style={styles.footerButtonText}>Inicio</Text>
        </TouchableOpacity>
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState({ title: '', image: null });

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
            <Image
              source={selectedGraph.image} 
              style={styles.chartImage}
            />
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <HeaderApp />

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Reportes Gráficos</Text>

        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => openGraphModal(
            'Ingresos y Egresos por Mes',
            require('../assets/grafica2.png') 
          )}
        >
          <Ionicons name="stats-chart-outline" size={24} color="#fff" style={styles.settingIcon} />
          <Text style={styles.settingText}>Ingresos y Egresos por Mes</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => openGraphModal(
            'Gastos por Categoría',
            require('../assets/grafica3.png') 
          )}
        >
          <Ionicons name="pie-chart-outline" size={24} color="#fff" style={styles.settingIcon} />
          <Text style={styles.settingText}>Gastos por Categoría</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => alert('Gráfica de Ahorro no disponible (aún)')}
        >
          <Ionicons name="leaf-outline" size={24} color="#fff" style={styles.settingIcon} />
          <Text style={styles.settingText}>Progreso de Ahorro</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#555" />
        </TouchableOpacity>

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
    opacity: 0.7,
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