// Data Mockup Kategori (Sesuai Gambar 3)
const categories = [
    { id: 1, name: "Beauty", icon: "fa-paint-brush", color: "#e91e63" },
    { id: 2, name: "Car", icon: "fa-car", color: "#4fc3f7" },
    { id: 3, name: "Clothing", icon: "fa-tshirt", color: "#cddc39" },
    { id: 4, name: "Education", icon: "fa-book-open", color: "#dcedc9" },
    { id: 5, name: "Entertainment", icon: "fa-tv", color: "#ce93d8" },
    { id: 6, name: "Food", icon: "fa-pizza-slice", color: "#ffb74d" },
    { id: 7, name: "Gift", icon: "fa-gift", color: "#f48fb1" },
    { id: 8, name: "Health", icon: "fa-heartbeat", color: "#ef5350" },
    { id: 9, name: "Home", icon: "fa-home", color: "#ff5252" },
    { id: 10, name: "Kids", icon: "fa-child", color: "#4db6ac" },
    { id: 11, name: "Other", icon: "fa-tag", color: "#8d6e63" },
    { id: 12, name: "Personal", icon: "fa-user", color: "#90caf9" },
    { id: 13, name: "Pet", icon: "fa-dog", color: "#a1887f" },
    { id: 14, name: "Repair", icon: "fa-tools", color: "#90a4ae" },
    { id: 15, name: "Shopping", icon: "fa-shopping-cart", color: "#ffd54f" },
    { id: 16, name: "Social", icon: "fa-users", color: "#f8bbd0" },
    { id: 17, name: "Sport", icon: "fa-futbol", color: "#ce93d8" },
    { id: 18, name: "Telephone", icon: "fa-mobile-alt", color: "#7e57c2" },
    { id: 19, name: "Transport", icon: "fa-bus", color: "#ffeb3b" },
    { id: 20, name: "Travel", icon: "fa-plane", color: "#26c6da" }
];

// Data Mockup Akun (Sesuai Wallet)
const accounts = [
    { id: 1, name: "Cash", balance: 569000, color: "#2ecc71" },
    { id: 2, name: "Mandiri", balance: 841882, color: "#3498db" }
];

