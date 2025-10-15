async function fetchStudents() {
    try {
        const response = await fetch('https://localhost:7282/api/Students');
        if (!response.ok) {
            const errorText = await response.text(); // API hata mesaj� varsa al
            throw new Error(`Sunucu hatas�: ${response.status} - ${response.statusText} ${errorText}`);
        }
        const students = await response.json();

        // E�er hi� ��renci yoksa kullan�c�y� bilgilendir
        if (students.length === 0) {
            const tbody = document.querySelector('#studentsTable tbody');
            tbody.innerHTML = `<tr style="background-color: transparent;"><td colspan="7" style="background-color: transparent; padding: 0; margin-top:5px;"> <div class="alert alert-warning text-center mb-0" role="alert">Listede g�sterilecek kay�tl� ��renci bulunamad�.</div></td></tr>`;
            return;
        }

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
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Fetch s�ras�nda hata olu�tu:', error);
        showErrorMessage('��renciler al�n�rken bir hata olu�tu. L�tfen uygulaman�n �al��t���ndan ve internet ba�lant�n�z�n aktif oldu�undan emin olun ve tekrar deneyin.');
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