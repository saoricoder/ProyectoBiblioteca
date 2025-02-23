using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi3.Data.Contabilidad_data;
using WebApi3.Models.Contabilidad;
using WebApi3.Models.Contabilidad_models;

namespace WebApi3.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class Contabilidad(AppDbContext_contabilidad context) : ControllerBase
    {
        private readonly AppDbContext_contabilidad _context = context;

        //GET: api/comprobante
        [HttpGet("comprobante")]
        public List<Comprobante_models> GetComprobantes()
        {
            return Comprobante_data.ConsultarComprobantes();
        }

        //GET: api/comprobante/5
        [HttpGet("comprobante/{id}")]
        public IActionResult GetComprobante(int id)
        {
            if (id <= 0)
            {
                return BadRequest("El ID proporcionado no es válido.");
            }

            try
            {
                var comprobante = Comprobante_data.ConsultarComprobante(id);

                if (comprobante == null)
                {
                    return NotFound($"No se encontró un Comprobante con el ID {id}.");
                }

                return Ok(comprobante);
            }
            catch (Exception)
            {
                // Puedes registrar el error aquí si usas un logger
                return StatusCode(500, "Ocurrió un error en el servidor. Inténtalo más tarde.");
            }
        }


        //GET: api/comprobante/buscar
        [HttpGet("comprobante/buscar")]
        public IActionResult GetBuscar([FromQuery] int? numero = null, [FromQuery] string? fecha = null)
        {
            try
            {
                // Llamada al método de datos con los parámetros proporcionados.
                var resultados = Comprobante_data.BuscarComprobante(numero, fecha);

                // Verificar si se encontraron resultados.
                if (resultados == null || resultados.Count == 0)
                {
                    // En lugar de "NotFound", devolver "NoContent" ya que no se encontraron resultados con los parámetros.
                    return NoContent(); // 204 No Content
                }

                // Retornar los resultados exitosamente con un código 200.
                return Ok(resultados);
            }
            catch (Exception ex)
            {
                // Manejo de excepciones: Devolvemos un estado 500 con un mensaje detallado del error.
                return StatusCode(500, new { message = "Ocurrió un error inesperado al procesar la búsqueda de comprobantes.", error = ex.Message });
            }
        }

        //POST: api/comprobante
        [HttpPost("comprobante")]
        public bool PostComprobante([FromBody] Comprobante_models OComprobante)
        {
            return Comprobante_data.InsertarComprobante(OComprobante);
        }

        //PUT: api/comprobante/5
        [HttpPut("comprobante/{id}")]
        public IActionResult PutComprobante(int id, [FromBody] Comprobante_models OComprobante)
        {
            try
            {
                Console.WriteLine($"Solicitud recibida para actualizar comprobante con ID: {id}");

                // Validación del ID: debe ser un número positivo
                if (id <= 0)
                {
                    return BadRequest(new { message = "El ID proporcionado no es válido." });
                }

                // Validación del cuerpo de la solicitud (Comprobante)
                if (OComprobante == null)
                {
                    return BadRequest(new { message = "El cuerpo de la solicitud no puede estar vacío." });
                }

                Console.WriteLine($"Datos recibidos: Fecha = {OComprobante.Fecha}, Observaciones = {OComprobante.Observaciones}");

                // Comprobamos si el comprobante realmente existe antes de actualizarlo
                var comprobanteExistente = Comprobante_data.ConsultarComprobante(id);
                if (comprobanteExistente == null)
                {
                    return NotFound(new { message = "No se encontró un comprobante con el ID proporcionado." });
                }

                // Intentamos actualizar el comprobante
                bool actualizado = Comprobante_data.ActualizarComprobante(id, OComprobante);

                // Verificamos si la actualización fue exitosa
                if (actualizado)
                {
                    return Ok(new { message = "Comprobante actualizado correctamente." });
                }
                else
                {
                    return StatusCode(500, new { message = "No se pudo actualizar el comprobante. Verifica los datos enviados." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en PutComprobante: {ex.Message}");
                return StatusCode(500, new { message = "Ocurrió un error al actualizar el comprobante.", error = ex.Message });
            }
        }

        //DELETE: api/comprobante/5
        [HttpDelete("comprobante/{id}")]
        public bool DeleteComprobante(int id)
        {
            return Comprobante_data.EliminarComprobante(id);
        }

        //GET: api/detalle_comprobante
        [HttpGet("detalle_comprobante")]
        public List<DetalleComprobante_models> GetDetalle_Comprobantes()
        {
            return DetalleComprobante_data.ConsultarDetalles();
        }

        //GET: api/detalle_comprobante/5
        [HttpGet("detalle_comprobante/obtener/{id}")]
        public IActionResult GetDetalleComprobante(int id)
        {
            if (id <= 0)
            {
                return BadRequest("El ID proporcionado no es válido.");
            }

            try
            {
                var detalleComprobante = DetalleComprobante_data.ConsultarDetalle(id);

                if (detalleComprobante == null)
                {
                    return NotFound($"No se encontró un Detalle de Comprobante con el ID {id}.");
                }

                return Ok(detalleComprobante);
            }
            catch (Exception)
            {
                // Puedes registrar el error aquí si usas un logger
                return StatusCode(500, "Ocurrió un error en el servidor. Inténtalo más tarde.");
            }
        }


        //GET: api/detalle_comprobante
        [HttpGet("detalle_comprobante/{id}")]
        public List<DetalleComprobante_models> GetObtener_Comprobante(int id)
        {
            return DetalleComprobante_data.ObtenerDetalles(id);
        }

        //GET: api/comprobante/buscar
        [HttpGet("detalle_comprobante/buscar")]
        public IActionResult GetBuscarDetalle([FromQuery] int? debe = null, [FromQuery] string? cuenta = null, [FromQuery] int? haber = null)
        {
            try
            {
                // Llamada al método de datos con los parámetros proporcionados.
                var resultados = DetalleComprobante_data.BuscarDetalle(haber, cuenta, debe);

                // Verificar si se encontraron resultados.
                if (resultados == null || resultados.Count == 0)
                {
                    // En lugar de "NotFound", devolver "NoContent" ya que no se encontraron resultados con los parámetros.
                    return NoContent(); // 204 No Content
                }

                // Retornar los resultados exitosamente con un código 200.
                return Ok(resultados);
            }
            catch (Exception ex)
            {
                // Manejo de excepciones: Devolvemos un estado 500 con un mensaje detallado del error.
                return StatusCode(500, new { message = "Ocurrió un error inesperado al procesar la búsqueda de comprobantes.", error = ex.Message });
            }
        }

        //POST: api/comprobante
        [HttpPost("detalle_comprobante")]
        public bool PostDetalle_Comprobante([FromBody] DetalleComprobante_models ODetalle)
        {
            return DetalleComprobante_data.InsertarDetalle(ODetalle);
        }

        //PUT: api/comprobante/5
        [HttpPut("detalle_comprobante/{id}")]
        public IActionResult PutDetalle_Comprobante(int id, [FromBody] DetalleComprobante_models ODetalle)
        {
            try
            {
                // Validación del ID: debe ser un número positivo
                if (id <= 0)
                {
                    return BadRequest(new { message = "El ID proporcionado no es válido." });
                }

                // Validación del cuerpo de la solicitud (Detalle Comprobante)
                if (ODetalle == null)
                {
                    return BadRequest(new { message = "El cuerpo de la solicitud no puede estar vacío." });
                }

                // Intentamos actualizar el detalle del comprobante
                bool actualizado = DetalleComprobante_data.ActualizarDetalle(id, ODetalle);

                // Verificamos si la actualización fue exitosa
                if (actualizado)
                {
                    return Ok(new { message = "Detalle de comprobante actualizado correctamente." });
                }
                else
                {
                    return NotFound(new { message = "No se encontró un detalle de comprobante con el ID proporcionado." });
                }
            }
            catch (Exception ex)
            {
                // Captura cualquier error inesperado y devuelve una respuesta adecuada
                return StatusCode(500, new { message = "Ocurrió un error al actualizar el detalle del comprobante.", error = ex.Message });
            }
        }

        //DELETE: api/comprobante/5
        [HttpDelete("detalle_comprobante/{id}")]
        public bool DeleteDetalle_Comprobante(int id)
        {
            return DetalleComprobante_data.EliminarDetalle(id);
        }
        //DELETE: api/comprobante/eliminar/5
        [HttpDelete("detalle_comprobante/eliminar/{id}")]
        public bool DeleteDetalleComprobante(int id)
        {
            return DetalleComprobante_data.EliminarDetalleUno(id);
        }

        //GET: api/cuenta
        [HttpGet("cuenta")]
        public List<Cuentas_models> GetCuentas()
        {
            return Cuentas_data.ConsultarCuentas();
        }

        //GET: api/cuenta/5
        [HttpGet("cuenta/{id}")]
        public Cuentas_models GetCuenta(int id)
        {
            return Cuentas_data.ConsultarCuenta(id);
        }

        //GET: api/cuenta/buscar
        [HttpGet("cuenta/buscar")]
        public IActionResult GetBuscarCuenta([FromQuery] int? id = null, [FromQuery] string? nombre = null, [FromQuery] string? tipo = null)
        {
            try
            {
                // Llamar al método de datos con los parámetros opcionales.
                var resultados = Cuentas_data.BuscarCuenta(id, nombre, tipo);

                // Verificar si hay resultados.
                if (resultados == null || resultados.Count == 0)
                {
                    // En lugar de retornar "NotFound", devolver "NoContent" para indicar que no hay resultados.
                    return NoContent(); // 204 No Content
                }

                // Devolver resultados con estado 200 OK.
                return Ok(resultados);
            }
            catch (Exception ex)
            {
                // Manejo de excepciones: devolver estado 500 con un mensaje de error detallado.
                return StatusCode(500, new { message = "Ocurrió un error inesperado al procesar la solicitud de búsqueda de cuentas.", error = ex.Message });
            }
        }

        //POST: api/cuenta
        [HttpPost("cuenta")]
        public bool PostCuenta([FromBody] Cuentas_models OCuenta)
        {
            return Cuentas_data.InsertarCuenta(OCuenta);
        }

        //PUT: api/cuenta/5
        [HttpPut("cuenta/{id}")]
        public IActionResult PutCuenta(int id, [FromBody] Cuentas_models OCuenta)
        {
            try
            {
                // Validación del ID: debe ser un número positivo
                if (id <= 0)
                {
                    return BadRequest(new { message = "El ID proporcionado no es válido." });
                }

                // Validación del cuerpo de la solicitud
                if (OCuenta == null)
                {
                    return BadRequest(new { message = "El cuerpo de la solicitud no puede estar vacío." });
                }

                // Intentamos actualizar la cuenta
                bool actualizado = Cuentas_data.ActualizarCuenta(id, OCuenta);

                // Verificamos si la actualización fue exitosa
                if (actualizado)
                {
                    return Ok(new { message = "Cuenta actualizada correctamente." });
                }
                else
                {
                    return NotFound(new { message = "No se encontró una cuenta con el ID proporcionado." });
                }
            }
            catch (Exception ex)
            {
                // Captura cualquier error inesperado y devuelve una respuesta adecuada
                return StatusCode(500, new { message = "Ocurrió un error al actualizar la cuenta.", error = ex.Message });
            }
        }


        //DELETE: api/cuenta/5
        [HttpDelete("cuenta/{id}")]
        public bool DeleteCuenta(int id)
        {
            return Cuentas_data.EliminarCuenta(id);
        }

        //GET: api/tipodecuenta
        [HttpGet("tipodecuenta")]
        public List<TipoDeCuenta_models> GetTipoDeCuentas()
        {
            return TipoDeCuenta_data.ConsultarTipoDeCuentas();
        }

        //GET: api/tipodecuenta/5
        [HttpGet("tipodecuenta/{id}")]
        public IActionResult GetTipoDeCuenta(int id)
        {
            if (id <= 0)
            {
                return BadRequest("El ID proporcionado no es válido.");
            }

            try
            {
                var tipoDeCuenta = TipoDeCuenta_data.ConsultarTipoDeCuenta(id);

                if (tipoDeCuenta == null)
                {
                    return NotFound($"No se encontró un Tipo de Cuenta con el ID {id}.");
                }

                return Ok(tipoDeCuenta);
            }
            catch (Exception)
            {
                // Puedes agregar un logger aquí para registrar el error
                return StatusCode(500, "Ocurrió un error en el servidor. Inténtalo más tarde.");
            }
        }


        //GET: api/tipodecuenta/buscar
        [HttpGet("tipodecuenta/buscar")]
        public IActionResult GetBuscarTipoDeCuenta([FromQuery] int? codigo = null, [FromQuery] string? nombre = null)
        {
            try
            {
                // Llamar al método de datos con los parámetros opcionales.
                var resultados = TipoDeCuenta_data.BuscarTipoDeCuenta(codigo, nombre);

                // Verificar si hay resultados.
                if (resultados == null || resultados.Count == 0)
                {
                    // En lugar de NotFound, retornar un código 204 con un mensaje apropiado para indicar sin contenido.
                    return NoContent(); // 204 No Content
                }

                // Devolver resultados con estado 200 OK.
                return Ok(resultados);
            }
            catch (Exception ex)
            {
                // Manejo de errores: devolver 500 con mensaje de error detallado.
                return StatusCode(500, new { message = "Ocurrió un error inesperado al procesar la solicitud.", error = ex.Message });
            }
        }

        //POST: api/tipodecuenta
        [HttpPost("tipodecuenta")]
        public bool PostTipoDeCuenta([FromBody] TipoDeCuenta_models OTipoDeCuenta)
        {
            return TipoDeCuenta_data.InsertarTipoDeCuenta(OTipoDeCuenta);
        }

        //PUT: api/tipodecuenta/5
        [HttpPut("tipodecuenta/{id}")]
        public IActionResult PutTipoDeCuenta(int id, [FromBody] TipoDeCuenta_models OTipoDeCuenta)
        {
            try
            {
                // Validar si el ID es un número positivo
                if (id <= 0)
                {
                    return BadRequest(new { message = "El ID proporcionado no es válido." });
                }

                // Validar si el objeto recibido no es nulo
                if (OTipoDeCuenta == null)
                {
                    return BadRequest(new { message = "El cuerpo de la solicitud no puede estar vacío." });
                }

                // Intentar actualizar la cuenta
                bool actualizado = TipoDeCuenta_data.ActualizarTipodeCuenta(id, OTipoDeCuenta);

                // Evaluar el resultado
                if (actualizado)
                {
                    return Ok(new { message = "Tipo de cuenta actualizado correctamente." });
                }
                else
                {
                    return NotFound(new { message = "No se encontró un tipo de cuenta con el ID proporcionado." });
                }
            }
            catch (Exception ex)
            {
                // Manejo global de errores
                return StatusCode(500, new { message = "Ocurrió un error al actualizar el tipo de cuenta.", error = ex.Message });
            }
        }

        //DELETE: api/tipodecuenta/5
        [HttpDelete("tipodecuenta/{id}")]
        public bool DeleteTipoDeCuenta(int id)
        {
            return TipoDeCuenta_data.EliminarTipoDeCuenta(id);
        }

        //GET: api/balance
        [HttpGet("balance")]
        public async Task<ActionResult<BalanceGeneral_models>> ObtenerBalanceGeneral()
        {
            var balance = new BalanceGeneral_models
            {
                Activos = await _context.Cuenta
                    .Where(c => c.TipoDeCuenta == "Activo")
                    .Select(c => new CuentaSaldo_models
                    {
                        Codigo = c.Codigo,
                        Nombre = c.Nombre ?? string.Empty, // Fix for CS8601
                        Saldo = c.Saldo
                    }).ToListAsync(),

                Pasivos = await _context.Cuenta
                    .Where(c => c.TipoDeCuenta == "Pasivo")
                    .Select(c => new CuentaSaldo_models
                    {
                        Codigo = c.Codigo,
                        Nombre = c.Nombre ?? string.Empty, // Fix for CS8601
                        Saldo = c.Saldo
                    }).ToListAsync(),

                Capital = await _context.Cuenta
                    .Where(c => c.TipoDeCuenta == "Capital")
                    .Select(c => new CuentaSaldo_models
                    {
                        Codigo = c.Codigo,
                        Nombre = c.Nombre ?? string.Empty, // Fix for CS8601
                        Saldo = c.Saldo
                    }).ToListAsync()
            };

            return Ok(balance);
        }

        //GET: api/resultados
        [HttpGet("resultados")]
        public async Task<ActionResult<EstadoResultado_models>> ObtenerEstadoResultados()
        {
            var estadoResultados = new EstadoResultado_models
            {
                Ingresos = await _context.Cuenta
                    .Where(c => c.TipoDeCuenta == "Ingreso")
                    .Select(c => new CuentaSaldo_models
                    {
                        Codigo = c.Codigo,
                        Nombre = c.Nombre ?? string.Empty, // Fix for CS8601
                        Saldo = c.Saldo
                    }).ToListAsync(),

                Egresos = await _context.Cuenta
                    .Where(c => c.TipoDeCuenta == "Egreso")
                    .Select(c => new CuentaSaldo_models
                    {
                        Codigo = c.Codigo,
                        Nombre = c.Nombre ?? string.Empty, // Fix for CS8601
                        Saldo = c.Saldo
                    }).ToListAsync(),

                Utilidad = await _context.Cuenta
                    .Where(c => c.TipoDeCuenta == "Utilidad")
                    .Select(c => new CuentaSaldo_models
                    {
                        Codigo = c.Codigo,
                        Nombre = c.Nombre ?? string.Empty, // Fix for CS8601
                        Saldo = c.Saldo
                    }).ToListAsync() // Calcular la suma total de las cuentas de utilidad
            };

            return Ok(estadoResultados);
        }
    }
}
