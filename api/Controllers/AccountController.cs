using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using api_raiz.Models.Auth;

namespace api_raiz.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;

        public AccountController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
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

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] Register model)
        {
            if (ModelState.IsValid)
            {
                var user = new IdentityUser { UserName = model.Username, Email = model.Email };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    return Ok(new { message = "Usuário registrado com sucesso!" });
                }

                return BadRequest(new { message = "Erro ao registrar o usuário", errors = result.Errors });
            }
            return BadRequest(new { message = "Requisição inválida" });
        }

        [HttpGet("IsAuthenticated")]
        public IActionResult IsAuthenticated()
        {
            if (User.Identity.IsAuthenticated)
            {
                return Ok(new { isAuthenticated = true });
            }
            return Unauthorized(new { isAuthenticated = false });
        }

    }
}
