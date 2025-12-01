/**
 * Modelo User
 * Representa la estructura de datos de un usuario
 * 
 * Tabla en BD: users (id, nombre, correo, username, password)
 */

export class User {
  constructor(nombre, correo, username, password, id = null) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.username = username;
    this.password = password;
  }

  /**
   * Valida que los datos del usuario sean correctos
   * @returns {boolean} true si es válido
   * @throws {Error} si hay algún error de validación
   */
  validate() {
    // Validar nombre
    if (!this.nombre || this.nombre.trim() === '') {
      throw new Error('El nombre es requerido');
    }

    // Validar correo
    if (!this.correo || !this.correo.includes('@')) {
      throw new Error('El correo debe ser válido (debe contener @)');
    }

    // Validar usuario
    if (!this.username || this.username.trim() === '') {
      throw new Error('El nombre de usuario es requerido');
    }

    // Validar contraseña
    if (!this.password || this.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    return true;
  }

  /**
   * Obtiene los datos del usuario sin la contraseña (para seguridad)
   * @returns {Object} Usuario sin el campo password
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      correo: this.correo,
      username: this.username,
    };
  }

  /**
   * Convierte el usuario a string
   */
  toString() {
    return `Usuario: ${this.nombre} (${this.username})`;
  }
}
