namespace api_raiz.Data;

public class InstallmentDetailDto
{
    public int InstallmentNumber { get; set; }
    public bool Paid { get; set; }
    public int EventId { get; set; }
    public int StudentId { get; set; }
}