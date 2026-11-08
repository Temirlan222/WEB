'use strict';
// Plain JavaScript owns the About page guide; Contacts DOM lives in contacts.jquery.js.
(function () {
    const pages = [
        {title: 'Home', url: 'index.html', text: 'Choose a category, continue your saved list and compare its total with your budget.'},
        {title: 'Products', url: 'products.html', text: 'Search 50 products, filter by category or your cart, prepare an enquiry and download a shopping list.'},
        {title: 'Cart', url: 'prices.html', text: 'Change quantities, remove items and review the estimated total before continuing to delivery information.'},
        {title: 'Order and delivery', url: 'delivery.html', text: 'Prepare a local delivery or pickup plan. This site does not submit a real order or collect a payment.'},
        {title: 'Contacts', url: 'contacts.html', text: 'Find the address, phone and listed hours; prepare and download a question for the store.'},
        {title: 'About this site', url: 'colophon.html', text: 'Find the right page using this guide and learn how the site works.'}
    ];
    const host = document.querySelector('.page-colophon .site-information');
    if (!host) return;
    function make(tag, text, classes) {
        const element = document.createElement(tag);
        element.textContent = text;
        element.className = classes || '';
        return element;
    }
    // Update existing outdated copy; the frozen HTML source remains unchanged.
    host.querySelectorAll('p')[1].textContent = 'The site uses HTML, Bootstrap and a small colour stylesheet. Plain JavaScript builds this guide and the Home budget; jQuery handles the product catalogue and enquiry forms. The menu uses the Bootstrap bundle. Files open directly in a browser, with internet access for the CDN libraries. No real payment or order is submitted.';
    const heading = make('h3', 'Find the page you need', 'h5 fw-bold mt-4');
    const label = make('label', 'Search pages by name or purpose', 'form-label');
    label.htmlFor = 'site-page-search';
    const search = make('input', '', 'form-control mb-2');
    search.id = 'site-page-search';
    search.type = 'search';
    const reset = make('button', 'Show all pages', 'btn btn-outline-success btn-sm mb-2');
    reset.id = 'site-page-reset';
    reset.type = 'button';
    const count = make('p', '', 'small');
    count.id = 'site-page-count';
    count.setAttribute('role', 'status');
    const list = make('ul', '', 'list-group');
    list.id = 'site-page-list';
    const empty = make('p', 'No page matches. Change the search or choose Show all pages.', 'd-none');
    empty.id = 'site-page-empty';
    host.append(heading, label, search, reset, count, list, empty);
    function matchingPages(query) {
        const text = query.trim().toLowerCase();
        return pages.filter(function (page) { return (page.title + ' ' + page.text).toLowerCase().includes(text); });
    }
    function renderPages(items) {
        list.replaceChildren();
        for (const page of items) {
            const item = make('li', '', 'list-group-item');
            const link = make('a', page.title, 'fw-bold');
            link.href = page.url;
            item.append(link, make('p', page.text, 'small mb-0'));
            list.append(item);
        }
        count.textContent = items.length + ' of ' + pages.length + ' pages';
        empty.classList.toggle('d-none', items.length !== 0);
    }
    search.addEventListener('input', function () { renderPages(matchingPages(search.value)); });
    reset.addEventListener('click', function () {
        search.value = '';
        renderPages(matchingPages(search.value));
        search.focus();
    });
    renderPages(matchingPages(''));
    const example = document.querySelector('.editing-notes pre');
    const toggle = make('button', 'Hide telephone link example', 'btn btn-outline-success btn-sm mb-2');
    toggle.id = 'toggle-phone-example';
    toggle.type = 'button';
    example.id = 'phone-link-example';
    toggle.setAttribute('aria-controls', example.id);
    toggle.setAttribute('aria-expanded', 'true');
    example.before(toggle);
    toggle.addEventListener('click', function () {
        const hidden = example.classList.toggle('d-none');
        toggle.textContent = hidden ? 'Show telephone link example' : 'Hide telephone link example';
        toggle.setAttribute('aria-expanded', String(!hidden));
    });
})();
