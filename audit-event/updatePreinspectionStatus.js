const { getMariaDBConnection } = require('../db/mariadbConnection');

async function updatePreinspectionStatus(preinspeccionId) {
  let conn;
  try {
    conn = await getMariaDBConnection();
    await conn.query('UPDATE eventos_preinspeccion SET status = true WHERE preinspeccion_id = ?', [preinspeccionId]);
    console.log(`Estado actualizado para preinspeccionId ${preinspeccionId}`);
  } catch (error) {
    console.error(`Error al actualizar el estado en la base de datos para preinspeccionId ${preinspeccionId}:`, error);
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { updatePreinspectionStatus };
