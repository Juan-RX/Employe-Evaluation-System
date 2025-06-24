using ApiBack.Models;
using ApiBack.Data;
using ApiBack.Repositories.Interfaces;
using Dapper;

namespace ApiBack.Repositories
{
    public class JobRepository : IJobRepository
    {
        private readonly DbContextDapper _dapper;
        public JobRepository(DbContextDapper dapper)
        {
            _dapper = dapper;
        }

        public async Task<IEnumerable<Job>> GetAllAsync()
        {
            using var connection = _dapper.CreateConnection();
            return await connection.QueryAsync<Job>("GetAllJobs", commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Job?> GetByIdAsync(int id_Job)
        {
            using var connection = _dapper.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Job>("GetJobById", new { id_Job }, commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<int> InsertAsync(Job job)
        {
            using var connection = _dapper.CreateConnection();
            return await connection.ExecuteAsync(
                "InsertJob",
                new { job.name_Job },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<int> UpdateAsync(Job job)
        {
            using var connection = _dapper.CreateConnection();
            return await connection.ExecuteAsync(
                "UpdateJob",
                new { job.id_Job, job.name_Job },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<int> DeleteAsync(int id_Job)
        {
            using var connection = _dapper.CreateConnection();
            return await connection.ExecuteAsync("DeleteJob", new { id_Job }, commandType: System.Data.CommandType.StoredProcedure);
        }
    }
} 