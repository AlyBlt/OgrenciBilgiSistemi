async function fetchStudents() {
    try {
        const response = await fetch('https://localhost:7282/api/Students');
       
        if (!response.ok) {
            const errorText = await response.text();  // API hata mesajýný al
            if (response.status === 404) {
                throw new Error(`Öðrenciler bulunamadý (404): ${errorText}`);
            } else if (response.status === 500) {
                throw new Error(`Sunucu hatasý (500): ${errorText}`);
            } else {
                throw new Error(`Sunucu hatasý: ${response.status} - ${response.statusText} ${errorText}`);
            }
        }
        const students = await response.json();

        // Eðer hiç öðrenci yoksa kullanýcýyý bilgilendir
        const tbody = document.querySelector('#studentsTable tbody');
        if (!tbody) {
            console.error('studentsTable tbody bulunamadý.');
            return;
        }
        if (students.length === 0) {
            tbody.innerHTML = `<tr style="background-color: transparent;"><td colspan="7" style="background-color: transparent; padding: 0; margin-top:5px;"> <div class="alert alert-warning text-center mb-0" role="alert">Listede gösterilecek kayýtlý öðrenci bulunamadý.</div></td></tr>`;
            return;
        }

        tbody.innerHTML = ''; // Önce tabloyu temizle

        // Her öðrenci için satýr oluþtur
        students.forEach(student => {
            const tr = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = student.id;

            const tdAd = document.createElement('td');
            tdAd.textContent = student.ad;

            const tdSoyad = document.createElement('td');
            tdSoyad.textContent = student.soyad;

            const tdOgrNo = document.createElement('td');
            tdOgrNo.textContent = student.ogrenciNo;

            const tdSinif = document.createElement('td');
            tdSinif.textContent = student.sinif;

            const tdEposta = document.createElement('td');
            tdEposta.textContent = student.eposta;

            const tdAktifMi = document.createElement('td');
            tdAktifMi.textContent = student.aktifMi ? 'Evet' : 'Hayýr';

            // Hücreleri satýra ekle
            tr.appendChild(tdId);
            tr.appendChild(tdAd);
            tr.appendChild(tdSoyad);
            tr.appendChild(tdOgrNo);
            tr.appendChild(tdSinif);
            tr.appendChild(tdEposta);
            tr.appendChild(tdAktifMi);

            // Satýrý tabloya ekle
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