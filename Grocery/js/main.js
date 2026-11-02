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

    const $homeCategories = $('#home-category-list');
    if ($homeCategories.length) {
        for (const category of store.categories) {
            const products = store.products.filter(function (product) { return product.category === category.id; });
            const $column = $('<div>').addClass('col');
            const $card = $('<a>').addClass('category-card card h-100 text-decoration-none text-reset shadow-sm')
                .attr('href', 'products.html?category=' + category.id + '#product-gallery');
            $('<img>').addClass('category-photo img-fluid w-100 rounded-top').attr({
                src: products[0].image, alt: category.label, width: 240, height: 120, loading: 'lazy'
            }).appendTo($card);
            const $body = $('<div>').addClass('card-body');
            $('<h3>').addClass('h6 fw-bold').text(category.label).appendTo($body);
            $('<p>').addClass('small mb-0 text-body-secondary').text(products.length + ' products').appendTo($body);
            $card.append($body).appendTo($column);
            $homeCategories.append($column);
        }
    }

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
    $actions.append($checkout, $contact, $clear);
    $cart.append($title, $notice, $empty, $items, $quantity, $total, $actions, $confirmation);
    if (catalogueUpdated) {
        make('p', 'The catalogue has changed. Items no longer listed were removed from your saved cart.', 'small alert alert-info')
            .attr({ id: 'cart-catalogue-notice', role: 'status' }).insertAfter($notice);
    }
    if ($('#catalogue-cart').length) $cart.appendTo('#catalogue-cart');
    else $cart.insertBefore('#request-summary');

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
        $clear.add($checkout).prop('disabled', totals.quantity === 0);
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
    $page.on('cart-updated', renderCart);
    renderCart();
});


