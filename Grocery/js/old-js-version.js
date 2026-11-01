'use strict';

// Assignment 6 comparison only: the original plain-JavaScript version.
// Saved from 3c83c69336164c918538f859eb6a52d50596f181; this file is deliberately NOT linked to any page.


// ===== Original js/store.js =====
'use strict';

// Recorded project prices, not live prices or stock promises.
const storeProducts = [
    { id: 'milk', name: 'Milk "Lactel"', category: 'dairy', unit: '1 L', price: 846, image: 'images/catalog/milk.webp' },
    { id: 'bread', name: 'Bread', category: 'food', unit: '1 piece', price: 230, image: 'images/catalog/bread.jpg' },
    { id: 'apples', name: 'Apples', category: 'produce', unit: '1 kg', price: 672, image: 'images/catalog/apples.jpg' },
    { id: 'twix', name: 'Chocolate "Twix"', category: 'sweets', unit: '1 piece', price: 435, image: 'images/catalog/twix.jpg' },
    { id: 'juice', name: 'Juice "Rich"', category: 'beverages', unit: '1 L', price: 1335, image: 'images/catalog/juice.jpg' },
    { id: 'chips', name: 'Potato Chips "Lays"', category: 'snacks', unit: '1 pack', price: 1100, image: 'images/catalog/chips.jpg' },
    { id: 'ariel', name: 'Laundry Detergent "Ariel"', category: 'household', unit: '1 pack', price: 5100, image: 'images/catalog/ariel.jpg' },
    { id: 'sausage', name: 'Sausage', category: 'meat', unit: '1 pack', price: 2000, image: 'images/catalog/sausage.webp' }
];

function findProduct(id) {
    return storeProducts.find(function (product) {
        return product.id === id;
    });
}

function filterProducts(items, search, category) {
    const query = search.trim().toLowerCase();
    return items.filter(function (product) {
        const matchesText = product.name.toLowerCase().includes(query);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesText && matchesCategory;
    });
}

function validQuantity(value) {
    if (typeof value !== 'number' && typeof value !== 'string') {
        return false;
    }
    const quantity = Number(value);
    return Number.isInteger(quantity) && quantity >= 1 && quantity <= 999;
}

function normalizeCart(items) {
    const result = [];
    if (!Array.isArray(items)) {
        return result;
    }
    for (const item of items) {
        if (!item || !findProduct(item.id) || !validQuantity(item.quantity)) {
            continue;
        }
        const existing = result.find(function (line) { return line.id === item.id; });
        if (existing) {
            existing.quantity = Math.min(999, existing.quantity + Number(item.quantity));
        } else {
            result.push({ id: item.id, quantity: Number(item.quantity) });
        }
    }
    return result;
}

function changeQuantity(cart, id, quantity) {
    const result = normalizeCart(cart);
    if (!findProduct(id)) {
        return result;
    }
    if (quantity === 0) {
        return result.filter(function (line) { return line.id !== id; });
    }
    if (!validQuantity(quantity)) {
        return result;
    }
    const line = result.find(function (item) { return item.id === id; });
    if (line) {
        line.quantity = Number(quantity);
    } else {
        result.push({ id: id, quantity: Number(quantity) });
    }
    return result;
}

function addItem(cart, id) {
    const line = normalizeCart(cart).find(function (item) { return item.id === id; });
    const quantity = line ? line.quantity + 1 : 1;
    return changeQuantity(cart, id, quantity);
}

function cartTotals(cart) {
    let quantity = 0;
    let total = 0;
    for (const line of normalizeCart(cart)) {
        const product = findProduct(line.id);
        quantity += line.quantity;
        total += product.price * line.quantity;
    }
    return { quantity: quantity, total: total };
}

function formatMoney(amount) {
    return new Intl.NumberFormat('en-US').format(amount) + ' ₸';
}

function makeReference() {
    return 'DEMO-' + Math.floor(100000 + Math.random() * 900000);
}

