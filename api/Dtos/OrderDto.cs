namespace api_raiz.Dtos
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int ProductQuantity { get; set; }
        public int StudentId { get; set; }
        public DateTime Date { get; set; }

        public OrderDto(int productId, int productQuantity, int studentId, DateTime date)
        {
            ProductId = productId;
            ProductQuantity = productQuantity;
            StudentId = studentId;
            Date = date;
        }
    }
}