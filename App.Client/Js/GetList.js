async function fetchStudents() {
    try {
        const response = await fetch('https://localhost:7282/api/Students');
        if (!response.ok) {
            const errorText = await response.text(); // API hata mesajý varsa al
            throw new Error(`Sunucu hatasý: ${response.status} - ${response.statusText} ${errorText}`);
        }
        const students = await response.json();

        // Eðer hiç öðrenci yoksa kullanýcýyý bilgilendir
        if (students.length === 0) {
            const tbody = document.querySelector('#studentsTable tbody');
            tbody.innerHTML = `<tr style="background-color: transparent;"><td colspan="7" style="background-color: transparent; padding: 0; margin-top:5px;"> <div class="alert alert-warning text-center mb-0" role="alert">Listede gösterilecek kayýtlý öðrenci bulunamadý.</div></td></tr>`;
            return;
        }

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
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Fetch sýrasýnda hata oluþtu:', error);
        showErrorMessage('Öðrenciler alýnýrken bir hata oluþtu. Lütfen uygulamanýn çalýþtýðýndan ve internet baðlantýnýzýn aktif olduðundan emin olun ve tekrar deneyin.');
    }
}
function showErrorMessage(message) {
    
    let errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.margin = '20px';
        document.querySelector('.container').prepend(errorDiv);
    }
    errorDiv.textContent = message;
}

document.addEventListener('DOMContentLoaded', fetchStudents);