using Xunit;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace ApiBack.Tests.Controllers
{
    public class ProtectedEndpointsIntegrationTests
    {
        private readonly string _baseUrl;
        private readonly HttpClient _client;
        private readonly IConfiguration _config;

        public ProtectedEndpointsIntegrationTests()
        {
            _config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();
            _baseUrl = "http://localhost:5194/api"; // Ajusta si tu API corre en otro puerto
            _client = new HttpClient();
        }

        private async Task<string> GetJwtTokenAsync()
        {
            var loginData = new { username = "Juan", userPassword = "Juan123" };
            var content = new StringContent(JsonConvert.SerializeObject(loginData), Encoding.UTF8, "application/json");
            var response = await _client.PostAsync($"{_baseUrl}/UserLogin/Login", content);
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            dynamic obj = JsonConvert.DeserializeObject(json)!;
            return (string)obj.token;
        }

        [Fact]
        public async Task Job_Employe_Evaluation_Insert_Update_Delete_Works()
        {
            var token = await GetJwtTokenAsync();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Helper local para manejar errores y mostrar el contenido
            async Task EnsureSuccessOrPrint(HttpResponseMessage resp, string step)
            {
                if (!resp.IsSuccessStatusCode)
                {
                    var content = await resp.Content.ReadAsStringAsync();
                    throw new System.Exception($"Error en paso '{step}': {(int)resp.StatusCode} {resp.ReasonPhrase}\nContenido: {content}");
                }
            }

            // 1. Insertar Job
            var job = new { id_Job = 0, name_Job = "TestJob" };
            var jobContent = new StringContent(JsonConvert.SerializeObject(job), Encoding.UTF8, "application/json");
            var jobInsertResp = await _client.PostAsync($"{_baseUrl}/Job/Insert", jobContent);
            await EnsureSuccessOrPrint(jobInsertResp, "Insert Job");
            var jobId = int.Parse(await jobInsertResp.Content.ReadAsStringAsync());

            // 2. Insertar Employe usando el Job creado
            var employe = new {
                id_Employee = 0,
                name_Employee = "TestName",
                lastName_Employee = "TestLastName",
                birthDate = "1990-01-01",
                contract_Start_Date = "2020-01-01",
                id_Job = jobId
            };
            var empContent = new StringContent(JsonConvert.SerializeObject(employe), Encoding.UTF8, "application/json");
            var empInsertResp = await _client.PostAsync($"{_baseUrl}/Employe/Insert", empContent);
            await EnsureSuccessOrPrint(empInsertResp, "Insert Employe");
            var empId = int.Parse(await empInsertResp.Content.ReadAsStringAsync());

            // 3. Insertar Employe usando el Job creado
            var employeUpdated = new {
                id_Employee = empId,
                name_Employee = "TestEmpUpdated",
                lastName_Employee = "Test",
                birthDate = "1990-01-01",
                contract_Start_Date = "2024-06-25",
                id_Job = jobId
            };
            var empUpdateContent = new StringContent(JsonConvert.SerializeObject(employeUpdated), Encoding.UTF8, "application/json");
            var empUpdateResp = await _client.PostAsync($"{_baseUrl}/Employe/Update", empUpdateContent);
            await EnsureSuccessOrPrint(empUpdateResp, "Update Employe");

            // 4. Update Job
            var jobUpdate = new { id_Job = jobId, name_Job = "TestJobUpdated" };
            var jobUpdateContent = new StringContent(JsonConvert.SerializeObject(jobUpdate), Encoding.UTF8, "application/json");
            var jobUpdateResp = await _client.PostAsync($"{_baseUrl}/Job/Update", jobUpdateContent);
            await EnsureSuccessOrPrint(jobUpdateResp, "Update Job");

            // 5. Update Employe
            var empUpdate = new {
                id_Employee = empId,
                name_Employee = "TestNameUpdated",
                lastName_Employee = "TestLastNameUpdated",
                birthDate = "1990-01-01",
                contract_Start_Date = "2020-01-01",
                id_Job = jobId
            };
            empUpdateContent = new StringContent(JsonConvert.SerializeObject(empUpdate), Encoding.UTF8, "application/json");
            empUpdateResp = await _client.PostAsync($"{_baseUrl}/Employe/Update", empUpdateContent);
            await EnsureSuccessOrPrint(empUpdateResp, "Update Employe");
        }
    }
} 