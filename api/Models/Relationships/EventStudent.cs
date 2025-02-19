﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using api_raiz.Data;

namespace api_raiz.Models.Relationships
{
    public class EventStudent
    {
        [Key] public int Id { get; set; }

        [Required] public int EventId { get; set; }

        [Required] public int PaidInstallments { get; set; }

        [ForeignKey("EventId")] public Event Event { get; set; }

        [Required] public int StudentId { get; set; }

        [ForeignKey("StudentId")] public Student Student { get; set; }

    }
}