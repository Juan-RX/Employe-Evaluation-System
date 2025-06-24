using Microsoft.AspNetCore.Mvc;
using ApiBack.Repositories.Interfaces;
using ApiBack.Models;
using Microsoft.AspNetCore.Authorization;

namespace ApiBack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class JobController : ControllerBase
    {
        private readonly IJobRepository _repo;

        public JobController(IJobRepository repo)
        {
            _repo = repo;
        }

        [HttpPost("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var jobs = await _repo.GetAllAsync();
            return Ok(jobs);
        }

        [HttpPost("GetById")]
        public async Task<IActionResult> GetById([FromBody] int id_Job)
        {
            var job = await _repo.GetByIdAsync(id_Job);
            return Ok(job);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] Job job)
        {
            var result = await _repo.InsertAsync(job);
            return Ok(result);
        }

        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromBody] Job job)
        {
            var result = await _repo.UpdateAsync(job);
            return Ok(result);
        }

        [HttpPost("Delete")]
        public async Task<IActionResult> Delete([FromBody] int id_Job)
        {
            try
            {
                var result = await _repo.DeleteAsync(id_Job);
                return Ok(result);
            }
            catch (Microsoft.Data.SqlClient.SqlException ex)
            {
                if (ex.Number == 50000) // Mensaje personalizado desde SQL Server
                    return BadRequest(new { message = ex.Message });
                return StatusCode(500, new { message = "Error interno del servidor." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
} 