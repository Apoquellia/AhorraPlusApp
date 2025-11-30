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
export const queries = { getAll, add, dlt, update };