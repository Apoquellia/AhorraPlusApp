import * as Queries from '../database/queries';
import { Transaction } from '../models/Transaction';
import { formatCategory } from '../utils/formatters';

class TransactionController {
  /**
   * Crear una nueva transacción (ingreso o gasto)
   * VALIDA CONTRA PRESUPUESTOS - Rechaza si se excedería
   * 
   * @param {Object} transactionData - Datos de la transacción
   * 
   * @returns {Object} { success: boolean, data?: Transaction, error?: string, message: string }
   */
  async crearTransaccion(transactionData) {
    try {
      const { monto, categoria, fecha, descripcion, tipo, userId } = transactionData;

      // Normalizar categoría
      const normalizedCategory = formatCategory(categoria);

      // Crear instancia y validar modelo
      const transaction = new Transaction(monto, normalizedCategory, fecha, descripcion, tipo, userId);
      transaction.validate();

      // 1. ELIMINADO BLOQUEO ESTRICTO
      // La validación de presupuesto ahora es solo informativa/notificación post-guardado

      // 2. Crear transacción
      const result = await Queries.addTransaction(
        monto,
        normalizedCategory,
        fecha,
        descripcion,
        tipo,
        userId
      );

      // 3. Verificar triggers de presupuesto (Notificaciones)
      if (tipo === 'gasto') {
        await this.checkBudgetAndNotify(userId, normalizedCategory, fecha, result.id);
      }

      return {
        success: true,
        data: result,
        message: 'Transacción creada exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al crear transacción',
      };
    }
  }

