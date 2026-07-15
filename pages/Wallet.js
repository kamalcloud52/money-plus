export function renderWallet() {
    // Data Mockup untuk Wallet (bisa diambil dari API nanti)
    const accounts = [
        { name: "Cash", balance: 569000, color: "bg-green" },
        { name: "Mandiri", balance: 841882, color: "bg-blue" }
    ];

    // Fungsi pembantu untuk format Rupiah (tanpa .00 di belakang)
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number).replace("Rp", "IDR");
    };

    // Hitung total saldo
    const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

    return `
        <div class="app-container wallet-page">
            
            <!-- Header Halaman -->
            <div class="wallet-header">
                <h2>Accounts</h2>
                <button class="btn-add-account"><i class="fas fa-plus"></i></button>
            </div>

            <!-- Ringkasan Saldo (Financial Statement) -->
            <div class="card wallet-summary">
                <div class="summary-row">
                    <span>Financial Statement:</span>
                    <span class="text-green fw-bold total-balance">${formatRupiah(totalBalance)}</span>
                </div>
            </div>

            <!-- List Akun -->
            ${accounts.map(account => `
                <div class="account-item">
                    <div class="account-icon ${account.color}"></div>
                    <div class="account-details">
                        <span class="account-name">${account.name}</span>
                        <span class="account-balance text-green fw-bold">${formatRupiah(account.balance)}</span>
                    </div>
                    <button class="account-menu-btn"><i class="fas fa-ellipsis-v"></i></button>
                </div>
            `).join('')}

        </div>
    `;
}
