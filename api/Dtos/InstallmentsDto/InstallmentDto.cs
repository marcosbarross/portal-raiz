namespace api_raiz.Dtos.InstallmentsDto;

public class InstallmentDto
{
    public int EventId { get; set; }
    public int StudentId { get; set; }
    public int TotalInstallments { get; set; }
    public int PaidInstallments { get; set; }
}