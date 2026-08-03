// --- STATE & GLOBAL VARIABLES ---
const AppState = {
    transactions: [],
    accounts: [],
    currentTab: 'dasbor',
    chartMode: 'pengeluaran',
    currentFilter: 'all',
    editingId: null,
    editingAccountId: null
};

// --- UTILITY FUNCTIONS ---
const formatRupiah = (angka) => {
    if (!angka && angka !== 0) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

const formatDateIndo = (dateStr) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', options);
};

const showToast = (msg, success = true) => {
    const toast = document.getElementById('toast');
    const message = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');
    icon.className = success ? 'fas fa-check-circle text-emerald-400' : 'fas fa-times-circle text-red-400';
    message.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
};

// --- GAS CONNECTOR (MOCK + REAL) ---
function runGasFunc(funcName, param) {
    return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.script && google.script.run) {
            google.script.run
                .withSuccessHandler(resolve)
                .withFailureHandler(reject)
                [funcName](param);
        } else {
            // MOCK MODE (Untuk testing local)
            setTimeout(() => {
                if (funcName === 'setupSheetOtomatis') resolve("Setup DB Berhasil!");
                if (funcName === 'addTransaction') {
                    if (AppState.editingId) {
                        const idx = AppState.transactions.findIndex(t => t.id === AppState.editingId);
                        if (idx !== -1) AppState.transactions[idx] = { ...AppState.transactions[idx], ...param };
                        AppState.editingId = null;
                    } else {
                        AppState.transactions.unshift({ ...param, id: 'TRX-' + Date.now() });
                    }
                    resolve(true);
                }
                if (funcName === 'deleteTransaction') {
                    AppState.transactions = AppState.transactions.filter(t => t.id !== param);
                    resolve(true);
                }
                if (funcName === 'getAccounts') {
                    if (AppState.accounts.length === 0) {
                        AppState.accounts = ['Dompet Tunai', 'BCA', 'Gopay'];
                    }
                    resolve(AppState.accounts);
                }
                if (funcName === 'addAccount') {
                    if (!AppState.accounts.includes(param)) AppState.accounts.push(param);
                    resolve(true);
                }
                if (funcName === 'deleteAccount') {
                    AppState.accounts = AppState.accounts.filter(a => a !== param);
                    resolve(true);
                }
                if (funcName === 'getExcelExportUrl') resolve("https://docs.google.com/spreadsheets");
                if (funcName === 'getTransactions') {
                    if (AppState.transactions.length === 0) {
                        let today = new Date().toISOString().split('T')[0];
                        let yst = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                        AppState.transactions = [
                            { id: '1', tanggal: today, tipe: 'Pengeluaran', kategori: 'Makanan & Minuman', jumlah: 45000, akun: 'Dompet Tunai', catatan: 'Makan siang' },
                            { id: '2', tanggal: today, tipe: 'Pengeluaran', kategori: 'Transportasi', jumlah: 15000, akun: 'Gopay', catatan: 'Ojek online' },
                            { id: '3', tanggal: yst, tipe: 'Pemasukan', kategori: 'Gaji', jumlah: 8500000, akun: 'BCA', catatan: 'Gaji Bulanan' },
                            { id: '4', tanggal: yst, tipe: 'Pengeluaran', kategori: 'Tagihan & Utilitas', jumlah: 350000, akun: 'BCA', catatan: 'Listrik & Air' }
                        ];
                    }
                    resolve(AppState.transactions);
                }
            }, 300);
        }
    });
}

