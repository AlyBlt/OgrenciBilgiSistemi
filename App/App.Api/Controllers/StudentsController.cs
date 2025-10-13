using App.Api.Data;
using App.Api.DTOs;
using App.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(StudentData.Students);
        }

        [HttpGet("{id}")]
        public IActionResult GetStudent(int id)
        {
            var student = StudentData.Students.FirstOrDefault(s => s.Id == id);
            if (student == null) 
                return NotFound("Öğrenci bulunamadı.");
            return Ok(student);
        
        }

        [HttpPost]
        public IActionResult CreateStudent([FromBody] StudentCreateDto studentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (StudentData.Students.Any(s => s.OgrenciNo == studentDto.OgrenciNo))
                return BadRequest("Bu öğrenci numarası zaten kayıtlı.");
            var student = new Student
            {
                Id = StudentData.Students.Count > 0 ? StudentData.Students.Max(s => s.Id) + 1 : 1,
                Ad = studentDto.Ad,
                Soyad = studentDto.Soyad,
                OgrenciNo = studentDto.OgrenciNo,
                Sinif = studentDto.Sinif,
                Eposta = studentDto.Eposta,
                KayitTarihi = DateTime.Now,
                AktifMi = true
            };

            StudentData.Students.Add(student);

            return Ok(student);

        }



        [HttpPut("{id}")]
        public IActionResult UpdateStudent(int id, [FromBody] StudentUpdateDto updatedDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var student = StudentData.Students.FirstOrDefault(s => s.Id == id);
            if (student == null)
                return NotFound("Öğrenci bulunamadı.");
            if (StudentData.Students.Any(s => s.OgrenciNo == updatedDto.OgrenciNo && s.Id != id))
                return BadRequest("Bu öğrenci numarası başka bir öğrenciye ait.");
            student.Ad = updatedDto.Ad;
            student.Soyad = updatedDto.Soyad;
            student.OgrenciNo = updatedDto.OgrenciNo;
            student.Sinif = updatedDto.Sinif;
            student.Eposta = updatedDto.Eposta;
            student.AktifMi = updatedDto.AktifMi;

            return Ok(student);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteStudent(int id)
        {
            var student = StudentData.Students.FirstOrDefault(s => s.Id == id);
            if (student == null)
                return NotFound("Silinecek öğrenci bulunamadı.");

            StudentData.Students.Remove(student);
            return Ok("Öğrenci silindi.");
        }

        [HttpGet("checkunique/{ogrenciNo}")]
        public IActionResult CheckUniqueOgrenciNo(string ogrenciNo)
        {
            var exists = StudentData.Students.Any(s => s.OgrenciNo == ogrenciNo);
            return Ok(!exists); // true dönerse "benzersiz", false ise "var"
        }



    }
}
