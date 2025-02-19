﻿using api_raiz.Models;

namespace api_raiz.Dtos.StudentsDto;

public class StudentEventDto
{
    public int EventId { get; set; }
    public int Registration { get; set; }
    public string? Name { get; set; }
    public string? Responsible { get; set; }
    public int GroupId { get; set; }
}

