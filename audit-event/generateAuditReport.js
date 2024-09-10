const {insertPreinspectionReportQuery} = require('../queries/insertPreinspectionReportQuery')

async function generateAuditReport(conn_report, preinspeccionId, data) {
	try {
	  await conn_report.beginTransaction();

	  console.log(data);
  
	  // Eliminar registros existentes en la tabla de reportes para este preinspeccion_id
	  const deleteQuery = 'DELETE FROM preinspeccion_reporte WHERE preinspeccionId = ?';
	  await conn_report.query(deleteQuery, [preinspeccionId]);
  
	  if (data.length > 0) {
		// Preparar los valores para la inserción
		for (const row of data) {

			const insertValues = [
				Number(row.preinspeccionId),
				row.fecha.toISOString().slice(0, 19).replace('T', ' '),
				row.compra,
				row.proveedor ? row.proveedor.replace(/'/g, "''") : null,
				row.cliente ? row.cliente : null,
				Number(row.productoId),
				row.producto ? row.producto.replace(/'/g, "''") : null,
				row.descripcion ? row.descripcion.replace(/'/g, "''") : null,
				row.costounitariocompleto,
				row.costo, 
				row.precio ? row.precio : null,
				row.utilidad ? row.utilidad.replace(/'/g, "''"): null,
				row.cantidad,
				row.valorCompra,
				row.cantidadPorNacionalizar,
				row.cantidadNacionalizada,
				row.porcentajeNacionalizado,
				row.prorrateo,
				Number(row.compraId),
				Number(row.proveedorId),
				row.clienteId ? Number(row.clienteId) : null,
				row.gastos_administrativos,
				row.gastos_administrativos_porcentaje,
				row.gastos_aduaneros_y_tributarios,
				row.gastos_aduaneros_y_tributarios_porcentaje,
				row.gastos_comerciales,
				row.gastos_comerciales_porcentaje,
				row.gastos_de_destino,
				row.gastos_de_destino_porcentaje,
				row.gastos_de_manejo_y_logística,
				row.gastos_de_manejo_y_logística_porcentaje,
				row.gastos_de_seguro,
				row.gastos_de_seguro_porcentaje,
				row.gastos_de_transporte,
				row.gastos_de_transporte_porcentaje,
				row.gastos_financieros,
				row.gastos_financieros_porcentaje,
				row.gastos_operativos,
				row.gastos_operativos_porcentaje,
				row.otros,
				row.otros_porcentaje,
				row.antidumping,
				row.antidumping_porcentaje,
				row.arancel,
				row.arancel_porcentaje,
				row.iva,
				row.iva_porcentaje,
				row.ultraprocesados,
				row.ultraprocesados_porcentaje,
				row.totalGastos,
				row.totalTributos,
				row.totalGastosImpuestos,
				row.costoUnitarioGasto,
				row.costoUnitarioGastoImpuesto,
				row.costoUnitarioImpuesto,
				row.costoUnitarioCompletoCalculado,
				row.embarque,
				Number(row.embarqueId),
				row.gastos_costos_indirectos,
				row.gastos_costos_indirectos_porcentaje
			  ];
			//console.log("A insertar: ",insertValues)
			console.log(insertValues)

			const insertQuery = insertPreinspectionReportQuery();
          
			await conn_report.query(insertQuery, insertValues);
			console.log(insertValues);
		}
		await conn_report.commit();
		console.log(`Datos insertados en la tabla de reportes para preinspeccionId ${preinspeccionId}`);
	  } else {
		console.log(`No se encontraron datos para insertar en la tabla de reportes para preinspeccionId ${preinspeccionId}`);
	  }
  
	} catch (error) {
	  await conn_report.rollback();
	  console.error(`Error al insertar/actualizar la tabla de reportes para preinspeccionId ${preinspeccionId}:`, error);
	  process.exit(1);
	}
  }

  module.exports = { generateAuditReport };