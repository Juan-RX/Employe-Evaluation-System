using Microsoft.AspNetCore.Mvc;
using ApiBack.Repositories.Interfaces;
using ApiBack.Models;
using Microsoft.AspNetCore.Authorization;

namespace ApiBack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeController : ControllerBase
    {
        private readonly IEmployeRepository _repo;

        public EmployeController(IEmployeRepository repo)
        {
            _repo = repo;
        }

        [HttpPost("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var empleados = await _repo.GetAllAsync();
            return Ok(empleados);
        }

        [HttpPost("GetById")]
        public async Task<IActionResult> GetById([FromBody] int id_Employee)
        {
            var empleado = await _repo.GetByIdAsync(id_Employee);
            return Ok(empleado);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] Employe employe)
        {
            var result = await _repo.InsertAsync(employe);
            return Ok(result);
        }

        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromBody] Employe employe)
        {
            var result = await _repo.UpdateAsync(employe);
            return Ok(result);
        }

        [HttpPost("Delete")]
        public async Task<IActionResult> Delete([FromBody] int id_Employee)
        {
            var result = await _repo.DeleteAsync(id_Employee);
            return Ok(result);
        }
    }
} 