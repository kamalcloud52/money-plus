export function renderGraph() {
    // --- Data Mockup ---
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Data untuk Line Chart (Financial Statement)
    // Visual: Mulai tinggi, stabil, lalu turun drastis di Juli, lalu landai.
    const lineData = [1.56, 1.56, 1.56, 1.56, 1.56, 1.57, 1.41, 1.42, 1.42, 1.42, 1.42, 1.42];
    
    // Data untuk Bar Chart (Expense & Income) - Hanya Juli yang ada datanya
    // Income: 20L (Hijau), Expense: -35L (Merah)
    const barIncome = [0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0];
    const barExpense = [0, 0, 0, 0, 0, 0, -35, 0, 0, 0, 0, 0];

    // --- Helper Functions ---
    const formatCurrency = (val) => `IDR${val}M`;

    // --- Render Line Chart (SVG) ---
    // Menghitung koordinat SVG agar garis mengikuti data
    const lineChartWidth = 340;
    const lineChartHeight = 160;
    const padding = { top: 10, bottom: 20, left: 50, right: 10 };
    const graphWidth = lineChartWidth - padding.left - padding.right;
    const graphHeight = lineChartHeight - padding.top - padding.bottom;
    
    const minLine = 1.40;
    const maxLine = 1.58;
    const rangeLine = maxLine - minLine;

    const linePoints = lineData.map((val, i) => {
        const x = padding.left + (i / (lineData.length - 1)) * graphWidth;
        const y = padding.top + graphHeight - ((val - minLine) / rangeLine) * graphHeight;
        return `${x},${y}`;
    }).join(' ');
    
    // Titik-titik lingkaran di data
    const circles = lineData.map((val, i) => {
        const x = padding.left + (i / (lineData.length - 1)) * graphWidth;
        const y = padding.top + graphHeight - ((val - minLine) / rangeLine) * graphHeight;
        return `<circle cx="${x}" cy="${y}" r="3" fill="#f5a623" />`;
    }).join('');


    // --- Render Bar Chart (SVG) ---
    const barChartWidth = 340;
    const barChartHeight = 200;
    const barPadding = { top: 10, bottom: 30, left: 40, right: 10 };
    const barGraphWidth = barChartWidth - barPadding.left - barPadding.right;
    const barGraphHeight = barChartHeight - barPadding.top - barPadding.bottom;

    // Grid Y Label (IDR20L, IDR10L, 0, -10L, dll)
    const barYLabels = ["IDR20L", "IDR10L", "IDR0", "IDR-10L", "IDR-20L", "IDR-30L", "IDR-40L"];
    const barYGridLines = barYLabels.map((_, i) => {
        const y = barPadding.top + (i / (barYLabels.length - 1)) * barGraphHeight;
        // Garis bantu grid
        return `<line x1="${barPadding.left}" y1="${y}" x2="${barChartWidth - barPadding.right}" y2="${y}" stroke="#e0e0e0" stroke-width="1" />`;
    }).join('');

    // Menggambar Batang (Hanya Juli yang ada isinya = index ke 6)
    const barWidth = 20;
    const zeroY = barPadding.top + (3 / (barYLabels.length - 1)) * barGraphHeight; // Posisi garis nol (IDR0)
    const valueToPixelY = (val) => {
        // Skala: 20L ke 0 adalah setengah tinggi (3 langkah dari 0 sampai 20L)
        const stepsFromZero = val / 10; 
        const pixelsPerStep = (barPadding.top + ((3 - 0) / (barYLabels.length - 1)) * barGraphHeight) - zeroY;
        // Perhatikan arah Y di SVG (0 di atas, bawah positif)
        return zeroY - (stepsFromZero * Math.abs(pixelsPerStep)); 
    };

    // Loop 12 bulan untuk gambar batang
    let barSVG = '';
    for (let i = 0; i < 12; i++) {
        const x = barPadding.left + (i / (12 - 1)) * barGraphWidth - (barWidth/2);
        
        // Batang Income (Hijau)
        if (barIncome[i] !== 0) {
            const yIncome = valueToPixelY(barIncome[i]);
            const heightIncome = zeroY - yIncome;
            barSVG += `<rect x="${x}" y="${yIncome}" width="${barWidth}" height="${heightIncome}" fill="#4cd964" />`;
        }
        
        // Batang Expense (Merah) - Bernilai negatif, jadi turun ke bawah dari nol
        if (barExpense[i] !== 0) {
            const yExpense = zeroY;
            const heightExpense = Math.abs(valueToPixelY(barExpense[i]) - zeroY);
            barSVG += `<rect x="${x}" y="${yExpense}" width="${barWidth}" height="${heightExpense}" fill="#ff3b30" />`;
        }
    }

    // Label Sumbu X Bar Chart
    const xLabels = monthLabels.map((month, i) => {
        const x = barPadding.left + (i / (12 - 1)) * barGraphWidth;
        return `<text x="${x}" y="${barChartHeight - 5}" font-size="9" fill="#888" text-anchor="middle">${month}</text>`;
    }).join('');


    // --- Final HTML Structure ---
    return `
        <div class="app-container graph-page">
            
            <!-- Header Halaman -->
            <div class="graph-header">
                <h2>Graph</h2>
                <button class="btn-date-picker">
                    <i class="far fa-calendar-alt"></i> 2026
                </button>
            </div>

            <!-- 1. Financial Statement Chart -->
            <div class="card graph-card">
                <div class="graph-card-header">
                    <h3>Financial Statement</h3>
                    <p class="graph-subtitle">Your money accumulated in 2026</p>
                </div>
                
                <div class="chart-wrapper">
                    <svg viewBox="0 0 ${lineChartWidth} ${lineChartHeight}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                        <!-- Area Gradient (Background Bawah Garis) -->
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#f5a623" stop-opacity="0.3" />
                                <stop offset="100%" stop-color="#f5a623" stop-opacity="0.0" />
                            </linearGradient>
                        </defs>
                        
                        <!-- Garis Y Labels -->
                        <text x="${padding.left - 10}" y="${padding.top + 10}" font-size="9" fill="#888" text-anchor="end">${formatCurrency(1.56)}</text>
                        <text x="${padding.left - 10}" y="${padding.top + 50}" font-size="9" fill="#888" text-anchor="end">${formatCurrency(1.53)}</text>
                        <text x="${padding.left - 10}" y="${padding.top + 90}" font-size="9" fill="#888" text-anchor="end">${formatCurrency(1.50)}</text>
                        <text x="${padding.left - 10}" y="${padding.top + 130}" font-size="9" fill="#888" text-anchor="end">${formatCurrency(1.47)}</text>
                        <text x="${padding.left - 10}" y="${padding.top + 155}" font-size="9" fill="#888" text-anchor="end">${formatCurrency(1.44)}</text>
                        <text x="${padding.left - 10}" y="${lineChartHeight - 5}" font-size="9" fill="#888" text-anchor="end">${formatCurrency(1.41)}</text>

                        <!-- Area Path -->
                        <path d="M${linePoints} L${padding.left + graphWidth},${lineChartHeight - padding.bottom} L${padding.left},${lineChartHeight - padding.bottom} Z" fill="url(#lineGradient)" />
                        
                        <!-- Garis Tepi Atas -->
                        <polyline points="${linePoints}" fill="none" stroke="#f5a623" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />
                        
                        <!-- Titik Data -->
                        ${circles}
                    </svg>
                    
                    <!-- Label Sumbu X Line Chart (Manual dibawah SVG agar rapi) -->
                    <div class="x-axis-labels">
                        <span>Jan</span>
                        <span>Mar</span>
                        <span>May</span>
                        <span>Jul</span>
                        <span>Sep</span>
                        <span>Nov</span>
                    </div>
                </div>
            </div>

            <!-- 2. Expense & Income Chart -->
            <div class="card graph-card">
                <div class="graph-card-header">
                    <h3>Expense & Income</h3>
                    <p class="graph-subtitle">Per month in 2026</p>
                </div>
                
                <div class="chart-wrapper">
                    <svg viewBox="0 0 ${barChartWidth} ${barChartHeight}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                        <!-- Grid Lines & Y Labels -->
                        ${barYGridLines}
                        
                        <!-- Y Axis Labels Text -->
                        ${barYLabels.map((label, i) => {
                            const y = barPadding.top + (i / (barYLabels.length - 1)) * barGraphHeight;
                            return `<text x="${barPadding.left - 8}" y="${y + 3}" font-size="9" fill="#888" text-anchor="end">${label}</text>`;
                        }).join('')}

                        <!-- Bar Data -->
                        ${barSVG}

                        <!-- X Axis Labels (Month) -->
                        ${xLabels}
                    </svg>
                </div>
            </div>

        </div>
    `;
}
