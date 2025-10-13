document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('updateForm');

    function capitalizeWords(str) {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
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
        warning.textContent = "��renci ID bulunamad�. URL'de html?id=1 gibi bir de�er olmal�.";
        container.prepend(warning);

        return;  // Daha fazla i�lem yapma
    }

    // ID varsa devam et, formu g�ster
    form.style.display = 'block';

    const idInput = document.getElementById('studentId');
    idInput.value = studentId;

    // ��renci verisini al
    fetch(`https://localhost:7282/api/Students/${studentId}`)
        .then(res => {
            if (!res.ok) throw new Error("��renci bulunamad�");
            return res.json();
        })
        .then(student => {
            document.getElementById('ad').value = student.Ad || '';
            document.getElementById('soyad').value = student.Soyad || '';
            document.getElementById('ogrenciNo').value = student.OgrenciNo || '';
            document.getElementById('sinif').value = student.Sinif || '';
            document.getElementById('eposta').value = student.Eposta || '';
            document.getElementById('aktifMi').checked = student.AktifMi || false;
        })
        .catch(err => {
            alert("Veri al�n�rken hata olu�tu: " + err.message);
        });

    // G�ncelleme i�lemi (ayn� kod)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const idFromForm = document.getElementById('studentId').value;

        const updatedStudent = {
            Id: parseInt(idFromForm),
            Ad: capitalizeWords(document.getElementById('ad').value.trim()),
            Soyad: capitalizeWords(document.getElementById('soyad').value.trim()),
            OgrenciNo: document.getElementById('ogrenciNo').value.trim(),
            Sinif: document.getElementById('sinif').value.trim(),
            Eposta: document.getElementById('eposta').value.trim(),
            AktifMi: document.getElementById('aktifMi').checked
        };

        try {
            const response = await fetch(`https://localhost:7282/api/Students/${idFromForm}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedStudent)
            });

            if (!response.ok) {
                const error = await response.json();
                alert("Hata: " + (error.title || response.statusText));
                return;
            }

            const result = await response.json();
            alert(`��renci g�ncellendi: ${result.Ad} ${result.Soyad}`);
        } catch (err) {
            alert("Bir hata olu�tu: " + err.message);
        }
    });
});