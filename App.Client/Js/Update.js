document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('updateForm');
    const submitButton = form.querySelector('button[type="submit"]');
    let student = null;  // Burada global olarak student de�i�kenini tan�ml�yoruz
    let lastValidSinif = null;  // En son ge�erli sinif de�eri i�in bir de�i�ken ekliyoruz
    let lastValidEposta = null; // En son ge�erli eposta de�eri i�in bir de�i�ken ekliyoruz

    function resetSubmitButton() {
        submitButton.disabled = false;
        submitButton.textContent = 'G�ncelle';
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
        // Hata mesaj�n� en �stte g�steriyoruz
        errorDiv.style.display = 'block';  // Hata mesaj�n� g�ster
        errorDiv.textContent = message; // Mesaj� ayarla

    }

    function validateStudent(student) {
        // S�n�f ve Eposta bo� ise hata vermeyelim, sadece null d�nd�relim
        if (!student.sinif) {
            student.sinif = null; // Bo�sa null olarak ayarlayal�m
        }

        if (!student.eposta) {
            student.eposta = null; // Bo�sa null olarak ayarlayal�m
        }

        return null; // Herhangi bir hata yoksa null d�nd�r�yoruz
    }

   try {
        // ��renci listesini �ekiyoruz
        const listResponse = await fetch('https://localhost:7282/api/Students');
        if (!listResponse.ok) throw new Error('��renciler al�n�rken hata olu�tu.');

        const studentsList = await listResponse.json();

        if (studentsList.length === 0) {
            form.style.display = 'none';
            showFormMessage("Listede g�ncellenecek kay�tl� ��renci bulunamad�.", 'warning');
            resetSubmitButton();
            return;  // Burada duruyor, a�a��ya ge�miyor
        }

    } catch (error) {
        showFetchMessage("Sunucuya ba�lan�lam�yor. L�tfen internet ba�lant�n�z� kontrol edin ve tekrar deneyin.");
        resetSubmitButton();
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const studentId = params.get('id');

    if (!studentId) {
        // Formu gizle
        form.style.display = 'none';

        // Uyar� mesaj�n� g�ster
        const container = document.querySelector('.container');
        const warning = document.createElement('div');
        warning.classList.add('alert', 'alert-warning', 'text-center');
        warning.textContent = "��renci Id bulunamad�. URL'de html?id=1 gibi bir de�er olmal�.";
        container.prepend(warning);

        resetSubmitButton(); return;  // Daha fazla i�lem yapma
    }

    // ID varsa devam et, formu g�ster
    form.style.display = 'block';

    const idInput = document.getElementById('studentId');
    idInput.value = studentId;

    // ��renci verisini al
    fetch(`https://localhost:7282/api/Students/${studentId}`)
        .then(res => {
            if (!res.ok) {
                // E�er ��renci bulunamad�ysa formu gizle
                form.style.display = 'none';
                throw new Error(`${studentId} numaral� Id'ye sahip bir ��renci bulunamad�.`);
            }
             return res.json();  // E�er ��renci bulunursa JSON verisini d�nd�r
        })
        .then(student => {
            document.getElementById('ad').value = student.Ad || '';
            document.getElementById('soyad').value = student.Soyad || '';
            document.getElementById('ogrenciNo').value = student.OgrenciNo || '';
            document.getElementById('sinif').value = student.Sinif || '';// Burada eski de�eri al�yoruz
            lastValidSinif = student.sinif || ''; // �lk ��renci verisiyle gelen sinif de�eri

            document.getElementById('eposta').value = student.Eposta || '';
            lastValidEposta = student.eposta || '';
            document.getElementById('aktifMi').checked = student.AktifMi || false;
        })
        .catch(err => {
            // Burada sunucu hatalar�n� ve ge�ersiz ID hatalar�n� ay�rt ediyoruz
            if (err.message.includes('bulunamad�')) {
                // Ge�ersiz ID hatas�
                showFormMessage(`${studentId} numaral� ��renci bulunamad�.`, 'danger');
            } else {
                // Di�er hatalar
                showFetchMessage("Sunucuya ba�lan�lam�yor. L�tfen internet ba�lant�n�z� kontrol edin ve daha sonra tekrar deneyin.");
            }
        });

    
    // G�ncelleme i�lemi
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitButton.disabled = true;
        submitButton.textContent = 'Y�kleniyor...';

        const idFromForm = document.getElementById('studentId').value;
        form.style.display = 'block'; // Formu g�r�n�r hale getir

        const ad = document.getElementById('ad').value.trim();
        const soyad = document.getElementById('soyad').value.trim();
        const ogrenciNo = document.getElementById('ogrenciNo').value.trim();
        const sinif = document.getElementById('sinif').value.trim();  
        const eposta = document.getElementById('eposta').value.trim();   

        //Zorunlu alan kontrolleri
        if (!ad || !soyad || !ogrenciNo) {
            showFormMessage("Ad, Soyad ve ��renci No bo� b�rak�lamaz.", 'danger');
            resetSubmitButton(); return;
        }
        // Sadece harf kontrol�
        const onlyLetters = /^[a-zA-Z������������\s]+$/;

        if (!onlyLetters.test(ad) || !onlyLetters.test(soyad)) {
            showFormMessage("Ad ve Soyad sadece harf i�ermelidir!", 'danger');
            resetSubmitButton(); return;
        }

        // ��renci No kontrol�
        try {
            const kontrolUrl = `https://localhost:7282/api/Students/checkunique/${ogrenciNo}/${idFromForm}`;
            const response = await fetch(kontrolUrl);

            if (!response.ok) {
                const errText = await response.text();
                showFormMessage(`��renci numaras� kontrol� s�ras�nda hata: ${errText}`, 'danger');
                resetSubmitButton(); return;
            }

            const isUnique = await response.json();
            if (!isUnique) {
                showFormMessage("Bu ��renci numaras� zaten kay�tl�!", 'danger');
                resetSubmitButton(); return;
            }
        } catch (error) {
            showFormMessage("Sunucuyla ba�lant� kurulamad�: " + error.message, 'danger');
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
            // E�er do�rulama hatas� varsa, hata mesaj�n� g�ster ve i�lemi durdur
            showFormMessage(validationError, 'danger');
            resetSubmitButton();
            return;
        }

        console.log('G�ncellenmi� ��renci:', updatedStudent);  // G�ncellenmi� ��renci verisi

        
        try {
            const response = await fetch(`https://localhost:7282/api/Students/${idFromForm}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedStudent)
            });

            if (!response.ok) {
                let errorMessage = "Beklenmeyen bir hata olu�tu.";
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
            showFormMessage(`��renci g�ncellendi: ${result.ad} ${result.soyad}`, 'success');

            lastValidSinif = updatedStudent.sinif;  // G�ncellenen s�n�f� son ge�erli olarak kaydediyoruz
            lastValidEposta = updatedStudent.eposta;  // G�ncellenen epostay� son ge�erli olarak kaydediyoruz
           
        } catch (err) {
            showFormMessage("Bir hata olu�tu: " + err.message);
        }

         finally {
            resetSubmitButton(); // Tek bir yerden kontrol
        }
    });
   
});



