using ApiBack.Models;
using ApiBack.Data;
using ApiBack.Repositories.Interfaces;
using Dapper;

namespace ApiBack.Repositories
{
    public class EvaluationRepository : IEvaluationRepository
    {
        private readonly DbContextDapper _dapper;
        public EvaluationRepository(DbContextDapper dapper)
        {
            _dapper = dapper;
        }

        public async Task<IEnumerable<Evaluation>> GetAllAsync()
        {
            using var connection = _dapper.CreateConnection();
            return await connection.QueryAsync<Evaluation>("GetAllEvaluations", commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Evaluation?> GetByIdAsync(int id_Evaluation)
        {
            using var connection = _dapper.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Evaluation>("SELECT * FROM evaluation WHERE id_Evaluation = @id_Evaluation", new { id_Evaluation });
        }

        public async Task<IEnumerable<Evaluation>> GetByEmployeeAsync(int id_employee)
        {
            using var connection = _dapper.CreateConnection();
            return await connection.QueryAsync<Evaluation>("GetEvaluationsByEmployee", new { id_employee }, commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<int> InsertAsync(Evaluation evaluation)
        {
            using var connection = _dapper.CreateConnection();
            return await connection.ExecuteAsync(
                "InsertEvaluation",
                new
                {
                    id_employee = evaluation.id_employee,
                    evaluation_Date = evaluation.evaluation_Date,
                    productivity = evaluation.productivity,
                    punctuality = evaluation.punctuality,
                    work_quality = evaluation.work_quality,
                    communication = evaluation.communication,
                    willingness_to_learn = evaluation.willingness_to_learn,
                    honesty = evaluation.honesty,
                    initiative = evaluation.initiative,
                    teamwork = evaluation.teamwork,
                    comments = evaluation.comments
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<int> UpdateAsync(Evaluation evaluation)
        {
            using var connection = _dapper.CreateConnection();
            return await connection.ExecuteAsync(
                "UpdateEvaluation",
                new
                {
                    evaluation.id_Evaluation,
                    evaluation.id_employee,
                    evaluation.productivity,
                    evaluation.punctuality,
                    evaluation.work_quality,
                    evaluation.communication,
                    evaluation.willingness_to_learn,
                    evaluation.honesty,
                    evaluation.initiative,
                    evaluation.teamwork,
                    evaluation.comments
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<int> DeleteAsync(int id_Evaluation)
        {
            using var connection = _dapper.CreateConnection();
            return await connection.ExecuteAsync("DeleteEvaluation", new { id_Evaluation }, commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<(int success, int fail, List<string> errors)> ImportBulkAsync(IEnumerable<Evaluation> evaluations)
        {
            int success = 0, fail = 0;
            var errors = new List<string>();
            using var connection = _dapper.CreateConnection();
            foreach (var evaluation in evaluations)
            {
                try
                {
                    await connection.ExecuteAsync(
                        "InsertEvaluation",
                        new
                        {
                            id_employee = evaluation.id_employee,
                            evaluation_Date = evaluation.evaluation_Date,
                            productivity = evaluation.productivity,
                            punctuality = evaluation.punctuality,
                            work_quality = evaluation.work_quality,
                            communication = evaluation.communication,
                            willingness_to_learn = evaluation.willingness_to_learn,
                            honesty = evaluation.honesty,
                            initiative = evaluation.initiative,
                            teamwork = evaluation.teamwork,
                            comments = evaluation.comments
                        },
                        commandType: System.Data.CommandType.StoredProcedure);
                    success++;
                }
                catch (Exception ex)
                {
                    fail++;
                    errors.Add($"Empleado: {evaluation.id_employee}, Error: {ex.Message}");
                }
            }
            return (success, fail, errors);
        }
    }
} 