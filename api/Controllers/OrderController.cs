using api_raiz.Data;
using api_raiz.Dtos;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace api_raiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly Context _context;

        public OrderController(Context context)
        {
            _context = context;
        }

        [HttpGet("GetOrders")]
        public IActionResult GetOrders()
        {
            var orders = _context.OrderStudentProducts.ToList();
            var students = _context.Students.ToList();
            var products = _context.Products.ToList();
            var response = new List<OrderResponseDto>();

            foreach (var order in orders)
            {
                var student = students.FirstOrDefault(s => s.Registration == order.StudentId);
                var product = products.FirstOrDefault(p => p.Id == order.ProductId);

                if (student != null && product != null)
                {
                    response.Add(new OrderResponseDto(
                        order.OrderIdentificator,
                        student.Name,
                        product.Name,
                        order.ProductQuantity,
                        order.Date,
                        product.Price
                    ));
                }
            }

            return Ok(response);
        }

        [HttpGet("GetOrder/{identificator}")]
        public IActionResult GetOrder(int identificator)
        {
            var orders = _context.OrderStudentProducts
                .Where(osp => osp.OrderIdentificator == identificator)
                .ToList();

            var students = _context.Students.ToList();
            var products = _context.Products.ToList();

            var response = orders.Select(order => new OrderResponseDto(
                order.OrderIdentificator,
                students.FirstOrDefault(s => s.Registration == order.StudentId)?.Name,
                products.FirstOrDefault(p => p.Id == order.ProductId)?.Name,
                order.ProductQuantity,
                order.Date,
                products.FirstOrDefault(p => p.Id == order.ProductId).Price
            )).ToList();

            return Ok(response);
        }

        [HttpGet("GetOrderByStudentId/{studentId}")]
        public IActionResult GetOrderByStudentId(int studentId)
        {
            var orders = _context.OrderStudentProducts
                .Where(osp => osp.StudentId == studentId)
                .ToList();

            var students = _context.Students.ToList();
            var products = _context.Products.ToList();

            var response = orders.Select(order => new OrderResponseDto(
                order.OrderIdentificator,
                students.FirstOrDefault(s => s.Registration == order.StudentId)?.Name,
                products.FirstOrDefault(p => p.Id == order.ProductId)?.Name,
                order.ProductQuantity,
                order.Date,
                products.FirstOrDefault(p => p.Id == order.ProductId).Price
            )).ToList();

            return Ok(response);
        }
    }
}
