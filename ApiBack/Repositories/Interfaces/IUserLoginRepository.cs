using ApiBack.Models;

namespace ApiBack.Repositories.Interfaces
{
    public interface IUserLoginRepository
    {
        Task<UserLogin?> LoginAsync(string username, string userPassword);
    }
} 