// --- SPA ROUTING & NAVIGATION ---
const renderPage = (tabId) => {
    AppState.currentTab = tabId;
    const app = document.getElementById('app');

    // Render Layout Global (Header, Main, Nav)
    app.innerHTML = `
        <!-- HEADER -->
        <header id="mainHeader">
            <div class="header-top">
                <div class="header-logo">
                    <div class="header-logo-icon"><i class="fas fa-wallet"></i></div>
                    <div>
                        <h1 class="header-title" id="headerTitle">Money Plus</h1>
                        <p class="header-subtitle" id="headerSubtitle">Halo, Selamat Datang!</p>
                    </div>
                </div>
                <button onclick="window.initSetup()" id="btnSetup" class="btn-setup"><i class="fas fa-database mr-1"></i> Setup</button>
            </div>
            <div id="headerDashboardContent" class="header-dash" style="${tabId === 'dasbor' ? 'display:block; opacity:1;' : 'display:none; opacity:0;'}">
                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:0.25rem;">
                    <div>
                        <p class="header-balance-label">Total Saldo</p>
                        <h2 class="header-balance" id="totalBalance">Rp 0</h2>
                    </div>
                    <div class="header-stats">
                        <div class="header-stat-box"><span style="opacity:0.8;">↓</span> <span id="totalIncome">Rp 0</span></div>
                        <div class="header-stat-box"><span style="opacity:0.8;">↑</span> <span id="totalExpense">Rp 0</span></div>
                    </div>
                </div>
            </div>
        </header>

        <!-- MAIN CONTENT -->
        <main id="mainContent" class="hide-scrollbar">
            <div id="view-container" class="view-section active"></div>
        </main>

        <!-- FLOATING ACTION BUTTON -->
        <button id="fabAdd" onclick="window.toggleModal(true, null)" class="btn-fab" style="${tabId === 'dasbor' || tabId === 'transaksi' ? 'display:flex;' : 'display:none;'}">
            <i class="fas fa-plus"></i>
        </button>

        <!-- BOTTOM NAV -->
        <nav class="bottom-nav">
            ${['dasbor', 'transaksi', 'anggaran', 'setting'].map(t => `
                <button onclick="window.switchTab('${t}')" class="nav-btn ${t === tabId ? 'active' : ''}" data-target="${t}">
                    <i class="fas ${t === 'dasbor' ? 'fa-chart-pie' : t === 'transaksi' ? 'fa-list-ul' : t === 'anggaran' ? 'fa-wallet' : 'fa-cog'}"></i>
                    <span>${t.charAt(0).toUpperCase() + t.slice(1)}</span>
                </button>
            `).join('')}
        </nav>

        <!-- TOAST & MODALS -->
        <div id="toast"><i class="fas fa-check-circle text-emerald-400"></i> <span id="toastMessage">Berhasil!</span></div>
        <div id="addModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-handle"></div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                    <h3 class="modal-title" id="modalTitle">Tambah Transaksi</h3>
                    <button onclick="window.toggleModal(false, null)" class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <form id="transactionForm" onsubmit="window.submitTransaction(event)">
                    <input type="hidden" id="editId">
                    <div class="segmented-control">
                        <label class="segmented-btn active" id="lblPengeluaran"><input type="radio" name="tipe" value="Pengeluaran" hidden checked onchange="window.changeType('Pengeluaran')"> Pengeluaran</label>
                        <label class="segmented-btn" id="lblPemasukan"><input type="radio" name="tipe" value="Pemasukan" hidden onchange="window.changeType('Pemasukan')"> Pemasukan</label>
                        <label class="segmented-btn" id="lblTransfer"><input type="radio" name="tipe" value="Transfer" hidden onchange="window.changeType('Transfer')"> Transfer</label>
                    </div>
                    <div class="input-group" style="border-bottom: 2px solid #10b981; border-radius:0; background:transparent; border:none; border-bottom:2px solid #10b981; padding:0.25rem 0; margin-bottom:0.75rem;">
                        <span style="font-size:1.25rem; font-weight:700; color:#059669; margin-right:0.5rem;">Rp</span>
                        <input type="number" id="jumlah" required placeholder="0" class="input-field" style="font-size:1.5rem; font-weight:700;">
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
                        <div class="input-group"><label class="input-label">Tanggal</label><input type="date" id="tanggal" required class="input-field"></div>
                        <div class="input-group"><label class="input-label">Akun</label><select id="akun" required class="input-field"></select></div>
                    </div>
                    <div class="input-group" style="margin-top:0.5rem;"><label class="input-label">Kategori</label><select id="kategori" required class="input-field"></select></div>
                    <div class="input-group" style="margin-top:0.5rem;"><label class="input-label">Catatan</label><input type="text" id="catatan" placeholder="Makan siang, bensin..." class="input-field"></div>
                    <button type="submit" id="btnSubmit" class="btn-primary"><i class="fas fa-save"></i> Simpan Transaksi</button>
                    <button type="button" onclick="window.deleteTransactionFromModal()" id="btnDelete" class="btn-danger hidden"><i class="fas fa-trash"></i> Hapus Transaksi</button>
                </form>
            </div>
        </div>

        <div id="accountModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-handle"></div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                    <h3 class="modal-title">Kelola Akun</h3>
                    <button onclick="window.toggleAccountModal(false)" class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div id="accountList" style="max-height:15rem; overflow-y:auto; margin-bottom:1rem;"></div>
                <form id="accountForm" onsubmit="window.submitAccount(event)">
                    <input type="hidden" id="editAccountId">
                    <div style="display:flex; gap:0.5rem;">
                        <input type="text" id="accountName" required placeholder="Nama Akun (misal: BCA)" class="input-field" style="background:#f9fafb; padding:0.5rem; border-radius:1rem; border:1px solid #f3f4f6; flex:1;">
                        <button type="submit" id="btnAccountSubmit" class="btn-primary" style="width:auto; padding:0.5rem 1rem; margin:0;">Tambah</button>
                    </div>
                    <button type="button" onclick="window.deleteAccountFromModal()" id="btnAccountDelete" class="btn-danger hidden">Hapus Akun Ini</button>
                </form>
            </div>
        </div>
    `;

    // Render konten spesifik halaman
    const container = document.getElementById('view-container');
    if (tabId === 'dasbor') container.innerHTML = Dashboard.render();
    else if (tabId === 'transaksi') container.innerHTML = Transactions.render();
    else if (tabId === 'anggaran') container.innerHTML = Budget.render();
    else if (tabId === 'setting') container.innerHTML = Settings.render();

    // Load Data & Event Listeners
    loadData();
    setupListeners();
};

