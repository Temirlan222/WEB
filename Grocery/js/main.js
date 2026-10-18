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
