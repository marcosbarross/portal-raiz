using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api_raiz.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Nome { get; set; }
        [Required]
        public int Tamanho { get; set; }
        [Required]
        public double Preco { get; set; }
        public int QuantidadeRestante { get; set; }

        public Product() { }

        public Product(int id, string nome, int tamanho, double preco, int quantidadeRestante)
        {
            Id = id;
            Nome = nome;
            Tamanho = tamanho;
            Preco = preco;
            QuantidadeRestante = quantidadeRestante;
        }
    }
}
