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
        submitButton.textContent = '��renci Ekle';
    }

    // Fetch Error mesaji i�in ayr� div
    function showFetchError(message) {
        const errorMessageDiv = document.getElementById('error-message');
        if (errorMessageDiv) {
            errorMessageDiv.style.display = 'block';  // G�r�n�r yap
            errorMessageDiv.textContent = message; // Mesaj� ekle
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();  // Formun klasik submitini engelle
        
        submitButton.disabled = true;
        submitButton.textContent = 'Y�kleniyor...';

        // Form alanlar�n� al
        const ad = document.getElementById('ad').value.trim();
        const soyad = document.getElementById('soyad').value.trim();
        const ogrenciNo = document.getElementById('ogrenciNo').value.trim();
        const sinifInput = document.getElementById('sinif').value.trim();
        const sinif = sinifInput === "" ? null : sinifInput;
        const epostaInput = document.getElementById('eposta').value.trim();
        const eposta = epostaInput === "" ? null : epostaInput;

        if (!ad || !soyad) {
            showMessage('Ad ve Soyad alanlar� zorunludur!');
            resetSubmitButton(); return;
        }
        const onlyLetters = /^[a-zA-Z������������\s]+$/;

        if (!onlyLetters.test(ad) || !onlyLetters.test(soyad)) {
            showMessage('Ad ve Soyad sadece harf i�ermelidir!');
            resetSubmitButton(); return;
        }
        

        if (!ogrenciNo) {
            showMessage('��renci No bo� b�rak�lamaz!');
            resetSubmitButton(); return;
        }

        const capitalizedAd = capitalizeWords(ad);
        const capitalizedSoyad = capitalizeWords(soyad);

        // ��renci numaras�n�n benzersiz olup olmad���n� kontrol et
        
        try {
            const response = await fetch(`https://localhost:7282/api/Students/checkunique/${ogrenciNo}`);

            if (response.ok) {
                // E�er response ba�ar�l�ysa, isUnique sonucunu al
                const isUnique = await response.json();

                // E�er ��renci numaras� benzersiz de�ilse, hata mesaj� g�ster
                if (!isUnique) {
                    showMessage('Bu ��renci numaras� zaten kay�tl�!');
                    resetSubmitButton(); return; // Form g�nderimini engelle
                }

            } else {
                // API'den ba�ar�yla yan�t al�namazsa.Benzersizlik kontrol� yap�lamazsa.
                showMessage('��renci numaras� kontrol� yap�l�rken bir sorun olu�tu. L�tfen tekrar deneyin.');
                resetSubmitButton(); return; // Formu iptal et
            }
        } catch (error) {
            // API iste�i yap�l�rken bir hata olu�ursa
            showFetchError('��renci numaras� kontrol edilirken bir sorun olu�tu. L�tfen internet ba�lant�n�z� kontrol edin ve tekrar deneyin.' + "(Hata: " + error.message + ")");
            resetSubmitButton(); return; // Formu iptal et
        }
 
        // G�nderilecek veri objesi
        const studentData = {
            Ad: capitalizedAd,
            Soyad: capitalizedSoyad,
            OgrenciNo: ogrenciNo,
            Sinif: sinif,
            Eposta: eposta
        };
        // ��renci verisini API'ye g�nder
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
                console.error('Hata:', errorData);  // Konsola hata mesaj�n� yazd�r
                showMessage('Hata: ' + (errorData.title || response.statusText || 'Bilinmeyen bir hata olu�tu.'));
                resetSubmitButton(); return;
            }

            const createdStudent = await response.json();
            console.log('Ba�ar�yla kaydedildi:', createdStudent);  // Kaydedilen ��renci bilgilerini konsola yazd�r
            showMessage(`��renci ba�ar�yla eklendi: ${createdStudent.ad} ${createdStudent.soyad}`, 'success');

            // formu s�f�rla
            form.reset();

        } catch (error) {
            showFetchError('Bir hata olu�tu. L�tfen internet ba�lant�n�z� kontrol edin ve tekrar deneyin.' + "(Hata: "+error.message+")");
        }
        finally {
            resetSubmitButton(); // Tek bir yerden kontrol
        }
       
    });
});
