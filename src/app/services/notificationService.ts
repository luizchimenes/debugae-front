import { GetUserNotificationsResponse } from "../components/atoms/NotificationComponent";
import api from "../config/axiosConfig";

export const NotificationService = {
  getCurrentUserNotificationsAsync: async (): Promise<GetUserNotificationsResponse> => {
    const response = await api.get('/notifications/getCurrentNotifications');

    return response.data;
  },

  markAsReadAsync: async (notificationId: string): Promise<void> => {
    await api.post('/notifications/markAsRead', { notificationId });
  }
}