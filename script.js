document.getElementById('calculateBtn').addEventListener('click', function() {
    let budget = parseFloat(document.getElementById('budget').value) || 0;
    
    let accounts = [
        { name: "Members Choice", balance: parseFloat(document.getElementById('balance-1').value), apr: parseFloat(document.getElementById('apr-1').value) || 0, min: parseFloat(document.getElementById('min-1').value), manualExtra: parseFloat(document.getElementById('extra-1').value) || 0, paidToday: 0 },
        { name: "Comerica", balance: parseFloat(document.getElementById('balance-2').value), apr: parseFloat(document.getElementById('apr-2').value) || 0, min: parseFloat(document.getElementById('min-2').value), manualExtra: parseFloat(document.getElementById('extra-2').value) || 0, paidToday: 0 },
        { name: "Cap One Savor", balance: parseFloat(document.getElementById('balance-3').value), apr: parseFloat(document.getElementById('apr-3').value) || 0, min: parseFloat(document.getElementById('min-3').value), manualExtra: parseFloat(document.getElementById('extra-3').value) || 0, paidToday: 0 },
        { name: "Silver Card", balance: parseFloat(document.getElementById('balance-4').value), apr: parseFloat(document.getElementById('apr-4').value) || 0, min: parseFloat(document.getElementById('min-4').value), manualExtra: parseFloat(document.getElementById('extra-4').value) || 0, paidToday: 0 },
        { name: "Signature Loan", balance: parseFloat(document.getElementById('balance-5').value), apr: parseFloat(document.getElementById('apr-5').value) || 0, min: parseFloat(document.getElementById('min-5').value), manualExtra: parseFloat(document.getElementById('extra-5').value) || 0, paidToday: 0 }
    ].filter(a => a.balance > 0);

    const totalMinRequired = accounts.reduce((sum, acc) => sum + acc.min, 0);
    const label = document.getElementById('minTotalLabel');
    label.innerText = `Required Minimums Total: $${totalMinRequired.toFixed(2)}`;

    if (budget < totalMinRequired && budget > 0) {
        label.classList.add('text-red-600');
        label.classList.remove('text-blue-400');
        label.innerText += " ⚠️ BUDGET TOO LOW";
    } else {
        label.classList.remove('text-red-600');
        label.classList.add('text-blue-400');
    }

    const resultsDiv = document.getElementById('results');
    const resultList = document.getElementById('resultList');
    resultsDiv.classList.remove('hidden');
    
    let html = "";
    let totalInterestSaved = 0;

    // 1. PHASE 1: Base Minimums
    html += `<div class="results-section"><h4 class="text-slate-400 font-black text-[10px] uppercase mb-4 border-b pb-1 tracking-widest text-center">1. Security Layer: All Minimums</h4><div class="space-y-2">`;
    accounts.forEach(acc => {
        let payment = Math.min(budget, acc.min, acc.balance);
        acc.balance -= payment;
        acc.paidToday += payment;
        budget -= payment;
        html += `<div class="flex justify-between text-sm"><span>${acc.name}</span><span class="font-bold text-slate-800">$${payment.toFixed(2)}</span></div>`;
    });
    html += `</div></div>`;

    // 2. PHASE 2: User Manual Extras
    if (budget > 0) {
        let manualHeaderAdded = false;
        accounts.forEach(acc => {
            if (acc.manualExtra > 0 && budget > 0 && acc.balance > 0) {
                if (!manualHeaderAdded) {
                    html += `<div class="results-section pt-6 mt-6 border-t border-dashed text-center"><h4 class="text-blue-600 font-black text-[10px] uppercase mb-4 border-b border-blue-100 pb-1 tracking-widest">2. Your Personalized Choices</h4><div class="space-y-2 text-left">`;
                    manualHeaderAdded = true;
                }
                
                let extraToApply = Math.min(budget, acc.manualExtra, acc.balance);
                if (acc.apr > 0) {
                    totalInterestSaved += extraToApply * ((acc.apr / 100) / 12);
                }

                acc.balance -= extraToApply;
                acc.paidToday += extraToApply;
                budget -= extraToApply;
                
                html += `<div class="flex justify-between text-sm text-blue-700"><span>${acc.name} (Custom)</span><span class="font-black">+$${extraToApply.toFixed(2)}</span></div>`;
            }
        });
        if (manualHeaderAdded) html += `</div></div>`;
    }

    // 3. PHASE 3: Smart Waterfall Overflow
    if (budget > 0) {
        accounts.sort((a, b) => b.apr - a.apr);
        html += `<div class="results-section pt-6 mt-6 border-t border-dashed text-center"><h4 class="text-green-600 font-black text-[10px] uppercase mb-4 border-b border-green-100 pb-1 tracking-widest">3. Recommended Interest Sweep</h4><div class="space-y-2 text-left">`;
        accounts.forEach(acc => {
            if (budget > 0 && acc.balance > 0) {
                let overflow = Math.min(budget, acc.balance);
                if (acc.apr > 0) {
                    totalInterestSaved += overflow * ((acc.apr / 100) / 12);
                }
                acc.balance -= overflow;
                acc.paidToday += overflow;
                budget -= overflow;
                html += `<div class="flex justify-between text-sm text-green-700 font-bold"><span>${acc.name} (${acc.apr}%)</span><span class="font-black">+$${overflow.toFixed(2)}</span></div>`;
            }
        });
        html += `</div></div>`;
    }

    const grandTotalRemaining = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    html += `
        <div class="mt-10 bg-slate-900 p-6 rounded-2xl text-white shadow-2xl">
            <div class="text-center mb-8 bg-white/10 p-4 rounded-xl border border-white/10">
                <p class="text-[10px] uppercase font-black text-blue-300 tracking-widest mb-1">Monthly Interest Saved</p>
                <p class="text-4xl font-black text-green-400">$${totalInterestSaved.toFixed(2)}</p>
            </div>
            <div class="space-y-4">
                ${accounts.map(acc => `
                    <div class="flex justify-between items-center py-3 border-b border-white/5 last:border-0 text-left">
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-slate-300 uppercase tracking-tighter">${acc.name}</span>
                            <span class="text-[10px] text-slate-500 italic font-medium">Total Applied: $${acc.paidToday.toFixed(2)}</span>
                        </div>
                        <span class="text-sm font-black ${acc.balance === 0 ? 'text-green-400' : 'text-white'}">
                            ${acc.balance === 0 ? 'PAID OFF 🎉' : 'Bal: $' + acc.balance.toFixed(2)}
                        </span>
                    </div>
                `).join('')}
                <div class="pt-6 mt-2 border-t border-white/20 text-center">
                    <span class="text-[10px] font-black uppercase text-slate-400 block mb-1 tracking-widest">Total Combined Debt Remaining</span>
                    <span class="text-3xl font-black text-blue-100">$${grandTotalRemaining.toFixed(2)}</span>
                </div>
            </div>
        </div>`;

    resultList.innerHTML = html;
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
});