namespace ApiBack.Models
{
    public class UserLogin
    {
        public int id_user { get; set; }
        public required string username { get; set; }
        public required string userPassword { get; set; }
    }
} 