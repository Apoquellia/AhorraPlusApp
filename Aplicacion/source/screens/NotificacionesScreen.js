import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NotificacionesScreen({ navigation }) {
    const sendEmailNotification = (title, subtitle) => {
      Alert.alert(
        'Correo electrónico enviado',
        `Se ha enviado una notificación a su correo electrónico:\n${title}\n${subtitle}`
      );
    };

    const handleSimulateTransfer = () => {
      const newNotification = {
        id: Date.now().toString(),
        icon: 'cash-outline',
        color: '#4CAF50',
        title: 'Transferencia recibida',
        subtitle: 'Ha recibido una transferencia de $2,500.00 en su cuenta.',
        read: false
      };
      setNotifications([newNotification, ...notifications]);
      sendEmailNotification(newNotification.title, newNotification.subtitle);
    };

    const handleExceedBudget = () => {
      const newNotification = {
        id: Date.now().toString(),
        icon: 'warning-outline',
        color: '#FFD700',
        title: 'Presupuesto excedido',
        subtitle: 'Ha excedido el límite de su presupuesto en la categoría Vivienda.',
        read: false
      };
      setNotifications([newNotification, ...notifications]);
      sendEmailNotification(newNotification.title, newNotification.subtitle);
    };
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      icon: 'warning-outline',
      color: '#FFD700',
      title: 'Presupuesto de Vivienda al 91.6%',
      subtitle: 'Has gastado $1100.00 de $1200.00',
      read: false
    },
    {
      id: '2',
      icon: 'checkmark-circle-outline',
      color: '#4CAF50',
      title: 'Pago de Transporte Registrado',
      subtitle: 'Se registró un gasto de $50.00 en Transporte.',
      read: false
    },
    {
      id: '3',
      icon: 'fast-food-outline',
      color: '#aaa',
      title: 'Resumen de Comida',
      subtitle: 'Tu gasto en comida está al 50%.',
      read: true
    },
    {
      id: '4',
      icon: 'information-circle-outline',
      color: '#aaa',
      title: 'Bienvenido a tu App de Presupuesto',
      subtitle: 'Comienza añadiendo tus categorías.',
      read: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    Alert.alert('Notificaciones', 'Todas las notificaciones han sido marcadas como leídas.');
  };

  const handleNotificationPress = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDeleteNotification = (id) => {
    Alert.alert(
      'Eliminar notificación',
      '¿Está seguro que desea eliminar esta notificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => setNotifications(notifications.filter(n => n.id !== id)) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Notificaciones</Text>

        <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
          <Ionicons name="checkmark-done-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.simulationRow}>
        <TouchableOpacity style={styles.simButton} onPress={handleSimulateTransfer}>
          <Ionicons name="cash-outline" size={20} color="#4CAF50" />
          <Text style={styles.simButtonText}>Simular transferencia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.simButton} onPress={handleExceedBudget}>
          <Ionicons name="warning-outline" size={20} color="#FFD700" />
          <Text style={styles.simButtonText}>Exceder presupuesto</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes notificaciones.</Text>
          </View>
        ) : (
          notifications.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.notificationCard, n.read && styles.notificationRead]}
              activeOpacity={0.8}
              onPress={() => handleNotificationPress(n.id)}
            >
              <Ionicons name={n.icon} size={32} color={n.color} style={styles.notificationIcon} />
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{n.title}</Text>
                <Text style={styles.notificationSubtitle}>{n.subtitle}</Text>
              </View>
              {!n.read && <View style={styles.notificationDot} />}
              <TouchableOpacity onPress={() => handleDeleteNotification(n.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
      simulationRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        marginVertical: 10,
      },
      simButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#222',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#444',
      },
      simButtonText: {
        color: '#fff',
        fontSize: 15,
        marginLeft: 8,
        fontWeight: 'bold',
      },
    markAllButton: {
      padding: 4,
      marginLeft: 8,
    },
    deleteButton: {
      marginLeft: 10,
      padding: 4,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    emptyText: {
      color: '#aaa',
      fontSize: 16,
      fontStyle: 'italic',
    },
  container: { 
    flex: 1, 
    backgroundColor: '#121212' 
  },
  header: { 
    backgroundColor: '#6200ee', 
    padding: 16, 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  headerText: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold',
  },
  backButton: {
    padding: 4, 
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingVertical: 10, 
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationRead: {
    opacity: 0.6,
  },
  notificationIcon: {
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationSubtitle: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 2,
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6200ee',
    marginLeft: 10,
  },
});