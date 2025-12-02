import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import NotificationController from '../controllers/NotificationController';
import { useAuth } from '../context/AuthContext';

export default function NotificacionesScreen({ navigation }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    if (user) {
      const data = await NotificationController.getNotifications(user.id);
      setNotifications(data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [user])
  );

  const handleMarkAsRead = async (id) => {
    await NotificationController.markAsRead(id);
    loadNotifications();
  };

  const handleDelete = async (id) => {
    await NotificationController.deleteNotification(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await NotificationController.markAllAsRead(notifications);
    loadNotifications();
  };

  const getIconName = (type) => {
    switch (type) {
      case 'danger': return 'warning-outline';
      case 'warning': return 'alert-circle-outline';
      case 'success': return 'checkmark-circle-outline';
      default: return 'information-circle-outline';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'danger': return '#FF4444';
      case 'warning': return '#FFC107';
      case 'success': return '#4CAF50';
      default: return '#2196F3';
    }
  };

  return (
    // 2. CAMBIO PRINCIPAL: Usamos SafeAreaView en lugar de View
    // edges={['top']} asegura que solo proteja la parte de arriba (notch)
    // El backgroundColor aquí asegura que el notch se vea del mismo color que tu app
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notificaciones</Text>
        <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllButton}>
          <Ionicons name="checkmark-done-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>No tienes notificaciones</Text>
          </View>
        ) : (
          notifications.map((item) => (
            <View key={item.id} style={[styles.notificationCard, !item.is_read && styles.unreadCard]}>
              <Ionicons name={getIconName(item.type)} size={28} color={getIconColor(item.type)} />
              <View style={{ flex: 1 }}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationSubtitle}>{item.message}</Text>
                <Text style={styles.dateText}>{new Date(item.fecha_creacion).toLocaleDateString()} {new Date(item.fecha_creacion).toLocaleTimeString()}</Text>
              </View>
              <View style={{ alignItems: 'center', gap: 10 }}>
                {!item.is_read && (
                  <TouchableOpacity onPress={() => handleMarkAsRead(item.id)}>
                    <View style={styles.notificationDot} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    // Opcional: Si sientes que el header quedó muy pegado a los iconos del sistema,
    // puedes añadir un paddingTop pequeño aquí, pero el SafeAreaView suele ser suficiente.
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 4,
  },
  markAllButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
    backgroundColor: '#383838'
  },
  notificationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationSubtitle: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  dateText: {
    color: '#888',
    fontSize: 12,
    marginTop: 6,
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6200ee',
  },
  deleteButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 50,
    gap: 10,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    fontStyle: 'italic',
  },
});