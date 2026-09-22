function getClientId() {
    let id = localStorage.getItem('radioBrowserClientId');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('radioBrowserClientId', id);
    }
    return id;
}

function setIcon(btn, name) {
    const icon = btn.querySelector('[data-lucide]');
    if (icon) {
        icon.setAttribute('data-lucide', name);
        lucide.createIcons();
    }
}

const current = {audio : null, btn : null};

document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-player-button]');
    if (!btn) return;

    const audio = btn.parentElement.querySelector('audio');
    if (!audio) return;

    if (current.audio && current.audio !== audio) {
        current.audio.pause();
        setIcon(current.btn, 'play');
    }

    if (audio.paused) {
        audio.play().catch(() => setIcon(btn, 'play'));
        setIcon(btn, 'pause');
        current.audio = audio;
        current.btn = btn;
    } else {
        audio.pause();
        setIcon(btn, 'play');
        current.audio = current.btn = null;
    }
});

document.addEventListener('DOMContentLoaded', () => lucide.createIcons());