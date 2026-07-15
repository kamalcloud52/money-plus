import { dashboardData } from '../api/index.js';

export function renderHome() {
    // Kita bisa memanggil API di sini jika diperlukan
    const data = dashboardData; 

    // Mengembalikan string HTML untuk halaman Home
    return `
        <div class="app-container">
            <!-- 1. Financial Statement -->
            <div class="card financial-statement">
                <div class="card-header">
                    <h3>Financial Statement</h3>
                    <div class="arrow-icon"><i class="fas fa-arrow-right"></i></div>
                </div>
                <div class="balance">${data.balance}</div>
            </div>

            <!-- 2. Expense & Income -->
            <div class="card expense-income">
                <div class="card-header">
                    <h3>Expense & Income</h3>
                    <div class="arrow-icon"><i class="fas fa-arrow-right"></i></div>
                </div>
                <div class="filter-select">
                    <select><option>This Month</option></select>
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
                    <div class="arrow-icon"><i class="fas fa-arrow-right"></i></div>
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
                    <div class="arrow-icon"><i class="fas fa-arrow-right"></i></div>
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
    `;
}
