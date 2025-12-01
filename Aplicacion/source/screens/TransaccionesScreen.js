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
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Importamos el Contexto de Autenticación (para saber quién es el usuario)
import { useAuth } from '../context/AuthContext';
// Importamos el Controlador
import TransactionController from '../controllers/TransactionController';

export default function TransaccionesScreen({ navigation }) {
  const { user } = useAuth(); // Obtener usuario logueado

  // Estados de UI
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados de Datos (Lista de transacciones)
  const [transactionsList, setTransactionsList] = useState([]);

  // Estados del Formulario (Crear/Editar)
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [transactionType, setTransactionType] = useState('gasto');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Estados de Filtros
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // --- 1. FUNCIÓN PARA CARGAR DATOS (READ) ---
  const loadTransactions = async () => {
    if (!user) return;
    setLoading(true);

    // Preparamos los filtros para enviarlos al controlador
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

  // Usamos useFocusEffect para recargar cada vez que la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [user, filterCategory, filterStartDate, filterEndDate]) // Se recarga si cambian los filtros
  );

  // --- 2. HANDLERS DEL FORMULARIO ---
  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    // Resetear formulario
    setMonto('');
    setCategoria('');
    setDescripcion('');
    setTransactionType('gasto');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setModalVisible(true);
  };

  const handleEditTransaction = (item) => {
    setSelectedTransaction(item);
    // Llenar formulario con datos del item
    setMonto(item.monto.toString());
    setCategoria(item.categoria);
    setDescripcion(item.descripcion || '');
    setTransactionType(item.tipo);
    setSelectedDate(item.fecha);
    setModalVisible(true);
  };

  // --- 3. GUARDAR (CREATE / UPDATE) ---
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
      // Actualizar
      result = await TransactionController.actualizarTransaccion(selectedTransaction.id, transactionData);
    } else {
      // Crear
      result = await TransactionController.crearTransaccion(transactionData);
    }

    if (result.success) {
      Alert.alert("Éxito", selectedTransaction ? "Transacción actualizada" : "Transacción creada");
      setModalVisible(false);
      loadTransactions(); // Recargar lista
    } else {
      Alert.alert("Atención", result.error || "Ocurrió un error al guardar");
    }
  };

  // --- 4. ELIMINAR (DELETE) ---
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

  // --- RENDER ITEM ---
  const renderTransaction = ({ item }) => {
    const amountStyle = item.tipo === 'ingreso' ? styles.amountGain : styles.amountLoss;
    const iconColor = item.tipo === 'ingreso' ? '#4CAF50' : '#FF6B6B';
    const iconName = item.tipo === 'ingreso' ? 'cash-outline' : 'cart-outline'; // Icono genérico si no guardas el nombre del icono

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleEditTransaction(item)}
      >
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

      {/* --- MODAL FORMULARIO --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedTransaction ? 'Editar Transacción' : 'Nueva Transacción'}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Monto"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={monto}
              onChangeText={setMonto}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Categoría"
              placeholderTextColor="#999"
              value={categoria}
              onChangeText={setCategoria}
            />

            {/* Input de Fecha Simple */}
            <TextInput
              style={styles.modalInput}
              placeholder="Fecha (YYYY-MM-DD)"
              placeholderTextColor="#999"
              value={selectedDate}
              onChangeText={setSelectedDate}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Descripción (opcional)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              value={descripcion}
              onChangeText={setDescripcion}
            />

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
              {selectedTransaction ? (
                <>
                  <TouchableOpacity style={styles.modalButtonDelete} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
                    <Text style={styles.modalButtonText}>Guardar Cambios</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalButtonCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
                    <Text style={styles.modalButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL FILTROS --- */}
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
              placeholder="Ej: Comida"
              placeholderTextColor="#999"
              value={filterCategory}
              onChangeText={setFilterCategory}
            />

            <Text style={styles.modalLabel}>Desde (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Fecha Inicio"
              placeholderTextColor="#999"
              value={filterStartDate}
              onChangeText={setFilterStartDate}
            />

            <Text style={styles.modalLabel}>Hasta (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Fecha Fin"
              placeholderTextColor="#999"
              value={filterEndDate}
              onChangeText={setFilterEndDate}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  // Limpiar filtros
                  setFilterCategory('');
                  setFilterStartDate('');
                  setFilterEndDate('');
                  setFilterModalVisible(false);
                  // loadTransactions se disparará automáticamente por el useFocusEffect al cambiar los estados
                }}
              >
                <Text style={styles.modalButtonCancelText}>Limpiar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setFilterModalVisible(false);
                  loadTransactions(); // Aplicar filtros
                }}
              >
                <Text style={styles.modalButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.headerText}>Transacciones</Text>
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

        <TouchableOpacity
          style={styles.addCard}
          onPress={handleAddTransaction}
        >
          <Ionicons name="add-outline" size={32} color="#6200ee" />
          <Text style={styles.addCardText}>Añadir transacción</Text>
        </TouchableOpacity>

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

        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={transactionsList}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>
                No hay transacciones registradas.
              </Text>
            }
          />
        )}
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
  typeSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
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
