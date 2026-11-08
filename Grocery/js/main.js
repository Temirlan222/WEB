'use strict';

// jQuery 3.7.1 full CDN loads first: effects need the full build.
// Ready waits for the document; this file also supplies the shared cart on all six pages.
$(function () {
    const store = window.Lido;
    if (!store) return;
    const $page = $(window);
    $.fx.off = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Rewrite 2: $(), .on(), .text(), .append() and class methods replace native cart DOM/events.
    // Traversal and button creation are shorter; the calculation/storage rules remain plain JavaScript.
    let catalogueUpdated = false;
    try {
        const savedCart = JSON.parse(localStorage.getItem('lido-cart'));
        store.cart = store.normalizeCart(savedCart);
        catalogueUpdated = Array.isArray(savedCart) && savedCart.some(function (line) {
            return line && !store.findProduct(line.id);
        });
    } catch (error) {
        store.cart = [];
    }

    store.saveCart = function () {
        store.cart = store.normalizeCart(store.cart);
        try {
            // Only product ids and quantities are stored, never personal form values.
            localStorage.setItem('lido-cart', JSON.stringify(store.cart));
        } catch (error) {
            // The current page still works when storage is unavailable.
        }
        $page.trigger('cart-updated');
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

    const $linkRow = $('<p>').addClass('mb-3').prependTo('main');
    // Chain: attr sets the link/id, addClass uses existing styling, text sets its label, appendTo inserts it.
    const $link = $('<a>').attr({ id: 'cart-link', href: 'products.html#shopping-cart' })
        .addClass('btn btn-outline-success btn-sm').text('Shopping cart (0)').appendTo($linkRow);

    function updateCartLink() {
        $link.text('Shopping cart (' + store.cartTotals(store.cart).quantity + ')');
    }
    $page.on('cart-updated', updateCartLink);
    updateCartLink();

    $('nav a[href="prices.html"]').text('Cart');
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    $('nav a').each(function () {
        const $link = $(this);
        const active = $link.attr('href') === currentPage;
        $link.toggleClass('active', active);
        if (active) $link.attr('aria-current', 'page');
        else $link.removeAttr('aria-current');
    });
    $('tbody tr').each(function () {
        const $row = $(this);
        const name = $row.find('td').first().text().trim();
        const product = store.products.find(function (item) { return item.name === name; });
        if (product) $row.attr('id', 'price-' + product.id);
    });

    const $result = $('#request-result');
    if (!$result.length) return;
    $result.find('.result-pending, .result-confirmation').remove();
    $('#result-title').text('Cart and request result');

    function make(tag, text, classes) {
        return $('<' + tag + '>').text(text || '').addClass(classes || '');
    }

    const $cart = make('section', '', 'card bg-white p-3 shadow-sm mb-4')
        .attr({ id: 'shopping-cart', 'aria-labelledby': 'cart-title' });
    const $title = make('h2', 'Your shopping list', 'h4 fw-bold').attr('id', 'cart-title');
    const $notice = make('p', 'Check quantities and the total below. To buy, call Lido or visit the store. Online orders and payments are not available yet.', 'small text-body-secondary');
    const $empty = make('p', 'Your cart is empty. Add a product from the catalogue.').attr('id', 'cart-empty');
    const $items = make('ul', '', 'list-unstyled overflow-auto').attr('id', 'cart-items');
    const $quantity = make('p', '', 'mb-1').attr('id', 'cart-quantity');
    const $total = make('p', '', 'fw-bold').attr('id', 'cart-total');
    const $actions = make('div', '', 'd-flex flex-wrap gap-2');
    const $clear = make('button', 'Clear cart', 'btn btn-outline-success')
        .attr('id', 'cart-clear').prop('type', 'button');
    const $checkout = make('button', 'Review shopping list', 'btn btn-success')
        .attr('id', 'cart-checkout').prop('type', 'button');
    const $contact = make('a', 'Call the store', 'btn btn-outline-success').attr('href', 'tel:+77479052505');
    const $confirmation = make('div', '', 'hidden success rounded p-3 mt-3')
        .attr({ id: 'cart-confirmation', role: 'status' }).prop('tabIndex', -1);
    const $download = make('button', 'Download shopping list', 'btn btn-outline-success').attr({id: 'cart-download', type: 'button'});
    $actions.append($checkout, $download, $contact, $clear);
    $cart.append($title, $notice, $empty, $items, $quantity, $total, $actions, $confirmation);
    if (catalogueUpdated) {
        make('p', 'The catalogue has changed. Items no longer listed were removed from your saved cart.', 'small alert alert-info')
            .attr({ id: 'cart-catalogue-notice', role: 'status' }).insertAfter($notice);
    }
    if ($('#catalogue-cart').length) $cart.appendTo('#catalogue-cart');
    else $cart.insertBefore('#product-gallery');

    function lineButton(action, text, product, disabled) {
        return make('button', text, 'btn btn-outline-success btn-sm')
            .attr({ 'data-cart-action': action, 'data-product-id': product.id, 'aria-label': action + ' ' + product.name })
            .prop({ type: 'button', disabled: disabled });
    }

    function renderCart() {
        $items.empty();
        // Cancel an unfinished effect before hiding an outdated result; clear only effect-generated styles.
        $confirmation.stop(true, false).addClass('hidden').removeAttr('style').empty();
        for (const line of store.cart) {
            const product = store.findProduct(line.id);
            const $item = make('li', '', 'border-bottom py-3');
            const $description = make('p', product.name + ' (' + product.unit + ') - ' + store.formatMoney(product.price) + ' each', 'mb-1');
            const $subtotal = make('p', 'Quantity: ' + line.quantity + ' | Subtotal: ' + store.formatMoney(product.price * line.quantity), 'mb-2');
            const $buttons = make('div', '', 'd-flex flex-wrap gap-2');
            $buttons.append(
                lineButton('decrease', '-', product, line.quantity === 1),
                lineButton('increase', '+', product, line.quantity === 999),
                lineButton('remove', 'Remove', product, false)
            );
            $item.append($description, $subtotal, $buttons).appendTo($items);
        }
        const totals = store.cartTotals(store.cart);
        $quantity.text('Total quantity: ' + totals.quantity + ' listed unit(s)');
        $total.text('Total: ' + store.formatMoney(totals.total));
        $empty.toggleClass('hidden', totals.quantity !== 0);
        $clear.add($checkout).add($download).prop('disabled', totals.quantity === 0);
    }

    // Delegate to the stable list: direct binding to today's buttons would miss buttons created by the next render.
    $items.on('click', '[data-cart-action]', function () {
        const $button = $(this);
        const id = $button.attr('data-product-id');
        const line = store.cart.find(function (item) { return item.id === id; });
        if (!line) return;
        const action = $button.attr('data-cart-action');
        const next = action === 'remove' ? 0 : line.quantity + (action === 'increase' ? 1 : -1);
        store.setCartQuantity(line.id, next);

        let $target = $items.find('[data-product-id="' + id + '"][data-cart-action="' + action + '"]:not(:disabled)').first();
        if (!$target.length) $target = $items.find('button:not(:disabled)').first();
        if (!$target.length) $target = $('#catalogue-search');
        $target.trigger('focus');
    });
    $clear.on('click', function () {
        store.clearCart();
        $('#catalogue-search').trigger('focus');
    });
    $checkout.on('click', function () {
        const totals = store.cartTotals(store.cart);
        if (totals.quantity === 0) return;
        $confirmation.stop(true, false).addClass('hidden').removeAttr('style').empty();
        const $summary = make('ul', '', 'mb-2');
        for (const line of store.cart) {
            const product = store.findProduct(line.id);
            $summary.append(make('li', product.name + ' (' + product.unit + ') x ' + line.quantity + ' = ' + store.formatMoney(product.price * line.quantity)));
        }
        $confirmation.append(
            make('p', 'Your shopping list is ready to review', 'fw-bold mb-2'),
            $summary,
            make('p', 'Total: ' + store.formatMoney(totals.total) + ' for ' + totals.quantity + ' listed unit(s).', 'mb-2'),
            make('p', 'Your items stay in the cart. Show this list in store or call to confirm availability and the final price. No order or payment has been submitted.', 'mb-0')
        );
        // Reveal the completed result, then focus it after the effect; no new CSS rules are written.
        $confirmation.slideDown(160, function () {
            $(this).removeClass('hidden').removeAttr('style').trigger('focus');
        });
    });
    $download.on('click', function () {
        const rows = store.cart.map(function (line) {
            const product = store.findProduct(line.id);
            return product.name + ' (' + product.unit + ') x ' + line.quantity + ' = ' + store.formatMoney(product.price * line.quantity);
        });
        rows.push('Total: ' + store.formatMoney(store.cartTotals(store.cart).total));
        rows.push('Recorded reference prices. Confirm availability and final prices with Lido. No order placed.');
        const url = URL.createObjectURL(new Blob([rows.join('\n')], {type: 'text/plain;charset=utf-8'}));
        const $file = $('<a>').attr({href: url, download: 'Lido-shopping-list.txt'}).appendTo($cart);
        $file[0].click();
        $file.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
    $page.on('cart-updated', renderCart);
    renderCart();
});
