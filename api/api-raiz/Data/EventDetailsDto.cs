﻿namespace api_raiz.Data;

public class EventDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Installments { get; set; }
    public DateTime Date { get; set; }
    public List<StudentDto> Students { get; set; }
}