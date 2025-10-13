using System.ComponentModel.DataAnnotations;

namespace App.Api.DTOs
{
    public class StudentUpdateDto
    {
        [Required(ErrorMessage = "Ad alanı zorunludur.")]
        public string Ad { get; set; } = string.Empty;

        [Required(ErrorMessage = "Soyad alanı zorunludur.")]
        public string Soyad { get; set; } = string.Empty;

        [Required(ErrorMessage = "Öğrenci numarası zorunludur.")]
        public string OgrenciNo { get; set; } = string.Empty;

        public string Sinif { get; set; } = string.Empty;
        public string Eposta { get; set; } = string.Empty;
        public bool AktifMi { get; set; } = true;
    

    }
}