export function renderTransaction() {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number).replace("Rp", "IDR");
    };

    return `
        <div class="app-container transaction-page">
            
            <!-- Header -->
            <div class="transaction-header">
                <button class="back-btn"><i class="fas fa-chevron-left"></i></button>
                <h2>Transaction</h2>
                <div style="width: 24px;"></div> <!-- Spacer -->
            </div>

            <!-- Tab Menu -->
            <div class="tab-container">
                <button class="tab-btn active" data-tab="expense">Expense</button>
                <button class="tab-btn" data-tab="income">Income</button>
                <button class="tab-btn" data-tab="transfer">Transfer</button>
            </div>

            <form id="transaction-form">
                
                <!-- Input Amount -->
                <div class="amount-input-group">
                    <label>Amount</label>
                    <div class="amount-wrapper">
                        <input type="number" placeholder="0" class="amount-field">
                        <span class="currency-label">IDR</span>
                    </div>
                </div>

                <!-- Form Content (Berubah sesuai Tab) -->
                <div id="dynamic-form-content">
                    <!-- Expense / Income Default -->
                    <div class="form-group select-group" id="account-selector">
                        <div class="icon-box"><i class="fas fa-wallet"></i></div>
                        <div class="text-info">
                            <span class="label">Account</span>
                            <span class="value placeholder" data-account-id="">Select account</span>
                        </div>
                    </div>

                    <div class="form-group select-group" id="category-selector">
                        <div class="icon-box bg-orange"><i class="fas fa-th-large"></i></div>
                        <div class="text-info">
                            <span class="label">Category</span>
                            <span class="value placeholder" data-category-id="">Select category</span>
                        </div>
                    </div>
                </div>

                <!-- Date & Time -->
                <div class="form-row">
                    <div class="form-group half">
                        <span class="label">Day</span>
                        <div class="value-group">
                            <i class="far fa-calendar-alt icon-gray"></i>
                            <input type="date" class="date-input">
                        </div>
                    </div>
                    <div class="form-group half">
                        <span class="label">Time</span>
                        <div class="value-group">
                            <span class="time-display">${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div class="form-group">
                    <div class="icon-box small"><i class="fas fa-info-circle"></i></div>
                    <div class="text-info full-width">
                        <span class="label">Description</span>
                        <input type="text" class="desc-input" placeholder="Input data...">
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="button" class="submit-btn">Submit</button>
            </form>
        </div>

        <!-- ================= BOTTOM SHEETS (MODAL) ================= -->

        <!-- 1. Bottom Sheet Accounts -->
        <div class="bottom-sheet-overlay" id="account-sheet">
            <div class="bottom-sheet-content">
                <h3>Accounts</h3>
                <div class="list-container">
                    ${accounts.map(acc => `
                        <div class="list-item" data-id="${acc.id}" data-name="${acc.name}">
                            <div class="circle-icon" style="background:${acc.color}"></div>
                            <div class="list-text">
                                <span class="title">${acc.name}</span>
                                <span class="subtitle text-green fw-bold">${formatRupiah(acc.balance)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- 2. Bottom Sheet Categories -->
        <div class="bottom-sheet-overlay" id="category-sheet">
            <div class="bottom-sheet-content">
                <h3>Category</h3>
                <div class="grid-container">
                    ${categories.map(cat => `
                        <div class="grid-item" data-id="${cat.id}" data-name="${cat.name}">
                            <div class="circle-icon" style="background:${cat.color}">
                                <i class="fas ${cat.icon}"></i>
                            </div>
                            <span class="label">${cat.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ================= LOGIKA JAVASCRIPT UNTUK HALAMAN INI =================
// Fungsi ini akan dipanggil oleh router setelah HTML dirender
export function initTransactionLogic() {
    // Tangkap Elements
    const tabs = document.querySelectorAll('.tab-btn');
    const dynamicContent = document.getElementById('dynamic-form-content');
    const accountSelector = document.getElementById('account-selector');
    const categorySelector = document.getElementById('category-selector');
    const accountSheet = document.getElementById('account-sheet');
    const categorySheet = document.getElementById('category-sheet');
    const submitBtn = document.querySelector('.submit-btn');
    const backBtn = document.querySelector('.back-btn');

    // Logika Ganti Tab (Expense/Income vs Transfer)
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update aktif tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Ubah Form Content
            const type = tab.dataset.tab;
            if (type === 'transfer') {
                dynamicContent.innerHTML = `
                    <div class="form-group select-group" id="from-account-selector">
                        <div class="icon-box"><i class="fas fa-wallet"></i></div>
                        <div class="text-info">
                            <span class="label">From</span>
                            <span class="value placeholder">Select from account</span>
                        </div>
                    </div>
                    <div class="form-group select-group" id="to-account-selector">
                        <div class="icon-box"><i class="fas fa-wallet"></i></div>
                        <div class="text-info">
                            <span class="label">To</span>
                            <span class="value placeholder">Select to account</span>
                        </div>
                        <i class="fas fa-arrows-alt-v swap-icon"></i>
                    </div>
                `;
                // Hilangkan pemilih kategori saat transfer
            } else {
                dynamicContent.innerHTML = `
                    <div class="form-group select-group" id="account-selector">
                        <div class="icon-box"><i class="fas fa-wallet"></i></div>
                        <div class="text-info">
                            <span class="label">Account</span>
                            <span class="value placeholder" data-account-id="">Select account</span>
                        </div>
                    </div>

                    <div class="form-group select-group" id="category-selector">
                        <div class="icon-box bg-orange"><i class="fas fa-th-large"></i></div>
                        <div class="text-info">
                            <span class="label">Category</span>
                            <span class="value placeholder" data-category-id="">Select category</span>
                        </div>
                    </div>
                `;
                // Re-attach events jika ingin lebih kompleks (disederhanakan)
            }
        });
    });

    // Fungsi untuk Membuka/Menutup Bottom Sheet
    function toggleSheet(sheetElement, show) {
        if (show) {
            sheetElement.classList.add('open');
        } else {
            sheetElement.classList.remove('open');
        }
    }

    // Event: Klik Account -> Buka Sheet Account
    document.addEventListener('click', (e) => {
        const target = e.target.closest('#account-selector, #from-account-selector, #to-account-selector');
        if (target) toggleSheet(accountSheet, true);
    });

    // Event: Klik Category -> Buka Sheet Category
    document.addEventListener('click', (e) => {
        const target = e.target.closest('#category-selector');
        if (target) toggleSheet(categorySheet, true);
    });

    // Event: Klik Item Account (Pilih Akun)
    document.querySelectorAll('#account-sheet .list-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            const name = item.dataset.name;
            // Update tampilan selector
            const val = document.querySelector('#account-selector .value');
            if(val) {
                val.textContent = name;
                val.classList.remove('placeholder');
                val.dataset.accountId = id;
            }
            toggleSheet(accountSheet, false);
        });
    });

    // Event: Klik Item Category (Pilih Kategori)
    document.querySelectorAll('#category-sheet .grid-item').forEach(item => {
        item.addEventListener('click', () => {
            const name = item.dataset.name;
            // Update tampilan selector
            const val = document.querySelector('#category-selector .value');
            if(val) {
                val.textContent = name;
                val.classList.remove('placeholder');
                val.dataset.categoryId = item.dataset.id;
            }
            toggleSheet(categorySheet, false);
        });
    });

    // Tutup modal jika klik overlay (background gelap)
    document.querySelectorAll('.bottom-sheet-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) toggleSheet(overlay, false);
        });
    });

    // Tombol Kembali
    if(backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.hash = '#home';
        });
    }

    // Tombol Submit
    if(submitBtn) {
        submitBtn.addEventListener('click', () => {
            alert('Transaksi berhasil disimpan! (Logika backend menyusul)');
        });
    }
}
