using ApiBack.Models;
using ApiBack.Data;
using ApiBack.Repositories.Interfaces;
using Dapper;

namespace ApiBack.Repositories
{
    public class UserLoginRepository : IUserLoginRepository
    {
        private readonly DbContextDapper _dapper;
        public UserLoginRepository(DbContextDapper dapper)
        {
            _dapper = dapper;
        }

        public async Task<UserLogin?> LoginAsync(string username, string userPassword)
        {
            using var connection = _dapper.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<UserLogin>(
                "SELECT * FROM userlogin WHERE username = @username AND userPassword = @userPassword",
                new { username, userPassword });
        }
    }
} 