namespace ApiBack.Models
{
    public class Employe
    {
        public int id_Employee { get; set; }
        public required string name_Employee { get; set; }
        public required string lastName_Employee { get; set; }
        public required string birthDate { get; set; }
        public required string contract_Start_Date { get; set; }
        public int id_Job { get; set; }
    }
} 