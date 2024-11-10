using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using api_raiz.Models;

namespace api_raiz.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly SignInManager<IdentityUser> _signInManager;

        public AccountController(SignInManager<IdentityUser> signInManager)
        {
            _signInManager = signInManager;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    return Ok(new { message = "Login bem-sucedido!" });
                }
                return Unauthorized(new { message = "Credenciais inválidas" });
            }
            return BadRequest(new { message = "Requisição inválida" });
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Logout bem-sucedido" });
        }
    }
}