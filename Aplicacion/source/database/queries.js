import { getDB } from './database';
import { Platform } from 'react-native';

const storageKey = 'users_local';

// Obtener todos los usuarios
export async function getAll() {
  if (Platform.OS === 'web') {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } else {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM users ORDER BY id DESC;',
          [],
          (_, result) => resolve(result.rows._array),
          (_, error) => reject(error)
        );
      });
    });
  }
}

// Agregar un nuevo usuario
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
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO users (nombre, correo, username, password) VALUES (?, ?, ?, ?);',
          [nombre, correo, username, password],
          (_, result) =>
            resolve({
              id: result.insertId,
              nombre,
              correo,
              username,
              password,
              fecha_creacion: new Date().toISOString(),
            }),
          (_, error) => reject(error)
        );
      });
    });
  }
}

// Eliminar usuario
export async function dlt(id) {
  if (Platform.OS === 'web') {
    const usuarios = await getAll();
    const nuevos = usuarios.filter(u => u.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(nuevos));
    return { rowsAffected: usuarios.length - nuevos.length };
  } else {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM users WHERE id = ?;',
          [id],
          (_, result) => resolve({ rowsAffected: result.rowsAffected }),
          (_, error) => reject(error)
        );
      });
    });
  }
}

// Actualizar usuario
export async function update(id, nombre, correo, username) {
  if (Platform.OS === 'web') {
    const usuarios = await getAll();
    const nuevos = usuarios.map(u =>
      u.id === id ? { ...u, nombre, correo, username } : u
    );
    localStorage.setItem(storageKey, JSON.stringify(nuevos));
    return { rowsAffected: 1 };
  } else {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE users SET nombre = ?, correo = ?, username = ? WHERE id = ?;',
          [nombre, correo, username, id],
          (_, result) => resolve({ rowsAffected: result.rowsAffected }),
          (_, error) => reject(error)
        );
      });
    });
  }
}

// Exportar todas las queries
export const queries = { getAll, add, dlt, update };
    