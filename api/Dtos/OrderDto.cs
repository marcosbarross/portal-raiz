namespace api_raiz.Dtos
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int ProductQuantity { get; set; }
        public int StudentId { get; set; }
        public int Identificator { get; set; }
        public DateTime Date { get; set; }

        public OrderDto() { }

        public OrderDto(int id, int productId, int productQuantity, int studentId, int identificator, DateTime date)
        {
            Id = id;
            ProductId = productId;
            ProductQuantity = productQuantity;
            StudentId = studentId;
            Identificator = identificator;
            Date = date;
        }
    }
}