// ===== Shalkar Contacts jQuery contribution =====
// jQuery 3.7.1 loads before this file; ready waits until Contacts HTML exists.
$(function () {
    'use strict';

    const $review = $('.customer-review');
    const $tools = $('.payment-information');
    const $actions = $('main a[href^="tel:"]').closest('.d-flex');

    function safeStorageGet(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function safeStorageSet(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            // The feature still works when private browsing blocks storage.
        }
    }

    // Rewritten feature 1: .on(), .text(), .attr() and fadeToggle replace
    // addEventListener, textContent, setAttribute and classList. It is shorter.
    const $translation = $('<p>', {
        id: 'review-translation',
        class: 'alert alert-light border mt-3',
        lang: 'en',
        text: 'Good shop with reasonable prices and kind owners.'
    }).hide();
    const $translationButton = $('<button>', {
        id: 'toggle-review',
        class: 'btn btn-outline-success btn-sm',
        type: 'button',
        'aria-expanded': 'false',
        'aria-controls': 'review-translation',
        text: 'Show English translation'
    });

    $review.find('blockquote').after($translation);
    $translationButton.insertAfter($translation);

    $translationButton.on('click', function () {
        const $button = $(this);
        const willShow = !$button.hasClass('active');

        $button
            .toggleClass('active', willShow)
            .attr('aria-expanded', String(willShow))
            .text(willShow ? 'Hide English translation' : 'Show English translation');

        $translation.stop(true, true).fadeToggle(200);
    });

    // Rewritten feature 2: toggleClass, attr and text replace the old
    // classList, getAttribute/setAttribute and textContent calls.
    const $helpfulButton = $('<button>', {
        id: 'helpful-review',
        class: 'btn btn-outline-success btn-sm ms-2',
        type: 'button',
        'aria-pressed': 'false',
        text: 'Helpful 0'
    }).insertAfter($translationButton);

    function setHelpfulState(isHelpful) {
        $helpfulButton
            .toggleClass('active', isHelpful)
            .attr('aria-pressed', String(isHelpful))
            .text(isHelpful ? 'Helpful 1' : 'Helpful 0');
    }

    setHelpfulState(safeStorageGet('lido-contact-review-helpful') === 'true');

    $helpfulButton.on('click', function () {
        const isHelpful = $(this).attr('aria-pressed') !== 'true';
        setHelpfulState(isHelpful);
        safeStorageSet('lido-contact-review-helpful', String(isHelpful));
    });

    // Rewritten feature 3: the button, temporary field and feedback are built
    // with jQuery instead of createElement/appendChild and a click listener.
    const $copyButton = $('<button>', {
        class: 'btn btn-outline-success btn-sm',
        type: 'button',
        'data-phone': '+77479052505',
        text: 'Copy phone number'
    }).appendTo($actions);
    const $copyStatus = $('<span>', {
        class: 'small text-success',
        role: 'status',
        'aria-live': 'polite'
    }).appendTo($actions);

    function fallbackCopy(text) {
        const $temporary = $('<textarea>', {
            class: 'visually-hidden',
            readonly: 'readonly'
        }).val(text).appendTo('body');

        $temporary.trigger('select');
        const copied = document.execCommand('copy');
        $temporary.remove();
        return copied;
    }

    $actions.on('click', '[data-phone]', async function () {
        const $button = $(this);
        const phone = $button.attr('data-phone');
        let copied = false;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(phone);
                copied = true;
            } else {
                copied = fallbackCopy(phone);
            }
        } catch (error) {
            copied = false;
        }

        $copyStatus.stop(true, true).text(copied ? 'Phone copied.' : `Use ${phone}.`).fadeIn(150).delay(1400).fadeOut(200);
        $button.text(copied ? 'Copied ✓' : 'Copy unavailable');
        window.setTimeout(function () {
            $button.text('Copy phone number');
        }, 1800);
    });

    const topics = [
        { label: 'Product availability', subject: 'Product availability' },
        { label: 'Opening hours', subject: 'Opening hours' },
        { label: 'Payment options', subject: 'Payment options' }
    ];

    const $toolsHeading = $('<h3>', { class: 'h5 fw-bold mt-4', text: 'Ask about your visit' });
    const $toolsIntro = $('<p>', { text: 'Choose a topic, then complete the form.' });
    const $topicList = $('<div>', {
        id: 'contact-topic-list',
        class: 'list-group mb-3',
        'aria-label': 'Contact topics'
    });
    const $topicStatus = $('<p>', {
        id: 'topic-status',
        class: 'small text-body-secondary',
        role: 'status',
        text: 'No topic selected.'
    });
    const $formToggle = $('<button>', {
        id: 'contact-form-toggle',
        class: 'btn btn-outline-success btn-sm mb-3',
        type: 'button',
        'aria-expanded': 'false',
        'aria-controls': 'contact-form',
        text: 'Show contact form'
    });

    // The array is turned into list items with each() and appendTo(); none are in HTML.
    $(topics).each(function (index, topic) {
        $('<button>', {
            class: 'contact-topic list-group-item list-group-item-action',
            type: 'button',
            'data-subject': topic.subject,
            text: `${index + 1}. ${topic.label}`
        }).appendTo($topicList);
    });

    const $form = $(
        `<form id="contact-form" class="mt-2" novalidate>
            <div class="mb-3">
                <label class="form-label" for="contact-name">Name</label>
                <input id="contact-name" class="form-control" name="name" type="text" autocomplete="name" required>
                <span class="invalid-feedback" role="alert"></span>
            </div>
            <div class="mb-3">
                <label class="form-label" for="contact-email">E-mail</label>
                <input id="contact-email" class="form-control" name="email" type="email" autocomplete="email" required>
                <span class="invalid-feedback" role="alert"></span>
            </div>
            <div class="mb-3">
                <label class="form-label" for="contact-phone">Phone</label>
                <input id="contact-phone" class="form-control" name="phone" type="tel" autocomplete="tel" required>
                <span class="invalid-feedback" role="alert"></span>
            </div>
            <div class="mb-3">
                <label class="form-label" for="contact-subject">Topic</label>
                <input id="contact-subject" class="form-control" name="subject" type="text" required>
                <span class="invalid-feedback" role="alert"></span>
            </div>
            <div class="mb-3">
                <label class="form-label" for="contact-message">Question</label>
                <textarea id="contact-message" class="form-control" name="message" rows="3" required></textarea>
                <span class="invalid-feedback" role="alert"></span>
            </div>
            <div class="mb-3">
                <div class="form-check">
                    <input id="contact-terms" class="form-check-input" name="terms" type="checkbox" required>
                    <label class="form-check-label" for="contact-terms">I checked that the details are correct.</label>
                </div>
                <span class="invalid-feedback" role="alert"></span>
            </div>
            <button class="btn btn-success" type="submit">Check request</button>
            <p id="contact-success" class="alert alert-success mt-3 mb-0" role="status"></p>
        </form>`
    ).hide();

    $form.find('#contact-success').hide();
    $tools.append($toolsHeading, $toolsIntro, $topicList, $topicStatus, $formToggle, $form);

    // This delegated handler is attached to an existing parent. Direct binding
    // to .contact-topic before the array was built would miss the new buttons.
    $tools.on('click', '.contact-topic', function () {
        const subject = $(this).attr('data-subject');

        // This chain selects the clicked topic and clears the other siblings.
        $(this)
            .addClass('active')
            .attr('aria-current', 'true')
            .siblings('.contact-topic')
            .removeClass('active')
            .removeAttr('aria-current');

        $(this).parent().siblings('#topic-status').text(`Selected topic: ${subject}.`);
        $(this).closest('.content-section').find('#contact-subject').val(subject);
        $form.stop(true, true).slideDown(250);
        $formToggle.addClass('active').attr('aria-expanded', 'true').text('Hide contact form');
    });

    $formToggle.on('click', function () {
        const $button = $(this);
        const willShow = !$button.hasClass('active');

        $button
            .toggleClass('active', willShow)
            .attr('aria-expanded', String(willShow))
            .text(willShow ? 'Hide contact form' : 'Show contact form');

        $form.stop(true, true).slideToggle(250);
    });

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[0-9()\s-]{10,20}$/;

    function showError($field, message) {
        $field.addClass('is-invalid').removeClass('is-valid').attr('aria-invalid', 'true');
        $field.closest('.mb-3').find('.invalid-feedback').text(message).addClass('d-block');
    }

    function clearError($field) {
        $field.removeClass('is-invalid').addClass('is-valid').removeAttr('aria-invalid');
        $field.closest('.mb-3').find('.invalid-feedback').text('').removeClass('d-block');
    }

    function validateField($field) {
        if ($field.is("[type='checkbox']")) {
            // attr('checked') is initial markup; prop('checked') is the live state.
            const checked = $field.prop('checked') && $form.find('input:checked').length > 0;
            if (!checked) {
                showError($field, 'Please confirm the details.');
                return false;
            }
            clearError($field);
            return true;
        }

        const value = $.trim($field.val());
        const name = $field.attr('name');
        $field.val(value);

        if (!value) {
            showError($field, 'This field is required.');
            return false;
        }
        if (name === 'email' && !emailPattern.test(value)) {
            showError($field, 'Enter an e-mail such as name@example.com.');
            return false;
        }

        const digitCount = value.replace(/\D/g, '').length;
        if (name === 'phone' && (!phonePattern.test(value) || digitCount < 10 || digitCount > 15)) {
            showError($field, 'Enter 10–15 digits; spaces, brackets, + and - are allowed.');
            return false;
        }

        clearError($field);
        return true;
    }

    $form.on('input change', '[required]', function () {
        validateField($(this));
        $form.find('#contact-success').stop(true, true).fadeOut(100);
    });

    $form.on('submit', function (event) {
        // Without preventDefault the browser would reload and remove our messages.
        event.preventDefault();
        let valid = true;

        $form.find('[required]:not(:disabled)').each(function () {
            if (!validateField($(this))) {
                valid = false;
            }
        });

        if (!valid) {
            $form.find('.is-invalid:first').trigger('focus');
            return;
        }

        $form.trigger('reset');
        $form.find('[required]').each(function () {
            $(this).removeClass('is-invalid is-valid').removeAttr('aria-invalid');
        });

        // html() is safe for this fixed developer message; visitor values always use text().
        $form.find('#contact-success')
            .stop(true, true)
            .hide()
            .html('<strong>Thank you.</strong> The browser checks passed; no message was sent.')
            .fadeIn(300, function () {
                $(this).attr('tabindex', '-1').trigger('focus');
            });

        // Browser validation helps visitors, but the server must repeat every check.
    });

    // Element selector and :first filter add a useful relationship to the schedule.
    $('table:first').attr('aria-describedby', 'hours-source');
});
