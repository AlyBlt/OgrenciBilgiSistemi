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

        // Form alanlar�n� al
        const ad = document.getElementById('ad').value.trim();
        const soyad = document.getElementById('soyad').value.trim();
        if (!ad || !soyad) {
            alert('Ad ve Soyad alanlar� zorunludur!');
            return;
        }
        const capitalizedAd = capitalizeWords(ad);
        const capitalizedSoyad = capitalizeWords(soyad);

        const ogrenciNo = document.getElementById('ogrenciNo').value.trim();
       
        if (!ogrenciNo) {
            alert('��renci No bo� b�rak�lamaz!');
            return;
        }
        // Benzersizlik kontrol�
        let isUnique = false;
        try {
            const response = await fetch(`https://localhost:7282/api/Students/checkunique/${ogrenciNo}`);
            if (response.ok) {
                isUnique = await response.json();
            } else {
                alert('Benzersizlik kontrol� yap�lamad�, l�tfen tekrar deneyin.');
                return;
            }
        } catch (error) {
            alert('Benzersizlik kontrol� s�ras�nda hata olu�tu: ' + error.message);
            return;
        }

        if (!isUnique) {
            alert('Bu ��renci numaras� zaten kay�tl�!');
            return; // Form g�nderimini iptal et
        }
        const sinif = document.getElementById('sinif').value.trim();
        const eposta = document.getElementById('eposta').value.trim();

        

        // �rnek benzersizlik kontrol� (client taraf�nda statik, ger�ek check i�in API call gerekir)
        // Burada basit olarak devam ediyoruz.

        // G�nderilecek veri objesi
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
            alert(`��renci ba�ar�yla eklendi: ${createdStudent.ad} ${createdStudent.soyad}`);

            // �stersen formu s�f�rla
            form.reset();

        } catch (error) {
            alert('Bir hata olu�tu: ' + error.message);
        }
    });
});
