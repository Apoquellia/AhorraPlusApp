import { getDB } from './database';
import { Platform } from 'react-native';

const storageKey = 'users_local';

export async function getAll() {
  if (Platform.OS === 'web') {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } else {
    const db = await getDB();
    const result = await db.getAllAsync('SELECT * FROM users ORDER BY id DESC;');
    return result;
  }
}

export async function add(nombre, correo, username, password) {
  if (Platform.OS === 'web') {
    const usuarios = await getAll();
    const nuevoUsuario = {
      id: Date.now(),
      nombre,
      correo,
      username,
      password,
      fecha_creacion: new Date().toISOString(),
    };
    usuarios.unshift(nuevoUsuario);
    localStorage.setItem(storageKey, JSON.stringify(usuarios));
    return nuevoUsuario;
  } else {
    const db = await getDB();
    const result = await db.runAsync(
      'INSERT INTO users (nombre, correo, username, password) VALUES (?, ?, ?, ?);',
      [nombre, correo, username, password]
    );
    return {
      id: result.lastInsertRowId,
      nombre,
      correo,
      username,
      password,
      fecha_creacion: new Date().toISOString(),
    };
  }
}

export async function dlt(id) {
  if (Platform.OS === 'web') {
    const usuarios = await getAll();
    const nuevos = usuarios.filter(u => u.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(nuevos));
    return { rowsAffected: usuarios.length - nuevos.length };
  } else {
    const db = await getDB();
    const result = await db.runAsync('DELETE FROM users WHERE id = ?;', [id]);
    return { rowsAffected: result.changes };
  }
}

export async function update(id, nombre, correo, username, password) {
  if (Platform.OS === 'web') {
    const usuarios = await getAll();
    const nuevos = usuarios.map(u =>
      u.id === id ? { ...u, nombre, correo, username, password } : u
    );
    localStorage.setItem(storageKey, JSON.stringify(nuevos));
    return { rowsAffected: 1 };
  } else {
    const db = await getDB();
    const result = await db.runAsync(
      'UPDATE users SET nombre = ?, correo = ?, username = ?, password = ? WHERE id = ?;',
      [nombre, correo, username, password, id]
    );
    return { rowsAffected: result.changes };
  }
}

// Obtener total de ingresos y egresos agrupados por categoría
export async function getTotalsByCategory(monthKey = null) {
  if (Platform.OS === 'web') {
    // Para web, retornar datos simulados
    return [];
  }

  try {
    const db = await getDB();
    const query = monthKey
      ? `SELECT categoria, tipo,
               SUM(monto) AS total
        FROM transactions
        WHERE strftime('%Y-%m', fecha) = ?
        GROUP BY categoria, tipo;`
      : `SELECT categoria, tipo,
               SUM(monto) AS total
        FROM transactions
        GROUP BY categoria, tipo;`;

    const params = monthKey ? [monthKey] : [];
    const result = await db.getAllAsync(query, params);
    return result;
  } catch (error) {
    console.error('Error en getTotalsByCategory:', error);
    return [];
  }
}

// Obtener ingresos y gastos agrupados por mes
export async function getMonthlyTotals(monthKey = null) {
  if (Platform.OS === 'web') {
    return { ingresos: 0, gastos: 0 };
  }

  try {
    const db = await getDB();
    const query = monthKey
      ? `SELECT 
           SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) AS ingresos,
           SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END) AS gastos
         FROM transactions
         WHERE strftime('%Y-%m', fecha) = ?;`
      : `SELECT 
           SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) AS ingresos,
           SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END) AS gastos
         FROM transactions;`;

    const params = monthKey ? [monthKey] : [];
    const result = await db.getAllAsync(query, params);
    return result[0] || { ingresos: 0, gastos: 0 };
  } catch (error) {
    console.error('Error en getMonthlyTotals:', error);
    return { ingresos: 0, gastos: 0 };
  }
}

