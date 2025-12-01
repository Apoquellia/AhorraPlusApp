import * as Queries from '../database/queriesTransactions';
import { Transaction } from '../models/Transaction';

class TransactionController {
  async createTransaction(monto, categoria, fecha, descripcion, tipo, userId) {
    try {
      const transaction = new Transaction(monto, categoria, fecha, descripcion, tipo, userId);
      transaction.validate();
      const created = await Queries.add(monto, categoria, fecha, descripcion, tipo, userId);
      return {
        success: true,
        data: created,
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

  async getTransactions(userId) {
    try {
      const data = await Queries.getAll(userId);
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  getTransactionsFiltered(userId, transactionsList = [], filters = {}) {
    try {
      let transactions = transactionsList.filter(t => t.user_id === userId);
      if (filters.categoria) {
        transactions = transactions.filter(t => t.categoria.toLowerCase().includes(filters.categoria.toLowerCase()));
      }
      if (filters.tipo) {
        transactions = transactions.filter(t => t.tipo === filters.tipo);
      }
      if (filters.fechaInicio && filters.fechaFin) {
        const inicio = new Date(filters.fechaInicio);
        const fin = new Date(filters.fechaFin);
        transactions = transactions.filter(t => {
          const fecha = new Date(t.fecha);
          return fecha >= inicio && fecha <= fin;
        });
      }
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

  async updateTransaction(id, monto, categoria, fecha, descripcion, tipo) {
    try {
      const transaction = new Transaction(monto, categoria, fecha, descripcion, tipo, null, id);
      transaction.validate();
      await Queries.update(id, monto, categoria, fecha, descripcion, tipo);
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

  async deleteTransaction(id) {
    try {
      await Queries.dlt(id);
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

}

export default new TransactionController();