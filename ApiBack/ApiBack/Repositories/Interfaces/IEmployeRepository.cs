using ApiBack.Models;

namespace ApiBack.Repositories.Interfaces
{
    public interface IEmployeRepository
    {
        Task<IEnumerable<Employe>> GetAllAsync();
        Task<Employe?> GetByIdAsync(int id_Employee);
        Task<int> InsertAsync(Employe employe);
        Task<int> UpdateAsync(Employe employe);
        Task<int> DeleteAsync(int id_Employee);
    }
} 