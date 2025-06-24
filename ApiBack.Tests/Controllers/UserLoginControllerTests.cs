using Xunit;
using Moq;
using ApiBack.Controllers;
using ApiBack.Repositories.Interfaces;
using ApiBack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApiBack.Tests.Controllers
{
    public class UserLoginControllerTests
    {
        private IConfiguration GetFakeConfig()
        {
            var inMemorySettings = new Dictionary<string, string> {
                {"Jwt:Key", "supersecretkey1234567890abcdef1234567890"},
                {"Jwt:Issuer", "TestIssuer"},
                {"Jwt:Audience", "TestAudience"}
            };
            return new ConfigurationBuilder().AddInMemoryCollection(inMemorySettings).Build();
        }

        [Fact]
        public async Task Login_ReturnsToken_WhenCredentialsAreCorrect()
        {
            // Arrange
            var mockRepo = new Mock<IUserLoginRepository>();
            var user = new UserLogin { id_user = 1, username = "testuser", userPassword = "password" };
            mockRepo.Setup(repo => repo.LoginAsync("testuser", "password")).ReturnsAsync(user);
            var controller = new UserLoginController(mockRepo.Object, GetFakeConfig());

            // Act
            var result = await controller.Login(new UserLogin { username = "testuser", userPassword = "password" });

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("token", okResult.Value!.ToString());
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenCredentialsAreIncorrect()
        {
            // Arrange
            var mockRepo = new Mock<IUserLoginRepository>();
            mockRepo.Setup(repo => repo.LoginAsync("wronguser", "wrongpass")).ReturnsAsync((UserLogin?)null);
            var controller = new UserLoginController(mockRepo.Object, GetFakeConfig());

            // Act
            var result = await controller.Login(new UserLogin { username = "wronguser", userPassword = "wrongpass" });

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Usuario o contraseña incorrectos", unauthorizedResult.Value);
        }
    }
} 