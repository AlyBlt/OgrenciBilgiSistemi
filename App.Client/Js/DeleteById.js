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
        alert('L�tfen bir ��renci ID\'si girin.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${id}`);
        if (response.status === 404) {
            messageDiv.textContent = '��renci bulunamad�.';
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
        messageDiv.textContent = error.message;
    }
});

deleteBtn.addEventListener('click', async () => {
    if (!currentStudentId) {
        alert('L�tfen �nce ��renci aray�n.');
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
            messageDiv.textContent = '��renci ba�ar�yla silindi.';
            studentDetails.style.display = 'none';
            currentStudentId = null;
            searchForm.reset();
        } else {
            throw new Error('Silme i�lemi ba�ar�s�z oldu.');
        }
    } catch (error) {
        messageDiv.textContent = error.message;
    }
});