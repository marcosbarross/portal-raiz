using api_raiz.Models;

namespace api_raiz.Data
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        
        public ProductDTO() { }
        
        public ProductDTO(Product product, int quantity)
        {
            Id = product.Id;
            Quantity = quantity;
        }
    }
}