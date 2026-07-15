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
    // Kita ubah target elemennya. Jangan hapus seluruh #app, tapi hapus isi .app-container saja
    // Atau, kita render navbar terpisah dari konten.
    
    function navigate() {
        let hash = window.location.hash.replace('#', '');
        if (!hash || !routes[hash]) {
            hash = 'home';
        }

        const renderFn = routes[hash];
        if (renderFn) {
            // CARA BARU: Render konten ke dalam .app-container yang ada di dalam #app
            // Jika belum ada .app-container, kita buat dulu
            let container = document.querySelector('#app .app-container');
            
            if (!container) {
                // Jika belum ada container, buat elemen barunya
                container = document.createElement('div');
                container.className = 'app-container';
                // Masukkan container ke app, tepat sebelum navbar (agar navbar tetap di bawah)
                const navbar = document.querySelector('#app .bottom-nav');
                if (navbar) {
                    document.getElementById('app').insertBefore(container, navbar);
                } else {
                    document.getElementById('app').appendChild(container);
                }
            }
            
            // Render HTML ke dalam container tanpa menghapus Navbar
            container.innerHTML = renderFn();
        }

        // Update class active pada menu navigasi
        document.querySelectorAll('.nav-item').forEach(link => {
            link.classList.toggle('active', link.dataset.page === hash);
        });
    }

    window.addEventListener('hashchange', navigate);
    navigate(); // Jalankan pertama kali saat load
}
