const apiUrl = 'https://localhost:7282/api/Students';

const searchForm = document.getElementById('searchForm');
const studentDetails = document.getElementById('studentDetails');
const messageDiv = document.getElementById('message');

const detailId = document.getElementById('detailId');
const detailAd = document.getElementById('detailAd');
const detailSoyad = document.getElementById('detailSoyad');
const detailOgrenciNo = document.getElementById('detailOgrenciNo');
const detailSinif = document.getElementById('detailSinif');
const detailEposta = document.getElementById('detailEposta');
const detailAktifMi = document.getElementById('detailAktifMi');

const deleteBtn = document.getElementById('deleteBtn');

let currentStudentId = null;

function showMessage(message, type = 'danger') {
    messageDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Kapat"></button>
        </div>
    `;
}

function showFetchError(message) {
    const errorMessageDiv = document.getElementById('fetchMessage');
    if (errorMessageDiv) {
        errorMessageDiv.style.display = 'block';  // Görünür yap
        errorMessageDiv.textContent = message; // Mesajý ekle
    }
}

async function initPage() {
    // Baþlangýçta kontrol et: sistemde öðrenci var mý?
    try {
        const listResponse = await fetch(apiUrl);
        if (!listResponse.ok) {
            throw new Error('Öðrenciler alýnýrken hata oluþtu: ' + listResponse.statusText);
        }
        const studentsList = await listResponse.json();

        if (studentsList.length === 0) {
            // Hiç öðrenci yoksa formu ve detaylarý gizle, mesaj göster
            searchForm.style.display = 'none';
            studentDetails.style.display = 'none';
            showMessage("Listede silinecek kayýtlý öðrenci bulunamadý.", 'warning');
            return;
        }
    } catch (err) {
        showFetchMessage(`Sunucuya ulaþýlamýyor. Lütfen uygulamanýn çalýþtýðýndan ve internet baðlantýnýzýn aktif olduðundan emin olun. (Hata: ${err.message})`);
        // Formu gizle de olabilir
        searchForm.style.display = 'none';
        studentDetails.style.display = 'none';
    }
}

// Sayfa yüklenirken init çalýþsýn
document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageDiv.textContent = '';
    studentDetails.style.display = 'none';

    const id = document.getElementById('studentId').value.trim();

    if (!id) {
        showMessage('Lütfen bir öðrenci Id\'si girin.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${id}`);
        if (response.status === 404) {
            showMessage(id + ' numaralý Id\'ye sahip bir öðrenci bulunamadý.');
            return;
        }
        if (!response.ok) {
            throw new Error('Öðrenci bilgisi alýnýrken hata oluþtu.');
        }
        const student = await response.json();

        // Bilgileri göster
        detailId.textContent = student.id;
        detailAd.textContent = student.ad;
        detailSoyad.textContent = student.soyad;
        detailOgrenciNo.textContent = student.ogrenciNo;
        detailSinif.textContent = student.sinif;
        detailEposta.textContent = student.eposta;
        detailAktifMi.textContent = student.aktifMi ? 'Evet' : 'Hayýr';

        studentDetails.style.display = 'block';
        currentStudentId = student.id;
    } catch (error) {
        showFetchMessage(`Sunucuya ulaþýlamýyor. Lütfen uygulamanýn çalýþtýðýndan ve internet baðlantýnýzýn aktif olduðundan emin olun. (Hata: ${error.message})`);
    }
});

deleteBtn.addEventListener('click', async () => {
    if (!currentStudentId) {
        showMessage('Lütfen önce öðrenci arayýn.');
        return;
    }

    if (!confirm('Bu öðrenciyi silmek istediðinize emin misiniz?')) {
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${currentStudentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showMessage('Öðrenci baþarýyla silindi.', 'success');
            studentDetails.style.display = 'none';
            currentStudentId = null;
            searchForm.reset();
            // Silme sonrasý: kontrol et, artýk öðrenci hiç kalmadýysa
            const listResponse = await fetch(apiUrl);
            if (listResponse.ok) {
                const studentsList = await listResponse.json();
                if (studentsList.length === 0) {
                    // Hiç öðrenci kalmadý, formu gizle
                    searchForm.style.display = 'none';
                    showMessage("Listede silinecek öðrenci kalmadý.", 'warning');
                }
            }
        } else {
            const errText = await response.text();
            showMessage('Silme iþlemi baþarýsýz oldu: ' + errText);
        }

    } catch (error) {
        showMessage('Bir hata oluþtu. (Hata: ' + error.message + ')');
    }
        
});