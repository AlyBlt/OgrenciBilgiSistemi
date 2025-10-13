const apiUrl = 'https://localhost:7282/api/Students';

document.getElementById('getStudentBtn').addEventListener('click', async () => {
    const idInput = document.getElementById('studentId');
    const id = idInput.value.trim();
    const resultDiv = document.getElementById('result');

    if (!id) {
        resultDiv.innerHTML = '<div class="alert alert-warning">L�tfen bir ��renci ID giriniz.</div>';
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${id}`);

        if (response.status === 404) {
            resultDiv.innerHTML = `<div class="alert alert-danger">ID'si ${id} olan ��renci bulunamad�.</div>`;
            return;
        }

        if (!response.ok) {
            throw new Error('��renci bilgisi al�n�rken hata olu�tu.');
        }

        const student = await response.json();

        resultDiv.innerHTML = `
            <table class="table table-bordered w-50">
                <tr><th>ID</th><td>${student.id}</td></tr>
                <tr><th>Ad</th><td>${student.ad}</td></tr>
                <tr><th>Soyad</th><td>${student.soyad}</td></tr>
                <tr><th>��renci No</th><td>${student.ogrenciNo}</td></tr>
                <tr><th>S�n�f</th><td>${student.sinif}</td></tr>
                <tr><th>E-posta</th><td>${student.eposta}</td></tr>
                <tr><th>Aktif Mi?</th><td>${student.aktifMi ? 'Evet' : 'Hay�r'}</td></tr>
            </table>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger">Hata: ${error.message}</div>`;
    }
});