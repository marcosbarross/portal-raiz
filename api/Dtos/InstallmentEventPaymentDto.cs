﻿namespace api_raiz.Data
{
    public class InstallmentEventPaymentDto
    {
        public int EventId { get; set; }
        public int StudentId { get; set; }
        public int AmountPaid { get; set; }
    }
}