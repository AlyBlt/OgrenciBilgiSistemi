async function fetchStudents() {
    try {
        const response = await fetch('https://localhost:7282/api/Students');
        if (!response.ok) {
            alert('Öðrenciler alýnýrken hata oluþtu: ' + response.statusText);
            return;
        }
        const students = await response.json();

        const tbody = document.querySelector('#studentsTable tbody');
        tbody.innerHTML = ''; // Önce tabloyu temizle

        students.forEach(student => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.id}</td>
                <td>${student.ad}</td>
                <td>${student.soyad}</td>
                <td>${student.ogrenciNo}</td>
                <td>${student.sinif}</td>
                <td>${student.eposta}</td>
                <td>${student.aktifMi ? 'Evet' : 'Hayýr'}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Sil</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        alert('Fetch sýrasýnda hata oluþtu: ' + error.message);
    }
}

async function deleteStudent(id) {
    if (!confirm("Bu öðrenciyi silmek istediðinize emin misiniz?")) return;

    try {
        const response = await fetch(`https://localhost:7282/api/Students/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            alert("Silme iþlemi baþarýsýz oldu.");
            return;
        }

        alert("Öðrenci baþarýyla silindi.");
        fetchStudents(); // Listeyi tekrar yükle
    } catch (error) {
        alert('Silme sýrasýnda hata oluþtu: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', fetchStudents);