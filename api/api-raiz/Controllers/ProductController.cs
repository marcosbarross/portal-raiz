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
                var productsAlternativeSize = new List<ProductAlternativeSize>();
                var products = context.Products.ToList();
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
