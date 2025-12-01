/**
 * Modelo Transaction
 * Representa una transacción financiera (ingreso o gasto)
 * 
 * Tabla en BD: transactions (id, monto, categoria, fecha, descripcion, tipo, user_id)
 */

export class Transaction {
  constructor(monto, categoria, fecha, descripcion, tipo, user_id, id = null) {
    this.id = id;
    this.monto = parseFloat(monto);           // Convertir a número
    this.categoria = categoria;                // Ej: "Comida", "Transporte", "Salario"
    this.fecha = fecha;                        // Formato ISO: "2025-11-29"
    this.descripcion = descripcion;            // Ej: "Compra en mercado"
    this.tipo = tipo;                          // "ingreso" o "gasto"
    this.user_id = user_id;                    // ID del usuario propietario
  }

  /**
   * Valida que los datos de la transacción sean correctos
   * @returns {boolean} true si es válido
   * @throws {Error} si hay algún error
   */
  validate() {
    // Validar monto
    if (!this.monto || this.monto <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }

    // Validar categoría
    if (!this.categoria || this.categoria.trim() === '') {
      throw new Error('La categoría es requerida');
    }

    // Validar fecha
    if (!this.fecha) {
      throw new Error('La fecha es requerida');
    }

    // Validar tipo (solo "ingreso" o "gasto")
    if (this.tipo !== 'ingreso' && this.tipo !== 'gasto') {
      throw new Error('El tipo debe ser "ingreso" o "gasto"');
    }

    // Validar user_id
    if (!this.user_id) {
      throw new Error('El ID de usuario es requerido');
    }

    return true;
  }

  /**
   * Retorna el símbolo según el tipo (+/-)
   * @returns {string} "+" para ingreso, "-" para gasto
   */
  getSigno() {
    return this.tipo === 'ingreso' ? '+' : '-';
  }

  /**
   * Retorna el color según el tipo
   * @returns {string} Color en hex
   */
  getColor() {
    return this.tipo === 'ingreso' ? '#4CAF50' : '#FF6B6B';
  }

  /**
   * Formatea el monto con signo y decimales
   * @returns {string} Ej: "+$100.00" o "-$50.50"
   */
  getMontoFormateado() {
    return `${this.getSigno()}$${this.monto.toFixed(2)}`;
  }

  /**
   * Obtiene solo el año y mes de la fecha
   * @returns {string} Formato "2025-11"
   */
  getMesAno() {
    const fecha = new Date(this.fecha);
    const ano = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    return `${ano}-${mes}`;
  }

  /**
   * Formatea la fecha para mostrar
   * @returns {string} Ej: "29 de noviembre"
   */
  getFechaFormateada() {
    const fecha = new Date(this.fecha);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
  }

  /**
   * Convierte la transacción a string
   */
  toString() {
    return `${this.categoria}: ${this.getMontoFormateado()} en ${this.getFechaFormateada()}`;
  }
}
