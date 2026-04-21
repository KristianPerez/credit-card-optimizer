document.getElementById('calculateBtn').addEventListener('click', function() {
    let budget = parseFloat(document.getElementById('budget').value) || 0;
    
    // Core data array updated with Signature Loan
    let accounts = [
        { name: "Members Choice", balance: parseFloat(document.getElementById('balance-1').value), min: parseFloat(document.getElementById('min-1').value), apr: 12.75, paidToday: 0 },
        { name: "Comerica", balance: parseFloat(document.getElementById('balance-2').value), min: parseFloat(document.getElementById('min-2').value), apr: 17.49, paidToday: 0 },
        { name: "Capital One Savor", balance: parseFloat(document.getElementById('balance-3').value), min: parseFloat(document.getElementById('min-3').value), apr: 28.99, paidToday: 0 },
        { name: "Silver Card", balance: parseFloat(document.getElementById('balance-4').value), min: parseFloat(document.getElementById('min-4').value), apr: 0, paidToday: 0 },
        { name: "Signature Loan", balance: parseFloat(document.getElementById('balance-5').value), min: parseFloat(document.getElementById('min-5').value), apr: 10.24, paidToday: 0 }
    ].filter(a => a.balance > 0);

    const resultsDiv = document.getElementById('results');
    const resultList = document.getElementById('resultList');
    
    resultsDiv.classList.remove('hidden');
    let html = "";

    // 1. PHASE 1: Paying all required minimums
    html += `<div><h4 class="text-blue-600 font-bold text-[10px] uppercase mb-3 border-b border-blue-100 pb-1 tracking-widest text-center">Step 1: Secure Minimum Payments</h4><div class="space-y-2">`;
    accounts.forEach(acc => {
        let payment = Math.min(budget, acc.min, acc.balance);
        acc.balance -= payment;
        acc.paidToday += payment;
        budget -= payment;
        html += `<div class="flex justify-between text-sm"><span>${acc.name}</span><strong>$${payment.toFixed(2)}</strong></div>`;
    });
    html += `</div></div>`;

    // 2. PHASE 2: Interest Savings Waterfall (Avalanche)
    if (budget > 0) {
        accounts.sort((a, b) => b.apr - a.apr);
        html += `<div class="pt-4 border-t border-dashed border-slate-200 mt-4"><h4 class="text-green-600 font-bold text-[10px] uppercase mb-3 border-b border-green-100 pb-1 tracking-widest text-center">Step 2: Smart Waterfall Overflow</h4><div class="space-y-2">`;
        accounts.forEach(acc => {
            if (budget > 0 && acc.balance > 0) {
                let extra = Math.min(budget, acc.balance);
                acc.balance -= extra;
                acc.paidToday += extra;
                budget -= extra;
                html += `<div class="flex justify-between text-sm text-green-700 italic"><span>${acc.name} Extra</span><strong>$${extra.toFixed(2)}</strong></div>`;
            }
        });
        html += `</div></div>`;
    }

    // Calculate final totals
    const grandTotalRemaining = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    // 3. FINAL SUMMARY TABLE
    html += `
        <div class="mt-8 bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h4 class="text-slate-800 font-black text-xs uppercase mb-4 text-center tracking-widest">Final Status Summary</h4>
            <div class="space-y-4">
                <div class="grid grid-cols-3 text-[10px] font-bold text-slate-400 uppercase px-1">
                    <span>Account</span>
                    <span class="text-center">Total Paid</span>
                    <span class="text-right">New Balance</span>
                </div>
                ${accounts.map(acc => `
                    <div class="grid grid-cols-3 text-sm items-center border-b border-white pb-2 last:border-0">
                        <span class="font-bold text-slate-700">${acc.name}</span>
                        <span class="text-center text-blue-600 font-bold">$${acc.paidToday.toFixed(2)}</span>
                        <span class="text-right font-black ${acc.balance === 0 ? 'text-green-600' : 'text-slate-800'}">
                            $${acc.balance.toFixed(2)}
                        </span>
                    </div>
                `).join('')}
                
                <div class="pt-4 mt-2 border-t-2 border-slate-800 grid grid-cols-2 items-center">
                    <span class="text-xs font-black uppercase text-slate-500">Total Combined Debt Remaining:</span>
                    <span class="text-right text-xl font-black text-slate-900">$${grandTotalRemaining.toFixed(2)}</span>
                </div>
            </div>
        </div>`;

    resultList.innerHTML = html;
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
});