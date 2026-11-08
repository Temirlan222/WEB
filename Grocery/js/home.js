'use strict';
// Plain JavaScript only: category guide and saved shopping-list budget on Home.
// store.js loads first; defer makes the existing HTML available here.
(function () {
    const store = window.Lido;
    const host = document.getElementById('products-summary');
    if (!store || !host) return;

    function make(tag, text, classes) {
        const element = document.createElement(tag);
        element.textContent = text;
        element.className = classes || '';
        return element;
    }
    const guide = make('div', '', 'row g-3 mb-3');
    guide.id = 'home-category-list';
    for (const category of store.categories) {
        const column = make('div', '', 'col-12 col-md-6 col-lg-4');
        const link = make('a', category.label + ' (10 products)', 'btn btn-outline-success w-100');
        link.href = 'products.html?category=' + category.id + '#product-gallery';
        column.append(link);
        guide.append(column);
    }
    host.append(guide);
    const websiteNote = document.querySelector('#website-summary p');
    if (websiteNote) websiteNote.textContent = 'Store information and photographs come from the team visit. Catalogue names and reference prices come from Galmart Astana listings recorded on 2 November 2026. Confirm current prices and availability with Lido. This site prepares a local shopping list, not an online order.';
    const section = make('section', '', 'border rounded bg-white p-3 mb-3');
    section.setAttribute('aria-label', 'Continue your saved shopping list');
    section.append(make('h3', 'Continue your shopping list', 'h5 fw-bold'));
    const summary = make('p', '');
    summary.id = 'home-saved-summary';
    const label = make('label', 'Optional shopping budget (KZT)', 'form-label');
    label.htmlFor = 'home-budget';
    const budget = document.createElement('input');
    budget.id = 'home-budget';
    budget.type = 'number';
    budget.min = '0';
    budget.step = '1';
    budget.className = 'form-control mb-2';
    const result = make('p', '', 'small mb-2');
    result.id = 'home-budget-result';
    result.setAttribute('role', 'status');
    const link = make('a', 'Continue shopping', 'btn btn-success');
    link.href = 'products.html#shopping-cart';
    section.append(summary, label, budget, result, link);
    host.append(section);

    function readCart() {
        try { return store.normalizeCart(JSON.parse(localStorage.getItem('lido-cart'))); }
        catch (error) { return []; }
    }
    function updateSummary() {
        const totals = store.cartTotals(readCart());
        summary.textContent = totals.quantity ? totals.quantity + ' units saved. Reference total: ' + store.formatMoney(totals.total) : 'No saved products yet. Choose a category to start.';
        result.classList.remove('error', 'success');
        if (budget.value === '') { result.textContent = 'Enter a budget to compare it with your saved list.'; return; }
        const amount = Number(budget.value);
        if (!Number.isInteger(amount) || amount < 0) {
            result.textContent = 'Enter a whole budget of zero or more.';
            result.classList.add('error');
            return;
        }
        const remaining = amount - totals.total;
        result.textContent = remaining >= 0 ? store.formatMoney(remaining) + ' left in your budget.' : store.formatMoney(-remaining) + ' above your budget. Edit your list before visiting.';
        result.classList.add(remaining >= 0 ? 'success' : 'error');
    }
    budget.addEventListener('input', updateSummary);
    window.addEventListener('storage', updateSummary);
    window.addEventListener('pageshow', updateSummary);
    updateSummary();
})();
