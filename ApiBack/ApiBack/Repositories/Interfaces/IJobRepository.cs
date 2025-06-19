using ApiBack.Models;

namespace ApiBack.Repositories.Interfaces
{
    public interface IJobRepository
    {
        Task<IEnumerable<Job>> GetAllAsync();
        Task<Job?> GetByIdAsync(int id_Job);
        Task<int> InsertAsync(Job job);
        Task<int> UpdateAsync(Job job);
        Task<int> DeleteAsync(int id_Job);
    }
} 