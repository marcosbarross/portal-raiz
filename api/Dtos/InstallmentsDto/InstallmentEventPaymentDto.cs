namespace api_raiz.Dtos.InstallmentsDto
{
    public class InstallmentEventPaymentDto
    {
        public int EventId { get; set; }
        public int StudentId { get; set; }
        public int AmountPaid { get; set; }
    }
}