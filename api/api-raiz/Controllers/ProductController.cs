using Microsoft.AspNetCore.Mvc;
using api_raiz.Data;
using api_raiz.Models;
using System.Linq;

namespace api_raiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        [HttpPost("AddProduct")]
        public IActionResult AddProduct([FromBody] Product product)
        {
            using (var context = new Context())
            {
                context.Products.Add(product);
                context.SaveChanges();
                return Ok();
            }
        }

        [HttpGet("GetProducts")]
        public IActionResult GetProducts()
        {
            using (var context = new Context())
            {
                var products = context.Products.ToList();
                return Ok(products);
            }
        }

        [HttpDelete("DeleteProduct/{id}")]
        public IActionResult DeleteProduct(int id)
        {
            using (var context = new Context())
            {
                var product = context.Products.Find(id);
                if (product == null)
                {
                    return NotFound();
                }
                context.Products.Remove(product);
                context.SaveChanges();
                return Ok();
            }
        }

        [HttpPost("SellProduct")]
        public IActionResult SellProduct([FromBody] List<ProductDTO> orderItems)
        {
            using (var context = new Context())
            {
                foreach (var item in orderItems)
                {
                    var product = context.Products.FirstOrDefault(p => p.Id == item.Id);
                    if (product != null)
                    {
                        product.RemainingAmount -= item.Quantity;
                        product.SoldAmount += item.Quantity;
                    }
                }
                context.SaveChanges();
            }
            return Ok();
        }
    }
}