// Expose functions to window so HTML onclick can access them
window.switchTab = renderPage;
window.initSetup = initSetup;
window.toggleModal = toggleModal;
window.changeType = changeType;
window.submitTransaction = submitTransaction;
window.deleteTransactionFromModal = deleteTransactionFromModal;
window.toggleAccountModal = toggleAccountModal;
window.submitAccount = submitAccount;
window.deleteAccountFromModal = deleteAccountFromModal;

// --- CORE LOGIC ---
async function initSetup() {
    const btn = document.getElementById('btnSetup');
    const oriHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    try {
        await runGasFunc('setupSheetOtomatis');
        btn.innerHTML = '<i class="fas fa-check"></i> OK';
        setTimeout(() => btn.style.display = 'none', 2000);
        loadData();
        showToast('Database berhasil disetup!');
    } catch (err) { showToast('Error: ' + err, false); btn.innerHTML = oriHtml; }
}

async function loadData() {
    try {
        AppState.transactions = await runGasFunc('getTransactions');
        AppState.accounts = await runGasFunc('getAccounts');
        updateDashboard();
        renderTransactions();
        renderAccounts();
        populateAccountSelect();
        if (AppState.currentTab === 'dasbor') Dashboard.renderChart();
        if (AppState.currentTab === 'anggaran') Budget.renderBudget();
    } catch (err) { showToast('Gagal memuat data', false); console.error(err); }
}

function updateDashboard() {
    let income = 0, expense = 0;
    AppState.transactions.forEach(t => {
        let amt = Number(t.jumlah) || 0;
        if (t.tipe === 'Pemasukan') income += amt;
        else if (t.tipe === 'Pengeluaran') expense += amt;
    });
    document.getElementById('totalBalance').innerText = formatRupiah(income - expense);
    document.getElementById('totalIncome').innerText = formatRupiah(income);
    document.getElementById('totalExpense').innerText = formatRupiah(expense);
}

function getTxHTML(t, showActions = true) {
    let isExp = t.tipe === 'Pengeluaran';
    let isTrf = t.tipe === 'Transfer';
    let iconClass = isExp ? 'expense' : (isTrf ? 'transfer' : 'income');
    let sign = isExp ? '-' : (isTrf ? '' : '+');
    let amountClass = isExp ? 'negative' : (isTrf ? '' : 'positive');
    let iconName = 'fa-tag';
    const catLower = (t.kategori || '').toLowerCase();
    if (catLower.includes('makan')) iconName = 'fa-hamburger';
    else if (catLower.includes('trans')) iconName = 'fa-car';
    else if (catLower.includes('gaji')) iconName = 'fa-money-bill-wave';
    else if (catLower.includes('tagihan')) iconName = 'fa-file-invoice-dollar';
    else if (catLower.includes('belanja')) iconName = 'fa-shopping-bag';
    if (isTrf) iconName = 'fa-exchange-alt';

    return `
    <div class="tx-item">
        <div class="tx-icon ${iconClass}"><i class="fas ${iconName}"></i></div>
        <div class="tx-content">
            <div class="tx-cat">${t.kategori}</div>
            <div class="tx-meta">${t.akun} • ${t.catatan || '-'}</div>
        </div>
        <div style="text-align:right;">
            <div class="tx-amount ${amountClass}">${sign}${formatRupiah(t.jumlah)}</div>
            <div class="tx-date">${formatDateIndo(t.tanggal)}</div>
            ${showActions ? `
            <div class="tx-actions">
                <button class="edit" onclick="window.toggleModal(true, '${t.id}')">Edit</button>
                <button class="delete" onclick="window.deleteTransaction('${t.id}')">Hapus</button>
            </div>` : ''}
        </div>
    </div>`;
}

