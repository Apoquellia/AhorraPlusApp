import * as SQLite from 'expo-sqlite';

// 1. Abrir (o crear) la base de datos
const db = SQLite.openDatabase('AhorraPlusApp.db');

// 2. Función para inicializar las tablas
export const initDB = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      
      // --- TABLA USUARIOS (Para cumplir con Autenticación ) ---
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY NOT NULL,
          nombre TEXT NOT NULL,
          correo TEXT NOT NULL UNIQUE,
          username TEXT NOT NULL,
          password TEXT NOT NULL
        );`,
        [],
        () => {}, // Éxito parcial
        (_, err) => reject(err) // Error
      );

      // --- TABLA TRANSACCIONES (Para cumplir con Transacciones ) ---
      // Incluye: monto, categoría, fecha, descripción y tipo (ingreso/gasto)
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY NOT NULL,
          monto REAL NOT NULL,
          categoria TEXT NOT NULL,
          fecha TEXT NOT NULL,
          descripcion TEXT,
          tipo TEXT NOT NULL, -- 'ingreso' o 'gasto'
          user_id INTEGER, -- Para relacionarlo con el usuario (opcional por ahora)
          FOREIGN KEY (user_id) REFERENCES users (id)
        );`,
        [],
        () => {},
        (_, err) => reject(err)
      );

      // --- TABLA PRESUPUESTOS (Para cumplir con Presupuestos ) ---
      // Incluye: monto límite y categoría
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS budgets (
          id INTEGER PRIMARY KEY NOT NULL,
          categoria TEXT NOT NULL,
          monto_limite REAL NOT NULL,
          fecha_creacion TEXT NOT NULL,
          user_id INTEGER,
          FOREIGN KEY (user_id) REFERENCES users (id)
        );`,
        [],
        () => resolve(), // ¡Éxito total! La DB está lista.
        (_, err) => reject(err)
      );
    });
  });

  return promise;
};

// Exportamos la conexión para usarla en los Modelos
export default db;