using Microsoft.AspNetCore.Mvc;
using ApiBack.Repositories.Interfaces;
using ApiBack.Models;
using CsvHelper;
using System.Globalization;
using Microsoft.AspNetCore.Mvc.ApiExplorer;

namespace ApiBack.Controllers
{
    public class ImportCsvRequest
    {
        public required IFormFile file { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class EvaluationImportController : ControllerBase
    {
        private readonly IEvaluationRepository _repo;

        public EvaluationImportController(IEvaluationRepository repo)
        {
            _repo = repo;
        }

        [HttpPost("ImportCsv")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ImportCsv([FromForm] ImportCsvRequest request)
        {
            var file = request.file;
            if (file == null || file.Length == 0)
                return BadRequest("No se proporcionó un archivo válido.");

            var evaluations = new List<Evaluation>();
            using (var stream = file.OpenReadStream())
            using (var reader = new StreamReader(stream))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                evaluations = csv.GetRecords<Evaluation>().ToList();
            }

            var (success, fail, errors) = await _repo.ImportBulkAsync(evaluations);
            return Ok(new { success, fail, errors });
        }
    }
} 