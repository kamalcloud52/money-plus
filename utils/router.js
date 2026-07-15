import { renderHome } from '../pages/Home.js';
import { renderWallet } from '../pages/Wallet.js';
import { renderGraph } from '../pages/Graph.js';
import { renderTransaction, initTransactionLogic } from '../pages/Transaction.js';
import { renderSettings } from '../pages/Settings.js';

const routes = {
    'home': renderHome,
    'wallet': renderWallet,
    'graph': renderGraph,
    'transaction': renderTransaction,
    'settings': renderSettings
};

// Simpan referensi fungsi init agar bisa dipanggil ulang jika navigasi bolak-balik
let currentCleanup = null;

export function initRouter() {
    function navigate() {
        let hash = window.location.hash.replace('#', '');
        if (!hash || !routes[hash]) {
            hash = 'home';
        }

        const renderFn = routes[hash];
        if (renderFn) {
            let container = document.querySelector('#app .app-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'app-container';
                document.getElementById('app').appendChild(container);
            }
            
            // Render HTML
            container.innerHTML = renderFn();

            // Jalankan logika khusus jika halaman adalah Transaction
            if (hash === 'transaction') {
                initTransactionLogic();
            }
        }

        document.querySelectorAll('.nav-item').forEach(link => {
            link.classList.toggle('active', link.dataset.page === hash);
        });
    }

    window.addEventListener('hashchange', navigate);
    navigate();
}