function renderTransactions() {
    const dashList = document.getElementById('dashboardTxList');
    const fullList = document.getElementById('fullTxList');
    if(!dashList || !fullList) return;

    let filtered = AppState.transactions;
    if (AppState.currentFilter === 'month') {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        filtered = AppState.transactions.filter(t => t.tanggal >= firstDay);
    } else if (AppState.currentFilter === 'income') {
        filtered = AppState.transactions.filter(t => t.tipe === 'Pemasukan');
    } else if (AppState.currentFilter === 'expense') {
        filtered = AppState.transactions.filter(t => t.tipe === 'Pengeluaran');
    }

    if (filtered.length === 0) {
        const empty = `<div style="text-align:center; color:#9ca3af; padding:1.5rem 0;"><i class="fas fa-box-open" style="font-size:2rem; margin-bottom:0.5rem; color:#d1d5db;"></i><p style="font-size:0.875rem;">Belum ada data.</p></div>`;
        dashList.innerHTML = empty;
        fullList.innerHTML = empty;
        return;
    }
    dashList.innerHTML = filtered.slice(0, 4).map(t => getTxHTML(t, false)).join('');
    fullList.innerHTML = filtered.map(t => getTxHTML(t, true)).join('');
}

// --- MODAL TRANSACTION ---
function toggleModal(show, id = null) {
    const modal = document.getElementById('addModal');
    if (show) {
        AppState.editingId = id;
        if (id) {
            const tx = AppState.transactions.find(t => t.id === id);
            if (tx) {
                document.getElementById('modalTitle').innerText = 'Edit Transaksi';
                document.getElementById('editId').value = id;
                document.getElementById('jumlah').value = tx.jumlah;
                document.getElementById('tanggal').value = tx.tanggal;
                document.getElementById('akun').value = tx.akun;
                document.getElementById('catatan').value = tx.catatan || '';
                document.querySelector(`input[name="tipe"][value="${tx.tipe}"]`).checked = true;
                changeType(tx.tipe);
                document.getElementById('kategori').value = tx.kategori;
                document.getElementById('btnDelete').classList.remove('hidden');
            }
        } else {
            document.getElementById('modalTitle').innerText = 'Tambah Transaksi';
            document.getElementById('editId').value = '';
            document.getElementById('transactionForm').reset();
            document.getElementById('tanggal').valueAsDate = new Date();
            changeType('Pengeluaran');
            document.getElementById('btnDelete').classList.add('hidden');
        }
        modal.classList.add('open');
    } else {
        modal.classList.remove('open');
    }
}

function changeType(type) {
    const lbls = ['lblPengeluaran', 'lblPemasukan', 'lblTransfer'].map(id => document.getElementById(id));
    lbls.forEach(lbl => lbl.classList.remove('active'));
    let activeId = type === 'Pengeluaran' ? 'lblPengeluaran' : (type === 'Pemasukan' ? 'lblPemasukan' : 'lblTransfer');
    document.getElementById(activeId).classList.add('active');

    const kat = document.getElementById('kategori');
    if (type === 'Pengeluaran') {
        kat.innerHTML = `<option value="Makanan & Minuman">Makanan & Minuman</option><option value="Transportasi">Transportasi</option><option value="Tagihan & Utilitas">Tagihan & Utilitas</option><option value="Belanja">Belanja</option><option value="Hiburan">Hiburan</option><option value="Kesehatan">Kesehatan</option><option value="Lainnya">Lainnya</option>`;
    } else if (type === 'Pemasukan') {
        kat.innerHTML = `<option value="Gaji">Gaji</option><option value="Bisnis">Bisnis</option><option value="Investasi">Investasi</option><option value="Pemberian">Pemberian</option><option value="Bonus">Bonus</option>`;
    } else {
        kat.innerHTML = `<option value="Transfer Internal">Transfer Internal</option><option value="Tarik Tunai">Tarik Tunai</option>`;
    }
}

async function submitTransaction(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSubmit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    btn.disabled = true;

    const data = {
        id: document.getElementById('editId').value || null,
        tipe: document.querySelector('input[name="tipe"]:checked').value,
        jumlah: document.getElementById('jumlah').value,
        tanggal: document.getElementById('tanggal').value,
        akun: document.getElementById('akun').value,
        kategori: document.getElementById('kategori').value,
        catatan: document.getElementById('catatan').value
    };

    try {
        await runGasFunc('addTransaction', data);
        toggleModal(false);
        loadData();
        showToast('Transaksi berhasil disimpan!');
    } catch (err) { showToast('Gagal menyimpan!', false); } 
    finally { btn.innerHTML = originalText; btn.disabled = false; }
}

