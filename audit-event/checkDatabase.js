const { getMariaDBConnection, getReportsDBConnection } = require('../db/mariadbConnection');
const { generateAuditReport } = require('./generateAuditReport');
const { updatePreinspectionStatus } = require('./updatePreinspectionStatus');
const { getPreinspectionAuditQuery } = require('../queries/preinspectionQuery');


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkDatabase() {
  let conn;
  let conn_report;

  try {
    console.log("INtentando")
    conn = await getMariaDBConnection();
    console.log("nice")
    conn_report = await getReportsDBConnection();
    console.log("Conectado a MariaDB");

    const rows = await conn.query(`select id from preinspeccion where id in (
      1497, 1537, 1542, 1604, 1631) order by id asc`);
    if (rows.length === 0) {
      console.log('No hay preinspecciones pendientes');
      await delay(3900000 ); 

      return;
    }
    const preinspeccionIds = rows.map(row => Number(row.id));
    console.log(rows);

    for (const preinspeccionId of preinspeccionIds) {
      const query = getPreinspectionAuditQuery();
      const result = await conn.query(query, [preinspeccionId]);

      await generateAuditReport(conn_report, preinspeccionId, result);
      await updatePreinspectionStatus(preinspeccionId);
    }

    await conn.commit();
    console.log('Proceso completado con éxito');

  } catch (error) {
    if (conn) await conn.rollback();
    console.error('Error al revisar la base de datos:', error);
  } finally {
    if (conn) conn.release();
    if (conn_report) conn_report.release();
    await delay(3900000);
  }
}

module.exports = { checkDatabase };
