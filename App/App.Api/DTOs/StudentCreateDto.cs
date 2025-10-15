using System.ComponentModel.DataAnnotations;

namespace App.Api.DTOs
{
    public class StudentCreateDto
    {
        [Required(ErrorMessage = "Ad alanı zorunludur.")]
        [RegularExpression(@"^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$", ErrorMessage = "Ad sadece harf içermelidir.")]
        public string Ad { get; set; } = string.Empty;

        [Required(ErrorMessage = "Soyad alanı zorunludur.")]
        [RegularExpression(@"^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$", ErrorMessage = "Soyad sadece harf içermelidir.")]
        public string Soyad { get; set; } = string.Empty;

        [Required(ErrorMessage = "Öğrenci numarası zorunludur.")]
        public string OgrenciNo { get; set; } = string.Empty;

        public string? Sinif { get; set; }
        [EmailAddress]
        public string? Eposta { get; set; }

    }
}
