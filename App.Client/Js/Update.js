document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('updateForm');
    const submitButton = form.querySelector('button[type="submit"]');
    let student = null;  // Burada global olarak student deðiþkenini tanýmlýyoruz
    let lastValidSinif = null;  // En son geçerli sinif deðeri için bir deðiþken ekliyoruz
    let lastValidEposta = null; // En son geçerli eposta deðeri için bir deðiþken ekliyoruz

    function resetSubmitButton() {
        submitButton.disabled = false;
        submitButton.textContent = 'Güncelle';
    }
    function capitalizeWords(str) {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    function showFormMessage(message, type = 'danger') {
        let msgDiv = document.getElementById('form-messages');
        msgDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="margin-top: 0px; margin-bottom: 0px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Kapat"></button>
        </div>
        `;
    }
    function showFetchMessage(message) {

        let errorDiv = document.getElementById('fetch-message');
        form.style.display = 'none';
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'fetch-message';
            document.querySelector('.container').prepend(errorDiv);
        }
        // Hata mesajýný en üstte gösteriyoruz
        errorDiv.style.display = 'block';  // Hata mesajýný göster
        errorDiv.textContent = message; // Mesajý ayarla

    }

    function validateStudent(student) {
        // Sýnýf ve Eposta boþ ise hata vermeyelim, sadece null döndürelim
        if (!student.sinif) {
            student.sinif = null; // Boþsa null olarak ayarlayalým
        }

        if (!student.eposta) {
            student.eposta = null; // Boþsa null olarak ayarlayalým
        }

        return null; // Herhangi bir hata yoksa null döndürüyoruz
    }

   try {
        // Öðrenci listesini çekiyoruz
        const listResponse = await fetch('https://localhost:7282/api/Students');
        if (!listResponse.ok) throw new Error('Öðrenciler alýnýrken hata oluþtu.');

        const studentsList = await listResponse.json();

        if (studentsList.length === 0) {
            form.style.display = 'none';
            showFormMessage("Listede güncellenecek kayýtlý öðrenci bulunamadý.", 'warning');
            resetSubmitButton();
            return;  // Burada duruyor, aþaðýya geçmiyor
        }

    } catch (error) {
        showFetchMessage("Sunucuya baðlanýlamýyor. Lütfen internet baðlantýnýzý kontrol edin ve tekrar deneyin.");
        resetSubmitButton();
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const studentId = params.get('id');

    if (!studentId) {
        // Formu gizle
        form.style.display = 'none';

        // Uyarý mesajýný göster
        const container = document.querySelector('.container');
        const warning = document.createElement('div');
        warning.classList.add('alert', 'alert-warning', 'text-center');
        warning.textContent = "Öðrenci Id bulunamadý. URL'de html?id=1 gibi bir deðer olmalý.";
        container.prepend(warning);

        resetSubmitButton(); return;  // Daha fazla iþlem yapma
    }

    // ID varsa devam et, formu göster
    form.style.display = 'block';

    const idInput = document.getElementById('studentId');
    idInput.value = studentId;

    // Öðrenci verisini al
    fetch(`https://localhost:7282/api/Students/${studentId}`)
        .then(res => {
            if (!res.ok) {
                // Eðer öðrenci bulunamadýysa formu gizle
                form.style.display = 'none';
                throw new Error(`${studentId} numaralý Id'ye sahip bir öðrenci bulunamadý.`);
            }
             return res.json();  // Eðer öðrenci bulunursa JSON verisini döndür
        })
        .then(student => {
            document.getElementById('ad').value = student.Ad || '';
            document.getElementById('soyad').value = student.Soyad || '';
            document.getElementById('ogrenciNo').value = student.OgrenciNo || '';
            document.getElementById('sinif').value = student.Sinif || '';// Burada eski deðeri alýyoruz
            lastValidSinif = student.sinif || ''; // Ýlk öðrenci verisiyle gelen sinif deðeri

            document.getElementById('eposta').value = student.Eposta || '';
            lastValidEposta = student.eposta || '';
            document.getElementById('aktifMi').checked = student.AktifMi || false;
        })
        .catch(err => {
            // Burada sunucu hatalarýný ve geçersiz ID hatalarýný ayýrt ediyoruz
            if (err.message.includes('bulunamadý')) {
                // Geçersiz ID hatasý
                showFormMessage(`${studentId} numaralý öðrenci bulunamadý.`, 'danger');
            } else {
                // Diðer hatalar
                showFetchMessage("Sunucuya baðlanýlamýyor. Lütfen internet baðlantýnýzý kontrol edin ve daha sonra tekrar deneyin.");
            }
        });

    
    // Güncelleme iþlemi
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitButton.disabled = true;
        submitButton.textContent = 'Yükleniyor...';

        const idFromForm = document.getElementById('studentId').value;
        form.style.display = 'block'; // Formu görünür hale getir

        const ad = document.getElementById('ad').value.trim();
        const soyad = document.getElementById('soyad').value.trim();
        const ogrenciNo = document.getElementById('ogrenciNo').value.trim();
        const sinif = document.getElementById('sinif').value.trim();  
        const eposta = document.getElementById('eposta').value.trim();   

        //Zorunlu alan kontrolleri
        if (!ad || !soyad || !ogrenciNo) {
            showFormMessage("Ad, Soyad ve Öðrenci No boþ býrakýlamaz.", 'danger');
            resetSubmitButton(); return;
        }
        // Sadece harf kontrolü
        const onlyLetters = /^[a-zA-ZçÇðÐýÝöÖþÞüÜ\s]+$/;

        if (!onlyLetters.test(ad) || !onlyLetters.test(soyad)) {
            showFormMessage("Ad ve Soyad sadece harf içermelidir!", 'danger');
            resetSubmitButton(); return;
        }

        // Öðrenci No kontrolü
        try {
            const kontrolUrl = `https://localhost:7282/api/Students/checkunique/${ogrenciNo}/${idFromForm}`;
            const response = await fetch(kontrolUrl);

            if (!response.ok) {
                const errText = await response.text();
                showFormMessage(`Öðrenci numarasý kontrolü sýrasýnda hata: ${errText}`, 'danger');
                resetSubmitButton(); return;
            }

            const isUnique = await response.json();
            if (!isUnique) {
                showFormMessage("Bu öðrenci numarasý zaten kayýtlý!", 'danger');
                resetSubmitButton(); return;
            }
        } catch (error) {
            showFormMessage("Sunucuyla baðlantý kurulamadý: " + error.message, 'danger');
            resetSubmitButton(); return;
        }


        const updatedStudent = {
            id: parseInt(idFromForm),
            ad: capitalizeWords(ad),
            soyad: capitalizeWords(soyad),
            ogrenciNo: ogrenciNo.toUpperCase(),
            sinif: sinif === "" ? lastValidSinif : sinif,
            eposta: eposta === "" ? lastValidEposta : eposta,
            aktifMi: document.getElementById('aktifMi').checked
        };

        const validationError = validateStudent(updatedStudent);
        if (validationError) {
            // Eðer doðrulama hatasý varsa, hata mesajýný göster ve iþlemi durdur
            showFormMessage(validationError, 'danger');
            resetSubmitButton();
            return;
        }

        console.log('Güncellenmiþ öðrenci:', updatedStudent);  // Güncellenmiþ öðrenci verisi

        
        try {
            const response = await fetch(`https://localhost:7282/api/Students/${idFromForm}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedStudent)
            });

            if (!response.ok) {
                let errorMessage = "Beklenmeyen bir hata oluþtu.";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.title || errorData.message || JSON.stringify(errorData);
                } catch (_) {
                    try {
                        errorMessage = await response.text();
                    } catch (_) { }
                }
                showFormMessage(errorMessage);
                resetSubmitButton();
                return;
            }

            const result = await response.json();
            showFormMessage(`Öðrenci güncellendi: ${result.ad} ${result.soyad}`, 'success');

            lastValidSinif = updatedStudent.sinif;  // Güncellenen sýnýfý son geçerli olarak kaydediyoruz
            lastValidEposta = updatedStudent.eposta;  // Güncellenen epostayý son geçerli olarak kaydediyoruz
           
        } catch (err) {
            showFormMessage("Bir hata oluþtu: " + err.message);
        }

         finally {
            resetSubmitButton(); // Tek bir yerden kontrol
        }
    });
   
});



