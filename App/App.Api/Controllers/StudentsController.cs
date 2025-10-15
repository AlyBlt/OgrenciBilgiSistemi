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
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetAll()
        {
            return Ok(StudentData.Students);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetStudent(int id)
        {
            var student = StudentData.Students.FirstOrDefault(s => s.Id == id);
            if (student == null) 
                return NotFound("Öğrenci bulunamadı.");
            return Ok(student);
        
        }

        
        // FETCH ile gönderilen JSON veriyi yakalar
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Consumes("application/json")]
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

        // FORM üzerinden gelen veriyi yakalar
        [ApiExplorerSettings(IgnoreApi = true)]  //Swagger’da iki POST metodu görünmesin diye
        [HttpPost]
        [Consumes("application/x-www-form-urlencoded")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CreateStudentForm([FromForm] StudentCreateDto studentDto)
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

            return Ok(new
            {
                message = "Öğrenci başarıyla eklendi.",
                student = student
            });

        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
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
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult DeleteStudent(int id)
        {
            var student = StudentData.Students.FirstOrDefault(s => s.Id == id);
            if (student == null)
                return NotFound("Silinecek öğrenci bulunamadı.");

            StudentData.Students.Remove(student);
            return Ok("Öğrenci silindi.");
        }

        // Create için: sadece öğrenci no kontrolü
        [HttpGet("checkunique/{ogrenciNo}")]
        public IActionResult CheckUniqueOgrenciNo(string ogrenciNo)
        {
            var exists = StudentData.Students.Any(s => s.OgrenciNo == ogrenciNo);
            return Ok(!exists);  // true ise benzersiz
        }

        // Update için: öğrenci no ve id kontrolü (kendi kaydını dışla)
        [HttpGet("checkunique/{ogrenciNo}/{excludeId}")]
        public IActionResult CheckUniqueOgrenciNo(string ogrenciNo, int excludeId)
        {
            var exists = StudentData.Students.Any(s =>
                s.OgrenciNo == ogrenciNo && s.Id != excludeId);

            return Ok(!exists); // true => benzersiz, false => zaten var
        }

    }
}
