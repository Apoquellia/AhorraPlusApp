/**
 * AuthController
 * Controlador para autenticación: login, registro y recuperación de contraseña
 * 
 * Usa el modelo User para validaciones
 * Usa queries.js para acceso a BD
 */

import * as Queries from '../database/queries';
import { User } from '../models/User';

class AuthController {
  /**
   * Registrar un nuevo usuario
   * 
   * @param {string} nombre - Nombre completo del usuario
   * @param {string} correo - Correo electrónico (debe ser único)
   * @param {string} username - Nombre de usuario (debe ser único)
   * @param {string} password - Contraseña (mín 6 caracteres)
   * @param {string} passwordConfirm - Confirmación de contraseña
   * 
   * @returns {Object} { success: boolean, data?: User, error?: string, message: string }
   */
  async register(nombre, correo, username, password, passwordConfirm) {
    try {
      // Validar que las contraseñas coincidan
      if (password !== passwordConfirm) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Validar que el usuario no exista (buscar por username)
      const usuarioExistente = await Queries.getAll();
      const existe = usuarioExistente.find(u => u.username === username);
      if (existe) {
        throw new Error('El nombre de usuario ya existe');
      }

      // Crear instancia de User para validar datos
      const user = new User(nombre, correo, username, password);
      user.validate(); // Lanza error si algo está mal

      // Agregar usuario a BD
      const usuarioCreado = await Queries.add(nombre, correo, username, password);

      return {
        success: true,
        data: usuarioCreado,
        message: 'Usuario registrado exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al registrar usuario',
      };
    }
  }

  /**
   * Iniciar sesión con username y password
   * 
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * 
   * @returns {Object} { success: boolean, data?: User, error?: string, message: string }
   */
  async login(username, password) {
    try {
      if (!username || !password) {
        throw new Error('Usuario y contraseña son requeridos');
      }

      // Obtener todos los usuarios y buscar por username
      const usuarios = await Queries.getAll();
      const usuario = usuarios.find(u => u.username === username);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña
      if (usuario.password !== password) {
        throw new Error('Contraseña incorrecta');
      }

      return {
        success: true,
        data: usuario,
        message: 'Sesión iniciada exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al iniciar sesión',
      };
    }
  }

  /**
   * Buscar usuario por correo (primer paso de recuperación)
   * 
   * @param {string} correo - Correo electrónico
   * 
   * @returns {Object} { success: boolean, data?: { id, username, correo }, error?: string }
   */
  async recoverPassword(correo) {
    try {
      // Buscar usuario por correo
      const usuarios = await Queries.getAll();
      const usuario = usuarios.find(u => u.correo === correo);

      if (!usuario) {
        throw new Error('El correo no está registrado');
      }

      // Retornar datos del usuario sin la contraseña
      return {
        success: true,
        data: {
          id: usuario.id,
          username: usuario.username,
          correo: usuario.correo,
        },
        message: 'Usuario encontrado',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al buscar usuario',
      };
    }
  }

  /**
   * Restablecer contraseña (segundo paso de recuperación)
   * 
   * @param {number} userId - ID del usuario
   * @param {string} nuevaPassword - Nueva contraseña
   * @param {string} confirmarPassword - Confirmación de nueva contraseña
   * 
   * @returns {Object} { success: boolean, error?: string, message: string }
   */
  async resetPassword(userId, nuevaPassword, confirmarPassword) {
    try {
      // Validar que las contraseñas coincidan
      if (nuevaPassword !== confirmarPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Validar longitud mínima
      if (nuevaPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Obtener usuario actual
      const usuarios = await Queries.getAll();
      const usuario = usuarios.find(u => u.id === userId);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // En una app real, aquí encriptarías la contraseña
      // Por ahora solo actualizamos con el texto plano
      await Queries.update(userId, usuario.nombre, usuario.correo, usuario.username);

      return {
        success: true,
        message: 'Contraseña actualizada exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al restablecer contraseña',
      };
    }
  }

  /**
   * Obtener usuario por ID
   * 
   * @param {number} userId - ID del usuario
   * 
   * @returns {Object} { success: boolean, data?: User, error?: string }
   */
  async getUserById(userId) {
    try {
      const usuarios = await Queries.getAll();
      const usuario = usuarios.find(u => u.id === userId);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      return {
        success: true,
        data: usuario,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Actualizar perfil del usuario
   * 
   * @param {number} userId - ID del usuario
   * @param {string} nombre - Nuevo nombre
   * @param {string} correo - Nuevo correo
   * @param {string} username - Nuevo username
   * 
   * @returns {Object} { success: boolean, error?: string, message: string }
   */
  async updateProfile(userId, nombre, correo, username) {
    try {
      // Buscar usuario actual
      const usuarios = await Queries.getAll();
      const usuario = usuarios.find(u => u.id === userId);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Crear y validar nuevo usuario
      const user = new User(nombre, correo, username, usuario.password);
      user.validate();

      // Actualizar en BD
      await Queries.update(userId, nombre, correo, username);

      return {
        success: true,
        message: 'Perfil actualizado exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al actualizar perfil',
      };
    }
  }
}

// Exportar instancia única para usar en toda la app
export default new AuthController();
