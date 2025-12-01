/**
 * TransactionController
 * Controlador para gestionar transacciones (ingresos y gastos)
 * 
 * Usa el modelo Transaction para validaciones
 * Usa queries.js para acceso a BD
 */

import * as Queries from '../database/queries';
import { Transaction } from '../models/Transaction';

class TransactionController {
  /**
   * Crear una nueva transacción (ingreso o gasto)
   * VALIDA CONTRA PRESUPUESTOS - Rechaza si se excedería
   * 
   * @param {number} monto - Cantidad de dinero (> 0)
   * @param {string} categoria - Ej: "Comida", "Transporte", "Salario"
   * @param {string} fecha - Fecha en formato ISO: "2025-11-29"
   * @param {string} descripcion - Descripción de la transacción
   * @param {string} tipo - "ingreso" o "gasto"
   * @param {number} userId - ID del usuario propietario
   * 
   * @returns {Object} { success: boolean, data?: Transaction, error?: string, message: string }
   */
  async createTransaction(monto, categoria, fecha, descripcion, tipo, userId) {
    try {
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
          error: result.error,
          message: 'Presupuesto insuficiente o error al crear transacción',
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
   * Obtener todas las transacciones de un usuario
   * 
   * @param {number} userId - ID del usuario
   * @param {Array} transactionsList - Lista de transacciones (para pruebas)
   * 
   * @returns {Object} { success: boolean, data?: Array<Transaction>, error?: string }
   */
  getTransactions(userId, transactionsList = []) {
    try {
      // Filtrar solo transacciones del usuario actual
      const userTransactions = transactionsList.filter(t => t.user_id === userId);

      return {
        success: true,
        data: userTransactions,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Filtrar transacciones por múltiples criterios
   * 
   * @param {number} userId - ID del usuario
   * @param {Array} transactionsList - Lista de transacciones
   * @param {Object} filters - Filtros:
   *   - categoria: {string}
   *   - tipo: {string} "ingreso" o "gasto"
   *   - fechaInicio: {string} "2025-11-01"
   *   - fechaFin: {string} "2025-11-30"
   *   - montoMin: {number}
   *   - montoMax: {number}
   * 
   * @returns {Object} { success: boolean, data?: Array<Transaction>, error?: string }
   */
  getTransactionsFiltered(userId, transactionsList = [], filters = {}) {
    try {
      let transactions = transactionsList.filter(t => t.user_id === userId);

      // Filtrar por categoría
      if (filters.categoria) {
        transactions = transactions.filter(t => t.categoria === filters.categoria);
      }

      // Filtrar por tipo (ingreso/gasto)
      if (filters.tipo) {
        transactions = transactions.filter(t => t.tipo === filters.tipo);
      }

      // Filtrar por rango de fechas
      if (filters.fechaInicio && filters.fechaFin) {
        const inicio = new Date(filters.fechaInicio);
        const fin = new Date(filters.fechaFin);
        transactions = transactions.filter(t => {
          const fecha = new Date(t.fecha);
          return fecha >= inicio && fecha <= fin;
        });
      }

      // Filtrar por rango de monto
      if (filters.montoMin !== undefined && filters.montoMax !== undefined) {
        transactions = transactions.filter(t => {
          const monto = parseFloat(t.monto);
          return monto >= filters.montoMin && monto <= filters.montoMax;
        });
      }

      return {
        success: true,
        data: transactions,
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
   * @param {number} monto - Nuevo monto
   * @param {string} categoria - Nueva categoría
   * @param {string} fecha - Nueva fecha
   * @param {string} descripcion - Nueva descripción
   * @param {string} tipo - Nuevo tipo
   * @param {number} userId - ID del usuario propietario
   * 
   * @returns {Object} { success: boolean, error?: string, message: string }
   */
  updateTransaction(id, monto, categoria, fecha, descripcion, tipo, userId) {
    try {
      // Validar antes de actualizar
      const transaction = new Transaction(monto, categoria, fecha, descripcion, tipo, userId, id);
      transaction.validate();

      // ACTUALIZAR CON VALIDACIÓN DE PRESUPUESTO
      const result = Queries.updateTransactionWithBudgetCheck(
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
          message: 'Presupuesto insuficiente o error al actualizar transacción',
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
   * @param {Array} transactionsList - Lista de transacciones
   * 
   * @returns {Object} { success: boolean, error?: string, message: string }
   */
  deleteTransaction(id, transactionsList = []) {
    try {
      const existe = transactionsList.find(t => t.id === id);

      if (!existe) {
        throw new Error('Transacción no encontrada');
      }

      // En una app real, aquí eliminarías de BD
      return {
        success: true,
        message: 'Transacción eliminada exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al eliminar transacción',
      };
    }
  }

  /**
   * Obtener resumen de transacciones (total ingresos vs gastos)
   * 
   * @param {number} userId - ID del usuario
   * @param {Array} transactionsList - Lista de transacciones
   * 
   * @returns {Object} { success: boolean, data?: { ingresos, gastos, balance }, error?: string }
   */
  getSummary(userId, transactionsList = []) {
    try {
      const userTransactions = transactionsList.filter(t => t.user_id === userId);

      const ingresos = userTransactions
        .filter(t => t.tipo === 'ingreso')
        .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0);

      const gastos = userTransactions
        .filter(t => t.tipo === 'gasto')
        .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0);

      const balance = ingresos - gastos;

      return {
        success: true,
        data: {
          ingresos: parseFloat(ingresos.toFixed(2)),
          gastos: parseFloat(gastos.toFixed(2)),
          balance: parseFloat(balance.toFixed(2)),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Agrupar transacciones por categoría
   * 
   * @param {number} userId - ID del usuario
   * @param {Array} transactionsList - Lista de transacciones
   * 
   * @returns {Object} { success: boolean, data?: Object, error?: string }
   */
  getGroupedByCategory(userId, transactionsList = []) {
    try {
      const userTransactions = transactionsList.filter(t => t.user_id === userId);
      const grouped = {};

      // Agrupar por categoría
      userTransactions.forEach(t => {
        if (!grouped[t.categoria]) {
          grouped[t.categoria] = {
            categoria: t.categoria,
            ingresos: 0,
            gastos: 0,
            total: 0,
            cantidad: 0,
          };
        }

        grouped[t.categoria].cantidad++;
        if (t.tipo === 'ingreso') {
          grouped[t.categoria].ingresos += parseFloat(t.monto);
        } else {
          grouped[t.categoria].gastos += parseFloat(t.monto);
        }
        grouped[t.categoria].total += parseFloat(t.monto);
      });

      // Convertir a array y redondear
      const result = Object.values(grouped).map(g => ({
        ...g,
        ingresos: parseFloat(g.ingresos.toFixed(2)),
        gastos: parseFloat(g.gastos.toFixed(2)),
        total: parseFloat(g.total.toFixed(2)),
      }));

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Agrupar transacciones por mes
   * 
   * @param {number} userId - ID del usuario
   * @param {Array} transactionsList - Lista de transacciones
   * 
   * @returns {Object} { success: boolean, data?: Array, error?: string }
   */
  getGroupedByMonth(userId, transactionsList = []) {
    try {
      const userTransactions = transactionsList.filter(t => t.user_id === userId);
      const grouped = {};

      // Agrupar por mes
      userTransactions.forEach(t => {
        const fecha = new Date(t.fecha);
        const monthKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

        if (!grouped[monthKey]) {
          grouped[monthKey] = {
            mes: monthKey,
            ingresos: 0,
            gastos: 0,
            total: 0,
            cantidad: 0,
          };
        }

        grouped[monthKey].cantidad++;
        if (t.tipo === 'ingreso') {
          grouped[monthKey].ingresos += parseFloat(t.monto);
        } else {
          grouped[monthKey].gastos += parseFloat(t.monto);
        }
        grouped[monthKey].total += parseFloat(t.monto);
      });

      // Convertir a array, ordenar por mes descendente y redondear
      const result = Object.values(grouped)
        .sort((a, b) => b.mes.localeCompare(a.mes))
        .map(m => ({
          ...m,
          ingresos: parseFloat(m.ingresos.toFixed(2)),
          gastos: parseFloat(m.gastos.toFixed(2)),
          total: parseFloat(m.total.toFixed(2)),
        }));

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtener el estado de TODOS los presupuestos con sus gastos
   * ÚTIL PARA NOTIFICACIONES Y PANTALLA DE PRESUPUESTOS
   * 
   * @param {number} userId - ID del usuario
   * @param {string} monthKey - Mes en formato "YYYY-MM" (opcional)
   * 
   * @returns {Object} { success: boolean, data?: Array<{ categoria, limite, gastado, disponible, estado, porcentaje }> }
   */
  async getBudgetStatus(userId, monthKey = null) {
    try {
      const budgetStatus = await Queries.getBudgetStatusByUser(userId, monthKey);

      return {
        success: true,
        data: budgetStatus,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtener presupuestos que ESTÁN EXCEDIDOS (100%+)
   * PARA NOTIFICACIONES
   * 
   * @param {number} userId - ID del usuario
   * @param {string} monthKey - Mes en formato "YYYY-MM" (opcional)
   * 
   * @returns {Object} { success: boolean, data?: Array<presupuestos excedidos> }
   */
  async getExceededBudgets(userId, monthKey = null) {
    try {
      const budgetStatus = await Queries.getBudgetStatusByUser(userId, monthKey);
      const exceeded = budgetStatus.filter(b => b.estado === 'EXCEDIDO');

      return {
        success: true,
        data: exceeded,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtener presupuestos que ESTÁN EN ALERTA (80-100%)
   * PARA NOTIFICACIONES
   * 
   * @param {number} userId - ID del usuario
   * @param {string} monthKey - Mes en formato "YYYY-MM" (opcional)
   * 
   * @returns {Object} { success: boolean, data?: Array<presupuestos en alerta> }
   */
  async getAlertBudgets(userId, monthKey = null) {
    try {
      const budgetStatus = await Queries.getBudgetStatusByUser(userId, monthKey);
      const alerts = budgetStatus.filter(b => ['ALERTA', 'EXCEDIDO'].includes(b.estado));

      return {
        success: true,
        data: alerts,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Exportar instancia única para usar en toda la app
export default new TransactionController();
