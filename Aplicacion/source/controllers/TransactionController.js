import * as Queries from '../database/queries';
import { Transaction } from '../models/Transaction';

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

      // Crear instancia y validar modelo
      const transaction = new Transaction(monto, categoria, fecha, descripcion, tipo, userId);
      transaction.validate();

      // CREAR CON VALIDACIÓN DE PRESUPUESTO
      const result = await Queries.addTransactionWithBudgetCheck(
        monto,
        categoria,
        fecha,
        descripcion,
        tipo,
        userId
      );

      if (!result.success) {
        return {
          success: false,
          error: result.error, // Este error vendrá con el mensaje de "Presupuesto excedido"
          message: 'No se pudo crear la transacción',
        };
      }

      return {
        success: true,
        data: result.data,
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
import * as Queries from '../database/queries';
import { Transaction } from '../models/Transaction';

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

      // Crear instancia y validar modelo
      const transaction = new Transaction(monto, categoria, fecha, descripcion, tipo, userId);
      transaction.validate();

      // CREAR CON VALIDACIÓN DE PRESUPUESTO
      const result = await Queries.addTransactionWithBudgetCheck(
        monto,
        categoria,
        fecha,
        descripcion,
        tipo,
        userId
      );

      if (!result.success) {
        return {
          success: false,
          error: result.error, // Este error vendrá con el mensaje de "Presupuesto excedido"
          message: 'No se pudo crear la transacción',
        };
      }

      return {
        success: true,
        data: result.data,
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

      // Validar antes de actualizar
      const transaction = new Transaction(monto, categoria, fecha, descripcion, tipo, userId, id);
      transaction.validate();

      // ACTUALIZAR CON VALIDACIÓN DE PRESUPUESTO
      const result = await Queries.updateTransactionWithBudgetCheck(
        id,
        monto,
        categoria,
        fecha,
        descripcion,
        tipo,
        userId
      );

      if (!result.success) {
        return {
          success: false,
          error: result.error,
          message: 'No se pudo actualizar la transacción',
        };
      }

      return {
        success: true,
        message: 'Transacción actualizada exitosamente',
      };
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
        error: error.message
      };
    }
  }
}

export default new TransactionController();