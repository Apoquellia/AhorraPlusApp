import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Modal,
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const transactions = [
  { id: '1', date: '15 de septiembre de 2025', title: 'Transporte', amount: '-$350.00', type: 'gasto', icon: 'car-outline' },
  { id: '2', date: '16 de septiembre de 2025', title: 'Comida', amount: '-$200.00', type: 'gasto', icon: 'fast-food-outline' },
  { id: '4', date: '20 de septiembre de 2025', title: 'Salario', amount: '+$5,000.00', type: 'ingreso', icon: 'cash-outline' },
  { id: '3', date: '18 de septiembre de 2025', title: 'Renta', amount: '-$1100.00', type: 'gasto', icon: 'home-outline' },
];

export default function TransaccionesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false); // --- NUEVO ESTADO ---
  const [transactionType, setTransactionType] = useState('gasto');
  const [selectedDate, setSelectedDate] = useState('Seleccionar Fecha');

  const renderTransaction = ({ item }) => {
    const amountStyle = item.type === 'ingreso' ? styles.amountGain : styles.amountLoss;
    const iconColor = item.type === 'ingreso' ? '#4CAF50' : '#FF6B6B';

    return (
      <View style={styles.card}>
        <Text style={styles.date}>{item.date}</Text>
        <View style={styles.row}>
          <View style={styles.iconText}>
            <Ionicons name={item.icon} size={20} color={iconColor} />
            <Text style={styles.titleText}>{item.title}</Text>
          </View>
          <Text style={amountStyle}>{item.amount}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* --- MODAL AÑADIR TRANSACCIÓN (Existente) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Transacción</Text>
            
            <TextInput style={styles.modalInput} placeholder="Monto" placeholderTextColor="#999" keyboardType="numeric"/>
            <TextInput style={styles.modalInput} placeholder="Categoría" placeholderTextColor="#999"/>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => alert('Selector de fecha real aquí')}>
                <Ionicons name="calendar-outline" size={20} color="#999" />
                <Text style={styles.datePickerText}>{selectedDate}</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#999" />
            </TouchableOpacity>
            <TextInput style={styles.modalInput} placeholder="Descripción (opcional)" placeholderTextColor="#999" multiline numberOfLines={3}/>
            <View style={styles.typeSelectorContainer}>
                <TouchableOpacity
                    style={[styles.typeButton, transactionType === 'ingreso' ? styles.typeButtonActive : null]}
                    onPress={() => setTransactionType('ingreso')}>
                    <Ionicons name="add-circle-outline" size={20} color={transactionType === 'ingreso' ? '#fff' : '#4CAF50'} />
                    <Text style={[styles.typeButtonText, transactionType === 'ingreso' ? styles.typeButtonTextActive : { color: '#4CAF50' }]}>Ingreso</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.typeButton, transactionType === 'gasto' ? styles.typeButtonActive : null]}
                    onPress={() => setTransactionType('gasto')}>
                    <Ionicons name="remove-circle-outline" size={20} color={transactionType === 'gasto' ? '#fff' : '#FF6B6B'} />
                    <Text style={[styles.typeButtonText, transactionType === 'gasto' ? styles.typeButtonTextActive : { color: '#FF6B6B' }]}>Gasto</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* --- FIN MODAL AÑADIR TRANSACCIÓN --- */}

      {/* --- INICIO MODAL FILTRAR TRANSACCIONES (NUEVO) --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(!filterModalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar Transacciones</Text>
            
            <Text style={styles.modalLabel}>Categoría</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ej: Comida, Transporte..."
              placeholderTextColor="#999"
            />
            
            <Text style={styles.modalLabel}>Rango de Fechas</Text>
            <TouchableOpacity 
                style={styles.datePickerButton} 
                onPress={() => alert('Selector de fecha de inicio aquí')}
            >
                <Ionicons name="calendar-outline" size={20} color="#999" />
                <Text style={styles.datePickerText}>Fecha de Inicio</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.datePickerButton} 
                onPress={() => alert('Selector de fecha de fin aquí')}
            >
                <Ionicons name="calendar-outline" size={20} color="#999" />
                <Text style={styles.datePickerText}>Fecha de Fin</Text>
            </TouchableOpacity>


            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>Limpiar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  // Aquí iría la lógica de filtrado
                  setFilterModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
      {/* --- FIN MODAL FILTRAR TRANSACCIONES --- */}

      {/* --- Header Estándar --- */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Transacciones</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={28} color="white" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* --- Contenido de la Pantalla --- */}
      <View style={styles.content}>
        
        <TouchableOpacity 
            style={styles.addTransactionButton}
            onPress={() => setModalVisible(true)}
        >
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.addTransactionButtonText}>Agregar Nueva Transacción</Text>
        </TouchableOpacity>

        <View style={styles.titleRow}>
          <Text style={styles.title}>Historial de movimientos</Text>
          {/* --- ACTIVADOR DEL MODAL DE FILTRO --- */}
          <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
            <Ionicons name="filter-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
        />
      </View>
      
      {/* --- Footer Estándar --- */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="receipt" size={24} color="white" />
          <Text style={styles.footerButtonTextActive}>Transacciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="wallet-outline" size={24} color="white" />
          <Text style={styles.footerButtonText}>Presupuestos</Text>
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  addTransactionButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  addTransactionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  // --- NUEVO ESTILO ---
  modalLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
    marginLeft: 5,
  },
  // ---
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
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#555',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  datePickerText: {
    color: '#999',
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  typeSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    marginHorizontal: 5,
  },
  typeButtonActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  typeButtonTextActive: {
    color: '#fff',
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