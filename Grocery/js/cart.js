'use strict';

// plain JavaScript owns this page. Shared product data lives in store.js.
(function () {
    const store = window.Lido;
    const main = document.querySelector('main');
    let cart = store.cart;


    function make(tag, text, classes) {
        const element = document.createElement(tag);
        element.textContent = text;
        element.className = classes || '';
        return element;
    }

    const storageNotice = document.getElementById('storage-notice');
    main.innerHTML = `
        <p class="eyebrow">YOUR NEXT SHOP, SORTED</p>
        <h1 class="display-5 fw-bold mb-3" id="page-title">Your cart</h1>
        <p class="lead">A little planning, an easier shop. Check your items before you go.</p>
        <div class="row g-4 align-items-start">
            <section class="col-12 col-lg-8" aria-label="Cart items">
                <div class="card bg-white shadow-sm p-3" id="shopping-cart">
                    <h2 class="h4">Shopping list</h2>
                    <p id="cart-empty" class="mb-0">Your cart is empty. Choose a few groceries to get started.</p>
                    <ul id="cart-items" class="list-unstyled mb-0"></ul>
                </div>
                <a class="btn btn-outline-success mt-3" id="continue-shopping" href="products.html#product-gallery">Continue shopping</a>
            </section>
            <section class="col-12 col-lg-4" aria-labelledby="summary-title">
                <div class="card bg-white shadow-sm p-3">
                    <h2 class="h4" id="summary-title">Your shopping total</h2>
                    <p id="cart-quantity" class="mb-2"></p>
                    <p id="cart-total" class="h4 mb-3"></p>
                    <p class="small text-body-secondary">Estimated product total. Delivery charges and availability must be confirmed with Lido.</p>
                    <a id="cart-next" class="btn btn-success" href="delivery.html">Prepare pickup or delivery</a>
                    <button id="cart-checkout" class="btn btn-outline-success mt-2" type="button">Review shopping list</button>
                    <button id="cart-download" class="btn btn-outline-success mt-2" type="button">Download shopping list</button>
                    <button id="cart-clear" class="btn btn-outline-success mt-2" type="button">Clear cart</button>
                </div>
            </section>
        </div>
        <section id="cart-confirmation" class="alert alert-success mt-3" aria-label="Shopping list review" tabindex="-1" hidden></section>
        <p id="cart-status" class="small mt-3 mb-0" role="status" aria-live="polite"></p>
        <p class="small text-body-secondary mt-3">Prices use the existing catalogue: Galmart via Wolt, recorded 2 November 2026.
            These are estimates, not live Lido prices. No payment is taken here.</p>`;

    if (storageNotice) main.prepend(storageNotice);
    const confirmation = main.querySelector('#cart-confirmation');
    const items = main.querySelector('#cart-items');
    const status = main.querySelector('#cart-status');

    function button(action, label, product) {
        const control = make('button', label, 'btn btn-outline-success btn-sm');
        control.type = 'button';
        control.dataset.action = action;
        control.setAttribute('aria-label', label + ' ' + product.englishName);
        return control;
    }

    function render() {
        cart = store.cart;
        confirmation.hidden = true;
        confirmation.replaceChildren();
        // оставляем существующие поля: тогда Tab и клик после ввода не теряются.
        for (const row of Array.from(items.children)) {
            if (!cart.some(line => line.id === row.dataset.id)) {
                if (row.contains(document.activeElement)) main.querySelector('#continue-shopping').focus();
                row.remove();
            }
        }
        for (const line of cart) {
            const product = store.findProduct(line.id);
            const existing = items.querySelector('[data-id="' + line.id + '"]');
            if (existing) {
                existing.querySelector('input').value = line.quantity;
                existing.querySelector('[data-action="decrease"]').disabled = line.quantity === 1;
                existing.querySelector('[data-action="increase"]').disabled = line.quantity === 999;
                existing.lastElementChild.textContent = store.formatMoney(product.price * line.quantity);
                continue;
            }
            const row = make('li', '', 'border-bottom py-3');
            row.dataset.id = line.id;
            const top = make('div', '', 'd-flex gap-3 align-items-center mb-2');
            const image = make('img', '', 'cart-image rounded border');
            image.src = product.image;
            image.alt = product.englishName;
            image.width = 64;
            image.height = 64;
            const description = make('div');
            description.append(
                make('h3', product.englishName, 'h6 mb-1'),
                make('p', product.unit + ' · ' + store.formatMoney(product.price) + ' each', 'small mb-0')
            );
            top.append(image, description);
            const controls = make('div', '', 'd-flex flex-wrap gap-2 align-items-center');
            const decrease = button('decrease', '−', product);
            decrease.setAttribute('aria-label', 'Decrease ' + product.englishName);
            decrease.disabled = line.quantity === 1;
            const increase = button('increase', '+', product);
            increase.setAttribute('aria-label', 'Increase ' + product.englishName);
            increase.disabled = line.quantity === 999;
            const label = make('label', 'Qty', 'small');
            label.htmlFor = 'quantity-' + line.id;
            const input = make('input', '', 'form-control form-control-sm cart-quantity-input');
            input.id = label.htmlFor;
            input.type = 'number';
            input.min = 1;
            input.max = 999;
            input.step = 1;
            input.value = line.quantity;
            input.setAttribute('aria-label', 'Quantity for ' + product.englishName);
            controls.append(decrease, label, input, increase, button('remove', 'Remove', product));
            row.append(top, controls, make('p', store.formatMoney(product.price * line.quantity), 'fw-bold mt-2 mb-0'));
            items.append(row);
        }
        const totals = store.cartTotals(cart);
        main.querySelector('#cart-empty').classList.toggle('d-none', cart.length > 0);
        main.querySelector('#cart-quantity').textContent = totals.quantity + ' unit(s) · ' + cart.length + ' product(s)';
        main.querySelector('#cart-total').textContent = 'Total: ' + store.formatMoney(totals.total);
        for (const id of ['cart-clear', 'cart-checkout', 'cart-download']) {
            main.querySelector('#' + id).disabled = cart.length === 0;
        }
        const next = main.querySelector('#cart-next');
        next.href = cart.length ? 'delivery.html' : 'products.html#product-gallery';
        next.textContent = cart.length ? 'Prepare pickup or delivery' : 'Browse products';
    }

    function save(message) {
        store.cart = cart;
        store.saveCart();
        status.textContent = store.storageAvailable ? message : 'Storage is unavailable. Keep this page open or download your list before leaving.';
    }

    // делегирование работает и для строк, добавленных после загрузки страницы.
    items.addEventListener('click', function (event) {
        const control = event.target.closest('button[data-action]');
        if (!control) return;
        const id = control.closest('[data-id]').dataset.id;
        const line = cart.find(item => item.id === id);
        if (!line) return;
        const action = control.dataset.action;
        const quantity = action === 'remove' ? 0 : line.quantity + (action === 'increase' ? 1 : -1);
        cart = store.changeQuantity(cart, id, quantity);
        save('Cart updated.');
        const row = items.querySelector('[data-id="' + id + '"]');
        const focus = row && (row.querySelector('[data-action="' + action + '"]:not(:disabled)') || row.querySelector('input'));
        (focus || items.querySelector('input') || main.querySelector('#continue-shopping')).focus();
    });

    items.addEventListener('change', function (event) {
        if (!event.target.matches('input[type="number"]')) return;
        const input = event.target;
        const id = input.closest('[data-id]').dataset.id;
        if (!store.validQuantity(input.value)) {
            input.value = cart.find(line => line.id === id).quantity;
            status.textContent = 'Use a whole quantity from 1 to 999. Your previous quantity was kept.';
            return;
        }
        cart = store.changeQuantity(cart, id, Number(input.value));
        save('Quantity updated.');
    });

    main.querySelector('#cart-clear').addEventListener('click', function () {
        cart = [];
        save('Cart cleared. You can start a new shopping list.');
        main.querySelector('#continue-shopping').focus();
    });

    // просмотр и скачивание используют текущие товары из общей корзины.
    function shoppingRows() {
        return store.cart.map(function (line) {
            const product = store.findProduct(line.id);
            return product.name + ' (' + product.unit + ') × ' + line.quantity + ' = ' + store.formatMoney(product.price * line.quantity);
        });
    }
    main.querySelector('#cart-checkout').addEventListener('click', function () {
        if (!store.cart.length) return;
        confirmation.replaceChildren(make('h2', 'Your shopping list is ready to review', 'h4'));
        const list = make('ul', '', 'mb-3');
        for (const text of shoppingRows()) list.append(make('li', text));
        confirmation.append(list, make('p', 'Total: ' + store.formatMoney(store.cartTotals(store.cart).total), 'fw-bold'));
        confirmation.append(make('p', 'Show this list at the shop or call Lido to confirm availability and final prices.', 'mb-0'));
        confirmation.hidden = false;
        confirmation.focus();
    });
    main.querySelector('#cart-download').addEventListener('click', function () {
        if (!store.cart.length) return;
        const rows = shoppingRows();
        rows.push('Total: ' + store.formatMoney(store.cartTotals(store.cart).total));
        rows.push('Recorded reference prices. Confirm final prices and availability with Lido.');
        const url = URL.createObjectURL(new Blob([rows.join('\n')], {type: 'text/plain;charset=utf-8'}));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Lido-shopping-list.txt';
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        status.textContent = 'Shopping list download started.';
    });
    window.addEventListener('cart-updated', render);
    render();
})();
