using ApiBack.Models;
using ApiBack.Data;
using ApiBack.Repositories.Interfaces;
using Dapper;

namespace ApiBack.Repositories
{
    public class EmployeRepository : IEmployeRepository
    {
        private readonly DbContextDapper _dapper;
        public EmployeRepository(DbContextDapper dapper)
        {
            _dapper = dapper;
        }

        public async Task<IEnumerable<Employe>> GetAllAsync()
        {
            using var connection = _dapper.CreateConnection();
            return await connection.QueryAsync<Employe>("GetAllEmployes", commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Employe?> GetByIdAsync(int id_Employee)
        {
            using var connection = _dapper.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Employe>("GetEmployeById", new { id_Employee }, commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<int> InsertAsync(Employe employe)
        {
            using var connection = _dapper.CreateConnection();
            return await connection.ExecuteAsync(
                "InsertEmploye",
                new
                {
                    employe.name_Employee,
                    employe.lastName_Employee,
                    employe.birthDate,
                    employe.contract_Start_Date,
                    employe.id_Job
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<int> UpdateAsync(Employe employe)
        {
            using var connection = _dapper.CreateConnection();
            return await connection.ExecuteAsync(
                "UpdateEmploye",
                new
                {
                    employe.id_Employee,
                    employe.name_Employee,
                    employe.lastName_Employee,
                    employe.birthDate,
                    employe.contract_Start_Date,
                    employe.id_Job
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<int> DeleteAsync(int id_Employee)
        {
            using var connection = _dapper.CreateConnection();
            return await connection.ExecuteAsync("DeleteEmploye", new { id_Employee }, commandType: System.Data.CommandType.StoredProcedure);
        }
    }
} 