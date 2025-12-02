/**
 * BudgetController
 * Controlador para gestionar presupuestos y alertas de gasto
 * 
 * Usa el modelo Budget para validaciones y cálculos
 * Usa queries.js para acceso a BD
 */

import { Budget } from '../models/Budget';
import * as Queries from '../database/queries';
import { formatCategory } from '../utils/formatters';

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
      // 1. Normalizar categoría
      const normalizedCategory = formatCategory(categoria);

      // Crear y validar presupuesto (modelo)
      const budget = new Budget(normalizedCategory, montoLimite, userId);
      budget.validate();

      // Verificar si ya existe presupuesto para esa categoría (Case Insensitive)
      const existingBudgets = await Queries.getBudgetsByUser(userId);
      const duplicate = existingBudgets.find(b => b.categoria.toLowerCase() === normalizedCategory.toLowerCase());

      if (duplicate) {
        throw new Error(`Ya existe un presupuesto para la categoría "${normalizedCategory}"`);
      }

      // Guardar en BD
      const created = await Queries.addBudget(normalizedCategory, montoLimite, userId);

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
   * 
   * @returns {Object} { success: boolean, data?: Array<Budget>, error?: string }
   */
  async getBudgets(userId) {
    try {
      const userBudgets = await Queries.getBudgetsByUser(userId);

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
   * @param {string} monthKey - Mes opcional 'YYYY-MM'
   * 
   * @returns {Object} { success: boolean, data?: Array<BudgetWithStatus>, error?: string }
   */
  async getBudgetsWithStatus(userId, monthKey = null) {
    try {
      // Usamos la función optimizada de queries.js
      const statusList = await Queries.getBudgetStatusByUser(userId, monthKey);

      // Mapeamos para agregar colores y propiedades visuales si es necesario
      const enrichedList = statusList.map(item => {
        // Lógica de colores simple basada en estado
        let color = '#4CAF50'; // SEGURO - Verde
        if (item.estado === 'PRECAUCION') color = '#FFC107'; // Amarillo
        if (item.estado === 'ALERTA') color = '#FF9800'; // Naranja
        if (item.estado === 'EXCEDIDO') color = '#F44336'; // Rojo

        return {
          ...item,
          color
        };
      });

      return {
        success: true,
        data: enrichedList,
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
   * @param {number} userId - ID del usuario (necesario para validación)
   * 
   * @returns {Object} { success: boolean, error?: string, message: string }
   */
  async updateBudget(id, categoria, montoLimite, userId) {
    try {
      // 1. Normalizar categoría
      const normalizedCategory = formatCategory(categoria);

      // Validar antes de actualizar
      const budget = new Budget(normalizedCategory, montoLimite, userId, id);
      budget.validate();

      // Verificar duplicados (excluyendo el actual)
      const existingBudgets = await Queries.getBudgetsByUser(userId);
      const duplicate = existingBudgets.find(b =>
        b.categoria.toLowerCase() === normalizedCategory.toLowerCase() && b.id !== id
      );

      if (duplicate) {
        throw new Error(`Ya existe otro presupuesto para la categoría "${normalizedCategory}"`);
      }

      const result = await Queries.updateBudget(id, normalizedCategory, montoLimite);

      if (result.rowsAffected > 0) {
        return {
          success: true,
          message: 'Presupuesto actualizado exitosamente',
        };
      } else {
        throw new Error('No se pudo actualizar el presupuesto');
      }
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
   * 
   * @returns {Object} { success: boolean, error?: string, message: string }
   */
  async deleteBudget(id) {
    try {
      const result = await Queries.deleteBudget(id);

      if (result.rowsAffected > 0) {
        return {
          success: true,
          message: 'Presupuesto eliminado exitosamente',
        };
      } else {
        throw new Error('No se pudo eliminar el presupuesto');
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al eliminar presupuesto',
      };
    }
  }
}

// Exportar instancia única para usar en toda la app
export default new BudgetController();