import { getDB } from './database';

export async function getAll(userId) {
  const db = await getDB();
  const result = await db.getAllAsync('SELECT * FROM transactions WHERE user_id = ? ORDER BY fecha DESC;', [userId]);
  return result;
}

export async function add(monto, categoria, fecha, descripcion, tipo, userId) {
  const db = await getDB();
  const result = await db.runAsync(
    'INSERT INTO transactions (monto, categoria, fecha, descripcion, tipo, user_id) VALUES (?, ?, ?, ?, ?, ?);',
    [monto, categoria, fecha, descripcion, tipo, userId]
  );
  return {
    id: result.lastInsertRowId,
    monto,
    categoria,
    fecha,
    descripcion,
    tipo,
    user_id: userId,
  };
}

export async function update(id, monto, categoria, fecha, descripcion, tipo) {
  const db = await getDB();
  const result = await db.runAsync(
    'UPDATE transactions SET monto = ?, categoria = ?, fecha = ?, descripcion = ?, tipo = ? WHERE id = ?;',
    [monto, categoria, fecha, descripcion, tipo, id]
  );
  return { rowsAffected: result.changes };
}

export async function dlt(id) {
  const db = await getDB();
  const result = await db.runAsync('DELETE FROM transactions WHERE id = ?;', [id]);
  return { rowsAffected: result.changes };
} 