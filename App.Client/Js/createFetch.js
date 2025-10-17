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
    function closeMessage(button) {
        // X butonuna týklandýðýnda çalýþacak fonksiyon
        const msgDiv = button.closest('.alert');  // Butona en yakýn .alert div'ini buluyoruz
        if (msgDiv) {
            msgDiv.remove();  // Mesajý hemen DOM'dan kaldýrýyoruz
        }
    }
    function showMessage(message, type = 'danger') {
        const messageContainer = document.getElementById('form-messages'); // Mesaj container'ýný seçiyoruz
        messageContainer.innerHTML = `
            <div class="alert alert-${type}" role="alert">
                ${message}
               <button type="button" class="btn-close" aria-label="Kapat" style="position: absolute; top: 10px; right: 10px;"></button>
            </div>
        `;

        // Burada, 'btn-close' butonuna týklama olayýný baðlýyoruz
        const closeButton = messageContainer.querySelector('.btn-close');
        if (closeButton) {
            closeButton.addEventListener('click', function () {
                closeMessage(this);
            });
        }
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
        event.preventDefault();

        submitButton.disabled = true;
        submitButton.textContent = 'Yükleniyor...';

        let errors = [];
        const ad = document.getElementById('ad').value.trim();
        const soyad = document.getElementById('soyad').value.trim();
        const ogrenciNo = document.getElementById('ogrenciNo').value.trim();
        const sinifInput = document.getElementById('sinif').value.trim();
        const sinif = sinifInput === "" ? null : sinifInput;
        const epostaInput = document.getElementById('eposta').value.trim();
        const eposta = epostaInput === "" ? null : epostaInput;

        if (!ad) errors.push('Ad alaný zorunludur!');
        if (!soyad) errors.push('Soyad alaný zorunludur!');
        if (!ogrenciNo) errors.push('Öðrenci numarasý zorunludur!');

        if (errors.length > 0) {
            showMessage(errors.join('<br>'));
            resetSubmitButton();
            return;
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
        const ogrenciNoUpper = ogrenciNo ? ogrenciNo.toUpperCase() : null;
        const sinifUpper = sinif ? sinif.toUpperCase() : null;

        const studentData = {
            ad: capitalizedAd,
            soyad: capitalizedSoyad,
            ogrenciNo: ogrenciNo.toUpperCase(),
            sinif: sinif?.toUpperCase() || null ,
            eposta: eposta || null
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
                const errorMessage = errorData.title || errorData.message || response.statusText || 'Bilinmeyen bir hata oluþtu.';
                console.error('Hata:', errorData);
                showMessage('Hata: ' + errorMessage);
                resetSubmitButton();
                return;
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
