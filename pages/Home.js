import { dashboardData } from '../api/index.js';

export function renderHome() {
    const data = dashboardData; 

    return `
        <div class="app-container home-page">
            <!-- 1. Financial Statement -->
            <div class="card financial-statement">
                <div class="card-header">
                    <h3>Financial Statement</h3>
                    <a href="#financial-statement" class="arrow-icon"><i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="balance">${data.balance}</div>
            </div>

            <!-- 2. Expense & Income -->
            <div class="card expense-income">
                <div class="card-header">
                    <h3>Expense & Income</h3>
                    <a href="#category-ranking" class="arrow-icon"><i class="fas fa-arrow-right"></i></a>
                </div>
                
                <div class="filter-select" id="home-time-selector">
                    <div class="home-filter-btn">
                        <span id="home-time-text">This Month</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>

                <div class="chart-container">
                    <div class="chart-labels">
                        <span>IDR30L</span>
                        <span>IDR20L</span>
                    </div>
                    <div class="chart-bars">
                        <div class="chart-bar bar-income"></div>
                        <div class="chart-bar bar-expense"></div>
                    </div>
                    <div class="chart-data">
                        <div class="row">
                            <span>Income:</span>
                            <span class="text-green">IDR${data.chart.income.toLocaleString()}</span>
                        </div>
                        <div class="row">
                            <span>Expense:</span>
                            <span class="text-red">IDR-${data.chart.expense.toLocaleString()}</span>
                        </div>
                        <div class="row" style="border-top: 1px solid #f2f2f2; border-bottom: none; margin-top: 2px;">
                            <span>Total:</span>
                            <span class="text-red">IDR-${(data.chart.expense - data.chart.income).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. Monthly Budget -->
            <div class="card monthly-budget">
                <div class="card-header">
                    <h3>Monthly Budget</h3>
                    <a href="#graph" class="arrow-icon"><i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="budget-container">
                    <div class="donut-chart">
                        <div class="donut-inner">
                            <span>Remaining</span>
                            <strong>${data.budget.percentage}%</strong>
                        </div>
                    </div>
                    <div class="budget-data">
                        <div class="row flex-row">
                            <span>Budget</span>
                            <span class="text-green fw-bold">IDR${data.budget.total.toLocaleString()}</span>
                        </div>
                        <div class="row flex-row">
                            <span>Expenses</span>
                            <span class="text-red">IDR${data.budget.expenses.toLocaleString()}</span>
                        </div>
                        <div class="row flex-row">
                            <span>Remaining</span>
                            <span class="text-green fw-bold">IDR${data.budget.remaining.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 4. Recent Transactions -->
            <div class="card recent-transactions">
                <div class="card-header">
                    <h3>Recent Transactions</h3>
                    <a href="#graph" class="arrow-icon"><i class="fas fa-arrow-right"></i></a>
                </div>
                ${data.transactions.map(t => `
                    <div class="transaction-item">
                        <div class="trans-icon ${t.color}"><i class="fas fa-${t.icon}"></i></div>
                        <div class="trans-details">
                            <h4>${t.title}</h4>
                            <p>${t.desc}</p>
                        </div>
                        <div class="trans-amount">${t.amount.toLocaleString()}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- ===== BOTTOM SHEET HOME (THIS MONTH) ===== -->
        <div class="bottom-sheet-overlay home-time-sheet" id="home-time-sheet">
            <div class="bottom-sheet-content">
                <h3>Select Time</h3>
                <div class="list-container">
                    <div class="list-item" data-time="Today">Today</div>
                    <div class="list-item" data-time="This Week">This Week</div>
                    <div class="list-item active-item" data-time="This Month">This Month <i class="fas fa-check"></i></div>
                    <div class="list-item" data-time="This Year">This Year</div>
                </div>
            </div>
        </div>
    `;
}

// ============================
// LOGIKA JAVASCRIPT INTERAKTIF (UNTUK HALAMAN HOME)
// ============================
export function initHomeLogic() {
    const timeSelector = document.getElementById('home-time-selector');
    const timeSheet = document.getElementById('home-time-sheet');
    const timeText = document.getElementById('home-time-text');

    if (!timeSelector || !timeSheet) return;

    // Fungsi Buka/Tutup Sheet
    const toggleSheet = (show) => {
        if (show) {
            timeSheet.classList.add('open');
        } else {
            timeSheet.classList.remove('open');
        }
    };

    // 1. Buka sheet saat tombol diklik
    timeSelector.addEventListener('click', () => toggleSheet(true));

    // 2. Tutup sheet saat klik area gelap
    timeSheet.addEventListener('click', (e) => {
        if (e.target === timeSheet) toggleSheet(false);
    });

    // 3. Pilih item menu (LOGIKA CENTANG DIPERBAIKI)
    timeSheet.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', () => {
            const txt = item.dataset.time;
            
            // Hapus class active-item dari semua item (agar centang yang lama hilang)
            timeSheet.querySelectorAll('.list-item').forEach(el => {
                el.classList.remove('active-item');
            });
            
            // Tambahkan class active-item ke item yang baru diklik
            item.classList.add('active-item');
            
            // Update teks tombol di Home
            timeText.textContent = txt;
            
            // Tutup sheet
            toggleSheet(false);
        });
    });
}
