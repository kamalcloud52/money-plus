// Data kategori untuk halaman Settings
const categories = [
    { name: "Shopping", color: "#ffd54f" },
    { name: "Food", color: "#ffa726" },
    { name: "Home", color: "#ff5252" },
    { name: "Entertainment", color: "#ce93d8" },
    { name: "Gift", color: "#f48fb1" },
    { name: "Transport", color: "#ffeb3b" },
    { name: "Clothing", color: "#cddc39" },
    { name: "Telephone", color: "#7e57c2" },
    { name: "Car", color: "#4fc3f7" },
    { name: "Health", color: "#ef5350" },
    { name: "Travel", color: "#26c6da" },
    { name: "Pet", color: "#a1887f" },
    { name: "Kids", color: "#4db6ac" },
    { name: "Beauty", color: "#e91e63" },
    { name: "Personal", color: "#90caf9" },
    { name: "Sport", color: "#ce93d8" },
    { name: "Repair", color: "#90a4ae" },
    { name: "Social", color: "#f8bbd0" },
    { name: "Other", color: "#8d6e63" }
];

export function renderBudget() {
    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num).replace("Rp", "IDR");
    };

    return `
        <div class="app-container budget-page">
            
            <!-- Header -->
            <div class="budget-header">
                <button class="back-btn" id="budget-back-btn"><i class="fas fa-chevron-left"></i></button>
                <h2>Budget</h2>
                <div class="budget-date-selector" id="budget-date-picker">
                    <span>Jul 2026</span>
                    <i class="fas fa-caret-down"></i>
                </div>
            </div>

            <!-- Card 1: Monthly Budget -->
            <div class="card budget-card">
                <div class="budget-card-header">
                    <h3>Monthly Budget</h3>
                    <button class="icon-btn edit-budget-btn" data-target="monthly"><i class="fas fa-pen"></i></button>
                </div>
                <div class="budget-card-body">
                    <div class="donut-chart">
                        <div class="donut-inner">
                            <span>Remaining</span>
                            <strong>7.2%</strong>
                        </div>
                    </div>
                    <div class="budget-data">
                        <div class="row flex-row"><span>Budget</span><span class="text-green fw-bold">IDR5.000.000</span></div>
                        <div class="row flex-row"><span>Expenses</span><span class="text-red">IDR358.118</span></div>
                        <div class="row flex-row"><span>Remaining</span><span class="text-green fw-bold">IDR4.641.882</span></div>
                    </div>
                </div>
            </div>

            <!-- Card 2: Education (Dengan Pensil & Panah ke Settings) -->
            <div class="card budget-card">
                <div class="budget-card-header">
                    <h3>Education</h3>
                    <div>
                        <button class="icon-btn edit-budget-btn" data-target="education"><i class="fas fa-pen"></i></button>
                        <button class="icon-btn" id="goto-settings-btn"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                <div class="budget-card-body">
                    <div class="donut-chart">
                        <div class="donut-inner">
                            <span>Remaining</span>
                            <strong>0%</strong>
                        </div>
                    </div>
                    <div class="budget-data">
                        <div class="row flex-row"><span>Budget</span><span class="text-green fw-bold">IDR3.500.000</span></div>
                        <div class="row flex-row"><span>Expenses</span><span class="text-red">IDR0</span></div>
                        <div class="row flex-row"><span>Remaining</span><span class="text-green fw-bold">IDR3.500.000</span></div>
                    </div>
                </div>
            </div>

            <!-- Tombol Create New Budget (ke Settings) -->
            <div class="budget-footer">
                <button class="btn-create-budget" id="create-budget-btn">Create new Budget</button>
            </div>
        </div>

        <!-- ================= MODALS ================= -->

        <!-- 1. Edit Budget Modal (Muncul saat klik Pensil) -->
        <div class="budget-modal-overlay" id="edit-modal">
            <div class="budget-modal-content">
                <h4 id="edit-modal-title">Edit</h4>
                <div class="edit-input-wrapper">
                    <input type="text" id="edit-amount-input" value="5.000.000,00">
                </div>
                <div class="edit-actions">
                    <button class="btn-ok" id="edit-ok-btn">OK</button>
                </div>
            </div>
        </div>

        <!-- 2. Date Picker Modal (Muncul saat klik Header Tanggal) -->
        <div class="budget-modal-overlay" id="date-modal">
            <div class="budget-modal-content date-picker-content">
                <div class="date-picker-header">Select Date</div>
                <div class="date-picker-body">
                    <div class="date-column">
                        <div class="date-item inactive">May</div>
                        <div class="date-item">Jun</div>
                        <div class="date-item active">Jul</div>
                        <div class="date-item">Aug</div>
                        <div class="date-item inactive">Sen</div>
                    </div>
                    <div class="date-column">
                        <div class="date-item inactive">2024</div>
                        <div class="date-item">2025</div>
                        <div class="date-item active">2026</div>
                        <div class="date-item">2027</div>
                        <div class="date-item inactive">2028</div>
                    </div>
                </div>
                <div class="date-picker-actions">
                    <button class="btn-cancel" id="date-cancel-btn">Cancel</button>
                    <button class="btn-ok" id="date-ok-btn">OK</button>
                </div>
            </div>
        </div>

        <!-- 3. Budget Settings Page (Overlay penuh) -->
        <div class="budget-settings-overlay" id="settings-overlay">
            <div class="settings-header">
                <button class="back-btn" id="settings-back-btn"><i class="fas fa-chevron-left"></i></button>
                <h2>Budget Settings</h2>
                <span style="font-size:12px; color:#888;">Jul 2026</span>
            </div>
            <div class="settings-list">
                <!-- List Kategori -->
                ${categories.map(cat => `
                    <div class="settings-item">
                        <div class="settings-left">
                            <button class="icon-btn add-btn"><i class="fas fa-plus"></i></button>
                            <div class="circle-icon" style="background:${cat.color}; color: white;">
                                <i class="fas fa-${getIcon(cat.name)}"></i>
                            </div>
                            <span class="settings-name">${cat.name}</span>
                        </div>
                        <div class="settings-right">
                            <span class="settings-edit-text">Edit</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Helper untuk icons
