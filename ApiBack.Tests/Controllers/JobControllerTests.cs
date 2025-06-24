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
    public class JobControllerTests
    {
        [Fact]
        public async Task GetAll_ReturnsListOfJobs()
        {
            // Arrange
            var mockRepo = new Mock<IJobRepository>();
            mockRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(new List<Job>
            {
                new Job { id_Job = 1, name_Job = "Gerente" }
            });
            var controller = new JobController(mockRepo.Object);

            // Act
            var result = await controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var jobs = Assert.IsAssignableFrom<IEnumerable<Job>>(okResult.Value);
            Assert.Single(jobs);
        }

        [Fact]
        public async Task GetById_ReturnsJob()
        {
            // Arrange
            var mockRepo = new Mock<IJobRepository>();
            var job = new Job { id_Job = 2, name_Job = "Analista" };
            mockRepo.Setup(repo => repo.GetByIdAsync(2)).ReturnsAsync(job);
            var controller = new JobController(mockRepo.Object);

            // Act
            var result = await controller.GetById(2);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var jobResult = Assert.IsType<Job>(okResult.Value);
            Assert.Equal(2, jobResult.id_Job);
        }

        [Fact]
        public async Task Insert_ReturnsResult()
        {
            // Arrange
            var mockRepo = new Mock<IJobRepository>();
            var job = new Job { id_Job = 3, name_Job = "Desarrollador" };
            mockRepo.Setup(repo => repo.InsertAsync(job)).ReturnsAsync(1);
            var controller = new JobController(mockRepo.Object);

            // Act
            var result = await controller.Insert(job);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var insertResult = Assert.IsType<int>(okResult.Value);
            Assert.Equal(1, insertResult);
        }

        [Fact]
        public async Task Update_ReturnsResult()
        {
            // Arrange
            var mockRepo = new Mock<IJobRepository>();
            var job = new Job { id_Job = 4, name_Job = "Tester" };
            mockRepo.Setup(repo => repo.UpdateAsync(job)).ReturnsAsync(1);
            var controller = new JobController(mockRepo.Object);

            // Act
            var result = await controller.Update(job);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var updateResult = Assert.IsType<int>(okResult.Value);
            Assert.Equal(1, updateResult);
        }

        [Fact]
        public async Task Delete_ReturnsResult()
        {
            // Arrange
            var mockRepo = new Mock<IJobRepository>();
            mockRepo.Setup(repo => repo.DeleteAsync(5)).ReturnsAsync(1);
            var controller = new JobController(mockRepo.Object);

            // Act
            var result = await controller.Delete(5);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var deleteResult = Assert.IsType<int>(okResult.Value);
            Assert.Equal(1, deleteResult);
        }
    }
} 