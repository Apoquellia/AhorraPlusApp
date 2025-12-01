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

// -------------------------
// TRANSACCIONES
// -------------------------

export async function getTotalsByCategory() {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT categoria,
               SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) AS total_ingresos,
               SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END) AS total_gastos
        FROM transactions
        GROUP BY categoria;
        `,
        [],
        (_, result) => resolve(result.rows._array),
        (_, error) => reject(error)
      );
    });
  });
}

export async function getMonthlyTotals() {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT 
          strftime('%Y-%m', fecha) AS mes,
          SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) AS total_ingresos,
          SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END) AS total_gastos
        FROM transactions
        GROUP BY mes
        ORDER BY mes DESC;
        `,
        [],
        (_, result) => resolve(result.rows._array),
        (_, error) => reject(error)
      );
    });
  });
}

export async function addTransaction(monto, categoria, fecha, descripcion, tipo, user_id) {
  const db = await getDB();

  const fechaFinal = new Date(fecha).toISOString().split('T')[0];

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO transactions (monto, categoria, fecha, descripcion, tipo, user_id)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [monto, categoria, fechaFinal, descripcion, tipo, user_id],
        (_, result) =>
          resolve({
            id: result.insertId,
            monto,
            categoria,
            fecha: fechaFinal,
            descripcion,
            tipo,
            user_id
          }),
        (_, error) => reject(error)
      );
    });
  });
}

export const queries = { 
  getAll, 
  add, 
  dlt, 
  update,
  getTotalsByCategory,
  getMonthlyTotals,
  addTransaction
};
