async function fetchStudents() {
    try {
        const response = await fetch('https://localhost:7282/api/Students');
        if (!response.ok) {
            showPageMessage('Öðrenciler alýnýrken hata oluþtu: ' + response.statusText);
            return;
        }
        const students = await response.json();

        const tbody = document.querySelector('#studentsTable tbody');
        tbody.innerHTML = ''; // Önce tabloyu temizle

        if (students.length === 0) {
            // Eðer öðrenci yoksa tabloya 1 satýrlýk mesaj ekle
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="8" class="text-center bg-warning-subtle">Listede silinecek kayýtlý öðrenci bulunamadý.</td>`;
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
                <td>${student.aktifMi ? 'Evet' : 'Hayýr'}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Sil</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        showFetchError('Bir hata oluþtu.Lütfen internet baðlantýnýzý kontrol edin ve tekrar deneyin.' + "(Hata: " + error.message+ ")");
    }
}

async function deleteStudent(id) {
    if (!confirm("Bu öðrenciyi silmek istediðinize emin misiniz?")) return;

    try {
        const response = await fetch(`https://localhost:7282/api/Students/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorText = await response.text();
            showPageMessage("Silme iþlemi baþarýsýz oldu: " + errorText);
            return;
        }

        showPageMessage("Öðrenci baþarýyla silindi.", 'success');
        fetchStudents(); // Listeyi tekrar yükle
    } catch (error) {
        showPageMessage('Silme sýrasýnda hata oluþtu: ' + error.message);
    }
}
// Fetch Error mesaji için ayrý div
function showFetchError(message) {
    const errorMessageDiv = document.getElementById('fetchError');
    if (errorMessageDiv) {
        errorMessageDiv.style.display = 'block';  // Görünür yap
        errorMessageDiv.textContent = message; // Mesajý ekle
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