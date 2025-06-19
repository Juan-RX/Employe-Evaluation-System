namespace ApiBack.Models
{
    public class Evaluation
    {
        public int id_Evaluation { get; set; }
        public int id_employee { get; set; }
        public required string evaluation_Date { get; set; }
        public int productivity { get; set; }
        public int punctuality { get; set; }
        public int work_quality { get; set; }
        public int communication { get; set; }
        public int willingness_to_learn { get; set; }
        public int honesty { get; set; }
        public int initiative { get; set; }
        public int teamwork { get; set; }
        public required string comments { get; set; }
    }
} 