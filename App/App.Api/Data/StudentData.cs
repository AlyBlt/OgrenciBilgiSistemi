using App.Api.Models;


namespace App.Api.Data
{
    public class StudentData
    {
        public static List<Student> Students { get; } = new List<Student>
        {
        new Student
            {
                Id = 1,
                Ad = "Ahmet",
                Soyad = "Yılmaz",
                OgrenciNo = "1001",
                Sinif = "10A",
                Eposta = "ahmet.yilmaz@example.com",
                AktifMi = true
            },
            new Student
            {
                Id = 2,
                Ad = "Elif",
                Soyad = "Demir",
                OgrenciNo = "1002",
                Sinif = "11B",
                Eposta = "elif.demir@example.com",
                AktifMi = true
            }
        };
    }
}
