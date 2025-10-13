using System.ComponentModel.DataAnnotations;

namespace App.Api.Models
{
    public class Student
    {
        public int Id { get; set; }  // Sistem tarafından otomatik verilecek
        [Required] 
        public string Ad { get; set; } = string.Empty;
        [Required]
        public string Soyad { get; set; } = string.Empty;
        [Required]
        public string OgrenciNo { get; set; } = string.Empty;
        public string Sinif { get; set; } = string.Empty;            // Öğrencinin sınıf bilgisi
        public string Eposta { get; set; } = string.Empty;           // İletişim için
        public DateTime KayitTarihi { get; set; } = DateTime.Now;    // Otomatik kayıt tarihi
        public bool AktifMi { get; set; } = true;                    // Silinmemiş / aktif öğrenci mi?

    }
}
