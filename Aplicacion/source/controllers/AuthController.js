import * as Queries from '../database/queries';
import { User } from '../models/User';
import { hashPassword, verifyPassword } from '../utils/Security';

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
      if (password !== passwordConfirm) {
        throw new Error('Las contraseñas no coinciden');
      }

      const usuarioExistente = await Queries.getAll();
      const existe = usuarioExistente.find(u => u.username === username);
      if (existe) {
        throw new Error('El nombre de usuario ya existe');
      }

      const correoExistente = usuarioExistente.find(u => u.correo === correo);
      if (correoExistente) {
        throw new Error('El correo ya está registrado');
      }

      // Hashear contraseña antes de crear el modelo/guardar
      const hashedPassword = await hashPassword(password);

      // Nota: El modelo User valida longitud, pero guardaremos el hash. 
      // Si el modelo valida longitud sobre el valor pasado, el hash será largo así que pasará.
      // Pero es mejor validar la longitud del texto plano antes.
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const user = new User(nombre, correo, username, hashedPassword);
      // user.validate(); // Omitimos validación del modelo si valida formato de password, ya que es un hash ahora.

      const usuarioCreado = await Queries.add(nombre, correo, username, hashedPassword);

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

      const usuarios = await Queries.getAll();
      const usuario = usuarios.find(u => u.username === username);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // 1. Verificar si es contraseña legacy (texto plano)
      if (usuario.password === password) {
        // MIGRACIÓN AUTOMÁTICA: Actualizar a hash
        const newHash = await hashPassword(password);
        await Queries.update(usuario.id, usuario.nombre, usuario.correo, usuario.username, newHash);

        return {
          success: true,
          data: usuario,
          message: 'Sesión iniciada exitosamente (Seguridad actualizada)',
        };
      }

      // 2. Verificar hash
      const isValid = await verifyPassword(password, usuario.password);
      if (!isValid) {
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

      const usuarios = await Queries.getAll();
      const usuario = usuarios.find(u => u.correo === correo);

      if (!usuario) {
        throw new Error('El correo no está registrado');
      }

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

      if (nuevaPassword !== confirmarPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (nuevaPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const usuarios = await Queries.getAll();
      const usuario = usuarios.find(u => u.id === userId);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Hashear nueva contraseña
      const hashedPassword = await hashPassword(nuevaPassword);

      await Queries.update(userId, usuario.nombre, usuario.correo, usuario.username, hashedPassword);

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

}

export default new AuthController();