// Agregar una transacción
export async function addTransaction(monto, categoria, fecha, descripcion, tipo, user_id) {
  if (Platform.OS === 'web') {
    return {
      id: Date.now(),
      monto,
      categoria,
      fecha,
      descripcion,
      tipo,
      user_id,
    };
  }

  try {
    const db = await getDB();
    const fechaFinal = new Date(fecha).toISOString().split('T')[0];

    const result = await db.runAsync(
      `INSERT INTO transactions (monto, categoria, fecha, descripcion, tipo, user_id)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [monto, categoria, fechaFinal, descripcion, tipo, user_id]
    );

    return {
      id: result.lastInsertRowId,
      monto,
      categoria,
      fecha: fechaFinal,
      descripcion,
      tipo,
      user_id,
    };
  } catch (error) {
    console.error('Error en addTransaction:', error);
    throw error;
  }
}

// BUDGETS - Obtener todos los presupuestos de un usuario
export async function getBudgetsByUser(userId) {
  if (Platform.OS === 'web') {
    return [];
  }

  try {
    const db = await getDB();
    const result = await db.getAllAsync(
      'SELECT * FROM budgets WHERE user_id = ? ORDER BY fecha_creacion DESC;',
      [userId]
    );
    return result;
  } catch (error) {
    console.error('Error en getBudgetsByUser:', error);
    return [];
  }
}

// BUDGETS - Agregar un presupuesto
export async function addBudget(categoria, monto_limite, userId) {
  if (Platform.OS === 'web') {
    return {
      id: Date.now(),
      categoria,
      monto_limite,
      fecha_creacion: new Date().toISOString(),
      user_id: userId,
    };
  }

  try {
    const db = await getDB();
    const fecha_creacion = new Date().toISOString();

    const result = await db.runAsync(
      `INSERT INTO budgets (categoria, monto_limite, fecha_creacion, user_id)
       VALUES (?, ?, ?, ?);`,
      [categoria, monto_limite, fecha_creacion, userId]
    );

    return {
      id: result.lastInsertRowId,
      categoria,
      monto_limite,
      fecha_creacion,
      user_id: userId,
    };
  } catch (error) {
    console.error('Error en addBudget:', error);
    throw error;
  }
}

// BUDGETS - Actualizar un presupuesto
export async function updateBudget(id, categoria, monto_limite) {
  if (Platform.OS === 'web') {
    return { rowsAffected: 1 };
  }

  try {
    const db = await getDB();
    const result = await db.runAsync(
      'UPDATE budgets SET categoria = ?, monto_limite = ? WHERE id = ?;',
      [categoria, monto_limite, id]
    );
    return { rowsAffected: result.changes };
  } catch (error) {
    console.error('Error en updateBudget:', error);
    throw error;
  }
}

// BUDGETS - Eliminar un presupuesto
export async function deleteBudget(id) {
  if (Platform.OS === 'web') {
    return { rowsAffected: 1 };
  }

  try {
    const db = await getDB();
    const result = await db.runAsync('DELETE FROM budgets WHERE id = ?;', [id]);
    return { rowsAffected: result.changes };
  } catch (error) {
    console.error('Error en deleteBudget:', error);
    throw error;
  }
}

// TRANSACTIONS - Obtener todas las transacciones de un usuario
export async function getTransactionsByUser(userId) {
  if (Platform.OS === 'web') {
    return [];
  }

  try {
    const db = await getDB();
    const result = await db.getAllAsync(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY fecha DESC;',
      [userId]
    );
    return result;
  } catch (error) {
    console.error('Error en getTransactionsByUser:', error);
    return [];
  }
}

// TRANSACTIONS - Eliminar una transacción
export async function deleteTransaction(id) {
  if (Platform.OS === 'web') {
    return { rowsAffected: 1 };
  }

  try {
    const db = await getDB();
    const result = await db.runAsync('DELETE FROM transactions WHERE id = ?;', [id]);
    return { rowsAffected: result.changes };
  } catch (error) {
    console.error('Error en deleteTransaction:', error);
    throw error;
  }
}

// TRANSACTIONS - Actualizar una transacción
export async function updateTransaction(id, monto, categoria, fecha, descripcion, tipo) {
  if (Platform.OS === 'web') {
    return { rowsAffected: 1 };
  }

  try {
    const db = await getDB();
    const result = await db.runAsync(
      'UPDATE transactions SET monto = ?, categoria = ?, fecha = ?, descripcion = ?, tipo = ? WHERE id = ?;',
      [monto, categoria, fecha, descripcion, tipo, id]
    );
    return { rowsAffected: result.changes };
  } catch (error) {
    console.error('Error en updateTransaction:', error);
    throw error;
  }
}

// ============================================
// MÉTODOS SINCRONIZADOS (Transacciones + Presupuestos)
// ============================================

/**
 * Obtiene el gasto actual en una categoría específica
 * @param {number} userId - ID del usuario
 * @param {string} categoria - Categoría a revisar
 * @param {string} monthKey - Mes en formato "YYYY-MM" (opcional, default: mes actual)
 * @returns {number} Total gastado en esa categoría este mes
 */
export async function getSpentInCategory(userId, categoria, monthKey = null) {
  if (Platform.OS === 'web') {
    return 0;
  }

  try {
    const db = await getDB();
    const query = monthKey
      ? `SELECT SUM(monto) AS total FROM transactions 
         WHERE user_id = ? AND categoria = ? AND tipo = 'gasto' 
         AND strftime('%Y-%m', fecha) = ?;`
      : `SELECT SUM(monto) AS total FROM transactions 
         WHERE user_id = ? AND categoria = ? AND tipo = 'gasto';`;

    const params = monthKey ? [userId, categoria, monthKey] : [userId, categoria];
    const result = await db.getAllAsync(query, params);
    return (result[0]?.total || 0);
  } catch (error) {
    console.error('Error en getSpentInCategory:', error);
    return 0;
  }
}

/**
 * Obtiene el presupuesto de una categoría
 * @param {number} userId - ID del usuario
 * @param {string} categoria - Categoría a revisar
 * @returns {number|null} Monto límite del presupuesto, o null si no existe
 */
export async function getBudgetLimit(userId, categoria) {
  if (Platform.OS === 'web') {
    return null;
  }

  try {
    const db = await getDB();
    const result = await db.getAllAsync(
      'SELECT monto_limite FROM budgets WHERE user_id = ? AND categoria = ? LIMIT 1;',
      [userId, categoria]
    );
    return result[0]?.monto_limite || null;
  } catch (error) {
    console.error('Error en getBudgetLimit:', error);
    return null;
  }
}

/**
 * Obtiene el estado detallado de presupuestos vs gastos para un usuario
 * @param {number} userId - ID del usuario
 * @param {string} monthKey - Mes en formato "YYYY-MM" (opcional)
 * @returns {Array} Array con { categoria, limite, gastado, disponible, estado, porcentaje }
 */
export async function getBudgetStatusByUser(userId, monthKey = null) {
  if (Platform.OS === 'web') {
    return [];
  }

  try {
    const db = await getDB();

    // Obtener todos los presupuestos del usuario
    const budgets = await db.getAllAsync(
      'SELECT id, categoria, monto_limite FROM budgets WHERE user_id = ?;',
      [userId]
    );

    // Para cada presupuesto, obtener el gasto actual
    const statusArray = await Promise.all(
      budgets.map(async (budget) => {
        const gastado = await getSpentInCategory(userId, budget.categoria, monthKey);
        const disponible = budget.monto_limite - gastado;
        const porcentaje = (gastado / budget.monto_limite) * 100;

        let estado = 'SEGURO';
        if (porcentaje >= 100) estado = 'EXCEDIDO';
        else if (porcentaje >= 80) estado = 'ALERTA';
        else if (porcentaje >= 50) estado = 'PRECAUCION';

        return {
          id: budget.id,
          categoria: budget.categoria,
          monto_limite: budget.monto_limite,
          totalGastado: parseFloat(gastado.toFixed(2)),
          disponible: parseFloat(disponible.toFixed(2)),
          estado,
          porcentaje: parseFloat(porcentaje.toFixed(2)),
        };
      })
    );

    return statusArray;
  } catch (error) {
    console.error('Error en getBudgetStatusByUser:', error);
    return [];
  }
}

export const queries = {
  getAll,
  add,
  dlt,
  update,
  getTotalsByCategory,
  getMonthlyTotals,
  addTransaction,
  getBudgetsByUser,
  addBudget,
  updateBudget,
  deleteBudget,
  getTransactionsByUser,
  deleteTransaction,
  updateTransaction,
  // SINCRONIZACIÓN
  getSpentInCategory,
  getBudgetLimit,
  getBudgetStatusByUser,
  // NOTIFICACIONES
  addNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
};

// ============================================
// NOTIFICACIONES
// ============================================

// Crear tabla de notificaciones si no existe (esto debería ir en un init, pero lo simulamos aquí o asumimos que se corre)
// Nota: En un entorno real, deberíamos tener una función de migración o initDB.
// Vamos a intentar crearla en la primera llamada de escritura si es posible, o confiar en que el usuario reinicie la app si tiene un init central.
// Por ahora, agregaremos un método initNotificationsTable que se podría llamar al inicio.

export async function initNotificationsTable() {
  if (Platform.OS === 'web') return;
  try {
    const db = await getDB();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL, -- 'warning', 'danger', 'info', 'success'
        related_category TEXT,
        is_read INTEGER DEFAULT 0, -- 0: false, 1: true
        fecha_creacion TEXT NOT NULL
      );
    `);
  } catch (error) {
    console.error('Error initNotificationsTable:', error);
  }
}