async function deleteTransactionFromModal() {
    const id = document.getElementById('editId').value;
    if (id && confirm('Yakin ingin menghapus transaksi ini?')) {
        await deleteTransaction(id);
    }
}

async function deleteTransaction(id) {
    if (!id || !confirm('Hapus transaksi ini?')) return;
    try {
        await runGasFunc('deleteTransaction', id);
        toggleModal(false);
        loadData();
        showToast('Transaksi berhasil dihapus!');
    } catch (err) { showToast('Gagal menghapus!', false); }
}

// --- ACCOUNT MODAL ---
function toggleAccountModal(show) {
    const modal = document.getElementById('accountModal');
    if (show) {
        modal.classList.add('open');
        renderAccounts();
    } else {
        modal.classList.remove('open');
    }
}

function renderAccounts() {
    const list = document.getElementById('accountList');
    if (AppState.accounts.length === 0) {
        list.innerHTML = `<div style="text-align:center; color:#9ca3af; padding:1rem 0;">Belum ada akun.</div>`;
        return;
    }
    list.innerHTML = AppState.accounts.map(acc => `
        <div style="display:flex; justify-content:space-between; background:#f9fafb; padding:0.5rem; border-radius:1rem; border:1px solid #f3f4f6; margin-bottom:0.25rem;">
            <span style="font-weight:600; color:#374151; font-size:0.875rem;">${acc}</span>
            <div style="display:flex; gap:0.5rem;">
                <button onclick="window.editAccount('${acc}')" style="color:#3b82f6; background:none; border:none; font-size:0.75rem; cursor:pointer;">Edit</button>
                <button onclick="window.deleteAccount('${acc}')" style="color:#ef4444; background:none; border:none; font-size:0.75rem; cursor:pointer;">Hapus</button>
            </div>
        </div>
    `).join('');
}

function populateAccountSelect() {
    const select = document.getElementById('akun');
    if(select) select.innerHTML = AppState.accounts.map(acc => `<option value="${acc}">${acc}</option>`).join('');
}

window.editAccount = (name) => {
    document.getElementById('editAccountId').value = name;
    document.getElementById('accountName').value = name;
    document.getElementById('btnAccountSubmit').innerText = 'Simpan';
    document.getElementById('btnAccountDelete').classList.remove('hidden');
};

async function submitAccount(e) {
    e.preventDefault();
    const btn = document.getElementById('btnAccountSubmit');
    const name = document.getElementById('accountName').value.trim();
    const oldName = document.getElementById('editAccountId').value;
    if (!name) { showToast('Nama akun wajib diisi!', false); return; }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
        if (oldName && oldName !== name) await runGasFunc('deleteAccount', oldName);
        await runGasFunc('addAccount', name);
        document.getElementById('accountName').value = '';
        document.getElementById('editAccountId').value = '';
        document.getElementById('btnAccountSubmit').innerText = 'Tambah';
        document.getElementById('btnAccountDelete').classList.add('hidden');
        await loadData();
        showToast('Akun berhasil disimpan!');
        toggleAccountModal(false);
    } catch (err) { showToast('Gagal menyimpan akun!', false); } 
    finally { btn.innerHTML = 'Simpan'; btn.disabled = false; }
}

async function deleteAccountFromModal() {
    const name = document.getElementById('editAccountId').value;
    if (name && confirm(`Hapus akun "${name}"?`)) await deleteAccount(name);
}

async function deleteAccount(name) {
    if (!name || !confirm(`Hapus akun "${name}"?`)) return;
    try {
        await runGasFunc('deleteAccount', name);
        document.getElementById('accountName').value = '';
        document.getElementById('editAccountId').value = '';
        document.getElementById('btnAccountSubmit').innerText = 'Tambah';
        document.getElementById('btnAccountDelete').classList.add('hidden');
        await loadData();
        showToast('Akun berhasil dihapus!');
        toggleAccountModal(false);
    } catch (err) { showToast('Gagal menghapus akun!', false); }
}

// --- SETUP LISTENERS ---
function setupListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = (e) => {
            AppState.currentFilter = e.target.dataset.filter;
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.style.background = 'white';
                b.style.color = '#6b7280';
                b.style.border = '1px solid #e5e7eb';
            });
            e.target.style.background = '#10b981';
            e.target.style.color = 'white';
            e.target.style.border = '1px solid #10b981';
            renderTransactions();
        };
    });
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    renderPage('dasbor');
});
