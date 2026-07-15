import { renderHome } from '../pages/Home.js';
import { renderWallet } from '../pages/Wallet.js';
import { renderGraph } from '../pages/Graph.js';
import { renderSettings } from '../pages/Settings.js';

const routes = {
    'home': renderHome,
    'wallet': renderWallet,
    'graph': renderGraph,
    'settings': renderSettings
};

export function initRouter() {
    const mainContent = document.getElementById('app');
    
    function navigate() {
        let hash = window.location.hash.replace('#', '');
        if (!hash || !routes[hash]) {
            hash = 'home';
        }

        // Panggil fungsi render dari halaman yang sesuai
        const renderFn = routes[hash];
        if (renderFn) {
            // Kosongkan isi app lalu masukkan hasil render halaman
            mainContent.innerHTML = renderFn();
        }

        // Update class active pada menu navigasi
        document.querySelectorAll('.nav-item').forEach(link => {
            link.classList.toggle('active', link.dataset.page === hash);
        });
    }

    window.addEventListener('hashchange', navigate);
    navigate(); // Jalankan pertama kali saat load
}
