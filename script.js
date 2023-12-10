let meetings = [];
let meetingHistory = [];

function generateMeetingCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let meetingCode = '';
    for (let i = 0; i < 8; i++) {
        meetingCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return meetingCode;
}

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function clearFormInputs(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
        input.value = '';
    });
}

function updateMeetingStatus(text) {
    meetingHistory.push({ text: text });
    const meetingStatusText = document.getElementById("meetingStatusText");

    if (meetingHistory.length > 0) {
        meetingStatusText.innerHTML = meetingHistory.map(entry => entry.text).join("<br>");
        
        
    } else {
        meetingStatusText.innerHTML = "Henüz bir toplantı planı oluşturulmadı.";
    }
}


function createMeeting() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const meetingSubject = document.getElementById("meetingSubject").value;
    const meetingDate = document.getElementById("meetingDate").value;

    const meetingCode = generateMeetingCode();

    const newMeeting = {
        username: username,
        password: password,
        subject: meetingSubject,
        date: meetingDate,
        code: meetingCode
    };

    meetings.push(newMeeting);

    updateMeetingStatus(`${username} kullanıcısı tarafından "${meetingSubject}" adında ve ${meetingDate} tarihinde bir toplantı planı oluşturuldu. Toplantı Kodu: ${meetingCode}`);
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("meetingSubject").value = "";
    document.getElementById("meetingDate").value = "";

}

function cancelMeeting() {
    const cancelUsername = document.getElementById("cancelUsername").value;
    const cancelPassword = document.getElementById("cancelPassword").value;
    const meetingCode = document.getElementById("meetingCode").value;

    const meetingToCancel = meetings.find(meeting => meeting.code === meetingCode);

    if (meetingToCancel &&
        cancelUsername === meetingToCancel.username &&
        cancelPassword === meetingToCancel.password) {

        const cancelledMeetingParticipants = document.getElementById('katilimciListesi');
        const participantsToRemove = cancelledMeetingParticipants.getElementsByTagName('li');

        for (let i = participantsToRemove.length - 1; i >= 0; i--) {
            const participantInfo = participantsToRemove[i].textContent;
            if (participantInfo.includes(meetingCode)) {
                cancelledMeetingParticipants.removeChild(participantsToRemove[i]);
            }
        }

        meetings = meetings.filter(meeting => meeting.code !== meetingCode);
        clearFormInputs('cancelMeetingForm');

        updateMeetingStatus  (`${cancelUsername} kullanıcısı tarafından "${meetingCode}" kodlu toplantı iptal edildi. Katılımcılar listeden çıkarıldı.`);

    } else {
        alert("Geçersiz kullanıcı adı, şifre veya toplantı kodu. Toplantı iptal edilemedi.");
    }
}

function katilimciEkle() {
    const katilimciAdi = document.getElementById('katilimciAdi').value;
    const toplantiKodu = document.getElementById('toplantiKodu').value;
    const tarihSaat = document.getElementById('tarihSaat').value;

    if (katilimciAdi && toplantiKodu && tarihSaat) {
        const katilimciBilgisi = document.getElementById('katilimciBilgisi');
        const katilimciListesi = document.getElementById('katilimciListesi');

        const toplanti = meetings.find(meeting => meeting.code === toplantiKodu);

        if (toplanti) {
            if (!toplanti.cancelled) {
                katilimciBilgisi.style.display = 'none';

                const yeniKatilimci = document.createElement('li');
                clearFormInputs('joinMeetingForm');

                yeniKatilimci.textContent = `${katilimciAdi} kullanıcısı, ${toplantiKodu} kodlu toplantıya, ${tarihSaat} tarihinde katılabilecek.`;
                katilimciListesi.appendChild(yeniKatilimci);

                document.getElementById('katilimciAdi').value = '';
                document.getElementById('toplantiKodu').value = '';
                document.getElementById('tarihSaat').value = '';
            } else {
                alert('Bu toplantı iptal edildi. Katılımcı eklenemez.');

                const katilimciIndex = meetings.findIndex(meeting => meeting.code === toplantiKodu);
                if (katilimciIndex !== -1) {
                    meetings.splice(katilimciIndex, 1);
                    updateMeetingStatus(`${toplantiKodu} kodlu toplantı iptal edildi. Katılımcılar listeden çıkarıldı.`);
                }
            }
        } else {
            alert('Bu toplantı koduna sahip bir toplantı bulunamadı.');
        }
    } else {
        alert('Lütfen tüm alanları doldurun.');
    }
}
