using ApiBack.Models;

namespace ApiBack.Repositories.Interfaces
{
    public interface IEvaluationRepository
    {
        Task<IEnumerable<Evaluation>> GetAllAsync();
        Task<Evaluation?> GetByIdAsync(int id_Evaluation);
        Task<IEnumerable<Evaluation>> GetByEmployeeAsync(int id_employee);
        Task<int> InsertAsync(Evaluation evaluation);
        Task<int> UpdateAsync(Evaluation evaluation);
        Task<int> DeleteAsync(int id_Evaluation);
        Task<(int success, int fail, List<string> errors)> ImportBulkAsync(IEnumerable<Evaluation> evaluations);
    }
} 