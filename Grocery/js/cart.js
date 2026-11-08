'use strict';

// Plain JavaScript owns this page. Shared product data lives in store.js.
(function () {
    const store = window.Lido;
    const main = document.querySelector('main');
    let cart = [];
    let storageAvailable = true;

    function readCart() {
        try {
            return store.normalizeCart(JSON.parse(localStorage.getItem('lido-cart')));
        } catch (error) {
            return [];
        }
    }

    function make(tag, text, classes) {
        const element = document.createElement(tag);
        element.textContent = text;
        element.className = classes || '';
        return element;
    }

    document.title = 'Cart | Lido Grocery Store';
    document.querySelector('meta[name="description"]').content = 'Review your grocery list, quantities and estimated total.';
    document.querySelector('nav a[href="prices.html"]').textContent = 'Cart';
    main.innerHTML = `
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
                    <h2 class="h4" id="summary-title">At a glance</h2>
                    <p id="cart-quantity" class="mb-2"></p>
                    <p id="cart-total" class="h4 mb-3"></p>
                    <p class="small text-body-secondary">Estimated product total. Delivery charges and availability must be confirmed with Lido.</p>
                    <a id="cart-next" class="btn btn-success" href="delivery.html">Order &amp; delivery →</a>
                    <button id="cart-clear" class="btn btn-outline-success mt-2" type="button">Clear cart</button>
                </div>
            </section>
        </div>
        <p id="cart-status" class="small mt-3 mb-0" role="status" aria-live="polite"></p>
        <p class="small text-body-secondary mt-3">Prices use the existing catalogue: Galmart via Wolt, recorded 2 November 2026.
            These are estimates, not live Lido prices. No payment is taken here.</p>`;

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
        items.replaceChildren();
        for (const line of cart) {
            const product = store.findProduct(line.id);
            const row = make('li', '', 'border-bottom py-3');
            row.dataset.id = line.id;
            const top = make('div', '', 'd-flex gap-3 align-items-center mb-2');
            const image = make('img', '', 'rounded border');
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
            const input = make('input', '', 'form-control form-control-sm w-auto');
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
        main.querySelector('#cart-clear').disabled = cart.length === 0;
        const next = main.querySelector('#cart-next');
        next.href = cart.length ? 'delivery.html' : 'products.html#product-gallery';
        next.textContent = cart.length ? 'Order & delivery →' : 'Browse products';
    }

    function save(message) {
        try {
            localStorage.setItem('lido-cart', JSON.stringify(cart));
        } catch (error) {
            storageAvailable = false;
        }
        render();
        status.textContent = storageAvailable ? message : 'Storage is unavailable. This list works here but cannot be kept when you leave.';
    }

    // Delegation works after render replaces all the item controls.
    items.addEventListener('click', function (event) {
        const control = event.target.closest('button[data-action]');
        if (!control) return;
        const id = control.closest('[data-id]').dataset.id;
        const line = cart.find(item => item.id === id);
        const action = control.dataset.action;
        const quantity = action === 'remove' ? 0 : line.quantity + (action === 'increase' ? 1 : -1);
        cart = store.changeQuantity(cart, id, quantity);
        save('Cart updated.');
        const row = items.querySelector('[data-id="' + id + '"]');
        const focus = row && row.querySelector('[data-action="' + action + '"]:not(:disabled), input');
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
        document.getElementById(input.id).focus();
    });

    main.querySelector('#cart-clear').addEventListener('click', function () {
        cart = [];
        save('Cart cleared. You can start a new shopping list.');
        main.querySelector('#continue-shopping').focus();
    });
    window.addEventListener('storage', function (event) {
        if (event.key === 'lido-cart' || event.key === null) {
            cart = readCart();
            render();
            status.textContent = 'Cart updated from another tab.';
        }
    });
    cart = readCart();
    render();
})();
