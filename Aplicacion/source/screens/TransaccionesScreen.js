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
      </TouchableOpacity>
    );
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
  modalLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
    marginLeft: 5,
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
    flex: 1,
  },
  modalButtonCancelText: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonDelete: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    marginRight: 10,
    marginLeft: 0,
  },
});