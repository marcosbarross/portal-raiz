namespace api_raiz.Data;

public class InstallmentDto
{
    public int EventId { get; set; }
    public int StudentId { get; set; }
    public int TotalInstallments { get; set; }
    public int PaidInstallments { get; set; }
}