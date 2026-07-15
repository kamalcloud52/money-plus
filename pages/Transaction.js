// Data Mockup Kategori
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

// Data Mockup Akun
const accounts = [
    { id: 1, name: "Cash", balance: 569000, color: "#2ecc71" },
    { id: 2, name: "Mandiri", balance: 841882, color: "#3498db" }
];

export function renderTransaction() {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number).replace("Rp", "IDR");
    };

    // Ambil tanggal dan jam sekarang
    const now = new Date();
    const defaultDate = now.toISOString().split('T')[0]; // YYYY-MM-DD untuk input tersembunyi
    const displayDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); // July 15, 2026
    const displayTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); // 13:54

    return `
        <div class="app-container transaction-page">
            
            <!-- Header -->
            <div class="transaction-header">
                <button class="back-btn"><i class="fas fa-chevron-left"></i></button>
                <h2>Transaction</h2>
                <div style="width: 24px;"></div>
            </div>

            <!-- Tab Menu -->
            <div class="tab-container">
                <button class="tab-btn active" data-tab="expense">Expense</button>
                <button class="tab-btn" data-tab="income">Income</button>
                <button class="tab-btn" data-tab="transfer">Transfer</button>
            </div>

            <form id="transaction-form">
                
                <!-- Input Amount (Dengan Logika Warna & Titik Otomatis) -->
                <div class="amount-input-group">
                    <label>Amount</label>
                    <div class="amount-wrapper">
                        <input type="text" inputmode="numeric" placeholder="0" class="amount-field" id="amount-input">
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

                <!-- Date & Time (Layout baru: Text Display, Input Tersembunyi) -->
                <div class="form-row">
                    <div class="form-group half" id="day-selector">
                        <span class="label">Day</span>
                        <div class="value-group">
                            <i class="far fa-calendar-alt icon-gray"></i>
                            <span class="date-display" id="date-text">${displayDate}</span>
                            <input type="date" class="date-input" id="date-picker" value="${defaultDate}">
                        </div>
                    </div>
                    <div class="form-group half" id="time-selector">
                        <span class="label">Time</span>
                        <div class="value-group">
                            <i class="far fa-clock icon-gray"></i>
                            <span class="time-display" id="time-text">${displayTime}</span>
                            <input type="time" class="time-input" id="time-picker" value="${displayTime}">
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div class="form-group description-group">
                    <div class="desc-header">
                        <span class="label">Description</span>
                    </div>
                    <div class="desc-body">
                        <div class="icon-box small"><i class="fas fa-info-circle"></i></div>
                        <input type="text" class="desc-input" placeholder="Input data...">
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="button" class="submit-btn">Submit</button>
            </form>
        </div>

        <!-- ================= BOTTOM SHEETS (MODAL) ================= -->
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

// ================= LOGIKA JAVASCRIPT (INTERAKSI & FORMATTING) =================
export function initTransactionLogic() {
    // Tangkap Elements
    const tabs = document.querySelectorAll('.tab-btn');
    const dynamicContent = document.getElementById('dynamic-form-content');
    const accountSheet = document.getElementById('account-sheet');
    const categorySheet = document.getElementById('category-sheet');
    const submitBtn = document.querySelector('.submit-btn');
    const backBtn = document.querySelector('.back-btn');
    const amountInput = document.getElementById('amount-input');
    const datePicker = document.getElementById('date-picker');
    const dateText = document.getElementById('date-text');
    const timePicker = document.getElementById('time-picker');
    const timeText = document.getElementById('time-text');
    const daySelector = document.getElementById('day-selector');
    const timeSelector = document.getElementById('time-selector');

    // --- LOGIKA FORMAT RUPIAH & WARNA ANGKA ---
    let currentColorClass = 'text-red'; // Default (Expense)

    amountInput.addEventListener('input', function(e) {
        // 1. Hapus semua karakter non-digit
        let rawValue = this.value.replace(/\D/g, '');
        
        // 2. Ubah menjadi angka untuk logika
        let numericValue = parseInt(rawValue);
        if (isNaN(numericValue)) {
            this.value = '';
            return;
        }

        // 3. Format dengan titik (ribuan)
        this.value = new Intl.NumberFormat('id-ID').format(numericValue);

        // 4. Ganti warna teks berdasarkan tab yang aktif
        this.classList.remove('text-red', 'text-green');
        this.classList.add(currentColorClass);
    });

    // --- LOGIKA GANTI TAB (Update Warna Saat Pindah Tab) ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const type = tab.dataset.tab;
            
            // Ubah warna default angka saat tab diganti
            if (type === 'income') {
                currentColorClass = 'text-green';
            } else {
                currentColorClass = 'text-red';
            }
            
            // Update warna angka yang sudah diketik jika ada
            if (amountInput.value.length > 0) {
                amountInput.classList.remove('text-red', 'text-green');
                amountInput.classList.add(currentColorClass);
            }

            // Ubah Form Content
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
            }
        });
    });

    // --- LOGIKA DAY & TIME (KLIK TEXT UNTUK BUKA PICKER) ---
    if (datePicker && dateText) {
        datePicker.addEventListener('change', (e) => {
            if(e.target.value) {
                const d = new Date(e.target.value + 'T00:00:00');
                dateText.textContent = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            }
        });

        daySelector.addEventListener('click', () => {
            datePicker.showPicker ? datePicker.showPicker() : datePicker.click();
        });
    }

    if (timePicker && timeText) {
        timePicker.addEventListener('change', (e) => {
            if(e.target.value) {
                timeText.textContent = e.target.value;
            }
        });

        timeSelector.addEventListener('click', () => {
            timePicker.showPicker ? timePicker.showPicker() : timePicker.click();
        });
    }

    // --- LOGIKA BOTTOM SHEET ---
    function toggleSheet(sheetElement, show) {
        if (show) {
            sheetElement.classList.add('open');
        } else {
            sheetElement.classList.remove('open');
        }
    }

    document.addEventListener('click', (e) => {
        const target = e.target.closest('#account-selector, #from-account-selector, #to-account-selector');
        if (target) toggleSheet(accountSheet, true);
    });

    document.addEventListener('click', (e) => {
        const target = e.target.closest('#category-selector');
        if (target) toggleSheet(categorySheet, true);
    });

    document.querySelectorAll('#account-sheet .list-item').forEach(item => {
        item.addEventListener('click', () => {
            const name = item.dataset.name;
            const val = document.querySelector('#account-selector .value');
            if(val) {
                val.textContent = name;
                val.classList.remove('placeholder');
            }
            toggleSheet(accountSheet, false);
        });
    });

    document.querySelectorAll('#category-sheet .grid-item').forEach(item => {
        item.addEventListener('click', () => {
            const name = item.dataset.name;
            const val = document.querySelector('#category-selector .value');
            if(val) {
                val.textContent = name;
                val.classList.remove('placeholder');
            }
            toggleSheet(categorySheet, false);
        });
    });

    document.querySelectorAll('.bottom-sheet-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) toggleSheet(overlay, false);
        });
    });

    if(backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.hash = '#home';
        });
    }

    if(submitBtn) {
        submitBtn.addEventListener('click', () => {
            alert('Transaksi berhasil disimpan!');
        });
    }
}
