export function renderNavbar() {
    const app = document.getElementById('app');
    
    // Sisipkan HTML Navigasi ke dalam #app
    const navbarHTML = `
        <nav class="bottom-nav" id="bottom-nav">
            <a href="#home" class="nav-item active" data-page="home">
                <i class="fas fa-home"></i><span>Home</span>
            </a>
            <a href="#wallet" class="nav-item" data-page="wallet">
                <i class="fas fa-wallet"></i><span>Wallet</span>
            </a>
            <div class="tab-placeholder">
                <div class="fab-container">
                    <button class="fab" id="add-btn"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <a href="#graph" class="nav-item" data-page="graph">
                <i class="fas fa-chart-bar"></i><span>Graph</span>
            </a>
            <a href="#settings" class="nav-item" data-page="settings">
                <i class="fas fa-cog"></i><span>Settings</span>
            </a>
        </nav>
    `;

    app.insertAdjacentHTML('beforeend', navbarHTML);

    // Event listener untuk tombol tambah
    document.getElementById('add-btn').addEventListener('click', () => {
        alert('Tombol Tambah diklik!');
    });
}
