import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- IMPORTS LOCALES ---
// Asegúrate de que estas rutas sean correctas en tu proyecto
import { useAuth } from '../context/AuthContext';
import TransactionController from '../controllers/TransactionController';

// --- HELPER FUNCTIONS ---
const formatDateForDisplay = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// --- COMPONENTE: ITEM DE LA LISTA ---
const TransactionItem = ({ item, onPress }) => {
  const amountStyle = item.tipo === 'ingreso' ? styles.amountGain : styles.amountLoss;
  const iconColor = item.tipo === 'ingreso' ? '#4CAF50' : '#FF6B6B';
  const iconName = item.tipo === 'ingreso' ? 'cash-outline' : 'cart-outline';

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <Text style={styles.date}>{item.fecha}</Text>
      <View style={styles.row}>
        <View style={styles.iconText}>
          <Ionicons name={iconName} size={20} color={iconColor} />
          <View>
            <Text style={styles.titleText}>{item.categoria}</Text>
            {item.descripcion ? <Text style={styles.descText}>{item.descripcion}</Text> : null}
          </View>
        </View>
        <Text style={amountStyle}>
          {item.tipo === 'ingreso' ? '+' : '-'}${item.monto.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ==========================================
// PANTALLA PRINCIPAL
// ==========================================
export default function TransaccionesScreen({ navigation }) {
  const { user } = useAuth();

  // 1. ESTADOS: UI
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // 2. ESTADOS: DATOS
  const [transactionsList, setTransactionsList] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // 3. ESTADOS: FORMULARIO
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [transactionType, setTransactionType] = useState('gasto');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 4. ESTADOS: FILTROS
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [showFilterDatePicker, setShowFilterDatePicker] = useState({ type: '', visible: false });

  // ==========================================
  // LÓGICA DE NEGOCIO
  // ==========================================

  const loadTransactions = async () => {
    if (!user) return;
    setLoading(true);

    const filters = {
      categoria: filterCategory,
      fechaInicio: filterStartDate,
      fechaFin: filterEndDate
    };

    const response = await TransactionController.obtenerTransacciones(user.id, filters);

    if (response.success) {
      setTransactionsList(response.data);
    } else {
      Alert.alert("Error", "No se pudieron cargar las transacciones");
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [user, filterCategory, filterStartDate, filterEndDate])
  );

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setMonto('');
    setCategoria('');
    setDescripcion('');
    setTransactionType('gasto');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setModalVisible(true);
  };

  const handleEditTransaction = (item) => {
    setSelectedTransaction(item);
    setMonto(item.monto.toString());
    setCategoria(item.categoria);
    setDescripcion(item.descripcion || '');
    setTransactionType(item.tipo);
    setSelectedDate(item.fecha);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!monto || !categoria || !selectedDate) {
      Alert.alert("Error", "Monto, Categoría y Fecha son obligatorios");
      return;
    }

    const transactionData = {
      monto: parseFloat(monto),
      categoria,
      descripcion,
      tipo: transactionType,
      fecha: selectedDate,
      userId: user.id
    };

    let result;
    if (selectedTransaction) {
      result = await TransactionController.actualizarTransaccion(selectedTransaction.id, transactionData);
    } else {
      result = await TransactionController.crearTransaccion(transactionData);
    }

    if (result.success) {
      Alert.alert("Éxito", selectedTransaction ? "Transacción actualizada" : "Transacción creada");
      setModalVisible(false);
      loadTransactions();
    } else {
      Alert.alert("Atención", result.error || "Ocurrió un error al guardar");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar",
      "¿Deseas eliminar esta transacción?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const result = await TransactionController.eliminarTransaccion(selectedTransaction.id);
            if (result.success) {
              setModalVisible(false);
              loadTransactions();
            } else {
              Alert.alert("Error", "No se pudo eliminar");
            }
          }
        }
      ]
    );
  };

  // ==========================================
  // RENDERIZADO
  // ==========================================
  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Transacciones</Text>
        <TouchableOpacity style={styles.notificationButton} onPress={() => navigation.navigate('Notificaciones')}>
          <Ionicons name="notifications-outline" size={28} color="white" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Configuracion')}>
          <Ionicons name="person-circle-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* CONTENIDO PRINCIPAL */}
      <View style={styles.content}>

        {/* BOTÓN "AÑADIR" (El único que dejamos) */}
        <TouchableOpacity style={styles.addCard} onPress={handleAddTransaction}>
          <Ionicons name="add-outline" size={32} color="#6200ee" />
          <Text style={styles.addCardText}>Añadir transacción</Text>
        </TouchableOpacity>

        {/* BARRA DE TÍTULO Y FILTRO */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Historial de movimientos</Text>
          <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
            <Ionicons
              name={filterCategory || filterStartDate ? "filter" : "filter-outline"}
              size={24}
              color={filterCategory || filterStartDate ? "#6200ee" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        {/* LISTA */}
        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={transactionsList}
            renderItem={({ item }) => <TransactionItem item={item} onPress={handleEditTransaction} />}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No hay transacciones registradas.</Text>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      {/* MODAL 1: FORMULARIO */}
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

            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Text style={{ color: "#fff" }}>
                Fecha: {formatDateForDisplay(selectedDate)}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={new Date(selectedDate)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                themeVariant="dark"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setSelectedDate(date.toISOString().split('T')[0]);
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
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.buttonText}>{selectedTransaction ? "Guardar" : "Agregar"}</Text>
              </TouchableOpacity>
            </View>

            {selectedTransaction && (
              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* MODAL 2: FILTROS */}
      <Modal visible={filterModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Filtrar Transacciones</Text>

            <TextInput
              placeholder="Categoría (ej: Comida)"
              placeholderTextColor="#888"
              value={filterCategory}
              onChangeText={setFilterCategory}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowFilterDatePicker({ type: 'inicio', visible: true })}
            >
              <Text style={{ color: "#fff" }}>
                Desde: {filterStartDate ? formatDateForDisplay(filterStartDate) : 'Cualquier fecha'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowFilterDatePicker({ type: 'fin', visible: true })}
            >
              <Text style={{ color: "#fff" }}>
                Hasta: {filterEndDate ? formatDateForDisplay(filterEndDate) : 'Cualquier fecha'}
              </Text>
            </TouchableOpacity>

            {showFilterDatePicker.visible && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                themeVariant="dark"
                onChange={(event, date) => {
                  const type = showFilterDatePicker.type;
                  setShowFilterDatePicker({ type: '', visible: false });
                  if (date) {
                    const dateStr = date.toISOString().split('T')[0];
                    if (type === 'inicio') setFilterStartDate(dateStr);
                    else setFilterEndDate(dateStr);
                  }
                }}
              />
            )}

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={[styles.cancelButton]}
                onPress={() => {
                  setFilterCategory('');
                  setFilterStartDate('');
                  setFilterEndDate('');
                  setFilterModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Limpiar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  setFilterModalVisible(false);
                  loadTransactions();
                }}
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

// ==========================================
// ESTILOS
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
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
    marginVertical: 5,
    marginBottom: 10,
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
    fontSize: 12,
    marginBottom: 4,
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
    fontWeight: 'bold'
  },
  descText: {
    color: '#aaa',
    fontSize: 12,
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
  dateButton: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
  },
  typeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
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