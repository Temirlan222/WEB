'use strict';

// jQuery owns the delivery page: creation, events, validation and effects.
$(function () {
    const store = window.Lido;
    const fields = [
        { name: 'name', label: 'Your name', type: 'text', autocomplete: 'name' },
        { name: 'email', label: 'Email', type: 'email', autocomplete: 'email' },
        { name: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel' },
        { name: 'address', label: 'Delivery address', type: 'text', autocomplete: 'address-line1' }
    ];
    const payments = [
        { value: 'cash', label: 'Cash on receipt' },
        { value: 'card', label: 'Card on receipt' },
        { value: 'qr', label: 'Kaspi QR on receipt' }
    ];
    let cart = [];
    let submitted = false;
    $.fx.off = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function make(tag, text, classes) {
        return $('<' + tag + '>').text(text || '').addClass(classes || '');
    }

    document.title = 'Pickup & delivery | Lido Grocery Store';
    $('meta[name="description"]').attr('content', 'Prepare your shopping list and contact Lido about collection or delivery.');
    const $notice = $('#storage-notice').detach();
    const $main = $('main').empty().append($notice);
    $main.append(
        make('p', 'THE NEXT STEP', 'eyebrow'),
        make('h1', 'Pickup & delivery', 'display-5 fw-bold mb-3').attr('id', 'page-title'),
        make('p', 'Your groceries, your way. Prepare a list, then confirm it with Lido.', 'lead'),
        make('p', 'This page does not send an order or take payment. Contact details stay on this page only.', 'small text-body-secondary')
    );
    const $row = make('div', '', 'row g-4 align-items-start').appendTo($main);
    const $details = make('section', '', 'col-12 col-lg-7').attr('aria-label', 'Prepare your list').appendTo($row);
    const $form = $('<form>').attr({ id: 'delivery-form', novalidate: 'novalidate' })
        .addClass('card bg-white shadow-sm p-3').appendTo($details);
    $form.append(make('h2', 'Prepare your details', 'h4 mb-3'));
    for (const field of fields) {
        const $group = make('div', '', 'mb-3').appendTo($form);
        make('label', field.label, 'form-label').attr('for', 'delivery-' + field.name).appendTo($group);
        $('<input>').attr({
            id: 'delivery-' + field.name, name: field.name, type: field.type,
            autocomplete: field.autocomplete, maxlength: field.name === 'address' ? 200 : 100,
            'aria-describedby': 'error-' + field.name
        }).prop('required', true).addClass('form-control').appendTo($group);
        make('p', '', 'invalid-feedback mb-0').attr({ id: 'error-' + field.name, 'aria-live': 'polite' }).appendTo($group);
    }
    const $methodGroup = make('div', '', 'mb-3').insertBefore($form.find('[name="address"]').closest('.mb-3'));
    make('label', 'Pickup or delivery?', 'form-label').attr('for', 'delivery-method').appendTo($methodGroup);
    const $method = $('<select>').attr({ id: 'delivery-method', name: 'method', 'aria-describedby': 'error-method' })
        .addClass('form-select').appendTo($methodGroup);
    $method.append(
        $('<option>').val('pickup').text('Pickup · collect at Uly dala 31'),
        $('<option>').val('delivery').text('Delivery · to your address')
    );
    make('p', '', 'invalid-feedback mb-0').attr({ id: 'error-method', 'aria-live': 'polite' }).appendTo($methodGroup);
    const $paymentGroup = make('div', '', 'mb-3').appendTo($form);
    make('label', 'Payment method', 'form-label').attr('for', 'delivery-payment').appendTo($paymentGroup);
    const $payment = $('<select>').attr({ id: 'delivery-payment', name: 'payment', 'aria-describedby': 'error-payment payment-note' })
        .addClass('form-select').appendTo($paymentGroup);
    for (const payment of payments) {
        $('<option>').val(payment.value).text(payment.label).appendTo($payment);
    }
    make('p', '', 'invalid-feedback mb-0').attr({ id: 'error-payment', 'aria-live': 'polite' }).appendTo($paymentGroup);
    make('p', 'Your preference only. Confirm payment options and any delivery fee with Lido.', 'small text-body-secondary mt-2 mb-0')
        .attr('id', 'payment-note').appendTo($paymentGroup);
    const $actions = make('div', '', 'd-flex flex-wrap gap-2').appendTo($form);
    make('button', 'Review my list', 'btn btn-success').prop('type', 'submit').appendTo($actions);
    make('button', 'Reset details', 'btn btn-outline-success').prop('type', 'reset').appendTo($actions);
    const $confirmation = make('div', '', 'alert alert-success mt-3 d-none')
        .attr({ id: 'delivery-confirmation', role: 'status', tabindex: '-1' }).appendTo($details);

    const $aside = make('aside', '', 'col-12 col-lg-5').appendTo($row);
    const $summary = make('div', '', 'card bg-white shadow-sm p-3 mb-3').appendTo($aside);
    $summary.append(make('h2', 'Your visit', 'h4'));
    const $cartMessage = make('p', '', 'mb-2').appendTo($summary);
    const $total = make('p', '', 'fw-bold').appendTo($summary);
    $summary.append(
        make('p', 'Catalogue estimates only. Confirm final prices, stock and any delivery fee with Lido.', 'small text-body-secondary'),
        make('a', 'Edit cart', 'btn btn-outline-success').attr('href', 'cart.html')
    );
    $aside.append(
        make('a', 'Call Lido: +7 747 905 25 05', 'btn btn-success mb-3').attr('href', 'tel:+77479052505'),
        make('p', 'Visit us: Uly dala 31, Astana.', 'small')
    );

    function hideConfirmation() {
        $confirmation.stop(true, true).addClass('d-none').removeAttr('style').empty();
    }

    function refreshCart() {
        cart = store.cart;
        $cartMessage.text(cart.length ? 'Your items are saved on the Cart page.' : 'Your cart is empty. Add products before preparing a list.');
        $total.text('Product total: ' + store.formatMoney(store.cartTotals(cart).total));
        $details.toggleClass('d-none', !cart.length);
        $summary.find('a').text(cart.length ? 'Edit cart' : 'Browse products')
            .attr('href', cart.length ? 'cart.html' : 'products.html#product-gallery');
        hideConfirmation();
    }

    function toggleAddress(animate) {
        const needed = $method.val() === 'delivery';
        const $address = $form.find('[name="address"]');
        const $group = $address.prop({ disabled: !needed, required: needed }).closest('.mb-3');
        $group.stop(true, true);
        if (animate && needed) $group.removeClass('d-none').hide().slideDown(180);
        else if (animate) $group.slideUp(180, function () { $(this).addClass('d-none').removeAttr('style'); });
        else $group.toggleClass('d-none', !needed).removeAttr('style');
        if (!needed) $address.removeClass('is-invalid is-valid').removeAttr('aria-invalid').siblings('.invalid-feedback').text('');
    }

    function validate($field) {
        const value = $field.val().trim();
        const name = $field.attr('name');
        let error = '';
        if (!value) error = 'Please fill in this field.';
        else if (name === 'name' && value.length < 2) error = 'Enter at least 2 characters.';
        else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Use an email such as name@example.com.';
        else if (name === 'phone' && !/^\+?\d(?:[\d ()-]*\d)?$/.test(value)) error = 'Use digits, spaces, brackets or hyphens, with an optional leading +.';
        else if (name === 'phone' && !/^\d{10,15}$/.test(value.replace(/\D/g, ''))) error = 'Enter 10 to 15 digits.';
        else if (name === 'address' && value.length < 5) error = 'Enter a street, building and apartment if needed.';
        else if (name === 'method' && !['pickup', 'delivery'].includes(value)) error = 'Choose collection or delivery.';
        else if (name === 'payment' && !payments.some(payment => payment.value === value)) error = 'Choose a payment method.';
        else if (value.length > (name === 'address' ? 200 : 100)) error = 'Please shorten this field.';
        $field.toggleClass('is-invalid', Boolean(error)).toggleClass('is-valid', !error).attr('aria-invalid', String(Boolean(error)));
        $field.closest('.mb-3').find('.invalid-feedback').text(error);
        return !error;
    }

    $form.on('input change', 'input, select', function () {
        hideConfirmation();
        if ($(this).is('[name="method"]')) toggleAddress(true);
        if (submitted || $(this).hasClass('is-invalid')) validate($(this));
    });
    $form.on('submit', function (event) {
        event.preventDefault();
        hideConfirmation();
        submitted = true;
        let valid = true;
        $form.find(':input[required]:enabled, select:enabled').each(function () {
            $(this).val($(this).val().trim());
            if (!validate($(this))) valid = false;
        });
        if (!valid) {
            $form.find('.is-invalid:first').trigger('focus');
            return;
        }
        if (!cart.length) return;
        const value = name => $form.find('[name="' + name + '"]').val();
        $confirmation.append(
            make('h2', 'Your list is ready', 'h4'),
            make('p', value('name') + ' · ' + value('email') + ' · ' + value('phone')),
            make('p', value('method') === 'delivery' ? 'Delivery to: ' + value('address') : 'Pickup: Uly dala 31, Astana.'),
            make('p', 'Payment preference: ' + payments.find(payment => payment.value === value('payment')).label),
            make('p', 'Estimated product total: ' + store.formatMoney(store.cartTotals(cart).total), 'fw-bold'),
            make('p', 'Nothing has been sent or paid. Call Lido or show this list in store to confirm stock, final prices and delivery. Your cart is kept.', 'mb-0')
        ).removeClass('d-none').hide().fadeIn(200, function () { $(this).trigger('focus'); });
    });
    $form.on('reset', function () {
        submitted = false;
        hideConfirmation();
        $form.find('input, select').removeClass('is-invalid is-valid').removeAttr('aria-invalid');
        $form.find('.invalid-feedback').text('');
        // reset values are applied after the reset event finishes.
        setTimeout(toggleAddress, 0);
    });
    $(window).on('cart-updated', refreshCart);
    refreshCart();
    toggleAddress();
});
