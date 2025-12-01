import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, TextInput, Alert, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import TransactionController from '../controllers/TransactionController';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TransaccionesScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [transactionType, setTransactionType] = useState('gasto');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filters, setFilters] = useState({
    categoria: '',
    fechaInicio: null,
    fechaFin: null,
  });
  const [showFilterDatePicker, setShowFilterDatePicker] = useState({ type: '', visible: false });

  useEffect(() => {
    const loadUserAndTransactions = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(parseInt(storedUserId));
        await loadTransactions(parseInt(storedUserId));
      } else {
        Alert.alert('Error', 'Usuario no encontrado. Inicia sesión.');
      }
    };
    loadUserAndTransactions();
  }, []);

  const loadTransactions = async (id) => {
    const result = await TransactionController.getTransactions(id);
    if (result.success) {
      setTransactions(result.data);
      setFilteredTransactions(result.data); // Inicialmente, sin filtros
    } else {
      Alert.alert('Error', result.error);
    }
  };

  useEffect(() => {
    if (modalVisible) {
      if (selectedTransaction) {
        setMonto(selectedTransaction.monto.toString());
        setCategoria(selectedTransaction.categoria);
        setSelectedDate(new Date(selectedTransaction.fecha));
        setTransactionType(selectedTransaction.tipo);
        setDescripcion(selectedTransaction.descripcion || '');
      } else {
        setMonto('');
        setCategoria('');
        setSelectedDate(new Date());
        setTransactionType('gasto');
        setDescripcion('');
      }
    }
  }, [modalVisible, selectedTransaction]);

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setModalVisible(true);
  };

  const handleEditTransaction = (item) => {
    setSelectedTransaction(item);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!userId || !monto || !categoria) {
      Alert.alert('Error', 'Completa todos los campos obligatorios (Monto, Categoría).');
      return;
    }
    const fecha = selectedDate.toISOString().split('T')[0];

    if (selectedTransaction) {
      const result = await TransactionController.updateTransaction(
        selectedTransaction.id,
        parseFloat(monto),
        categoria,
        fecha,
        descripcion,
        transactionType
      );
      if (result.success) {
        Alert.alert('Éxito', result.message);
        loadTransactions(userId);
      } else Alert.alert('Error', result.message);
    } else {
      const result = await TransactionController.createTransaction(
        parseFloat(monto),
        categoria,
        fecha,
        descripcion,
        transactionType,
        userId
      );
      if (result.success) {
        Alert.alert('Éxito', result.message);
        loadTransactions(userId);
      } else Alert.alert('Error', result.message);
    }

    setModalVisible(false);
  };

  const handleDelete = async () => {
    if (!selectedTransaction) return;
    const result = await TransactionController.deleteTransaction(selectedTransaction.id);
    if (result.success) {
      Alert.alert('Éxito', result.message);
      loadTransactions(userId);
    } else Alert.alert('Error', result.message);
    setModalVisible(false);
  };

  const applyFilters = () => {
    const result = TransactionController.getTransactionsFiltered(userId, transactions, {
      categoria: filters.categoria || undefined,
      fechaInicio: filters.fechaInicio ? filters.fechaInicio.toISOString().split('T')[0] : undefined,
      fechaFin: filters.fechaFin ? filters.fechaFin.toISOString().split('T')[0] : undefined,
    });
    if (result.success) {
      setFilteredTransactions(result.data);
    } else {
      Alert.alert('Error', result.error);
    }
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setFilters({ categoria: '', fechaInicio: null, fechaFin: null });
    setFilteredTransactions(transactions);
    setFilterModalVisible(false);
  };

  const getIconForCategory = (categoria) => {
    const icons = {
      Transporte: 'car-outline',
      Comida: 'fast-food-outline',
      Salario: 'cash-outline',
      Renta: 'home-outline',
    };
    return icons[categoria] || 'cash-outline';
  };

  const renderTransaction = ({ item }) => {
    const amount = item.tipo === 'ingreso' ? `+$${item.monto}` : `-$${item.monto}`;
    const amountStyle = item.tipo === 'ingreso' ? styles.amountGain : styles.amountLoss;
    const iconColor = item.tipo === 'ingreso' ? '#4CAF50' : '#FF6B6B';
    const fechaFormateada = new Date(item.fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleEditTransaction(item)}>
        <Text style={styles.date}>{fechaFormateada}</Text>
        <View style={styles.row}>
          <View style={styles.iconText}>
            <Ionicons name={getIconForCategory(item.categoria)} size={20} color={iconColor} />
            <Text style={styles.titleText}>{item.categoria}</Text>
          </View>
          <Text style={amountStyle}>{amount}</Text>
        </View>
        {item.descripcion && <Text style={styles.description}>{item.descripcion}</Text>}
      </TouchableOpacity>
    );
  };

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Transacciones</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter-outline" size={24} color="white" />
        </TouchableOpacity>
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

      <View style={styles.content}>
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {filteredTransactions.length === 0 && transactions.length > 0 
                ? 'No hay transacciones que coincidan con los filtros.' 
                : 'No hay transacciones. Agrega una nueva.'}
            </Text>
          }
        />
      </View>

      <TouchableOpacity style={styles.addCard} onPress={handleAddTransaction}>
        <Ionicons name="add-circle-outline" size={30} color="#6200ee" />
        <Text style={styles.addCardText}>Agregar transacción</Text>
      </TouchableOpacity>

      {/* Modal para agregar/editar transacción */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {selectedTransaction ? "Editar transacción" : "Nueva transacción"}
            </Text>

            <TextInput
              placeholder="Monto"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={monto}
              onChangeText={setMonto}
              style={styles.input}
            />

            <TextInput
              placeholder="Categoría"
              placeholderTextColor="#888"
              value={categoria}
              onChangeText={setCategoria}
              style={styles.input}
            />

            <TextInput
              placeholder="Descripción (opcional)"
              placeholderTextColor="#888"
              value={descripcion}
              onChangeText={setDescripcion}
              style={[styles.input, { height: 70, textAlignVertical: "top" }]}
              multiline
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: "#fff" }}>
                Fecha: {selectedTransaction ? formatDateForDisplay(selectedDate) : 'Seleccionar Fecha'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                themeVariant="dark"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setSelectedDate(date);
                }}
              />
            )}

            <View style={styles.typeRow}>
              <TouchableOpacity
                onPress={() => setTransactionType("gasto")}
                style={[styles.typeButton, { backgroundColor: transactionType === "gasto" ? "#ff5252" : "#444" }]}
              >
                <Text style={{ color: "#fff" }}>Gasto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTransactionType("ingreso")}
                style={[styles.typeButton, { backgroundColor: transactionType === "ingreso" ? "#4caf50" : "#444" }]}
              >
                <Text style={{ color: "#fff" }}>Ingreso</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                style={styles.saveButton}
              >
                <Text style={styles.buttonText}>
                  {selectedTransaction ? "Guardar" : "Agregar"}
                </Text>
              </TouchableOpacity>
            </View>

            {selectedTransaction && (
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.deleteButton}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal para filtros */}
      <Modal visible={filterModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Filtrar Transacciones</Text>

            <TextInput
              placeholder="Categoría (ej: Comida, Transporte)"
              placeholderTextColor="#888"
              value={filters.categoria}
              onChangeText={(text) => setFilters({ ...filters, categoria: text })}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowFilterDatePicker({ type: 'inicio', visible: true })}
            >
              <Text style={{ color: "#fff" }}>
                Fecha de Inicio: {filters.fechaInicio ? formatDateForDisplay(filters.fechaInicio) : 'Seleccionar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowFilterDatePicker({ type: 'fin', visible: true })}
            >
              <Text style={{ color: "#fff" }}>
                Fecha de Fin: {filters.fechaFin ? formatDateForDisplay(filters.fechaFin) : 'Seleccionar'}
              </Text>
            </TouchableOpacity>

            {showFilterDatePicker.visible && (
              <DateTimePicker
                value={showFilterDatePicker.type === 'inicio' ? (filters.fechaInicio || new Date()) : (filters.fechaFin || new Date())}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                themeVariant="dark"
                onChange={(event, date) => {
                  setShowFilterDatePicker({ type: '', visible: false });
                  if (date) {
                    if (showFilterDatePicker.type === 'inicio') {
                      setFilters({ ...filters, fechaInicio: date });
                    } else {
                      setFilters({ ...filters, fechaFin: date });
                    }
                  }
                }}
              />
            )}

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                onPress={clearFilters}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Limpiar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={applyFilters}
                style={styles.saveButton}
              >
                <Text style={styles.buttonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  filterButton: {
    position: 'absolute',
    left: 16,
    top: 16,
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  addCard: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6200ee',
    borderStyle: 'dashed',
    minHeight: 80,
  },
  addCardText: {
    color: '#6200ee',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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
  description: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
  },

  /* ==========================
     MODALES
  =========================== */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20
  },
  modalBox: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },

  /* ==========================
     INPUTS
  =========================== */
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#555",
  },

  /* ==========================
     FECHA
  =========================== */
  dateButton: {
    backgroundColor: "#6200ee",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },

  /* ==========================
     TIPO DE TRANSACCIÓN
  =========================== */
  typeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },

  /* ==========================
     BOTONES
  =========================== */
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#444",
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: "#6200ee",
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
