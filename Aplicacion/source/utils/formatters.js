/**
 * Formatea una categoría para asegurar consistencia.
 * Elimina espacios al inicio/final y convierte a "Title Case".
 * Ejemplo: "  cOmIdA  " -> "Comida"
 * 
 * @param {string} text - Texto a formatear
 * @returns {string} Texto formateado
 */
export const formatCategory = (text) => {
    if (!text) return '';

    // 1. Trim espacios
    const trimmed = text.trim();

    if (trimmed.length === 0) return '';

    // 2. Convertir a minúsculas y luego primera letra mayúscula
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};