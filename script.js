document.getElementById('calculateBtn').addEventListener('click', function() {
    let budget = parseFloat(document.getElementById('budget').value) || 0;
    
    // Initialize cards array
    let cards = [
        { name: "Members Choice", balance: parseFloat(document.getElementById('balance-1').value), min: parseFloat(document.getElementById('min-1').value), apr: 12.75, paidToday: 0 },
        { name: "Comerica", balance: parseFloat(document.getElementById('balance-2').value), min: parseFloat(document.getElementById('min-2').value), apr: 17.49, paidToday: 0 },
        { name: "Capital One Savor", balance: parseFloat(document.getElementById('balance-3').value), min: parseFloat(document.getElementById('min-3').value), apr: 28.99, paidToday: 0 },
        { name: "Silver Card", balance: parseFloat(document.getElementById('balance-4').value), min: parseFloat(document.getElementById('min-4').value), apr: 0, paidToday: 0 }
    ].filter(c => c.balance > 0);

    const resultsDiv = document.getElementById('results');
    const resultList = document.getElementById('resultList');
    resultsDiv.classList.remove('hidden');
    let html = "";

    // 1. Pay Minimums
    html += `<div><h4 class="text-blue-600 font-bold text-[10px] uppercase mb-3 border-b border-blue-100 pb-1 tracking-widest text-center">Step 1: Required Minimums</h4><div class="space-y-2">`;
    cards.forEach(card => {
        let payment = Math.min(budget, card.min, card.balance);
        card.balance -= payment;
        card.paidToday += payment;
        budget -= payment;
        html += `<div class="flex justify-between text-sm"><span>${card.name}</span><strong>$${payment.toFixed(2)}</strong></div>`;
    });
    html += `</div></div>`;

    // 2. Extra Waterfall Payments
    if (budget > 0) {
        cards.sort((a, b) => b.apr - a.apr);
        html += `<div class="pt-4 border-t border-dashed border-slate-200 mt-4"><h4 class="text-green-600 font-bold text-[10px] uppercase mb-3 border-b border-green-100 pb-1 tracking-widest text-center">Step 2: Interest Savings (Waterfall)</h4><div class="space-y-2">`;
        cards.forEach(card => {
            if (budget > 0 && card.balance > 0) {
                let extra = Math.min(budget, card.balance);
                card.balance -= extra;
                card.paidToday += extra;
                budget -= extra;
                html += `<div class="flex justify-between text-sm text-green-700 italic"><span>${card.name} Extra</span><strong>$${extra.toFixed(2)}</strong></div>`;
            }
        });
        html += `</div></div>`;
    }

    // Calculate Grand Total Debt Remaining
    const grandTotalRemaining = cards.reduce((sum, card) => sum + card.balance, 0);

    // 3. Final Status Summary with Grand Total
    html += `
        <div class="mt-8 bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h4 class="text-slate-800 font-black text-xs uppercase mb-4 text-center tracking-widest">Final Status Summary</h4>
            <div class="space-y-4">
                <div class="grid grid-cols-3 text-[10px] font-bold text-slate-400 uppercase px-1">
                    <span>Card</span>
                    <span class="text-center">Total Paid</span>
                    <span class="text-right">New Balance</span>
                </div>
                ${cards.map(card => `
                    <div class="grid grid-cols-3 text-sm items-center border-b border-white pb-2 last:border-0">
                        <span class="font-bold text-slate-700">${card.name}</span>
                        <span class="text-center text-blue-600 font-bold">$${card.paidToday.toFixed(2)}</span>
                        <span class="text-right font-black ${card.balance === 0 ? 'text-green-600' : 'text-slate-800'}">
                            $${card.balance.toFixed(2)}
                        </span>
                    </div>
                `).join('')}
                
                <div class="pt-4 mt-2 border-t-2 border-slate-800 grid grid-cols-2 items-center">
                    <span class="text-xs font-black uppercase text-slate-500">Total Debt Remaining:</span>
                    <span class="text-right text-xl font-black text-slate-900">$${grandTotalRemaining.toFixed(2)}</span>
                </div>
            </div>
        </div>`;

    resultList.innerHTML = html;
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
});