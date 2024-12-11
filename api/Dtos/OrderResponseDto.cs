using api_raiz.Models;
using System;

namespace api_raiz.Dtos
{
    public class OrderResponseDto
    {
        public int Identificator { get; set; }
        public string StudentName { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public DateTime Date { get; set; }
        public Double Price { get; set; }
        public Double TotalPrice => Quantity * Price;

        public OrderResponseDto(int identificator, string studentName, string productName, int quantity, DateTime date, Double price)
        {
            Identificator = identificator;
            StudentName = studentName;
            ProductName = productName;
            Quantity = quantity;
            Date = date;
            Price = price;
        }
    }
}
