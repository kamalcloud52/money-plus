// Contoh data mockup (JSON)
export const dashboardData = {
    balance: "IDR1.210.882",
    chart: {
        income: 200000,
        expense: 358118
    },
    budget: {
        total: 5000000,
        expenses: 358118,
        remaining: 4641882,
        percentage: 7.2
    },
    transactions: [
        { id: 1, title: "Shopping", desc: "Dompet TORCH", amount: -106718, icon: "shopping-cart", color: "bg-orange" },
        { id: 2, title: "Repair", desc: "Tinta Epson", amount: -93900, icon: "cog", color: "bg-gray" },
        { id: 3, title: "Gift", desc: "Kuota Faza", amount: -27000, icon: "gift", color: "bg-pink" }
    ]
};
