import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import BudgetController from '../controllers/BudgetController';

export default function PresupuestoScreen({ navigation }) {
  const { user } = useAuth();

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Estados de Datos
  const [budgetsList, setBudgetsList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  // Estados del Formulario
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  // Estados de Filtros
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  // --- 1. CARGAR DATOS ---
  const loadBudgets = async () => {
    if (!user) return;
    setLoading(true);

    // Obtenemos presupuestos con estado (gastado vs límite) para el mes seleccionado
    const response = await BudgetController.getBudgetsWithStatus(user.id, filterDate);

    if (response.success) {
      setBudgetsList(response.data);
      applyFilters(response.data, filterCategory);
    } else {
      Alert.alert('Error', response.error || 'No se pudieron cargar los presupuestos');
    }
    setLoading(false);
  };

  // Aplicar filtros localmente
  const applyFilters = (list, catFilter) => {
    let result = list;
    if (catFilter) {
      result = result.filter(b => b.categoria.toLowerCase().includes(catFilter.toLowerCase()));
    }
    setFilteredList(result);
  };

  useFocusEffect(
    useCallback(() => {
      loadBudgets();
    }, [user, filterDate]) // Recargar si cambia el usuario o el mes filtro
  );

  // --- 2. HANDLERS FORMULARIO ---
  const handleAddBudget = () => {
    setSelectedBudget(null);
    setCategory('');
    setAmount('');
    setModalVisible(true);
  };

  const handleEditBudget = (budget) => {
    setSelectedBudget(budget);
    setCategory(budget.categoria);
    setAmount(budget.monto_limite.toString());
    setModalVisible(true);
  };

  // --- 3. GUARDAR (CREATE / UPDATE) ---
  const handleSave = async () => {
    if (!category || !amount) {
      Alert.alert('Error', 'Categoría y Monto son obligatorios');
      return;
    }

    const montoNum = parseFloat(amount);
    if (isNaN(montoNum) || montoNum <= 0) {
      Alert.alert('Error', 'El monto debe ser un número válido mayor a 0');
      return;
    }

    let result;
    if (selectedBudget) {
      // Editar
      result = await BudgetController.updateBudget(selectedBudget.id, category, montoNum, user.id);
    } else {
      // Crear
      result = await BudgetController.createBudget(category, montoNum, user.id);
    }

    if (result.success) {
      Alert.alert('Éxito', result.message);
      setModalVisible(false);
      loadBudgets();
    } else {
      Alert.alert('Error', result.error || 'Ocurrió un error al guardar');
    }
  };

  // --- 4. ELIMINAR ---
  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar el presupuesto de "${selectedBudget.categoria}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await BudgetController.deleteBudget(selectedBudget.id);
            if (result.success) {
              setModalVisible(false);
              loadBudgets();
            } else {
              Alert.alert('Error', result.error || 'No se pudo eliminar');
            }
          }
        }
      ]
    );
  };

  const renderBudgetCard = (item) => {
    const progressWidth = `${Math.min(item.porcentaje, 100)}%`;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.card, { borderColor: item.color, borderWidth: 1 }]}
        onPress={() => handleEditBudget(item)}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="wallet-outline" size={32} color={item.color} />
        </View>

        <View style={styles.contentCard}>
          <View style={styles.headerRow}>
            <Text style={styles.categoryText}>{item.categoria}</Text>
            <Text style={styles.budgetText}>${item.monto_limite.toFixed(2)}</Text>
          </View>

          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: progressWidth, backgroundColor: item.color }]} />
          </View>

          <View style={styles.spentRow}>
            <Text style={styles.spentLabel}>Gastado: <Text style={{ color: '#fff' }}>${item.totalGastado.toFixed(2)}</Text></Text>
            <Text style={[styles.statusText, { color: item.color }]}>
              {item.estado}
              {item.porcentaje > 100 && ` (Excedido por $${(item.totalGastado - item.monto_limite).toFixed(2)})`}
            </Text>
          </View>
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
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedBudget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nombre de la categoría"
              placeholderTextColor="#999"
              value={category}
              onChangeText={setCategory}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Monto límite ($)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <View style={styles.modalButtonRow}>
              {selectedBudget ? (
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
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar Presupuestos</Text>

            <Text style={styles.modalLabel}>Categoría</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Buscar categoría..."
              placeholderTextColor="#999"
              value={filterCategory}
              onChangeText={setFilterCategory}
            />

            <Text style={styles.modalLabel}>Mes (YYYY-MM)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="2025-11"
              placeholderTextColor="#999"
              value={filterDate}
              onChangeText={setFilterDate}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setFilterCategory('');
                  setFilterDate(new Date().toISOString().slice(0, 7));
                  setFilterModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonCancelText}>Resetear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setFilterModalVisible(false);
                  loadBudgets(); // Recargar con nueva fecha
                  applyFilters(budgetsList, filterCategory);
                }}
              >
                <Text style={styles.modalButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.headerText}>Mi Presupuesto</Text>

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
        <View style={styles.titleRow}>
          <Text style={styles.title}>Estado Mensual: {filterDate}</Text>
          <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
            <Ionicons
              name={filterCategory || filterDate !== new Date().toISOString().slice(0, 7) ? "filter" : "filter-outline"}
              size={24}
              color={filterCategory || filterDate !== new Date().toISOString().slice(0, 7) ? "#6200ee" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addCard}
          onPress={handleAddBudget}
        >
          <Ionicons name="add-outline" size={32} color="#6200ee" />
          <Text style={styles.addCardText}>Añadir presupuesto</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 20 }} />
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {filteredList.length === 0 ? (
              <Text style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>
                No hay presupuestos que coincidan.
              </Text>
            ) : (
              filteredList.map(renderBudgetCard)
            )}
          </ScrollView>
        )}
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  addCard: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6200ee',
    borderStyle: 'dashed',
    minHeight: 60,
  },
  addCardText: {
    color: '#6200ee',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCard: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  budgetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  spentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spentLabel: {
    color: '#aaa',
    fontSize: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Modal Styles
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
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
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