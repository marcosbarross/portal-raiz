using api_raiz.Models;
using System;

namespace api_raiz.Dtos.OrderDto
{
    public class OrderResponseDto
    {
        public int Identificator { get; set; }
        public string StudentName { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public DateTime Date { get; set; }
        public double Price { get; set; }
        public double TotalPrice => Quantity * Price;

        public OrderResponseDto(int identificator, string studentName, string productName, int quantity, DateTime date, double price)
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
