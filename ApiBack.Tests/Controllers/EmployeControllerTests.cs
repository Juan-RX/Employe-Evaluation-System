using Xunit;
using Moq;
using ApiBack.Controllers;
using ApiBack.Repositories.Interfaces;
using ApiBack.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApiBack.Tests.Controllers
{
    public class EmployeControllerTests
    {
        [Fact]
        public async Task GetAll_ReturnsListOfEmployees()
        {
            // Arrange
            var mockRepo = new Mock<IEmployeRepository>();
            mockRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(new List<Employe>
            {
                new Employe { id_Employee = 1, name_Employee = "Juan", lastName_Employee = "Pérez", birthDate = "1990-01-01", contract_Start_Date = "2020-01-01", id_Job = 1 }
            });
            var controller = new EmployeController(mockRepo.Object);

            // Act
            var result = await controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var empleados = Assert.IsAssignableFrom<IEnumerable<Employe>>(okResult.Value);
            Assert.Single(empleados);
        }

        [Fact]
        public async Task GetById_ReturnsEmployee()
        {
            // Arrange
            var mockRepo = new Mock<IEmployeRepository>();
            var empleado = new Employe { id_Employee = 2, name_Employee = "Ana", lastName_Employee = "García", birthDate = "1992-02-02", contract_Start_Date = "2021-02-02", id_Job = 2 };
            mockRepo.Setup(repo => repo.GetByIdAsync(2)).ReturnsAsync(empleado);
            var controller = new EmployeController(mockRepo.Object);

            // Act
            var result = await controller.GetById(2);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var empleadoResult = Assert.IsType<Employe>(okResult.Value);
            Assert.Equal(2, empleadoResult.id_Employee);
        }

        [Fact]
        public async Task Insert_ReturnsResult()
        {
            // Arrange
            var mockRepo = new Mock<IEmployeRepository>();
            var empleado = new Employe { id_Employee = 3, name_Employee = "Luis", lastName_Employee = "Martínez", birthDate = "1993-03-03", contract_Start_Date = "2022-03-03", id_Job = 3 };
            mockRepo.Setup(repo => repo.InsertAsync(empleado)).ReturnsAsync(1);
            var controller = new EmployeController(mockRepo.Object);

            // Act
            var result = await controller.Insert(empleado);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var insertResult = Assert.IsType<int>(okResult.Value);
            Assert.Equal(1, insertResult);
        }

        [Fact]
        public async Task Update_ReturnsResult()
        {
            // Arrange
            var mockRepo = new Mock<IEmployeRepository>();
            var empleado = new Employe { id_Employee = 4, name_Employee = "Sofía", lastName_Employee = "López", birthDate = "1994-04-04", contract_Start_Date = "2023-04-04", id_Job = 4 };
            mockRepo.Setup(repo => repo.UpdateAsync(empleado)).ReturnsAsync(1);
            var controller = new EmployeController(mockRepo.Object);

            // Act
            var result = await controller.Update(empleado);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var updateResult = Assert.IsType<int>(okResult.Value);
            Assert.Equal(1, updateResult);
        }

        [Fact]
        public async Task Delete_ReturnsResult()
        {
            // Arrange
            var mockRepo = new Mock<IEmployeRepository>();
            mockRepo.Setup(repo => repo.DeleteAsync(5)).ReturnsAsync(1);
            var controller = new EmployeController(mockRepo.Object);

            // Act
            var result = await controller.Delete(5);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var deleteResult = Assert.IsType<int>(okResult.Value);
            Assert.Equal(1, deleteResult);
        }
    }
} 