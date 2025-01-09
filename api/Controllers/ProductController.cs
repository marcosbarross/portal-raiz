using Microsoft.AspNetCore.Mvc;
using api_raiz.Data;
using api_raiz.Models;
using System.Collections.Generic;
using System.Linq;
using api_raiz.Models.Relationships;
using api_raiz.Dtos.OrderDto;

namespace api_raiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly Context _context;

        public ProductController(Context context)
        {
            _context = context;
        }

        [HttpPost("AddProduct")]
        public IActionResult AddProduct([FromBody] Product product)
        {
            _context.Products.Add(product);
            _context.SaveChanges();
            return Ok();
        }

        [HttpGet("GetProducts")]
        public IActionResult GetProducts()
        {
            var productsAlternativeSize = new List<ProductAlternativeSize>();
            var products = _context.Products.ToList();
            var productsToRemove = new List<Product>();

            foreach (var product in products)
            {
                if (product.Size > 16)
                {
                    var productAlternativeSize = new ProductAlternativeSize(product);
                    productsAlternativeSize.Add(productAlternativeSize);
                    productsToRemove.Add(product);
                }
            }

            foreach (var productToRemove in productsToRemove)
            {
                products.Remove(productToRemove);
            }

            var response = new ProductResponse
            {
                Products = products,
                ProductsAlternativeSize = productsAlternativeSize
            };
            return Ok(response);
        }

        [HttpPut("UpdateProduct/{id}")]
        public IActionResult UpdateProduct(int id, [FromBody] Product updatedProduct)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }

            product.Name = updatedProduct.Name;
            product.Price = updatedProduct.Price;
            product.Size = updatedProduct.Size;
            product.RemainingAmount = updatedProduct.RemainingAmount;

            _context.SaveChanges();
            return Ok();
        }


        [HttpPost("SellProduct")]
        public IActionResult SellProduct([FromBody] List<OrderDto> orderItems)
        {
            foreach (var item in orderItems)
            {
                var product = _context.Products.FirstOrDefault(p => p.Id == item.ProductId);

                if (product != null)
                {
                    product.RemainingAmount -= item.ProductQuantity;
                    product.SoldAmount += item.ProductQuantity;

                    var order = new Order
                    {
                        Identificator = item.Identificator,
                        StudentId = item.StudentId
                    };

                    _context.Orders.Add(order);
                    _context.SaveChanges();

                    var orderStudentProduct = new OrderStudentProduct
                    {
                        OrderId = order.Id,
                        StudentId = item.StudentId,
                        ProductId = item.ProductId,
                        ProductQuantity = item.ProductQuantity,
                        Date = item.Date,
                        OrderIdentificator = item.Identificator,
                        IsDelivered = false
                    };

                    _context.OrderStudentProducts.Add(orderStudentProduct);
                }
            }
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("DeleteProduct/{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }
            _context.Products.Remove(product);
            _context.SaveChanges();
            return Ok();
        }
    }
}
