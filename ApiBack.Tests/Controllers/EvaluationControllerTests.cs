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
    public class EvaluationControllerTests
    {
        [Fact]
        public async Task GetAll_ReturnsListOfEvaluations()
        {
            // Arrange
            var mockRepo = new Mock<IEvaluationRepository>();
            mockRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(new List<Evaluation>
            {
                new Evaluation { id_Evaluation = 1, id_employee = 1, evaluation_Date = "2024-01-01", productivity = 90, punctuality = 95, work_quality = 92, communication = 93, willingness_to_learn = 94, honesty = 95, initiative = 96, teamwork = 97, comments = "Muy bien" }
            });
            var controller = new EvaluationController(mockRepo.Object);

            // Act
            var result = await controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var evaluations = Assert.IsAssignableFrom<IEnumerable<Evaluation>>(okResult.Value);
            Assert.Single(evaluations);
        }

        [Fact]
        public async Task GetById_ReturnsEvaluation()
        {
            // Arrange
            var mockRepo = new Mock<IEvaluationRepository>();
            var evaluation = new Evaluation { id_Evaluation = 2, id_employee = 2, evaluation_Date = "2024-02-02", productivity = 80, punctuality = 85, work_quality = 82, communication = 83, willingness_to_learn = 84, honesty = 85, initiative = 86, teamwork = 87, comments = "Bien" };
            mockRepo.Setup(repo => repo.GetByIdAsync(2)).ReturnsAsync(evaluation);
            var controller = new EvaluationController(mockRepo.Object);

            // Act
            var result = await controller.GetById(2);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var evaluationResult = Assert.IsType<Evaluation>(okResult.Value);
            Assert.Equal(2, evaluationResult.id_Evaluation);
        }

        [Fact]
        public async Task GetByEmployee_ReturnsEvaluations()
        {
            // Arrange
            var mockRepo = new Mock<IEvaluationRepository>();
            mockRepo.Setup(repo => repo.GetByEmployeeAsync(3)).ReturnsAsync(new List<Evaluation>
            {
                new Evaluation { id_Evaluation = 3, id_employee = 3, evaluation_Date = "2024-03-03", productivity = 70, punctuality = 75, work_quality = 72, communication = 73, willingness_to_learn = 74, honesty = 75, initiative = 76, teamwork = 77, comments = "Regular" }
            });
            var controller = new EvaluationController(mockRepo.Object);

            // Act
            var result = await controller.GetByEmployee(3);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var evaluations = Assert.IsAssignableFrom<IEnumerable<Evaluation>>(okResult.Value);
            Assert.Single(evaluations);
        }

        [Fact]
        public async Task Insert_ReturnsResult()
        {
            // Arrange
            var mockRepo = new Mock<IEvaluationRepository>();
            var evaluation = new Evaluation { id_Evaluation = 4, id_employee = 4, evaluation_Date = "2024-04-04", productivity = 60, punctuality = 65, work_quality = 62, communication = 63, willingness_to_learn = 64, honesty = 65, initiative = 66, teamwork = 67, comments = "Suficiente" };
            mockRepo.Setup(repo => repo.InsertAsync(evaluation)).ReturnsAsync(1);
            var controller = new EvaluationController(mockRepo.Object);

            // Act
            var result = await controller.Insert(evaluation);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var insertResult = Assert.IsType<int>(okResult.Value);
            Assert.Equal(1, insertResult);
        }

        [Fact]
        public async Task Update_ReturnsResult()
        {
            // Arrange
            var mockRepo = new Mock<IEvaluationRepository>();
            var evaluation = new Evaluation { id_Evaluation = 5, id_employee = 5, evaluation_Date = "2024-05-05", productivity = 50, punctuality = 55, work_quality = 52, communication = 53, willingness_to_learn = 54, honesty = 55, initiative = 56, teamwork = 57, comments = "Mejorar" };
            mockRepo.Setup(repo => repo.UpdateAsync(evaluation)).ReturnsAsync(1);
            var controller = new EvaluationController(mockRepo.Object);

            // Act
            var result = await controller.Update(evaluation);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var updateResult = Assert.IsType<int>(okResult.Value);
            Assert.Equal(1, updateResult);
        }

        [Fact]
        public async Task Delete_ReturnsResult()
        {
            // Arrange
            var mockRepo = new Mock<IEvaluationRepository>();
            mockRepo.Setup(repo => repo.DeleteAsync(6)).ReturnsAsync(1);
            var controller = new EvaluationController(mockRepo.Object);

            // Act
            var result = await controller.Delete(6);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var deleteResult = Assert.IsType<int>(okResult.Value);
            Assert.Equal(1, deleteResult);
        }
    }
} 