function formatDate(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

function today() {
    return formatDate(new Date());
}

function validDate(value) {
    const parsed = new Date(value + 'T00:00:00');
    return !Number.isNaN(parsed.getTime()) && formatDate(parsed) === value;
}

function validateRequest(values, currentDate) {
    const errors = {};
    const name = String(values.name || '').trim();
    const email = String(values.email || '').trim();
    const phone = String(values.phone || '').trim();
    const product = String(values.product || '').trim();
    const date = String(values.date || '');
    const categories = ['dairy', 'food', 'produce', 'accessories', 'beverages', 'snacks', 'sweets', 'meat', 'household'];
    if (name.length < 2 || name.length > 100) {
        errors.name = 'Enter a name with 2 to 100 characters.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Enter a valid email address.';
    }
    const digits = phone.replace(/\D/g, '');
    if (values.method === 'phone' && phone === '') {
        errors.phone = 'Enter a phone number when choosing phone contact.';
    } else if (phone !== '' && (!/^\+?[\d\s()-]+$/.test(phone) || digits.length < 10 || digits.length > 15)) {
        errors.phone = 'Enter a valid phone number with 10 to 15 digits.';
    }
    if (product.length === 0 || product.length > 100) {
        errors.product = 'Enter a product name with 1 to 100 characters.';
    }
    if (!validQuantity(values.quantity)) {
        errors.quantity = 'Enter a whole quantity from 1 to 999.';
    }
    if (date !== '' && (!validDate(date) || date < currentDate)) {
        errors.date = 'Choose today or a future date.';
    }
    if (!categories.includes(values.category)) {
        errors.category = 'Choose a product category.';
    }
    if (values.method !== 'email' && values.method !== 'phone') {
        errors.method = 'Choose email or phone contact.';
    }
    if (values.permission !== true) {
        errors.permission = 'Confirm that you understand this is a demonstration.';
    }
    if (String(values.comment || '').length > 1000) {
        errors.comment = 'Keep your comment within 1000 characters.';
    }
    return errors;
}

function makeElement(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className || '';
    return element;
}

window.Lido = {
    products: storeProducts,
    cart: [],
    findProduct: findProduct,
    filterProducts: filterProducts,
    validQuantity: validQuantity,
    normalizeCart: normalizeCart,
    changeQuantity: changeQuantity,
    addItem: addItem,
    cartTotals: cartTotals,
    formatMoney: formatMoney,
    makeReference: makeReference,
    today: today,
    validateRequest: validateRequest,
    makeElement: makeElement
};


// ===== Original js/main.js =====
'use strict';

function setupSharedCart() {
    const store = window.Lido;
    if (!store) return;
    const make = store.makeElement;

    try {
        store.cart = store.normalizeCart(JSON.parse(localStorage.getItem('lido-cart')));
    } catch (error) {
        store.cart = [];
    }

    // Store only product ids and quantities, never the request form's details.
    store.saveCart = function () {
        store.cart = store.normalizeCart(store.cart);
        try {
            localStorage.setItem('lido-cart', JSON.stringify(store.cart));
        } catch (error) {
            // The current page still works if browser storage is unavailable.
        }
        window.dispatchEvent(new Event('cart-updated'));
    };
    store.addToCart = function (id) {
        const before = store.cartTotals(store.cart).quantity;
        store.cart = store.addItem(store.cart, id);
        store.saveCart();
        return store.cartTotals(store.cart).quantity > before;
    };
    store.setCartQuantity = function (id, quantity) {
        store.cart = store.changeQuantity(store.cart, id, quantity);
        store.saveCart();
    };
    store.clearCart = function () {
        store.cart = [];
        store.saveCart();
    };

    const linkRow = make('p', '', 'mb-3');
    const link = make('a', '', 'btn btn-outline-success btn-sm');
    link.id = 'cart-link';
    link.href = 'products.html#request-result';
    linkRow.append(link);
    document.querySelector('main').prepend(linkRow);

    function updateCartLink() {
        link.textContent = 'Shopping cart (' + store.cartTotals(store.cart).quantity + ')';
    }
    window.addEventListener('cart-updated', updateCartLink);
    updateCartLink();

    const currentPage = location.pathname.split('/').pop() || 'index.html';
    for (const navLink of document.querySelectorAll('nav a')) {
        const active = navLink.getAttribute('href') === currentPage;
        navLink.classList.toggle('active', active);
        if (active) navLink.setAttribute('aria-current', 'page');
        else navLink.removeAttribute('aria-current');
    }

    // Keep price-table anchors without changing the frozen midterm HTML.
    for (const row of document.querySelectorAll('tbody tr')) {
        const product = store.products.find(function (item) {
            return row.cells[0].textContent.trim() === item.name;
        });
        if (product) row.id = 'price-' + product.id;
    }

    const result = document.getElementById('request-result');
    if (!result) return;
    for (const message of result.querySelectorAll('.result-pending, .result-confirmation')) {
        message.remove();
    }
    document.getElementById('result-title').textContent = 'Cart and request result';
    const cart = make('section', '', 'mb-4 pb-4 border-bottom');
    cart.id = 'shopping-cart';
    cart.setAttribute('aria-labelledby', 'cart-title');
    const title = make('h4', 'Shopping cart', 'h5 fw-bold');
    title.id = 'cart-title';
    const notice = make('p', 'Example prices only. This cart demonstrates calculations; checkout does not send an order or take payment.', 'small');
    const empty = make('p', 'Your cart is empty. Add a product from the catalogue.');
    empty.id = 'cart-empty';
    const items = make('ul', '', 'list-unstyled');
    items.id = 'cart-items';
    const quantity = make('p', '', 'mb-1');
    quantity.id = 'cart-quantity';
    const total = make('p', '', 'fw-bold');
    total.id = 'cart-total';
    const actions = make('div', '', 'd-flex flex-wrap gap-2');
    const clear = make('button', 'Clear cart', 'btn btn-outline-success');
    clear.id = 'cart-clear';
    clear.type = 'button';
    const checkout = make('button', 'Demo checkout', 'btn btn-success');
    checkout.id = 'cart-checkout';
    checkout.type = 'button';
    const confirmation = make('div', '', 'success rounded p-3 mt-3');
    confirmation.id = 'cart-confirmation';
    confirmation.setAttribute('role', 'status');
    confirmation.tabIndex = -1;
    confirmation.classList.add('hidden');
    actions.append(clear, checkout);
    cart.append(title, notice, empty, items, quantity, total, actions, confirmation);
    result.insertBefore(cart, document.getElementById('request-summary'));

    function lineButton(action, text, product, disabled) {
        const button = make('button', text, 'btn btn-outline-success btn-sm');
        button.type = 'button';
        button.dataset.cartAction = action;
        button.dataset.productId = product.id;
        button.setAttribute('aria-label', action + ' ' + product.name);
        button.disabled = disabled;
        return button;
    }

    function renderCart() {
        items.replaceChildren();
        confirmation.classList.add('hidden');
        confirmation.replaceChildren();
        for (const line of store.cart) {
            const product = store.findProduct(line.id);
            const item = make('li', '', 'border-bottom py-3');
            const description = make('p', product.name + ' (' + product.unit + ') - ' + store.formatMoney(product.price) + ' each', 'mb-1');
            const subtotal = make('p', 'Quantity: ' + line.quantity + ' | Subtotal: ' + store.formatMoney(product.price * line.quantity), 'mb-2');
            const buttons = make('div', '', 'd-flex flex-wrap gap-2');
            buttons.append(
                lineButton('decrease', '-', product, line.quantity === 1),
                lineButton('increase', '+', product, line.quantity === 999),
                lineButton('remove', 'Remove', product, false)
            );
            item.append(description, subtotal, buttons);
            items.append(item);
        }
        const totals = store.cartTotals(store.cart);
        quantity.textContent = 'Total quantity: ' + totals.quantity + ' listed unit(s)';
        total.textContent = 'Total: ' + store.formatMoney(totals.total);
        empty.classList.toggle('hidden', totals.quantity !== 0);
        clear.disabled = totals.quantity === 0;
        checkout.disabled = totals.quantity === 0;
    }

    items.addEventListener('click', function (event) {
        const button = event.target.closest('[data-cart-action]');
        if (!button) return;
        const line = store.cart.find(function (item) { return item.id === button.dataset.productId; });
        if (!line) return;
        const action = button.dataset.cartAction;
        const next = action === 'remove' ? 0 : line.quantity + (action === 'increase' ? 1 : -1);
        store.setCartQuantity(line.id, next);
        // Rendering replaces the buttons; keep keyboard focus in the task.
        const sameAction = items.querySelector('[data-product-id="' + line.id + '"][data-cart-action="' + action + '"]:not(:disabled)');
        const nextControl = sameAction || items.querySelector('button:not(:disabled)') || document.getElementById('catalogue-search');
        nextControl.focus();
    });
    clear.addEventListener('click', function () {
        store.clearCart();
        document.getElementById('catalogue-search').focus();
    });
    checkout.addEventListener('click', function () {
        const totals = store.cartTotals(store.cart);
        if (totals.quantity === 0) return;
        const summary = make('ul', '', 'mb-2');
        for (const line of store.cart) {
            const product = store.findProduct(line.id);
            summary.append(make('li', product.name + ' (' + product.unit + ') x ' + line.quantity + ' = ' + store.formatMoney(product.price * line.quantity)));
        }
        store.clearCart();
        confirmation.append(
            make('p', 'Demo reference: ' + store.makeReference(), 'fw-bold mb-2'),
            summary,
            make('p', 'Total: ' + store.formatMoney(totals.total) + ' for ' + totals.quantity + ' listed unit(s).', 'mb-2'),
            make('p', 'Demonstration only. No data was sent, no real order was created and no payment was taken. The cart has been cleared.', 'mb-0')
        );
        confirmation.classList.remove('hidden');
        confirmation.focus();
    });
    window.addEventListener('cart-updated', renderCart);
    renderCart();
}

setupSharedCart();


// ===== Original js/products.js =====
'use strict';

function setupProductsPage() {
    const gallery = document.getElementById('product-gallery');
    if (!gallery || !window.Lido) return;

    const store = window.Lido;
    const make = store.makeElement;
    const categories = [
        ['all', 'All categories'], ['dairy', 'Dairy'], ['food', 'Food products'],
        ['produce', 'Fruit and vegetables'], ['sweets', 'Sweets'],
        ['beverages', 'Beverages'], ['snacks', 'Snacks'],
        ['household', 'Household cleaning'], ['meat', 'Meat']
    ];
    const shopPhotos = Array.from(gallery.querySelectorAll(':scope > div'));
    const title = make('h2', 'Food & Household Products', 'h3 fw-bold col-12');
    const note = make('p', 'Recorded example prices per listed unit. Check current price and availability with Lido.', 'col-12 mb-0');
    const controls = make('div', '', 'col-12');
    const fields = make('div', '', 'row g-3 align-items-end');
    const searchField = make('div', '', 'col-12 col-md-6');
    const searchLabel = make('label', 'Search products', 'form-label');
    searchLabel.htmlFor = 'catalogue-search';
    const search = make('input', '', 'form-control');
    search.type = 'search';
    search.id = 'catalogue-search';
    search.placeholder = 'Example: milk';
    const categoryField = make('div', '', 'col-12 col-md-6');
    const categoryLabel = make('label', 'Category', 'form-label');
    categoryLabel.htmlFor = 'catalogue-category';
    const category = make('select', '', 'form-select');
    category.id = 'catalogue-category';
    for (const item of categories) {
        const option = make('option', item[1]);
        option.value = item[0];
        category.append(option);
    }
    const reset = make('button', 'Reset filters', 'btn btn-outline-success mt-3');
    reset.id = 'catalogue-reset';
    reset.type = 'button';
    const count = make('p', '', 'col-12 mb-0');
    count.id = 'catalogue-count';
    count.setAttribute('role', 'status');
    const feedback = make('p', '', 'col-12 mb-0');
    feedback.id = 'catalogue-feedback';
    feedback.setAttribute('role', 'status');
    const cartLink = make('a', 'View cart and check totals', 'col-12 link-success');
    cartLink.href = '#shopping-cart';
    const empty = make('p', 'No products match. Change your search or choose Reset filters.', 'col-12');
    empty.id = 'catalogue-empty';
    const results = make('div', '', 'col-12 row g-3 m-0 px-0');
    results.id = 'catalogue-results';
    results.tabIndex = -1;
    searchField.append(searchLabel, search);
    categoryField.append(categoryLabel, category);
    fields.append(searchField, categoryField);
    controls.append(fields, reset);
    gallery.replaceChildren(title, note, controls, count, feedback, cartLink, empty, results);

    // Keep our original store photos available below the product catalogue.
    if (shopPhotos.length > 0) {
        const photos = make('details', '', 'col-12 mt-4');
        const summary = make('summary', 'Inside Lido: our store photos', 'fw-bold');
        const photoRow = make('div', '', 'row g-3 mt-1');
        photoRow.append(...shopPhotos);
        photos.append(summary, photoRow);
        gallery.append(photos);
    }

    const categorySection = document.getElementById('product-categories');
    if (categorySection) {
        const heading = make('h2', 'Product categories', 'h3 fw-bold');
        const explanation = make('p', 'Choose a category in the catalogue to see its recorded products. The department descriptions below describe the wider store range.');
        const filterLink = make('a', 'Go to catalogue filters', 'btn btn-outline-success');
        filterLink.href = '#catalogue-search';
        categorySection.replaceChildren(heading, explanation, filterLink);
    }

    function updateSelectedCards() {
        for (const card of results.querySelectorAll('[data-product-id]')) {
            const selected = store.cart.some(function (item) {
                return item.id === card.dataset.productId;
            });
            card.classList.toggle('selected', selected);
            card.querySelector('[data-add-product]').textContent = selected ? 'Add another to cart' : 'Add to cart';
        }
    }

    function addProduct(product) {
        const added = store.addToCart(product.id);
        feedback.textContent = added
            ? product.name + ' added to your cart. Use View cart to check quantities and totals.'
            : 'Could not add another ' + product.name + '. Check its quantity in your cart.';
    }

    function renderCatalogue(items) {
        results.replaceChildren();
        count.textContent = items.length + ' of ' + store.products.length + ' products shown';
        empty.classList.toggle('hidden', items.length !== 0);
        for (const product of items) {
            const column = make('div', '', 'col-12 col-md-6 col-lg-3');
            const card = make('article', '', 'product-card card h-100 shadow-sm');
            card.dataset.productId = product.id;
            const body = make('div', '', 'card-body d-flex flex-column');
            const image = make('img', '', 'img-fluid w-100 object-fit-contain rounded mb-3');
            image.src = product.image;
            image.alt = product.name + ', product example';
            image.width = 200;
            image.height = 160;
            const name = make('h3', product.name, 'card-title h5 fw-bold');
            const price = make('p', store.formatMoney(product.price) + ' / ' + product.unit, 'card-text');
            const add = make('button', 'Add to cart', 'btn btn-success mt-auto');
            add.type = 'button';
            add.dataset.addProduct = product.id;
            add.setAttribute('aria-label', 'Add ' + product.name + ' to cart');
            add.addEventListener('click', function () { addProduct(product); });
            body.append(image, name, price, add);
            card.append(body);
            column.append(card);
            results.append(column);
        }
        updateSelectedCards();
    }

    function applyFilters() {
        renderCatalogue(store.filterProducts(store.products, search.value, category.value));
    }

    function resetFilters() {
        search.value = '';
        category.value = 'all';
        feedback.textContent = '';
        applyFilters();
        search.focus();
    }

    search.addEventListener('input', applyFilters);
    category.addEventListener('change', applyFilters);
    reset.addEventListener('click', resetFilters);
    window.addEventListener('cart-updated', updateSelectedCards);
    applyFilters();
}

setupProductsPage();


// ===== Original js/request.js =====
'use strict';

function setupRequestForm() {
    const form = document.getElementById('product-request-form');
    if (!form || !window.Lido) {
        return;
    }

    const fields = [
        { key: 'name', ids: ['customer-name'], errorId: 'customer-name-error' },
        { key: 'email', ids: ['customer-email'], errorId: 'customer-email-error' },
        { key: 'phone', ids: ['customer-phone'], errorId: 'customer-phone-error' },
        { key: 'product', ids: ['product-name'], errorId: 'product-name-error' },
        { key: 'quantity', ids: ['quantity'], errorId: 'quantity-error' },
        { key: 'date', ids: ['request-date'], errorId: 'request-date-error' },
        { key: 'category', ids: ['category'], errorId: 'category-error' },
        { key: 'method', ids: ['contact-email', 'contact-phone'], errorId: 'contact-method-error' },
        { key: 'permission', ids: ['contact-permission'], errorId: 'contact-permission-error' },
        { key: 'comment', ids: ['request-comment'], errorId: 'request-comment-error' }
    ];
    const summary = document.getElementById('request-summary');
    const confirmation = document.getElementById('request-confirmation');
    confirmation.tabIndex = -1;
    const errorSummary = document.getElementById('request-error');
    const comment = document.getElementById('request-comment');
    let counter = document.getElementById('comment-counter');
    let hasValidated = false;

    form.noValidate = true;
    document.getElementById('request-date').min = Lido.today();
    document.getElementById('request-status').textContent =
        'JavaScript checks your entries on this page. Nothing is sent to a server, saved, or placed in the page URL. No order is created.';

    if (!counter) {
        counter = Lido.makeElement('small', '', 'small d-block');
        counter.id = 'comment-counter';
        comment.insertAdjacentElement('afterend', counter);
    }
    addDescription(comment, counter.id);
    fields.forEach(prepareFeedback);
    showInstructions();
    hideMessage(confirmation);
    hideMessage(errorSummary);
    updateCounter();

    form.addEventListener('submit', submitRequest);
    form.addEventListener('input', editRequest);
    form.addEventListener('change', editRequest);
    form.addEventListener('reset', resetRequest);

    function addDescription(control, id) {
        const descriptions = (control.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
        if (!descriptions.includes(id)) {
            descriptions.push(id);
        }
        control.setAttribute('aria-describedby', descriptions.join(' '));
    }

    function prepareFeedback(field) {
        const feedback = document.getElementById(field.errorId) ||
            Lido.makeElement('small', '', 'small d-block text-break');
        if (!feedback.parentElement) {
            feedback.id = field.errorId;
            document.getElementById(field.ids[0]).parentElement.appendChild(feedback);
        }
        feedback.hidden = true;
        field.ids.forEach(function describeField(id) {
            addDescription(document.getElementById(id), field.errorId);
        });
    }

    function collectValues() {
        const contact = form.querySelector('input[name="contact-method"]:checked');
        return {
            name: document.getElementById('customer-name').value.trim(),
            email: document.getElementById('customer-email').value.trim(),
            phone: document.getElementById('customer-phone').value.trim(),
            product: document.getElementById('product-name').value.trim(),
            quantity: document.getElementById('quantity').value,
            date: document.getElementById('request-date').value,
            category: document.getElementById('category').value,
            method: contact ? contact.value : '',
            permission: document.getElementById('contact-permission').checked,
            comment: comment.value.trim()
        };
    }

    function updateCounter() {
        counter.textContent = comment.value.length + ' / 1000 characters';
    }

    function hideMessage(element) {
        element.textContent = '';
        element.hidden = true;
        element.classList.add('hidden');
    }

    function addSummaryRow(label, value) {
        summary.appendChild(Lido.makeElement('dt', label, 'col-12 col-md-4'));
        summary.appendChild(Lido.makeElement('dd', value, 'col-12 col-md-8 text-break'));
    }

    function showInstructions() {
        summary.replaceChildren();
        addSummaryRow('Prepare a request', 'Enter your name, email, product and quantity, then choose a contact method and acknowledge the demo notice.');
        addSummaryRow('Check your details', 'Choose Check request to validate the fields and review a local summary. Nothing is sent to the shop.');
    }

    function showFeedback(errors) {
        fields.forEach(function updateField(field) {
            const feedback = document.getElementById(field.errorId);
            const invalid = Boolean(errors[field.key]);
            feedback.textContent = invalid ? 'Error: ' + errors[field.key] : 'Valid.';
            feedback.hidden = false;
            feedback.classList.toggle('error', invalid);
            feedback.classList.toggle('success', !invalid);
            field.ids.forEach(function updateControl(id) {
                const control = document.getElementById(id);
                control.setAttribute('aria-invalid', String(invalid));
                control.classList.toggle('is-invalid', invalid);
                control.classList.toggle('is-valid', !invalid);
            });
        });
        const messages = Object.values(errors);
        if (messages.length) {
            errorSummary.textContent = 'Please correct ' + messages.length + ' field(s): ' + messages.join(' ');
            errorSummary.classList.remove('hidden');
            errorSummary.hidden = false;
        } else {
            hideMessage(errorSummary);
        }
    }

    function submitRequest(event) {
        event.preventDefault();
        hasValidated = true;
        const values = collectValues();
        const errors = Lido.validateRequest(values, Lido.today());
        showFeedback(errors);
        hideMessage(confirmation);

        const firstInvalid = fields.find(function findInvalid(field) {
            return Boolean(errors[field.key]);
        });
        if (firstInvalid) {
            showInstructions();
            document.getElementById(firstInvalid.ids[0]).focus();
            return;
        }

        summary.replaceChildren();
        addSummaryRow('Name', values.name);
        addSummaryRow('Product', values.product);
        addSummaryRow('Quantity', values.quantity);
        const category = document.getElementById('category');
        addSummaryRow('Category', category.options[category.selectedIndex].textContent);
        addSummaryRow('Preferred date', values.date || 'Not specified');
        addSummaryRow('Email', values.email);
        if (values.phone) {
            addSummaryRow('Phone', values.phone);
        }
        addSummaryRow('Preferred contact', values.method === 'phone' ? 'Phone' : 'Email');
        addSummaryRow('Additional information', values.comment || 'None');
        confirmation.textContent = 'Demo: your details passed the checks on this page. No data was sent to a server or the shop, and no order was created.';
        confirmation.classList.remove('hidden');
        confirmation.hidden = false;
        confirmation.focus();
    }

    function editRequest(event) {
        if (!event.target.matches('input, select, textarea')) {
            return;
        }
        updateCounter();
        hideMessage(confirmation);
        showInstructions();
        if (hasValidated) {
            showFeedback(Lido.validateRequest(collectValues(), Lido.today()));
        }
    }

    function resetRequest() {
        hasValidated = false;
        fields.forEach(function clearField(field) {
            const feedback = document.getElementById(field.errorId);
            feedback.textContent = '';
            feedback.hidden = true;
            feedback.classList.remove('error', 'success');
            field.ids.forEach(function clearControl(id) {
                const control = document.getElementById(id);
                control.removeAttribute('aria-invalid');
                control.classList.remove('is-invalid', 'is-valid');
            });
        });
        hideMessage(errorSummary);
        hideMessage(confirmation);
        showInstructions();
        counter.textContent = '0 / 1000 characters';
    }
}

setupRequestForm();


// ===== Original Shalkar Contacts features (plain JavaScript) =====
// Comparison only. The active versions are rewritten in contacts.js with jQuery.

function setupContactTranslationOld() {
    const review = document.querySelector('.customer-review');
    const translation = document.createElement('p');
    const button = document.createElement('button');

    translation.id = 'review-translation';
    translation.className = 'alert alert-light border mt-3';
    translation.lang = 'en';
    translation.textContent = 'Good shop with reasonable prices and kind owners.';
    translation.hidden = true;

    button.id = 'toggle-review';
    button.className = 'btn btn-outline-success btn-sm';
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'review-translation');
    button.textContent = 'Show English translation';

    review.querySelector('blockquote').after(translation, button);
    button.addEventListener('click', function () {
        const willShow = translation.hidden;
        translation.hidden = !willShow;
        button.classList.toggle('active', willShow);
        button.setAttribute('aria-expanded', String(willShow));
        button.textContent = willShow ? 'Hide English translation' : 'Show English translation';
    });
}

function setupHelpfulReviewOld() {
    const translationButton = document.getElementById('toggle-review');
    const button = document.createElement('button');
    let helpful = false;

    try {
        helpful = window.localStorage.getItem('lido-contact-review-helpful') === 'true';
    } catch (error) {
        helpful = false;
    }

    function update() {
        button.classList.toggle('active', helpful);
        button.setAttribute('aria-pressed', String(helpful));
        button.textContent = helpful ? 'Helpful 1' : 'Helpful 0';
    }

    button.id = 'helpful-review';
    button.className = 'btn btn-outline-success btn-sm ms-2';
    button.type = 'button';
    translationButton.after(button);
    update();

    button.addEventListener('click', function () {
        helpful = !helpful;
        update();
        try {
            window.localStorage.setItem('lido-contact-review-helpful', String(helpful));
        } catch (error) {
            // The button still works without storage.
        }
    });
}

function setupPhoneCopyOld() {
    const actions = document.getElementById('contact-actions');
    const button = document.createElement('button');
    const status = document.createElement('span');

    button.className = 'btn btn-outline-success btn-sm';
    button.type = 'button';
    button.dataset.phone = '+77479052505';
    button.textContent = 'Copy phone number';
    status.className = 'small text-success';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    actions.append(button, status);

    button.addEventListener('click', async function () {
        const phone = button.dataset.phone;
        try {
            await navigator.clipboard.writeText(phone);
            status.textContent = 'Phone copied.';
            button.textContent = 'Copied ✓';
        } catch (error) {
            status.textContent = 'Use ' + phone + '.';
        }
    });
}

setupContactTranslationOld();
setupHelpfulReviewOld();
setupPhoneCopyOld();
