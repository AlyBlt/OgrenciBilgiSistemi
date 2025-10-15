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
        errorMessageDiv.style.display = 'block';  // G�r�n�r yap
        errorMessageDiv.textContent = message; // Mesaj� ekle
    }
}

async function initPage() {
    // Ba�lang��ta kontrol et: sistemde ��renci var m�?
    try {
        const listResponse = await fetch(apiUrl);
        if (!listResponse.ok) {
            throw new Error('��renciler al�n�rken hata olu�tu: ' + listResponse.statusText);
        }
        const studentsList = await listResponse.json();

        if (studentsList.length === 0) {
            // Hi� ��renci yoksa formu ve detaylar� gizle, mesaj g�ster
            searchForm.style.display = 'none';
            studentDetails.style.display = 'none';
            showMessage("Listede silinecek kay�tl� ��renci bulunamad�.", 'warning');
            return;
        }
    } catch (err) {
        showFetchMessage(`Sunucuya ula��lam�yor. L�tfen uygulaman�n �al��t���ndan ve internet ba�lant�n�z�n aktif oldu�undan emin olun. (Hata: ${err.message})`);
        // Formu gizle de olabilir
        searchForm.style.display = 'none';
        studentDetails.style.display = 'none';
    }
}

// Sayfa y�klenirken init �al��s�n
document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageDiv.textContent = '';
    studentDetails.style.display = 'none';

    const id = document.getElementById('studentId').value.trim();

    if (!id) {
        showMessage('L�tfen bir ��renci Id\'si girin.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${id}`);
        if (response.status === 404) {
            showMessage(id + ' numaral� Id\'ye sahip bir ��renci bulunamad�.');
            return;
        }
        if (!response.ok) {
            throw new Error('��renci bilgisi al�n�rken hata olu�tu.');
        }
        const student = await response.json();

        // Bilgileri g�ster
        detailId.textContent = student.id;
        detailAd.textContent = student.ad;
        detailSoyad.textContent = student.soyad;
        detailOgrenciNo.textContent = student.ogrenciNo;
        detailSinif.textContent = student.sinif;
        detailEposta.textContent = student.eposta;
        detailAktifMi.textContent = student.aktifMi ? 'Evet' : 'Hay�r';

        studentDetails.style.display = 'block';
        currentStudentId = student.id;
    } catch (error) {
        showFetchMessage(`Sunucuya ula��lam�yor. L�tfen uygulaman�n �al��t���ndan ve internet ba�lant�n�z�n aktif oldu�undan emin olun. (Hata: ${error.message})`);
    }
});

deleteBtn.addEventListener('click', async () => {
    if (!currentStudentId) {
        showMessage('L�tfen �nce ��renci aray�n.');
        return;
    }

    if (!confirm('Bu ��renciyi silmek istedi�inize emin misiniz?')) {
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${currentStudentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showMessage('��renci ba�ar�yla silindi.', 'success');
            studentDetails.style.display = 'none';
            currentStudentId = null;
            searchForm.reset();
            // Silme sonras�: kontrol et, art�k ��renci hi� kalmad�ysa
            const listResponse = await fetch(apiUrl);
            if (listResponse.ok) {
                const studentsList = await listResponse.json();
                if (studentsList.length === 0) {
                    // Hi� ��renci kalmad�, formu gizle
                    searchForm.style.display = 'none';
                    showMessage("Listede silinecek ��renci kalmad�.", 'warning');
                }
            }
        } else {
            const errText = await response.text();
            showMessage('Silme i�lemi ba�ar�s�z oldu: ' + errText);
        }

    } catch (error) {
        showMessage('Bir hata olu�tu. (Hata: ' + error.message + ')');
    }
        
});