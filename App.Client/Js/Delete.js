async function fetchStudents() {
    try {
        const response = await fetch('https://localhost:7282/api/Students');
        if (!response.ok) {
            alert('��renciler al�n�rken hata olu�tu: ' + response.statusText);
            return;
        }
        const students = await response.json();

        const tbody = document.querySelector('#studentsTable tbody');
        tbody.innerHTML = ''; // �nce tabloyu temizle

        students.forEach(student => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.id}</td>
                <td>${student.ad}</td>
                <td>${student.soyad}</td>
                <td>${student.ogrenciNo}</td>
                <td>${student.sinif}</td>
                <td>${student.eposta}</td>
                <td>${student.aktifMi ? 'Evet' : 'Hay�r'}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Sil</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        alert('Fetch s�ras�nda hata olu�tu: ' + error.message);
    }
}

async function deleteStudent(id) {
    if (!confirm("Bu ��renciyi silmek istedi�inize emin misiniz?")) return;

    try {
        const response = await fetch(`https://localhost:7282/api/Students/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            alert("Silme i�lemi ba�ar�s�z oldu.");
            return;
        }

        alert("��renci ba�ar�yla silindi.");
        fetchStudents(); // Listeyi tekrar y�kle
    } catch (error) {
        alert('Silme s�ras�nda hata olu�tu: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', fetchStudents);