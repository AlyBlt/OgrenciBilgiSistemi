const apiUrl = 'https://localhost:7282/api/Students';
function showFetchMessage(message) {
    const resultDiv = document.getElementById('result'); 
    let errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        document.querySelector('.container').prepend(errorDiv);
    }
    errorDiv.style.display = 'block';
    errorDiv.textContent = message;
    resultDiv.innerHTML = '';
}
function showError(message) {
    const resultDiv = document.getElementById('result'); 
    resultDiv.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Kapat"></button>
        </div>
    `;
}
// SAYFA A�ILDI�INDA L�STEDE ��RENC� VAR MI KONTROL ET
document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('getForm');
    const resultDiv = document.getElementById('result');

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Sunucu hatas�: ' + response.status);
        }

        const students = await response.json();

        if (students.length === 0) {
            // ��renci yoksa formu gizle ve mesaj g�ster
            form.style.display = 'none';
            resultDiv.innerHTML = `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Listede g�sterilecek kay�tl� ��renci bulunamad�.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Kapat"></button>
                </div>
            `;
        }
    } catch (error) {
        form.style.display = 'none';
        showFetchMessage(`Sunucuya ula��lam�yor. L�tfen uygulaman�n �al��t���ndan ve internet ba�lant�n�z�n aktif oldu�undan emin olun. (Hata: ${error.message})`);
        
    }
});


document.getElementById('getForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Sayfa yenilenmesin

    const idInput = document.getElementById('studentId');
    const id = idInput.value.trim();
    const resultDiv = document.getElementById('result');
    const errorMessageDiv = document.getElementById('error-message');
    const btn = e.submitter; // Formu g�nderen butonu al (Getir butonu)

    resultDiv.innerHTML = '';
    errorMessageDiv.style.display = 'none';

    btn.disabled = true;
    btn.textContent = 'Y�kleniyor...';

    try {
        const response = await fetch(`${apiUrl}/${id}`);

        if (response.status === 404) {
            showError(`${id} numaral� Id\'ye sahip bir ��renci bulunamad�.`);
            return;
        }

        if (!response.ok) {
            showError('��renci bilgisi al�n�rken hata olu�tu.');
            return;
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

        idInput.value = '';
        idInput.focus();

    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            showFetchMessage('Sunucuya ula��lam�yor. L�tfen uygulaman�n �al��t���ndan ve internet ba�lant�n�z�n aktif oldu�undan emin olun.');
        } else {
            showError(`Bir hata olu�tu: ${error.message}`);
            
        }
    } finally {
        btn.disabled = false;
        btn.textContent = 'Getir';
    }

});



