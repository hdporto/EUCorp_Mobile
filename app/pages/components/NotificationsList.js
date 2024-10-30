// NotificationsList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchNotifications, markNotificationAsRead } from '../../../supabaseClient';
import { useUser } from '@supabase/auth-helpers-react';
import useNotifications from '../../../useNotifications';
import NotificationService from '../../../NotificationService';

const NotificationsList = () => {
  const user = useUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications(user.id);
      setNotifications(data);
    };

    loadNotifications();
    NotificationService.registerForPushNotificationsAsync();
  }, [user]);

  useNotifications(user.id, setNotifications);

  const handleNotificationPress = async (notification) => {
    await markNotificationAsRead(notification.id);
  };

  // const scheduleNotificationEveryTenSeconds = () => {
  //   const interval = setInterval(async () => {
  //     const message = `Notification sent at ${new Date().toLocaleTimeString()}`;
  //     await NotificationService.schedulePushNotification(message);
  //   }, 10000); // 10 seconds

  //   return () => clearInterval(interval);
  // };

  // useEffect(() => {
  //   const intervalId = scheduleNotificationEveryTenSeconds();
  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleNotificationPress(item)}
            style={[
              styles.notificationCard,
              item.is_read ? styles.readNotification : styles.unreadNotification,
            ]}
          >
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  notificationCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#e0f7fa',
  },
  readNotification: {
    backgroundColor: '#fafafa',
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
});

export default NotificationsList;
