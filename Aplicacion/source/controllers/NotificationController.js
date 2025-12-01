import * as Queries from '../database/queries';

class NotificationController {
    /**
     * Obtener todas las notificaciones de un usuario
     * @param {number} userId 
     * @returns {Promise<Array>} Lista de notificaciones
     */
    async getNotifications(userId) {
        try {
            const notifications = await Queries.getNotifications(userId);
            return notifications;
        } catch (error) {
            console.error('Error en NotificationController.getNotifications:', error);
            return [];
        }
    }

    /**
     * Marcar una notificación como leída
     * @param {number} id - ID de la notificación
     * @returns {Promise<boolean>} true si fue exitoso
     */
    async markAsRead(id) {
        try {
            const result = await Queries.markNotificationAsRead(id);
            return result.rowsAffected > 0;
        } catch (error) {
            console.error('Error en NotificationController.markAsRead:', error);
            return false;
        }
    }

    /**
     * Eliminar una notificación
     * @param {number} id - ID de la notificación
     * @returns {Promise<boolean>} true si fue exitoso
     */
    async deleteNotification(id) {
        try {
            const result = await Queries.deleteNotification(id);
            return result.rowsAffected > 0;
        } catch (error) {
            console.error('Error en NotificationController.deleteNotification:', error);
            return false;
        }
    }

    /**
     * Marcar todas las notificaciones como leídas
     * @param {Array} notifications - Lista actual de notificaciones
     * @returns {Promise<void>}
     */
    async markAllAsRead(notifications) {
        try {
            // Idealmente esto sería una sola query, pero iteramos por ahora
            // para mantener consistencia con la implementación actual de queries
            const unread = notifications.filter(n => !n.is_read);
            await Promise.all(unread.map(n => Queries.markNotificationAsRead(n.id)));
        } catch (error) {
            console.error('Error en NotificationController.markAllAsRead:', error);
        }
    }
}

export default new NotificationController();
