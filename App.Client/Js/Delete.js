async function fetchStudents() {
    try {
        const response = await fetch('https://localhost:7282/api/Students');
        if (!response.ok) {
            showPageMessage('��renciler al�n�rken hata olu�tu: ' + response.statusText);
            return;
        }
        const students = await response.json();

        const tbody = document.querySelector('#studentsTable tbody');
        tbody.innerHTML = ''; // �nce tabloyu temizle

        if (students.length === 0) {
            // E�er ��renci yoksa tabloya 1 sat�rl�k mesaj ekle
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="8" class="text-center bg-warning-subtle">Listede silinecek kay�tl� ��renci bulunamad�.</td>`;
            tbody.appendChild(tr);
            return;
        }

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
        showFetchError('Bir hata olu�tu.L�tfen internet ba�lant�n�z� kontrol edin ve tekrar deneyin.' + "(Hata: " + error.message+ ")");
    }
}

async function deleteStudent(id) {
    if (!confirm("Bu ��renciyi silmek istedi�inize emin misiniz?")) return;

    try {
        const response = await fetch(`https://localhost:7282/api/Students/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorText = await response.text();
            showPageMessage("Silme i�lemi ba�ar�s�z oldu: " + errorText);
            return;
        }

        showPageMessage("��renci ba�ar�yla silindi.", 'success');
        fetchStudents(); // Listeyi tekrar y�kle
    } catch (error) {
        showPageMessage('Silme s�ras�nda hata olu�tu: ' + error.message);
    }
}
// Fetch Error mesaji i�in ayr� div
function showFetchError(message) {
    const errorMessageDiv = document.getElementById('fetchError');
    if (errorMessageDiv) {
        errorMessageDiv.style.display = 'block';  // G�r�n�r yap
        errorMessageDiv.textContent = message; // Mesaj� ekle
    }
}
function showPageMessage(message, type = 'danger') {
    let msgDiv = document.getElementById('page-messages');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.id = 'page-messages';
        msgDiv.classList.add('mt-3');
        document.querySelector('.container').prepend(msgDiv);
    }

    msgDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Kapat"></button>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', fetchStudents);