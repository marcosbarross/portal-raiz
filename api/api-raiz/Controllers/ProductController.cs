using Microsoft.AspNetCore.Mvc;
using api_raiz.Data;
using api_raiz.Models;
using System.Collections.Generic;
using System.Linq;

namespace api_raiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly Context _context;

        // Construtor que utiliza a injeção de dependência para o Context
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

        [HttpPost("SellProduct")]
        public IActionResult SellProduct([FromBody] List<ProductDTO> orderItems)
        {
            foreach (var item in orderItems)
            {
                var product = _context.Products.FirstOrDefault(p => p.Id == item.Id);
                if (product != null)
                {
                    product.RemainingAmount -= item.Quantity;
                    product.SoldAmount += item.Quantity;
                }
            }
            _context.SaveChanges();
            return Ok();
        }
    }
}
