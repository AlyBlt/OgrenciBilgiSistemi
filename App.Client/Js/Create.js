document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('studentForm');

    function capitalizeWords(str) {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();  // Formun klasik submitini engelle

        // Form alanlarýný al
        const ad = document.getElementById('ad').value.trim();
        const soyad = document.getElementById('soyad').value.trim();
        if (!ad || !soyad) {
            alert('Ad ve Soyad alanlarý zorunludur!');
            return;
        }
        const capitalizedAd = capitalizeWords(ad);
        const capitalizedSoyad = capitalizeWords(soyad);

        const ogrenciNo = document.getElementById('ogrenciNo').value.trim();
       
        if (!ogrenciNo) {
            alert('Öðrenci No boþ býrakýlamaz!');
            return;
        }
        // Benzersizlik kontrolü
        let isUnique = false;
        try {
            const response = await fetch(`https://localhost:7282/api/Students/checkunique/${ogrenciNo}`);
            if (response.ok) {
                isUnique = await response.json();
            } else {
                alert('Benzersizlik kontrolü yapýlamadý, lütfen tekrar deneyin.');
                return;
            }
        } catch (error) {
            alert('Benzersizlik kontrolü sýrasýnda hata oluþtu: ' + error.message);
            return;
        }

        if (!isUnique) {
            alert('Bu öðrenci numarasý zaten kayýtlý!');
            return; // Form gönderimini iptal et
        }
        const sinif = document.getElementById('sinif').value.trim();
        const eposta = document.getElementById('eposta').value.trim();

        

        // Örnek benzersizlik kontrolü (client tarafýnda statik, gerçek check için API call gerekir)
        // Burada basit olarak devam ediyoruz.

        // Gönderilecek veri objesi
        const studentData = {
            Ad: capitalizedAd,
            Soyad: capitalizedSoyad,
            OgrenciNo: ogrenciNo,
            Sinif: sinif,
            Eposta: eposta
        };

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
                alert('Hata: ' + (errorData.title || response.statusText));
                return;
            }

            const createdStudent = await response.json();
            alert(`Öðrenci baþarýyla eklendi: ${createdStudent.ad} ${createdStudent.soyad}`);

            // Ýstersen formu sýfýrla
            form.reset();

        } catch (error) {
            alert('Bir hata oluþtu: ' + error.message);
        }
    });
});
