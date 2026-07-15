import { renderHome } from '../pages/Home.js';
import { renderWallet } from '../pages/Wallet.js';
import { renderGraph } from '../pages/Graph.js';
import { renderTransaction, initTransactionLogic } from '../pages/Transaction.js';
import { renderFinancialStatement } from '../pages/FinancialStatement.js';
import { renderSettings } from '../pages/Settings.js';

const routes = {
    'home': renderHome,
    'wallet': renderWallet,
    'graph': renderGraph,
    'transaction': renderTransaction,
    'financial-statement': renderFinancialStatement,
    'settings': renderSettings
};

export function initRouter() {
    
    // Fungsi utama navigasi
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

        // Update active state menu navbar
        document.querySelectorAll('.nav-item').forEach(link => {
            link.classList.toggle('active', link.dataset.page === hash);
        });
    }

    // Event listener untuk perubahan URL (hash)
    window.addEventListener('hashchange', navigate);
    
    // Jalankan navigasi pertama kali saat aplikasi dimuat
    navigate();

    // --- EVENT LISTENER GLOBAL UNTUK TOMBOL BACK DI SEMUA HALAMAN ---
    // Kita pasang satu event listener di document (event delegation) untuk menangani klik
    // pada tombol Back yang memiliki ID spesifik.
    document.addEventListener('click', (e) => {
        // Cek apakah yang diklik adalah tombol Back di halaman Financial Statement
        const backBtn = e.target.closest('#fs-back-btn');
        if (backBtn) {
            e.preventDefault();
            window.location.hash = '#home';
        }
    });
}
