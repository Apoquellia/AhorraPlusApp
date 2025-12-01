import * as SQLite from 'expo-sqlite';

let dbInstance = null;

// Abrir la base de datos (Singleton)
export const getDB = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await SQLite.openDatabaseAsync('AhorraPlusApp.db');
    return dbInstance;
  } catch (error) {
    console.error("Error opening database:", error);
    throw error;
  }
};

// Inicializar tablas
export const initDB = async () => {
  try {
    const db = await getDB();
    await db.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY NOT NULL,
        nombre TEXT NOT NULL,
        correo TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY NOT NULL,
        monto REAL NOT NULL,
        categoria TEXT NOT NULL,
        fecha TEXT NOT NULL,
        descripcion TEXT,
        tipo TEXT NOT NULL,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );

      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY NOT NULL,
        categoria TEXT NOT NULL,
        monto_limite REAL NOT NULL,
        fecha_creacion TEXT NOT NULL,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database tables:", error);
  }
};