// Llamamos a esto de forma "lazy" o esperamos que se llame en App.js. 
// Para asegurar que funcione sin tocar App.js, lo llamaremos antes de insertar.

export async function addNotification(userId, title, message, type = 'info', relatedCategory = null) {
  if (Platform.OS === 'web') {
    // Simulación web
    return { id: Date.now(), userId, title, message, type, relatedCategory, is_read: 0, fecha_creacion: new Date().toISOString() };
  }

  try {
    await initNotificationsTable(); // Asegurar tabla
    const db = await getDB();
    const fecha = new Date().toISOString();

    const result = await db.runAsync(
      `INSERT INTO notifications (user_id, title, message, type, related_category, is_read, fecha_creacion)
       VALUES (?, ?, ?, ?, ?, 0, ?);`,
      [userId, title, message, type, relatedCategory, fecha]
    );

    return {
      id: result.lastInsertRowId,
      userId,
      title,
      message,
      type,
      relatedCategory,
      is_read: 0,
      fecha_creacion: fecha
    };
  } catch (error) {
    console.error('Error addNotification:', error);
    return null;
  }
}

export async function getNotifications(userId) {
  if (Platform.OS === 'web') return [];

  try {
    await initNotificationsTable();
    const db = await getDB();
    // Ordenar por fecha descendente
    const result = await db.getAllAsync(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY fecha_creacion DESC;',
      [userId]
    );
    // Convertir is_read 1/0 a boolean
    return result.map(n => ({ ...n, is_read: n.is_read === 1 }));
  } catch (error) {
    console.error('Error getNotifications:', error);
    return [];
  }
}

export async function markNotificationAsRead(id) {
  if (Platform.OS === 'web') return { rowsAffected: 1 };

  try {
    const db = await getDB();
    const result = await db.runAsync(
      'UPDATE notifications SET is_read = 1 WHERE id = ?;',
      [id]
    );
    return { rowsAffected: result.changes };
  } catch (error) {
    console.error('Error markNotificationAsRead:', error);
    return { rowsAffected: 0 };
  }
}

export async function deleteNotification(id) {
  if (Platform.OS === 'web') return { rowsAffected: 1 };

  try {
    const db = await getDB();
    const result = await db.runAsync(
      'DELETE FROM notifications WHERE id = ?;',
      [id]
    );
    return { rowsAffected: result.changes };
  } catch (error) {
    console.error('Error deleteNotification:', error);
    return { rowsAffected: 0 };
  }
}


