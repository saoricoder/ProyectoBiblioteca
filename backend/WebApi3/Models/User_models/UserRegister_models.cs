namespace WebApi3.Models.User_models
{
    public class UserRegister_models
    {
        public string? Id { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
        public int LoginAttempts {  get; set; }
        public DateTime? LockoutEnd { get; set; }
        public bool IsActive { get; set; }
    }
}