function getIcon(name) {
    const map = {
        'Shopping': 'shopping-cart', 'Food': 'pizza-slice', 'Home': 'home',
        'Entertainment': 'tv', 'Gift': 'gift', 'Transport': 'bus',
        'Clothing': 'tshirt', 'Telephone': 'mobile-alt', 'Car': 'car',
        'Health': 'heartbeat', 'Travel': 'plane', 'Pet': 'dog',
        'Kids': 'child', 'Beauty': 'paint-brush', 'Personal': 'user',
        'Sport': 'futbol', 'Repair': 'tools', 'Social': 'users',
        'Other': 'tag'
    };
    return map[name] || 'tag';
}

// ============================
// LOGIKA INTERAKTIF
// ============================
export function initBudgetLogic() {
    const backBtn = document.getElementById('budget-back-btn');
    const editModal = document.getElementById('edit-modal');
    const dateModal = document.getElementById('date-modal');
    const settingsOverlay = document.getElementById('settings-overlay');
    const createBtn = document.getElementById('create-budget-btn');
    const gotoBtn = document.getElementById('goto-settings-btn');
    const settingsBack = document.getElementById('settings-back-btn');
    const datePicker = document.getElementById('budget-date-picker');

    if(backBtn) backBtn.addEventListener('click', () => window.location.hash = '#home');

    // --- Logic Edit Modal (Pensil) ---
    document.querySelectorAll('.edit-budget-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            editModal.classList.add('open');
        });
    });
    document.getElementById('edit-ok-btn').addEventListener('click', () => {
        editModal.classList.remove('open');
    });
    editModal.addEventListener('click', (e) => {
        if(e.target === editModal) editModal.classList.remove('open');
    });

    // --- Logic Date Picker ---
    datePicker.addEventListener('click', () => dateModal.classList.add('open'));
    document.getElementById('date-cancel-btn').addEventListener('click', () => dateModal.classList.remove('open'));
    document.getElementById('date-ok-btn').addEventListener('click', () => dateModal.classList.remove('open'));
    dateModal.addEventListener('click', (e) => {
        if(e.target === dateModal) dateModal.classList.remove('open');
    });

    // --- Logic Buka Settings ---
    const openSettings = () => settingsOverlay.classList.add('open');
    createBtn.addEventListener('click', openSettings);
    gotoBtn.addEventListener('click', openSettings);
    
    settingsBack.addEventListener('click', () => settingsOverlay.classList.remove('open'));
}
