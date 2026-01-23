// State
const state = {
    sender: 'A Friend',
    recipient: 'You',
    photoData: null
};

// Elements
const sections = {
    create: document.getElementById('create-section'),
    envelope: document.getElementById('envelope-section'),
    wish: document.getElementById('wish-section')
};

const dom = {
    senderInput: document.getElementById('senderName'),
    recipientInput: document.getElementById('recipientName'),
    photoToggle: document.getElementById('photoToggle'),
    photoInputGroup: document.getElementById('photoInputGroup'),
    photoFile: document.getElementById('photoFile'),
    createBtn: document.getElementById('createBtn'),

    envelopeContainer: document.getElementById('envelopeContainer'),
    envelope: document.querySelector('.envelope'),
    envSender: document.getElementById('envSender'),

    wishRecipient: document.getElementById('wishRecipient'),
    wishPhotoContainer: document.getElementById('wishPhotoContainer'),
    wishPhoto: document.getElementById('wishPhoto'),
    bgMusic: document.getElementById('bgMusic'),

    generateQrBtn: document.getElementById('generateQrBtn'),
    qrModal: document.getElementById('qrModal'),
    closeModal: document.querySelector('.close-modal'),
    qrcode: document.getElementById('qrcode')
};

// Check for URL params to see if we should jump states
window.DOMContentLoaded = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('sender') && params.has('recipient')) {
        state.sender = params.get('sender') || 'Unknown';
        state.recipient = params.get('recipient') || 'Friend';

        // If viewing from a link, jump straight to envelope
        sections.create.classList.remove('active');
        sections.create.classList.add('hidden');
        showEnvelope();
    }
};

// Toggle Photo Input
dom.photoToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        dom.photoInputGroup.classList.remove('disabled');
    } else {
        dom.photoInputGroup.classList.add('disabled');
        dom.photoFile.value = ''; // clear
    }
});

// Handle File Input
dom.photoFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            state.photoData = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Create Wish
dom.createBtn.addEventListener('click', () => {
    const sender = dom.senderInput.value.trim();
    const recipient = dom.recipientInput.value.trim();

    if (!sender || !recipient) {
        alert("Please fill in both names!");
        return;
    }

    state.sender = sender;
    state.recipient = recipient;

    sections.create.classList.remove('active');
    setTimeout(() => {
        sections.create.classList.add('hidden');
        showEnvelope();
    }, 500);
});

function showEnvelope() {
    dom.envSender.innerText = state.sender;
    sections.envelope.classList.remove('hidden'); // make accessible
    sections.envelope.style.display = 'flex'; // verify display

    setTimeout(() => {
        sections.envelope.classList.add('active');
    }, 100);
}

// Open Envelope
dom.envelopeContainer.addEventListener('click', () => {
    if (sections.envelope.classList.contains('opened')) return; // already opening

    // Animate Envelope
    dom.envelope.classList.add('open');
    sections.envelope.classList.add('opened');

    // Play Music
    dom.bgMusic.volume = 0.5;
    dom.bgMusic.play().catch(e => console.log("Audio autoplay might be blocked", e));

    // Wait for animation then switch
    setTimeout(() => {
        sections.envelope.classList.remove('active');
        sections.envelope.classList.add('hidden');
        showWish();
    }, 1500);
});

function showWish() {
    dom.wishRecipient.innerText = state.recipient;

    if (state.photoData) {
        dom.wishPhoto.src = state.photoData;
        dom.wishPhotoContainer.classList.remove('hidden');
    }

    sections.wish.classList.remove('hidden');
    sections.wish.style.display = 'flex';
    setTimeout(() => {
        sections.wish.classList.add('active');
        fireConfetti();
    }, 100);
}

// Confetti Effect
function fireConfetti() {
    console.log("Confetti!");
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff00de', '#00ffff', '#ffffff']
    });
}

// QR Generation
dom.generateQrBtn.addEventListener('click', () => {
    dom.qrModal.classList.remove('hidden');

    // Clear previous
    dom.qrcode.innerHTML = '';

    // Build Share URL
    const baseUrl = window.location.href.split('?')[0];
    const params = new URLSearchParams();
    params.set('sender', state.sender);
    params.set('recipient', state.recipient);
    // Note: Photo not included in URL intentionally

    const shareUrl = `${baseUrl}?${params.toString()}`;

    new QRCode(dom.qrcode, {
        text: shareUrl,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
});

dom.closeModal.addEventListener('click', () => {
    dom.qrModal.classList.add('hidden');
});