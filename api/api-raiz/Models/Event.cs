using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api_raiz.Models
{
    public class Event
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public int Installments { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public ICollection<EventStudent> EventStudents { get; set; } = new List<EventStudent>();

        public Event() { }

        public Event(string name, int installments, DateTime date)
        {
            Name = name;
            Installments = installments;
            Date = date;
        }
    }
}