  /**
   * Obtener transacciones con filtros
   * 
   * @param {number} userId - ID del usuario
   * @param {Object} filters - Filtros opcionales
   * 
   * @returns {Object} { success: boolean, data?: Array, error?: string }
   */
  async obtenerTransacciones(userId, filters = {}) {
    try {
      // Obtener todas las transacciones del usuario
      const allTransactions = await Queries.getTransactionsByUser(userId);

      // Aplicar filtros en memoria
      let filtered = allTransactions;

      if (filters.categoria) {
        filtered = filtered.filter(t => t.categoria.toLowerCase().includes(filters.categoria.toLowerCase()));
      }

      if (filters.fechaInicio) {
        filtered = filtered.filter(t => t.fecha >= filters.fechaInicio);
      }

      if (filters.fechaFin) {
        filtered = filtered.filter(t => t.fecha <= filters.fechaFin);
      }

      if (filters.limit) {
        filtered = filtered.slice(0, filters.limit);
      }

      return {
        success: true,
        data: filtered,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Actualizar una transacción existente
   * VALIDA CONTRA PRESUPUESTOS - Rechaza si se excedería
   * 
   * @param {number} id - ID de la transacción
   * @param {Object} transactionData - Nuevos datos
   * 
   * @returns {Object} { success: boolean, error?: string, message: string }
   */
  async actualizarTransaccion(id, transactionData) {
    try {
      const { monto, categoria, fecha, descripcion, tipo, userId } = transactionData;

      // Normalizar categoría
      const normalizedCategory = formatCategory(categoria);

      // Validar antes de actualizar
      const transaction = new Transaction(monto, normalizedCategory, fecha, descripcion, tipo, userId, id);
      transaction.validate();

      // 1. ELIMINADO BLOQUEO ESTRICTO
      // La validación de presupuesto ahora es solo informativa/notificación post-guardado

      // 2. Actualizar
      const result = await Queries.updateTransaction(
        id,
        monto,
        normalizedCategory,
        fecha,
        descripcion,
        tipo
      );

      if (result.rowsAffected > 0) {
        // 3. Verificar triggers de presupuesto (Notificaciones)
        if (tipo === 'gasto') {
          await this.checkBudgetAndNotify(userId, normalizedCategory, fecha, id);
        }

        return {
          success: true,
          message: 'Transacción actualizada exitosamente',
        };
      } else {
        return {
          success: false,
          message: 'No se encontró la transacción para actualizar',
        };
      }

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al actualizar transacción',
      };
    }
  }

  /**
   * Eliminar una transacción
   * 
   * @param {number} id - ID de la transacción
   * 
   * @returns {Object} { success: boolean, error?: string, message: string }
   */
  async eliminarTransaccion(id) {
    try {
      const result = await Queries.deleteTransaction(id);

      if (result.rowsAffected > 0) {
        return {
          success: true,
          message: 'Transacción eliminada exitosamente',
        };
      } else {
        throw new Error('No se pudo eliminar la transacción');
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al eliminar transacción',
      };
    }
  }

  /**
   * Obtener resumen mensual de ingresos y gastos
   * 
   * @param {number} userId - ID del usuario
   * @param {string} monthKey - Mes 'YYYY-MM' (opcional)
   * 
   * @returns {Object} { success: boolean, data?: { ingresos: number, gastos: number }, error?: string }
   */
  async obtenerResumenMensual(userId, monthKey = null) {
    try {
      const allTransactions = await Queries.getTransactionsByUser(userId);

      let filtered = allTransactions;
      if (monthKey) {
        filtered = filtered.filter(t => t.fecha.startsWith(monthKey));
      } else {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        filtered = filtered.filter(t => t.fecha.startsWith(currentMonth));
      }

      const ingresos = filtered
        .filter(t => t.tipo === 'ingreso')
        .reduce((sum, t) => sum + t.monto, 0);

      const gastos = filtered
        .filter(t => t.tipo === 'gasto')
        .reduce((sum, t) => sum + t.monto, 0);

      return {
        success: true,
        data: {
          ingresos,
          gastos,
          balance: ingresos - gastos
        }
      };

    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener resumen mensual',
      };
    }
  }

  /**
   * Verifica el estado del presupuesto y genera notificaciones si es necesario
   */
  async checkBudgetAndNotify(userId, categoria, fecha, transactionId) {
    try {
      const monthKey = new Date(fecha).toISOString().split('T')[0].substring(0, 7);
      const budgetLimit = await Queries.getBudgetLimit(userId, categoria);

      if (budgetLimit === null) return; // No hay presupuesto para esta categoría

      const currentSpent = await Queries.getSpentInCategory(userId, categoria, monthKey);
      const percentage = (currentSpent / budgetLimit) * 100;

      // Lógica de Alertas
      // Caso B: Peligro (> 100%)
      if (percentage >= 100) {
        const exceededAmount = currentSpent - budgetLimit;
        await Queries.addNotification(
          userId,
          `¡Alerta! Presupuesto de ${categoria} excedido`,
          `Has excedido tu presupuesto de ${categoria} en $${exceededAmount.toFixed(2)}. Total gastado: $${currentSpent.toFixed(2)}`,
          'danger',
          categoria
        );
      }
      // Caso A: Advertencia (> 80% y < 100%)
      else if (percentage >= 80) {
        await Queries.addNotification(
          userId,
          `Presupuesto de ${categoria} al ${percentage.toFixed(1)}%`,
          `Estás cerca del límite. Has gastado $${currentSpent.toFixed(2)} de $${budgetLimit.toFixed(2)}`,
          'warning',
          categoria
        );
      }

    } catch (error) {
      console.error('Error en checkBudgetAndNotify:', error);
    }
  }

  /**
   * Obtener totales por categoría para gráficas
   * 
   * @param {number} userId - ID del usuario
   * @param {string} monthKey - Mes 'YYYY-MM'
   * @param {string} tipo - 'gasto' o 'ingreso' (default: 'gasto')
   * 
   * @returns {Object} { success: boolean, data: Array, error?: string }
   */
  async obtenerTotalesPorCategoria(userId, monthKey, tipo = 'gasto') {
    try {
      const rawData = await Queries.getTotalsByCategory(monthKey);

      // Filtrar por tipo y formatear para la gráfica
      const data = rawData
        .filter(item => item.tipo === tipo)
        .map(item => ({
          name: item.categoria,
          amount: Number(item.total),
          color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'), // Color aleatorio por defecto
          legendFontColor: '#7F7F7F',
          legendFontSize: 12
        }));

      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new TransactionController();