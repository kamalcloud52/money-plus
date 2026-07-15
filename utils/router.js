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
    function navigate() {
        let hash = window.location.hash.replace('#', '');
        if (!hash || !routes[hash]) {
            hash = 'home';
        }

        const renderFn = routes[hash];
        if (renderFn) {
            let container = document.querySelector('#app .app-container');
            
            // Jika belum ada, buat elemen barunya
            if (!container) {
                container = document.createElement('div');
                container.className = 'app-container';
                document.getElementById('app').appendChild(container);
            } else {
                // Jika sudah ada, kosongkan dulu agar tidak menumpuk
                container.innerHTML = '';
            }
            
            // Render HTML ke dalam container
            container.insertAdjacentHTML('beforeend', renderFn());
        }

        document.querySelectorAll('.nav-item').forEach(link => {
            link.classList.toggle('active', link.dataset.page === hash);
        });
    }

    window.addEventListener('hashchange', navigate);
    navigate();
}
