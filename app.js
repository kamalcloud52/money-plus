import { initRouter } from './utils/router.js';
import { renderNavbar } from './components/Navbar.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Navigasi Bawah terlebih dahulu
    renderNavbar();

    // 2. Inisialisasi Router SPA
    initRouter();
});
