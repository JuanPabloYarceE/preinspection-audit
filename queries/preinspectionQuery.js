function getPreinspectionAuditQuery() {
    return `
        select
	*
from
	(WITH data_inventario as (
	select
		inventario.preinspeccionId,
		inventario.embarqueId,
		inventario.compraId,
		inventario.proveedorId,
		inventario.clienteId,
		inventario.fecha,
		inventario.compra,
		inventario.proveedor,
		inventario.cliente,
		inventario.productoId,
		inventario.producto,
		inventario.descripcion,
		inventario.costounitariogasto,
		inventario.costounitariocompleto,
		SUM(inventario.costo) as costo,
		inventario.precio,
		CONCAT(ROUND((((inventario.precio - inventario.costounitariocompleto) /
                                               inventario.costounitariocompleto)) * 100),
                                       ' % ') as utilidad,
		COALESCE(
                                        SUM(IF(inventario.nombreGrupo = 'Gastos Administrativos', inventario.valorGrupo,
                                               NULL)), 0) + COALESCE(
                                        SUM(IF(inventario.nombreGrupo = 'Gastos Aduaneros y Tributarios',
                                               inventario.valorGrupo, NULL)), 0) + COALESCE(
                                        SUM(IF(inventario.nombreGrupo = 'Gastos Comerciales', inventario.valorGrupo,
                                               NULL)), 0) + COALESCE(
                                        SUM(IF(inventario.nombreGrupo = 'Gastos Costos Indirectos', inventario.valorGrupo,
                                               NULL)), 0) + COALESCE(
                                        SUM(IF(inventario.nombreGrupo = 'Gastos de Destino', inventario.valorGrupo,
                                               NULL)), 0) + COALESCE(
                                        SUM(IF(inventario.nombreGrupo = 'Gastos de Manejo y Logística',
                                               inventario.valorGrupo, NULL)), 0) + COALESCE(
                                        SUM(IF(inventario.nombreGrupo = 'Gastos de Seguro', inventario.valorGrupo,
                                               NULL)), 0) + COALESCE(
                                        SUM(IF(inventario.nombreGrupo = 'Gastos de Transporte', inventario.valorGrupo,
                                               NULL)), 0) + COALESCE(
                                        SUM(IF(inventario.nombreGrupo = 'Gastos Financieros', inventario.valorGrupo,
                                               NULL)), 0) + COALESCE(
                                        SUM(IF(inventario.nombreGrupo = 'Gastos Operativos', inventario.valorGrupo,
                                               NULL)), 0) +
                                COALESCE(SUM(IF(inventario.nombreGrupo = 'Otros', inventario.valorGrupo, NULL)),
                                         0) as totalGastos,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'Antidumping', inventario.valorGrupo, NULL)),
                                         0) +
                                COALESCE(SUM(IF(inventario.nombreGrupo = 'Arancel', inventario.valorGrupo, NULL)), 0) +
                                COALESCE(SUM(IF(inventario.nombreGrupo = 'IVA', inventario.valorGrupo, NULL)), 0) +
                                COALESCE(SUM(IF(inventario.nombreGrupo = 'Ultraprocesados', inventario.valorGrupo,
                                                NULL)),
                                         0) as totalTributos,
		COALESCE(
                                        SUM(IF(inventario.nombreGrupo = 'Gastos Administrativos', inventario.valorGrupo,
                                               NULL)),
                                        0) as gastos_administrativos,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'Gastos Aduaneros y Tributarios',
                                                inventario.valorGrupo, NULL)),
                                         0) as gastos_aduaneros_y_tributarios,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'Gastos Comerciales', inventario.valorGrupo,
                                                NULL)),
                                         0) as gastos_comerciales,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'Gastos Costos Indirectos', inventario.valorGrupo,
                                                NULL)),
                                         0) as gastos_costos_indirectos,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'Gastos de Destino', inventario.valorGrupo,
                                                NULL)),
                                         0) as gastos_de_destino,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'Gastos de Manejo y Logística',
                                                inventario.valorGrupo, NULL)),
                                         0) as gastos_de_manejo_y_logística,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'Gastos de Seguro', inventario.valorGrupo,
                                                NULL)),
                                         0) as gastos_de_seguro,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'Gastos de Transporte', inventario.valorGrupo,
                                                NULL)),
                                         0) as gastos_de_transporte,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'Gastos Financieros', inventario.valorGrupo,
                                                NULL)),
                                         0) as gastos_financieros,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'Gastos Operativos', inventario.valorGrupo,
                                                NULL)),
                                         0) as gastos_operativos,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'Otros', inventario.valorGrupo, NULL)),
                                         0) as otros,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'Antidumping', inventario.valorGrupo, NULL)),
                                         0) as antidumping,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'Arancel', inventario.valorGrupo, NULL)),
                                         0) as arancel,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'IVA', inventario.valorGrupo, NULL)),
                                         0) as iva,
		COALESCE(SUM(IF(inventario.nombreGrupo = 'Ultraprocesados', inventario.valorGrupo,
                                                NULL)),
                                         0) as ultraprocesados
	from
		((
		select
			p.id as productoId,
			p.codigo as producto,
			p.nombre as descripcion,
			pd.preinspeccion_id,
			pd.costounitariogastoitem as costounitariogasto,
			pd.costounitariocompletoitem as costounitariocompleto,
			ppt.valor as costo,
			ppr.precio,
			ppt.valor as valorGrupo,
			pi.id as preinspeccionId,
			pi.embarque_id as embarqueId,
			pi.fecha,
			cg.nombre as nombreGrupo,
			CONCAT_WS(' - ', c.consecutivo, c.documentoproveedor, dc.nombre) as compra,
			tp.nombrecompleto as proveedor,
			tc.nombrecompleto as cliente,
			c.id as compraId,
			tpd.id as proveedorId,
			tcd.id as clienteId
		from
			preinspeccion_detalles as pd
		join preinspeccion pi on
			pd.preinspeccion_id = pi.id
		left join preinspeccion_productos_tributos as ppt
                                                   on
			pd.preinspeccion_id = ppt.preinspeccion_id
			and
                                                      pd.producto_id = ppt.producto_id
		inner join productos as p on
			pd.producto_id = p.id
		left join compras_impuestos as ci on
			ppt.compraimpuesto_id = ci.id
		left join compras as c on
			pi.compra_id = c.id
		left join documentos_compras dc on
			c.documentocompra_id = dc.nombre
		left join terceros tp on
			c.proveedor_id = tp.id
		left join terceros_proveedores as tpd on
			tp.id = tpd.tercero_id
		left join terceros tc on
			c.cliente_id = tc.id
		left join terceros_clientes as tcd on
			tc.id = tcd.tercero_id
		inner join conceptos_tributarios as ct on
			ci.conceptotributario_id = ct.id
		inner join constantes as cg on
			ct.grupo_id = cg.id
		left join precios_productos as ppr
                                                   on
			pd.producto_id = ppr.producto_id
			and ppr.estado = 1
		group by
			pd.producto_id,
			cg.nombre,
			ci.conceptotributario_id,
			ci.id)
union all
                               (
	select
		p.id as productoId,
		p.codigo as producto,
		p.nombre as descripcion,
		pd.preinspeccion_id,
		pd.costounitariogastoitem as costounitariogasto,
		pd.costounitariocompletoitem as costounitariocompleto,
		pg.valor as costo,
		ppr.precio,
		pg.valor as valorGrupo,
		pi.id as preinspeccionId,
		pi.embarque_id as embarqueId,
		pi.fecha,
		COALESCE(gg.nombre, 'Otros') as nombreGrupo,
		CONCAT_WS(' - ', c.consecutivo, c.documentoproveedor, dc.nombre) as compra,
		tp.nombrecompleto as proveedor,
		tc.nombrecompleto as cliente,
		c.id as compraId,
		tpd.id as proveedorId,
		tcd.id as clienteId
	from
		preinspeccion_detalles as pd
	join preinspeccion pi on
		pd.preinspeccion_id = pi.id
	left join preinspeccion_productos_detalles_gastos as pg
                                                   on
		pd.preinspeccion_id = pg.preinspeccion_id
		and
                                                      pd.producto_id = pg.producto_id
	inner join productos as p on
		pd.producto_id = p.id
	inner join preinspeccion as pre on
		pd.preinspeccion_id = pre.id
	left join compras_gastos as cg on
		pg.compragasto_id = cg.id
	left join compras c on
		pi.compra_id = c.id
	left join documentos_compras dc on
		c.documentocompra_id = dc.id
	left join terceros tp on
		c.proveedor_id = tp.id
	left join terceros_proveedores as tpd on
		tp.id = tpd.tercero_id
	left join terceros tc on
		c.cliente_id = tc.id
	left join terceros_clientes as tcd on
		tc.id = tcd.tercero_id
	left join gastos as g on
		cg.gasto_id = g.id
	left join grupos_gastos as gg on
		g.grupogasto_id = gg.id
	left join precios_productos as ppr
                                                   on
		pd.producto_id = ppr.producto_id
		and ppr.estado = 1
	group by
		pd.producto_id,
		gg.nombre,
		cg.gasto_id,
		pg.id)) as inventario
	group by
		preinspeccionId,
		productoId),
	data_compraTotal as (
	select
		sum(cp.costo * cp.cantidad) as total,
		p.id as preinspeccionIdTotal
	from
		preinspeccion p
	join compras c on
		p.compra_id = c.id
	join compras_productos cp on
		c.id = cp.compra_id
	group by
		p.id),
	data_cantidadCompra as (
	select
		pre.id as preinspeccionCompraId,
		cp.producto_id,
		SUM(cp.cantidad) as cantidad,
		(SUM(cp.costo * cp.cantidad) / SUM(cp.cantidad)) as costo,
		SUM(cp.costo * cp.cantidad) as valorCompra,
		nacio.cantidadNacionalizada,
		nacio.cantidadPorNacionalizar
	from
		preinspeccion as pre
	inner join compras as c on
		pre.compra_id = c.id
	left join compras_productos as cp on
		pre.compra_id = cp.compra_id
	left join (
		select
			CASE
				WHEN MAX(pd.duplicado) = 1
                                                                THEN SUM(pd.cantidadnacionalizada)
				ELSE pd.cantidadnacionalizada
			END as cantidadnacionalizada,
			CASE
				WHEN MAX(pd.duplicado) = 1
                                                                THEN (SUM(pd.cantidad) - SUM(pd.cantidadnacionalizada))
				ELSE pd.cantidad - pd.cantidadnacionalizada
			END as cantidadPorNacionalizar,
			pd.preinspeccion_id,
			pd.producto_id
		from
			preinspeccion_detalles as pd
		group by
			pd.producto_id,
			pd.preinspeccion_id) as nacio
                                                on
		cp.producto_id = nacio.producto_id
		and pre.id = nacio.preinspeccion_id
	group by
		cp.producto_id,
		pre.id),
	data_preinspeccionGastoTributo
         as (
	select
		COALESCE(SUM(IF(grupo.grupoGasto = 'Gastos Administrativos', grupo.porcentaje, NULL)),
                             0) * 100 as gastos_administrativos_porcentaje,
		COALESCE(SUM(IF(grupo.grupoGasto = 'Gastos Aduaneros y Tributarios', grupo.porcentaje,
                                    NULL)),
                             0) * 100 as gastos_aduaneros_y_tributarios_porcentaje,
		COALESCE(SUM(IF(grupo.grupoGasto = 'Gastos Comerciales', grupo.porcentaje, NULL)),
                             0) * 100 as gastos_comerciales_porcentaje,
		COALESCE(SUM(IF(grupo.grupoGasto = 'Gastos Costos Indirectos', grupo.porcentaje, NULL)),
                             0) * 100 as gastos_costos_indirectos_porcentaje,
		COALESCE(SUM(IF(grupo.grupoGasto = 'Gastos de Destino', grupo.porcentaje, NULL)),
                             0) * 100 as gastos_de_destino_porcentaje,
		COALESCE(SUM(IF(grupo.grupoGasto = 'Gastos de Manejo y Logística', grupo.porcentaje,
                                    NULL)),
                             0) * 100 as gastos_de_manejo_y_logística_porcentaje,
		COALESCE(SUM(IF(grupo.grupoGasto = 'Gastos de Seguro', grupo.porcentaje, NULL)),
                             0) * 100 as gastos_de_seguro_porcentaje,
		COALESCE(SUM(IF(grupo.grupoGasto = 'Gastos de Transporte', grupo.porcentaje, NULL)),
                             0) * 100 as gastos_de_transporte_porcentaje,
		COALESCE(SUM(IF(grupo.grupoGasto = 'Gastos Financieros', grupo.porcentaje, NULL)),
                             0) * 100 as gastos_financieros_porcentaje,
		COALESCE(SUM(IF(grupo.grupoGasto = 'Gastos Operativos', grupo.porcentaje, NULL)),
                             0) * 100 as gastos_operativos_porcentaje,
		COALESCE(SUM(IF(grupo.grupoGasto = 'Otros', grupo.porcentaje, NULL)),
                             0) * 100 as otros_porcentaje,
		COALESCE(SUM(IF(grupo.grupoGasto = 'Antidumping', grupo.porcentaje, NULL)),
                             0) * 100 as antidumping_porcentaje,
		COALESCE(SUM(IF(grupo.grupoGasto = 'Arancel', grupo.porcentaje, NULL)),
                             0) * 100 as arancel_porcentaje,
		COALESCE(SUM(IF(grupo.grupoGasto = 'IVA', grupo.porcentaje, NULL)),
                             0) * 100 as iva_porcentaje,
		COALESCE(SUM(IF(grupo.grupoGasto = 'Ultraprocesados', grupo.porcentaje, NULL)),
                             0) * 100 as ultraprocesados_porcentaje,
		preinspeccionGastoTributoId,
		productoGastoTributoId
	from
		((
		select
			ppt.preinspeccion_id as preinspeccionGastoTributoId,
			ct.nombre as gasto,
			cg.nombre as grupoGasto,
			ppt.porcentaje,
			ppt.producto_id as productoGastoTributoId
		from
			preinspeccion_productos_tributos as ppt
		inner join compras_impuestos as ci on
			ppt.compraimpuesto_id = ci.id
		inner join conceptos_tributarios as ct on
			ci.conceptotributario_id = ct.id
		inner join constantes as cg on
			ct.grupo_id = cg.id
		group by
			ppt.preinspeccion_id,
			cg.nombre,
			ppt.producto_id
		)
union all (
	select
		pg.preinspeccion_id as preinspeccionGastoTributoId,
		g.nombre as gasto,
		gg.nombre as grupoGasto,
		pg.porcentaje,
		pg.producto_id as productoGastoTributoId
	from
		preinspeccion_productos_detalles_gastos as pg
	inner join compras_gastos as cg on
		pg.compragasto_id = cg.id
	inner join gastos as g on
		cg.gasto_id = g.id
	left join grupos_gastos as gg on
		g.grupogasto_id = gg.id
	group by
		pg.preinspeccion_id,
		gg.nombre,
		pg.producto_id
	)) as grupo
	group by
		preinspeccionGastoTributoId,
		productoGastoTributoId)
	select
		di.preinspeccionId,
		di.embarqueId,
		di.fecha,
		CONCAT_WS(' - ', e.consecutivo, dw.nombre) as embarque, 
		di.compra,
		di.proveedor,
		di.cliente,
		di.productoId,
		di.producto,
		di.descripcion,
		di.costounitariocompleto,
		dc.costo,
		di.precio,
		di.utilidad,
		dc.cantidad,
		dc.valorCompra,
		dc.cantidadPorNacionalizar,
		dc.cantidadNacionalizada,
		COALESCE((dc.cantidad / dc.cantidadNacionalizada) * 100, 0) as porcentajeNacionalizado,
		(dc.valorCompra / dt.total) * 100 as prorrateo,
		di.compraId,
		di.proveedorId,
		di.clienteId,
		di.gastos_administrativos,
		gastos_administrativos_porcentaje,
		di.gastos_aduaneros_y_tributarios,
		gastos_aduaneros_y_tributarios_porcentaje,
		di.gastos_comerciales,
		gastos_comerciales_porcentaje,
		di.gastos_costos_indirectos,
		gastos_costos_indirectos_porcentaje,
		di.gastos_de_destino,
		gastos_de_destino_porcentaje,
		di.gastos_de_manejo_y_logística,
		gastos_de_manejo_y_logística_porcentaje,
		di.gastos_de_seguro,
		gastos_de_seguro_porcentaje,
		di.gastos_de_transporte,
		gastos_de_transporte_porcentaje,
		di.gastos_financieros,
		gastos_financieros_porcentaje,
		di.gastos_operativos,
		gastos_operativos_porcentaje,
		di.otros,
		otros_porcentaje,
		di.antidumping,
		antidumping_porcentaje,
		di.arancel,
		arancel_porcentaje,
		di.iva,
		iva_porcentaje,
		di.ultraprocesados,
		ultraprocesados_porcentaje,
		di.totalGastos,
		di.totalTributos,
		di.totalGastos + di.totalTributos as totalGastosImpuestos,
		di.totalGastos / dc.cantidad as costoUnitarioGasto,
		(di.totalGastos + di.totalTributos) / dc.cantidad as costoUnitarioGastoImpuesto,
		di.totalTributos / dc.cantidadNacionalizada as costoUnitarioImpuesto,
		((di.totalGastos + di.totalTributos) / dc.cantidad) + dc.costo as costoUnitarioCompletoCalculado
	from
		data_inventario as di
	join data_cantidadCompra as dc
              on
		(di.productoId = dc.producto_id
			and di.preinspeccionId = dc.preinspeccionCompraId)
	join data_compraTotal as dt on
		di.preinspeccionId = dt.preinspeccionIdTotal
	join data_preinspeccionGastoTributo as dgt on
		di.preinspeccionId = dgt.preinspeccionGastoTributoId
		and di.productoId = dgt.productoGastoTributoId
	left join embarques e on
		di.embarqueId = e.id
	left join documentos_wms dw on
		e.documentowms_id = dw.id) as inventario
where
	(inventario.preinspeccionId = ?);
        `;
}

module.exports = { getPreinspectionAuditQuery };