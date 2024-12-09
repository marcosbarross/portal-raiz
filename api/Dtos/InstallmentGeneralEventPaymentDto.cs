namespace api_raiz.Dtos
{
    public class InstallmentGeneralEventPaymentDto
    {
        public int GeneralEventId { get; set; }
        public int StudentId { get; set; }
        public int InstallmentNumber { get; set; }
        public int InstallmentsToPay { get; set; }
    }
}
