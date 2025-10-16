async function fetchStudents() {

    // Yardýmcý fonksiyon: güvenli td oluþturur (textContent kullanýr)
    function createTd(text) {
        const td = document.createElement('td');
        td.textContent = text == null ? '' : text;  // null ya da undefined kontrolü
        return td;
    }
    // Yardýmcý: tbody'yi temizler
    function clearTbody(tbody) {
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
    }

    // Yardýmcý: "Ýþlem" sütunu görünürlüðünü ayarlar
    function toggleActionColumn(show) {
        const th = document.querySelector('#studentsTable thead tr th:last-child');
        if (th) th.style.display = show ? '' : 'none';

        const tdElements = document.querySelectorAll('#studentsTable tbody tr td:last-child');
        tdElements.forEach(td => {
            td.style.display = show ? '' : 'none';
        });
    }

    try {
        const response = await fetch('https://localhost:7282/api/Students');
        if (!response.ok) {
            showPageMessage('Öðrenciler alýnýrken hata oluþtu: ' + response.statusText);
            return;
        }
        const students = await response.json();

        const tbody = document.querySelector('#studentsTable tbody');
        /*tbody.innerHTML = ''; // Önce tabloyu temizle*/
        clearTbody(tbody);

        if (students.length === 0) {
            toggleActionColumn(false);

            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 8;
            td.style.backgroundColor = 'transparent';
            td.style.padding = '0';
            td.style.marginTop = '5px';

            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-warning text-center mb-0';
            alertDiv.setAttribute('role', 'alert');
            alertDiv.textContent = 'Listede silinecek kayýtlý öðrenci bulunamadý.';

            td.appendChild(alertDiv);
            tr.appendChild(td);
            tbody.appendChild(tr);

            return;
        } 
        else {
            toggleActionColumn(true);
        }
        
            students.forEach(student => {
            const tr = document.createElement('tr');

            // Her hücre için createTd kullanarak metni güvenle ekliyoruz
            tr.appendChild(createTd(student.id));
            tr.appendChild(createTd(student.ad));
            tr.appendChild(createTd(student.soyad));
            tr.appendChild(createTd(student.ogrenciNo));
            tr.appendChild(createTd(student.sinif));
            tr.appendChild(createTd(student.eposta));
            tr.appendChild(createTd(student.aktifMi ? 'Evet' : 'Hayýr'));


            // Ýþlem sütunu (sil butonu) oluþturuluyor
            const tdAction = document.createElement('td');
            const btn = document.createElement('button');
            btn.className = 'btn btn-danger btn-sm';
            btn.textContent = 'Sil';

            // Butona event listener ekleniyor (onclick yerine)
            btn.addEventListener('click', () => deleteStudent(student.id));

            tdAction.appendChild(btn);
            tr.appendChild(tdAction);

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
        msgDiv.classList.add('mt-5');
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