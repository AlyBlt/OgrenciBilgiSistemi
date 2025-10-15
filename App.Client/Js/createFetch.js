document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('studentForm');
    const messageContainer = document.getElementById('form-messages');
    const submitButton = form.querySelector('button[type="submit"]');
    function capitalizeWords(str) {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    function showMessage(message, type = 'danger') {
        messageContainer.innerHTML = `
            <div class="alert alert-${type}" role="alert">
                ${message}
            </div>
        `;
    }

    function resetSubmitButton() {
        submitButton.disabled = false;
        submitButton.textContent = 'Öðrenci Ekle';
    }

    // Fetch Error mesaji için ayrý div
    function showFetchError(message) {
        const errorMessageDiv = document.getElementById('error-message');
        if (errorMessageDiv) {
            errorMessageDiv.style.display = 'block';  // Görünür yap
            errorMessageDiv.textContent = message; // Mesajý ekle
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();  // Formun klasik submitini engelle
        
        submitButton.disabled = true;
        submitButton.textContent = 'Yükleniyor...';

        // Form alanlarýný al
        const ad = document.getElementById('ad').value.trim();
        const soyad = document.getElementById('soyad').value.trim();
        const ogrenciNo = document.getElementById('ogrenciNo').value.trim();
        const sinifInput = document.getElementById('sinif').value.trim();
        const sinif = sinifInput === "" ? null : sinifInput;
        const epostaInput = document.getElementById('eposta').value.trim();
        const eposta = epostaInput === "" ? null : epostaInput;

        if (!ad || !soyad) {
            showMessage('Ad ve Soyad alanlarý zorunludur!');
            resetSubmitButton(); return;
        }
        const onlyLetters = /^[a-zA-ZçÇðÐýÝöÖþÞüÜ\s]+$/;

        if (!onlyLetters.test(ad) || !onlyLetters.test(soyad)) {
            showMessage('Ad ve Soyad sadece harf içermelidir!');
            resetSubmitButton(); return;
        }
        

        if (!ogrenciNo) {
            showMessage('Öðrenci No boþ býrakýlamaz!');
            resetSubmitButton(); return;
        }

        const capitalizedAd = capitalizeWords(ad);
        const capitalizedSoyad = capitalizeWords(soyad);

        // Öðrenci numarasýnýn benzersiz olup olmadýðýný kontrol et
        
        try {
            const response = await fetch(`https://localhost:7282/api/Students/checkunique/${ogrenciNo}`);

            if (response.ok) {
                // Eðer response baþarýlýysa, isUnique sonucunu al
                const isUnique = await response.json();

                // Eðer öðrenci numarasý benzersiz deðilse, hata mesajý göster
                if (!isUnique) {
                    showMessage('Bu öðrenci numarasý zaten kayýtlý!');
                    resetSubmitButton(); return; // Form gönderimini engelle
                }

            } else {
                // API'den baþarýyla yanýt alýnamazsa.Benzersizlik kontrolü yapýlamazsa.
                showMessage('Öðrenci numarasý kontrolü yapýlýrken bir sorun oluþtu. Lütfen tekrar deneyin.');
                resetSubmitButton(); return; // Formu iptal et
            }
        } catch (error) {
            // API isteði yapýlýrken bir hata oluþursa
            showFetchError('Öðrenci numarasý kontrol edilirken bir sorun oluþtu. Lütfen internet baðlantýnýzý kontrol edin ve tekrar deneyin.' + "(Hata: " + error.message + ")");
            resetSubmitButton(); return; // Formu iptal et
        }
 
        // Gönderilecek veri objesi
        const studentData = {
            Ad: capitalizedAd,
            Soyad: capitalizedSoyad,
            OgrenciNo: ogrenciNo,
            Sinif: sinif,
            Eposta: eposta
        };
        // Öðrenci verisini API'ye gönder
        try {
            const response = await fetch('https://localhost:7282/api/Students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Hata:', errorData);  // Konsola hata mesajýný yazdýr
                showMessage('Hata: ' + (errorData.title || response.statusText || 'Bilinmeyen bir hata oluþtu.'));
                resetSubmitButton(); return;
            }

            const createdStudent = await response.json();
            console.log('Baþarýyla kaydedildi:', createdStudent);  // Kaydedilen öðrenci bilgilerini konsola yazdýr
            showMessage(`Öðrenci baþarýyla eklendi: ${createdStudent.ad} ${createdStudent.soyad}`, 'success');

            // formu sýfýrla
            form.reset();

        } catch (error) {
            showFetchError('Bir hata oluþtu. Lütfen internet baðlantýnýzý kontrol edin ve tekrar deneyin.' + "(Hata: "+error.message+")");
        }
        finally {
            resetSubmitButton(); // Tek bir yerden kontrol
        }
       
    });
});
