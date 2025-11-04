import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function PresupuestoScreen() {
  const progressTransporte = '70%'; 
  const progressComida = '50%';
  const progressVivienda = '91.6%';

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Presupuesto</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre de la categoría"
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Monto límite ($)"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.headerText}>Mi Presupuesto</Text>
        
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={28} color="white" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content} 
      >
        <View style={styles.card}>
          <Ionicons name="car-outline" size={40} color="#fff" style={styles.icon} />
          <View style={styles.contentCard}>
            <View style={styles.headerRow}>
              <Text style={styles.categoryText}>Transporte</Text>
              <Text style={styles.budgetText}>$500.00</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: progressTransporte, backgroundColor: '#4A90E2' }]} />
            </View>
            <View style={styles.spentRow}>
              <Text style={styles.spentLabel}>Gastado:</Text>
              <Text style={styles.spentAmount}>$350.00</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="fast-food-outline" size={40} color="#fff" style={styles.icon} />
          <View style={styles.contentCard}>
            <View style={styles.headerRow}>
              <Text style={styles.categoryText}>Comida</Text>
              <Text style={styles.budgetText}>$400.00</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: progressComida, backgroundColor: '#4A90E2' }]} />
            </View>
            <View style={styles.spentRow}>
              <Text style={styles.spentLabel}>Gastado:</Text>
              <Text style={styles.spentAmount}>$200.00</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="home-outline" size={40} color="#fff" style={styles.icon} />
          <View style={styles.contentCard}>
            <View style={styles.headerRow}>
              <Text style={styles.categoryText}>Vivienda</Text>
              <Text style={styles.budgetText}>$1200.00</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: progressVivienda, backgroundColor: '#FFD700' }]} />
            </View>
            <View style={styles.spentRow}>
              <Text style={styles.spentLabel}>Gastado:</Text>
              <Text style={styles.spentAmount}>$1100.00</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.addCard}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-outline" size={32} color="#6200ee" />
          <Text style={styles.addCardText}>Añadir presupuesto</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="receipt-outline" size={24} color="white" />
          <Text style={styles.footerButtonText}>Transacciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="wallet" size={24} color="white" />
          <Text style={styles.footerButtonTextActive}>Presupuestos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="stats-chart-outline" size={24} color="white" />
          <Text style={styles.footerButtonText}>Gráficas</Text>
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
    paddingVertical: 10,
    paddingBottom: 20,
    flexGrow: 1, 
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
  card: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1, 
    borderColor: 'rgba(255,0,0,0.3)', 
  },
  icon: {
    marginRight: 15,
  },
  contentCard: { 
    flex: 1, 
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5, 
  },
  categoryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  budgetText: {
    color: '#fff',
    fontSize: 16,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    overflow: 'hidden', 
    marginBottom: 5,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  spentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spentLabel: {
    color: '#ddd',
    fontSize: 14,
  },
  spentAmount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addCard: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, 
    borderColor: '#6200ee', 
    borderStyle: 'dashed', 
    minHeight: 100,
  },
  addCardText: {
    color: '#6200ee', 
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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

  // --- ESTILOS PARA EL MODAL (NUEVOS) ---
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#555',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#888',
    marginRight: 5,
    marginLeft: 0,
  },
  modalButtonCancelText: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
});