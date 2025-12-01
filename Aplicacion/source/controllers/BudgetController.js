/**
 * BudgetController
 * Controlador para gestionar presupuestos y alertas de gasto
 * 
 * Usa el modelo Budget para validaciones y cálculos
 * Usa queries.js para acceso a BD
 */

import { Budget } from '../models/Budget';

class BudgetController {
  /**
   * Crear un nuevo presupuesto
   * 
   * @param {string} categoria - Categoría del presupuesto (Ej: "Comida")
   * @param {number} montoLimite - Límite de gasto (Ej: 500)
   * @param {number} userId - ID del usuario propietario
   * 
   * @returns {Object} { success: boolean, data?: Budget, error?: string, message: string }
   */
  async createBudget(categoria, montoLimite, userId) {
    try {
      // Crear y validar presupuesto
      const budget = new Budget(categoria, montoLimite, userId);
      budget.validate();

      // En una app real, aquí guardarías en BD
      const created = {
        id: Date.now(),
        categoria,
        monto_limite: montoLimite,
        fecha_creacion: new Date().toISOString(),
        user_id: userId,
      };

      return {
        success: true,
        data: created,
        message: 'Presupuesto creado exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al crear presupuesto',
      };
    }
  }

  /**
   * Obtener todos los presupuestos de un usuario
   * 
   * @param {number} userId - ID del usuario
   * @param {Array} budgetsList - Lista de presupuestos
   * 
   * @returns {Object} { success: boolean, data?: Array<Budget>, error?: string }
   */
  getBudgets(userId, budgetsList = []) {
    try {
      const userBudgets = budgetsList.filter(b => b.user_id === userId);

      return {
        success: true,
        data: userBudgets,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtener todos los presupuestos CON estado actual y monto gastado
   * 
   * @param {number} userId - ID del usuario
   * @param {Array} budgetsList - Lista de presupuestos
   * @param {Array} transactionsList - Lista de transacciones (para calcular gasto)
   * 
   * @returns {Object} { success: boolean, data?: Array<BudgetWithStatus>, error?: string }
   */
  getBudgetsWithStatus(userId, budgetsList = [], transactionsList = []) {
    try {
      const userBudgets = budgetsList.filter(b => b.user_id === userId);

      // Enriquecer cada presupuesto con su estado actual
      const budgetsWithStatus = userBudgets.map(budget => {
        // Calcular cuánto se ha gastado en esta categoría
        const gastosEnCategoria = transactionsList
          .filter(t => t.user_id === userId && t.categoria === budget.categoria && t.tipo === 'gasto')
          .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0);

        // Crear instancia de Budget model para usar sus métodos
        const budgetModel = new Budget(budget.categoria, budget.monto_limite, userId, budget.id, budget.fecha_creacion);

        return {
          ...budget,
          totalGastado: parseFloat(gastosEnCategoria.toFixed(2)),
          disponible: parseFloat(budgetModel.calcularDisponible(gastosEnCategoria).toFixed(2)),
          porcentaje: parseFloat(budgetModel.calcularPorcentaje(gastosEnCategoria).toFixed(2)),
          estado: budgetModel.getEstado(gastosEnCategoria),
          color: budgetModel.getColor(gastosEnCategoria),
        };
      });

      return {
        success: true,
        data: budgetsWithStatus,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Actualizar un presupuesto
   * 
   * @param {number} id - ID del presupuesto
   * @param {string} categoria - Nueva categoría
   * @param {number} montoLimite - Nuevo monto límite
   * 
   * @returns {Object} { success: boolean, error?: string, message: string }
   */
  updateBudget(id, categoria, montoLimite) {
    try {
      // Validar antes de actualizar
      const budget = new Budget(categoria, montoLimite, null, id);
      budget.validate();

      // En una app real, aquí actualizarías en BD
      return {
        success: true,
        message: 'Presupuesto actualizado exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al actualizar presupuesto',
      };
    }
  }

  /**
   * Eliminar un presupuesto
   * 
   * @param {number} id - ID del presupuesto
   * @param {Array} budgetsList - Lista de presupuestos
   * 
   * @returns {Object} { success: boolean, error?: string, message: string }
   */
  deleteBudget(id, budgetsList = []) {
    try {
      const existe = budgetsList.find(b => b.id === id);

      if (!existe) {
        throw new Error('Presupuesto no encontrado');
      }

      // En una app real, aquí eliminarías de BD
      return {
        success: true,
        message: 'Presupuesto eliminado exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al eliminar presupuesto',
      };
    }
  }

  /**
   * Obtener presupuestos que YA están excedidos
   * 
   * @param {number} userId - ID del usuario
   * @param {Array} budgetsList - Lista de presupuestos
   * @param {Array} transactionsList - Lista de transacciones
   * 
   * @returns {Object} { success: boolean, data?: Array<Budget>, error?: string }
   */
  checkBudgetAlerts(userId, budgetsList = [], transactionsList = []) {
    try {
      const userBudgets = budgetsList.filter(b => b.user_id === userId);
      const alerts = [];

      userBudgets.forEach(budget => {
        // Calcular gasto en categoría
        const gastado = transactionsList
          .filter(t => t.user_id === userId && t.categoria === budget.categoria && t.tipo === 'gasto')
          .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0);

        // Crear modelo para verificar si está excedido
        const budgetModel = new Budget(budget.categoria, budget.monto_limite, userId);
        if (budgetModel.estaExcedido(gastado)) {
          alerts.push({
            ...budget,
            totalGastado: gastado,
            exceso: parseFloat((gastado - budget.monto_limite).toFixed(2)),
          });
        }
      });

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

  /**
   * Obtener presupuestos que están CERCA de excederse (80%+)
   * 
   * @param {number} userId - ID del usuario
   * @param {Array} budgetsList - Lista de presupuestos
   * @param {Array} transactionsList - Lista de transacciones
   * @param {number} threshold - Porcentaje mínimo para alertar (default: 80)
   * 
   * @returns {Object} { success: boolean, data?: Array<Budget>, error?: string }
   */
  getNearBudgetLimits(userId, budgetsList = [], transactionsList = [], threshold = 80) {
    try {
      const userBudgets = budgetsList.filter(b => b.user_id === userId);
      const nearLimits = [];

      userBudgets.forEach(budget => {
        // Calcular gasto en categoría
        const gastado = transactionsList
          .filter(t => t.user_id === userId && t.categoria === budget.categoria && t.tipo === 'gasto')
          .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0);

        // Crear modelo para calcular porcentaje
        const budgetModel = new Budget(budget.categoria, budget.monto_limite, userId);
        const porcentaje = budgetModel.calcularPorcentaje(gastado);

        // Si está entre 80% y 100% (cerca pero no excedido)
        if (porcentaje >= threshold && porcentaje < 100) {
          nearLimits.push({
            ...budget,
            totalGastado: parseFloat(gastado.toFixed(2)),
            disponible: parseFloat(budgetModel.calcularDisponible(gastado).toFixed(2)),
            porcentaje: parseFloat(porcentaje.toFixed(2)),
          });
        }
      });

      return {
        success: true,
        data: nearLimits,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtener resumen general de presupuestos
   * 
   * @param {number} userId - ID del usuario
   * @param {Array} budgetsList - Lista de presupuestos
   * @param {Array} transactionsList - Lista de transacciones
   * 
   * @returns {Object} { success: boolean, data?: { totalLimites, totalGastado, disponible, porcentajeTotal }, error?: string }
   */
  getBudgetSummary(userId, budgetsList = [], transactionsList = []) {
    try {
      const userBudgets = budgetsList.filter(b => b.user_id === userId);

      // Total de límites de presupuestos
      const totalLimites = userBudgets.reduce((sum, b) => sum + b.monto_limite, 0);

      // Total gastado en todas las categorías con presupuesto
      let totalGastado = 0;
      userBudgets.forEach(budget => {
        const gastado = transactionsList
          .filter(t => t.user_id === userId && t.categoria === budget.categoria && t.tipo === 'gasto')
          .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0);
        totalGastado += gastado;
      });

      const disponible = totalLimites - totalGastado;
      const porcentajeTotal = totalLimites > 0 ? (totalGastado / totalLimites) * 100 : 0;

      return {
        success: true,
        data: {
          totalLimites: parseFloat(totalLimites.toFixed(2)),
          totalGastado: parseFloat(totalGastado.toFixed(2)),
          disponible: parseFloat(disponible.toFixed(2)),
          porcentajeTotal: parseFloat(porcentajeTotal.toFixed(2)),
          presupuestosCantidad: userBudgets.length,
        },
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
export default new BudgetController();
