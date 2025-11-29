/**
 * Modelo Budget
 * Representa un límite de gasto (presupuesto) para una categoría
 * 
 * Tabla en BD: budgets (id, categoria, monto_limite, fecha_creacion, user_id)
 */

export class Budget {
  constructor(categoria, monto_limite, user_id, id = null, fecha_creacion = null) {
    this.id = id;
    this.categoria = categoria;                        // Ej: "Comida", "Entretenimiento"
    this.monto_limite = parseFloat(monto_limite);     // Máximo a gastar en el mes
    this.fecha_creacion = fecha_creacion || new Date().toISOString();
    this.user_id = user_id;                           // ID del usuario propietario
  }

  /**
   * Valida que los datos del presupuesto sean correctos
   * @returns {boolean} true si es válido
   * @throws {Error} si hay algún error
   */
  validate() {
    // Validar categoría
    if (!this.categoria || this.categoria.trim() === '') {
      throw new Error('La categoría es requerida');
    }

    // Validar monto límite
    if (!this.monto_limite || this.monto_limite <= 0) {
      throw new Error('El monto límite debe ser mayor a 0');
    }

    // Validar user_id
    if (!this.user_id) {
      throw new Error('El ID de usuario es requerido');
    }

    return true;
  }

  /**
   * Calcula qué porcentaje del presupuesto se ha usado
   * @param {number} montoGastado - Cuánto se ha gastado en esta categoría
   * @returns {number} Porcentaje 0-100+
   */
  calcularPorcentaje(montoGastado) {
    return (montoGastado / this.monto_limite) * 100;
  }

  /**
   * Verifica si se ha excedido el presupuesto
   * @param {number} montoGastado - Cuánto se ha gastado en esta categoría
   * @returns {boolean} true si gastado > límite
   */
  estaExcedido(montoGastado) {
    return montoGastado > this.monto_limite;
  }

  /**
   * Calcula cuánto dinero queda disponible (o cuánto se excedió)
   * @param {number} montoGastado - Cuánto se ha gastado en esta categoría
   * @returns {number} Positivo = dinero disponible, Negativo = exceso
   */
  calcularDisponible(montoGastado) {
    return this.monto_limite - montoGastado;
  }

  /**
   * Obtiene el estado del presupuesto según el gasto
   * @param {number} montoGastado - Cuánto se ha gastado en esta categoría
   * @returns {string} "SEGURO" | "PRECAUCION" | "ALERTA" | "EXCEDIDO"
   */
  getEstado(montoGastado) {
    const porcentaje = this.calcularPorcentaje(montoGastado);

    if (porcentaje < 50) return 'SEGURO';        // 0-49%
    if (porcentaje < 80) return 'PRECAUCION';    // 50-79%
    if (porcentaje < 100) return 'ALERTA';       // 80-99%
    return 'EXCEDIDO';                           // 100%+
  }

  /**
   * Retorna el color según el estado del presupuesto
   * @param {number} montoGastado - Cuánto se ha gastado en esta categoría
   * @returns {string} Color en hex
   */
  getColor(montoGastado) {
    const estado = this.getEstado(montoGastado);

    const colores = {
      SEGURO: '#4CAF50',      // Verde
      PRECAUCION: '#FFC107',  // Amarillo
      ALERTA: '#FF9800',      // Naranja
      EXCEDIDO: '#F44336',    // Rojo
    };

    return colores[estado] || '#4CAF50';
  }

  /**
   * Formatea el monto límite con símbolo de dólar
   * @returns {string} Ej: "$1,500.00"
   */
  getMontoFormateado() {
    return `$${this.monto_limite.toFixed(2)}`;
  }

  /**
   * Convierte el presupuesto a string
   */
  toString() {
    return `Presupuesto ${this.categoria}: límite ${this.getMontoFormateado()}`;
  }
}
