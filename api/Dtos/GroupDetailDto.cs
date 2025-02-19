﻿using System.Collections.Generic;
using api_raiz.Dtos.StudentsDto;
using api_raiz.Models;

namespace api_raiz.Data
{
    public class GroupDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
        public string Shift { get; set; }
        public List<StudentDto> Students { get; set; }

        public GroupDetailDto() { }

        public GroupDetailDto(int id, string name, string level, string shift)
        {
            Id = id;
            Name = name;
            Level = level;
            Shift = shift;
        }
    }
}