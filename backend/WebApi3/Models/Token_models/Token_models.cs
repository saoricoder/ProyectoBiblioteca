namespace WebApi3.Models.Token_models
{
    public class Token_models
    {
        public string? UserId { get; set; }
        public string? Token { get; set; }
        public DateTime ExpirationDate { get; set; }
        public bool IsRevoked { get; set; }
    }
}
