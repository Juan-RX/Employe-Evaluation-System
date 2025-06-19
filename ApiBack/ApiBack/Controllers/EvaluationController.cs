using Microsoft.AspNetCore.Mvc;
using ApiBack.Repositories.Interfaces;
using ApiBack.Models;
using CsvHelper;
using System.Globalization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;

namespace ApiBack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EvaluationController : ControllerBase
    {
        private readonly IEvaluationRepository _repo;

        public EvaluationController(IEvaluationRepository repo)
        {
            _repo = repo;
        }

        [HttpPost("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var evaluations = await _repo.GetAllAsync();
            return Ok(evaluations);
        }

        [HttpPost("GetById")]
        public async Task<IActionResult> GetById([FromBody] int id_Evaluation)
        {
            var evaluation = await _repo.GetByIdAsync(id_Evaluation);
            return Ok(evaluation);
        }

        [HttpPost("GetByEmployee")]
        public async Task<IActionResult> GetByEmployee([FromBody] int id_employee)
        {
            var evaluations = await _repo.GetByEmployeeAsync(id_employee);
            return Ok(evaluations);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] Evaluation evaluation)
        {
            var result = await _repo.InsertAsync(evaluation);
            return Ok(result);
        }

        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromBody] Evaluation evaluation)
        {
            var result = await _repo.UpdateAsync(evaluation);
            return Ok(result);
        }

        [HttpPost("Delete")]
        public async Task<IActionResult> Delete([FromBody] int id_Evaluation)
        {
            var result = await _repo.DeleteAsync(id_Evaluation);
            return Ok(result);
        }
    }
}