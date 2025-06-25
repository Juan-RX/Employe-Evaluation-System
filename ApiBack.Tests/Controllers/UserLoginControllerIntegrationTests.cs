using Xunit;
using ApiBack.Controllers;
using ApiBack.Repositories;
using ApiBack.Data;
using ApiBack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Threading.Tasks;

namespace ApiBack.Tests.Controllers
{
    public class UserLoginControllerIntegrationTests
    {
        private IConfiguration GetRealConfig()
        {
            // Carga la configuración real desde appsettings.json
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            return builder.Build();
        }

        [Fact]
        public async Task Login_ReturnsToken_WithRealDatabase()
        {
            // Arrange
            var config = GetRealConfig();
            var dapper = new DbContextDapper(config);
            var repo = new UserLoginRepository(dapper);
            var controller = new UserLoginController(repo, config);

            // Act
            var result = await controller.Login(new UserLogin { username = "Juan", userPassword = "Juan123" });

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("token", okResult.Value!.ToString());
        }
    }
} 