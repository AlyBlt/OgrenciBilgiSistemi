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

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageDiv.textContent = '';
    studentDetails.style.display = 'none';

    const id = document.getElementById('studentId').value.trim();

    if (!id) {
        alert('Lütfen bir öðrenci ID\'si girin.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${id}`);
        if (response.status === 404) {
            messageDiv.textContent = 'Öðrenci bulunamadý.';
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
        messageDiv.textContent = error.message;
    }
});

deleteBtn.addEventListener('click', async () => {
    if (!currentStudentId) {
        alert('Lütfen önce öðrenci arayýn.');
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
            messageDiv.textContent = 'Öðrenci baþarýyla silindi.';
            studentDetails.style.display = 'none';
            currentStudentId = null;
            searchForm.reset();
        } else {
            throw new Error('Silme iþlemi baþarýsýz oldu.');
        }
    } catch (error) {
        messageDiv.textContent = error.message;
    }
});