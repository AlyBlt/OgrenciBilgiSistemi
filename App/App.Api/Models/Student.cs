using System.ComponentModel.DataAnnotations;

namespace App.Api.Models
{
    public class Student
    {
        public int Id { get; set; }  // Sistem tarafından otomatik verilecek
        public string Ad { get; set; } = string.Empty;
        public string Soyad { get; set; } = string.Empty;
        public string OgrenciNo { get; set; } = string.Empty;  //harf ya da - gibi işaretler olabilir o nedenle string bıraktım.
        public string Sinif { get; set; } = string.Empty;            
        public string Eposta { get; set; } = string.Empty;           
        public DateTime KayitTarihi { get; set; } = DateTime.Now;    
        public bool AktifMi { get; set; } = true;                    

    }
}
