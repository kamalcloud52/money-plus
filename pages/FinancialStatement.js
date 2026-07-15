export function renderFinancialStatement() {
    // Data Mockup (Sesuai screenshot: Cash & Bank Account)
    const data = {
        total: 1410882,
        breakdown: [
            { name: "Cash", amount: 569000, color: "#2ecc71" }, // Warna Hijau
            { name: "Bank Account", amount: 841882, color: "#00bfff" } // Warna Biru Muda
        ]
    };

    // Helper: Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
            .format(number).replace("Rp", "IDR");
    };

    // --- LOGIKA MEMBUAT PIE CHART SVG ---
    const cx = 150; // Center X (Pusat lingkaran)
    const cy = 150; // Center Y
    const radius = 120; // Jari-jari
    let startAngle = 0;
    
    // Fungsi untuk mengubah sudut menjadi koordinat X, Y di SVG
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    // Fungsi membuat Path (irisan kue)
    const describeArc = (x, y, radius, startAngle, endAngle) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", x, y,
            "L", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "L", x, y // Kembali ke tengah
        ].join(" ");
    };

    // Loop data untuk membuat irisan kue dan label
    let pathSVG = '';
    let legendHTML = '';
    let runningAngle = 0;

    data.breakdown.forEach((item) => {
        const percentage = (item.amount / data.total) * 100;
        const angle = (percentage / 100) * 360;
        const endAngle = runningAngle + angle;

        // Buat path SVG
        if (percentage > 0) {
            pathSVG += `<path d="${describeArc(cx, cy, radius, runningAngle, endAngle)}" fill="${item.color}" />`;
            
            // Hitung posisi label persentase (di dalam kue)
            const midAngle = runningAngle + (angle / 2);
            const labelRadius = radius * 0.65; // Letakkan label agak ke dalam
            const labelPos = polarToCartesian(cx, cy, labelRadius, midAngle);
            
            pathSVG += `
                <text x="${labelPos.x}" y="${labelPos.y}" fill="#000" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="middle">
                    ${percentage.toFixed(1)}%
                </text>
            `;
        }

        // Buat Legenda (di bawah grafik)
        legendHTML += `
            <div class="legend-item">
                <span class="legend-dot" style="background-color: ${item.color};"></span>
                <span class="legend-text">${item.name}</span>
            </div>
        `;

        runningAngle += angle;
    });

    return `
        <div class="app-container financial-statement-page">
            
            <!-- Header -->
            <div class="fs-header">
                <!-- UBAH INI: Ganti <button> menjadi <a href="#home"> -->
                <a href="#home" class="back-btn"><i class="fas fa-chevron-left"></i></a>
                <h2>Financial Statement</h2>
                <div style="width: 24px;"></div>
            </div>

            <!-- Total Saldo -->
            <div class="card fs-total-card">
                <span class="fs-total-text text-green fw-bold">${formatRupiah(data.total)}</span>
            </div>

            <!-- Pie Chart -->
            <div class="fs-chart-container">
                <svg viewBox="0 0 300 300" width="100%" height="100%" style="max-width: 300px; margin: 0 auto;">
                    ${pathSVG}
                </svg>
            </div>

            <!-- Legenda -->
            <div class="fs-legend">
                ${legendHTML}
            </div>

        </div>
    `;
}
