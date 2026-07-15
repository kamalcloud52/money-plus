// Data Mockup Kategori
const expenseData = [
    { name: "Shopping", amount: 237218, color: "#ffd54f" },
    { name: "Repair", amount: 93900, color: "#90a4ae" },
    { name: "Gift", amount: 27000, color: "#f48fb1" }
];

const incomeData = [
    { name: "Investments", amount: 200000, color: "#ce93d8" }
];

export function renderCategoryRanking() {
    // Helper format
    const formatRupiah = (num) => {
        if (!num) return "IDR0";
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
            .format(num).replace("Rp", "IDR");
    };

    // --- LOGIKA SVG PIE CHART ---
    const buildPieChartSVG = (data) => {
        const total = data.reduce((sum, item) => sum + item.amount, 0);
        if (total === 0) return `<text x="150" y="155" fill="#888" font-size="16" text-anchor="middle">No Data</text>`;

        const cx = 150, cy = 150, radius = 120;
        let startAngle = 0;
        let svgHtml = '';

        const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
            const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            };
        };

        data.forEach((item) => {
            const percentage = (item.amount / total) * 100;
            if (percentage < 0.1) return;

            const angle = (percentage / 100) * 360;
            const endAngle = startAngle + angle;

            const start = polarToCartesian(cx, cy, radius, endAngle);
            const end = polarToCartesian(cx, cy, radius, startAngle);
            const largeArcFlag = angle <= 180 ? "0" : "1";

            const pathD = `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
            svgHtml += `<path d="${pathD}" fill="${item.color}" />`;

            const midAngle = startAngle + (angle / 2);
            const labelRadius = radius * 0.65;
            const labelPos = polarToCartesian(cx, cy, labelRadius, midAngle);
            svgHtml += `<text x="${labelPos.x}" y="${labelPos.y}" fill="#000" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="middle">${percentage.toFixed(1)}%</text>`;

            startAngle += angle;
        });
        return svgHtml;
    };

    // --- LOGIKA RENDER LIST & BAR ---
    const buildListHTML = (data, type) => {
        const total = data.reduce((sum, item) => sum + item.amount, 0);
        const isExpense = type === 'expense';
        if (total === 0) return `<div style="text-align:center;color:#999;padding:20px;">Tidak ada transaksi</div>`;
        
        return data.map(item => {
            const pct = (item.amount / total) * 100;
            // Tampilkan minus untuk Expense, plus/apa adanya untuk Income
            const displayAmount = isExpense ? `-${formatRupiah(item.amount)}` : formatRupiah(item.amount);
            const colorClass = isExpense ? 'text-red' : 'text-green';
            
            return `
                <div class="cr-item">
                    <div class="cr-header">
                        <div class="cr-icon-box" style="background:${item.color}; color: white;">
                            <i class="fas fa-${item.name === 'Shopping' ? 'shopping-cart' : item.name === 'Repair' ? 'tools' : item.name === 'Gift' ? 'gift' : item.name === 'Investments' ? 'chart-line' : 'tag'}"></i>
                        </div>
                        <div class="cr-info">
                            <span class="cr-name">${item.name}</span>
                            <span class="cr-amount ${colorClass}">${displayAmount} (${pct.toFixed(1)}%)</span>
                        </div>
                    </div>
                    <div class="cr-bar-bg">
                        <div class="cr-bar-fill" style="width: ${pct}%; background: ${item.color};"></div>
                    </div>
                </div>
            `;
        }).join('');
    };

    // --- HTML UTAMA ---
    return `
        <div class="app-container category-ranking-page">
            
            <div class="cr-header-top">
                <button class="back-btn" id="cr-back-btn"><i class="fas fa-chevron-left"></i></button>
                <div class="cr-center-actions">
                    <div class="cr-time-selector" id="cr-time-picker">
                        <span>This Month</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <button class="cr-calendar-btn" id="cr-calendar-btn">
                        <i class="far fa-calendar-alt"></i>
                    </button>
                </div>
            </div>

            <!-- TABS: Diberi ID agar mudah ditangkap logic JS -->
            <div class="cr-tabs" id="cr-tabs-container">
                <button class="cr-tab-btn active" data-type="expense">Expense</button>
                <button class="cr-tab-btn" data-type="income">Income</button>
            </div>

            <h3 class="cr-title">Category Ranking</h3>

            <!-- Pie Chart: Diberi ID agar SVG bisa diganti -->
            <div class="cr-chart-container">
                <svg viewBox="0 0 300 300" width="100%" height="100%" style="max-width: 280px; margin: 0 auto;" id="cr-chart-svg">
                    ${buildPieChartSVG(expenseData)}
                </svg>
            </div>

            <!-- Total: Diberi ID agar teks bisa diganti -->
            <div class="cr-total-row">
                <span>Total</span>
                <span class="fw-bold text-red" id="cr-total-text">${formatRupiah(expenseData.reduce((a,b) => a + b.amount, 0))}</span>
            </div>

            <!-- List: Diberi ID agar list bisa diganti -->
            <div class="cr-list" id="cr-list-container">
                ${buildListHTML(expenseData, 'expense')}
            </div>
        </div>

        <!-- BOTTOM SHEETS (Sama seperti sebelumnya) -->
        <div class="bottom-sheet-overlay" id="cr-time-sheet">
            <div class="bottom-sheet-content">
                <h3>Select Time</h3>
                <div class="list-container">
                    <div class="list-item" data-time="Today">Today</div>
                    <div class="list-item" data-time="This Week">This Week</div>
                    <div class="list-item active-item" data-time="This Month">This Month <i class="fas fa-check" style="color:#f5a623; margin-left:auto;"></i></div>
                    <div class="list-item" data-time="This Year">This Year</div>
                </div>
            </div>
        </div>

        <div class="bottom-sheet-overlay" id="cr-calendar-sheet">
            <div class="bottom-sheet-content" style="max-height: 80vh; overflow-y: auto;">
                <h3 style="margin-bottom: 12px;">2026</h3>
                <div class="month-list">
                    ${['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, i) => {
                        let inc = i === 6 ? 'IDR200.000' : 'IDR0';
                        let exp = i === 6 ? 'IDR358.118' : 'IDR0';
                        return `
                            <div class="month-row">
                                <span>${m}</span>
                                <div class="month-values">
                                    <span class="text-green">${inc}</span>
                                    <span class="text-red" style="margin-left: 16px;">${exp}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

// ============================
// LOGIKA JAVASCRIPT INTERAKTIF
// ============================
export function initCategoryRankingLogic() {
    const backBtn = document.getElementById('cr-back-btn');
    const timePicker = document.getElementById('cr-time-picker');
    const timeSheet = document.getElementById('cr-time-sheet');
    const calBtn = document.getElementById('cr-calendar-btn');
    const calSheet = document.getElementById('cr-calendar-sheet');
    const tabs = document.querySelectorAll('.cr-tab-btn');

    // 1. Tombol Kembali
    if(backBtn) backBtn.addEventListener('click', () => window.location.hash = '#home');

    // 2. Buka/Tutup Bottom Sheet
    const toggleSheet = (el, show) => show ? el.classList.add('open') : el.classList.remove('open');
    timePicker.addEventListener('click', () => toggleSheet(timeSheet, true));
    calBtn.addEventListener('click', () => toggleSheet(calSheet, true));

    document.querySelectorAll('.bottom-sheet-overlay').forEach(ov => {
        ov.addEventListener('click', (e) => {
            if(e.target === ov) toggleSheet(ov, false);
        });
    });

    // 3. Pilih Waktu
    document.querySelectorAll('#cr-time-sheet .list-item').forEach(item => {
        item.addEventListener('click', () => {
            const txt = item.dataset.time;
            document.querySelector('#cr-time-sheet .active-item')?.classList.remove('active-item');
            item.classList.add('active-item');
            timePicker.querySelector('span').textContent = txt;
            toggleSheet(timeSheet, false);
        });
    });

    // ============================================================
    // 4. LOGIKA UTAMA: PINDAH TAB EXPENSE / INCOME (YANG SEBELUMNYA HILANG)
    // ============================================================
    const chartSvg = document.getElementById('cr-chart-svg');
    const totalText = document.getElementById('cr-total-text');
    const listContainer = document.getElementById('cr-list-container');

    // Data mockup (Bisa disesuaikan jika diambil dari API)
    const dataExpense = [
        { name: "Shopping", amount: 237218, color: "#ffd54f" },
        { name: "Repair", amount: 93900, color: "#90a4ae" },
        { name: "Gift", amount: 27000, color: "#f48fb1" }
    ];
    const dataIncome = [
        { name: "Investments", amount: 200000, color: "#ce93d8" }
    ];

    // Fungsi Helper (Harus didefinisikan ulang di sini agar bisa dipakai JS)
    const formatRupiah = (num) => {
        if (!num) return "IDR0";
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num).replace("Rp", "IDR");
    };
    const buildPieChartSVG = (data) => {
        const total = data.reduce((sum, item) => sum + item.amount, 0);
        if (total === 0) return `<text x="150" y="155" fill="#888" font-size="16" text-anchor="middle">No Data</text>`;
        const cx = 150, cy = 150, radius = 120;
        let startAngle = 0;
        let svgHtml = '';
        const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
            const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
            return { x: centerX + (radius * Math.cos(angleInRadians)), y: centerY + (radius * Math.sin(angleInRadians)) };
        };
        data.forEach((item) => {
            const percentage = (item.amount / total) * 100;
            if (percentage < 0.1) return;
            const angle = (percentage / 100) * 360;
            const endAngle = startAngle + angle;
            const start = polarToCartesian(cx, cy, radius, endAngle);
            const end = polarToCartesian(cx, cy, radius, startAngle);
            const largeArcFlag = angle <= 180 ? "0" : "1";
            const pathD = `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
            svgHtml += `<path d="${pathD}" fill="${item.color}" />`;
            const midAngle = startAngle + (angle / 2);
            const labelRadius = radius * 0.65;
            const labelPos = polarToCartesian(cx, cy, labelRadius, midAngle);
            svgHtml += `<text x="${labelPos.x}" y="${labelPos.y}" fill="#000" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="middle">${percentage.toFixed(1)}%</text>`;
            startAngle += angle;
        });
        return svgHtml;
    };
    const buildListHTML = (data, type) => {
        const total = data.reduce((sum, item) => sum + item.amount, 0);
        const isExpense = type === 'expense';
        if (total === 0) return `<div style="text-align:center;color:#999;padding:20px;">Tidak ada transaksi</div>`;
        return data.map(item => {
            const pct = (item.amount / total) * 100;
            const displayAmount = isExpense ? `-${formatRupiah(item.amount)}` : formatRupiah(item.amount);
            const colorClass = isExpense ? 'text-red' : 'text-green';
            return `
                <div class="cr-item">
                    <div class="cr-header">
                        <div class="cr-icon-box" style="background:${item.color}; color: white;">
                            <i class="fas fa-${item.name === 'Shopping' ? 'shopping-cart' : item.name === 'Repair' ? 'tools' : item.name === 'Gift' ? 'gift' : item.name === 'Investments' ? 'chart-line' : 'tag'}"></i>
                        </div>
                        <div class="cr-info">
                            <span class="cr-name">${item.name}</span>
                            <span class="cr-amount ${colorClass}">${displayAmount} (${pct.toFixed(1)}%)</span>
                        </div>
                    </div>
                    <div class="cr-bar-bg">
                        <div class="cr-bar-fill" style="width: ${pct}%; background: ${item.color};"></div>
                    </div>
                </div>
            `;
        }).join('');
    };

    // Event Listener untuk Tab
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 1. Update visual aktif tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // 2. Tentukan data mana yang akan dipakai
            const type = this.dataset.type;
            let data, colorClass;
            if (type === 'expense') {
                data = dataExpense;
                colorClass = 'text-red';
            } else {
                data = dataIncome;
                colorClass = 'text-green';
            }

            // 3. Hitung total
            const total = data.reduce((sum, item) => sum + item.amount, 0);

            // 4. Update DOM (Chart, Total Text, List)
            chartSvg.innerHTML = buildPieChartSVG(data);
            
            totalText.textContent = formatRupiah(total);
            totalText.className = `fw-bold ${colorClass}`; // Ganti warna teks total

            listContainer.innerHTML = buildListHTML(data, type);
        });
    });
}
