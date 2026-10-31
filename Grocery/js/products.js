'use strict';

// jQuery 3.7.1 is loaded first; ready waits until the page elements are available.
$(function () {
    // $(), .append(), .text(), .toggleClass() and .on() replace native lookup, creation and events.
    // Traversal and delegation are clearer; building the same cards is not much shorter.
    const $gallery = $('#product-gallery');
    if (!$gallery.length || !window.Lido) return;

    const store = window.Lido;
    const categories = [
        ['all', 'All categories'], ['dairy', 'Dairy'], ['food', 'Food products'],
        ['produce', 'Fruit and vegetables'], ['sweets', 'Sweets'],
        ['beverages', 'Beverages'], ['snacks', 'Snacks'],
        ['household', 'Household cleaning'], ['meat', 'Meat']
    ];
    const $shopPhotos = $gallery.children('div').detach();
    const $title = $('<h2>').text('Food & Household Products').addClass('h3 fw-bold col-12');
    const $note = $('<p>').text('Recorded example prices per listed unit. Check current price and availability with Lido.').addClass('col-12 mb-0');
    const $controls = $('<div>').addClass('col-12');
    const $fields = $('<div>').addClass('row g-3 align-items-end');
    const $searchField = $('<div>').addClass('col-12 col-md-6');
    const $searchLabel = $('<label>').text('Search products').addClass('form-label').attr('for', 'catalogue-search');
    const $search = $('<input>').addClass('form-control').attr({
        type: 'search', id: 'catalogue-search', placeholder: 'Example: milk'
    });
    const $categoryField = $('<div>').addClass('col-12 col-md-6');
    const $categoryLabel = $('<label>').text('Category').addClass('form-label').attr('for', 'catalogue-category');
    const $category = $('<select>').addClass('form-select').attr('id', 'catalogue-category');
    for (const item of categories) {
        // .val() sets the option value, .text() its safe label, .appendTo() inserts it.
        $('<option>').val(item[0]).text(item[1]).appendTo($category);
    }
    const $reset = $('<button>').text('Reset filters').addClass('btn btn-outline-success mt-3')
        .attr({ id: 'catalogue-reset', type: 'button' });
    const $count = $('<p>').addClass('col-12 mb-0').attr({ id: 'catalogue-count', role: 'status' });
    const $feedback = $('<p>').addClass('col-12 mb-0').attr({ id: 'catalogue-feedback', role: 'status' });
    const $cartLink = $('<a>').text('View cart and check totals').addClass('col-12 link-success').attr('href', '#shopping-cart');
    const $empty = $('<p>').text('No products match. Change your search or choose Reset filters.')
        .addClass('col-12').attr('id', 'catalogue-empty');
    const $results = $('<div>').addClass('col-12 row g-3 m-0 px-0').attr('id', 'catalogue-results').prop('tabIndex', -1);
    $searchField.append($searchLabel, $search);
    $categoryField.append($categoryLabel, $category);
    $fields.append($searchField, $categoryField);
    $controls.append($fields, $reset);
    $gallery.empty().append($title, $note, $controls, $count, $feedback, $cartLink, $empty, $results);

    // Detach and reinsert the original store photos below the catalogue.
    if ($shopPhotos.length) {
        const $photos = $('<details>').addClass('col-12 mt-4');
        const $summary = $('<summary>').text('Inside Lido: our store photos').addClass('fw-bold');
        const $photoRow = $('<div>').addClass('row g-3 mt-1').append($shopPhotos);
        $photos.append($summary, $photoRow).appendTo($gallery);
    }

    const $categorySection = $('#product-categories');
    if ($categorySection.length) {
        const $heading = $('<h2>').text('Product categories').addClass('h3 fw-bold');
        const $explanation = $('<p>').text('Choose a category in the catalogue to see its recorded products. The department descriptions below describe the wider store range.');
        const $filterLink = $('<a>').text('Go to catalogue filters').addClass('btn btn-outline-success').attr('href', '#catalogue-search');
        $categorySection.empty().append($heading, $explanation, $filterLink);
    }

    function updateSelectedCards() {
        $results.find('[data-product-id]').each(function () {
            const $card = $(this);
            const selected = store.cart.some(function (item) {
                return item.id === $card.attr('data-product-id');
            });
            $card.toggleClass('selected', selected);
            $card.find('[data-add-product]').text(selected ? 'Add another to cart' : 'Add to cart');
        });
    }

    function showFeedback(message) {
        // Cancel stale effects; remove only the temporary styles created by jQuery effects.
        $feedback.stop(true, false).removeAttr('style').fadeOut(80, function () {
            $(this).text(message).fadeIn(120, function () {
                $(this).removeAttr('style');
            });
        });
    }

    function renderCatalogue(items) {
        $results.empty();
        $count.text(items.length + ' of ' + store.products.length + ' products shown');
        $empty.toggleClass('hidden', items.length !== 0);
        for (const product of items) {
            const $column = $('<div>').addClass('col-12 col-md-6 col-lg-3');
            const $card = $('<article>').addClass('product-card card h-100 shadow-sm')
                .attr('data-product-id', product.id).appendTo($column);
            const $body = $('<div>').addClass('card-body d-flex flex-column');
            const $image = $('<img>').addClass('img-fluid w-100 object-fit-contain rounded mb-3').attr({
                src: product.image, alt: product.name + ', product example', width: 200, height: 160
            });
            const $name = $('<h3>').text(product.name).addClass('card-title h5 fw-bold');
            const $price = $('<p>').text(store.formatMoney(product.price) + ' / ' + product.unit).addClass('card-text');
            const $add = $('<button>').text('Add to cart').addClass('btn btn-success mt-auto').attr({
                type: 'button', 'data-add-product': product.id, 'aria-label': 'Add ' + product.name + ' to cart'
            });
            $body.append($image, $name, $price, $add).appendTo($card);
            $results.append($column);
        }
        updateSelectedCards();
    }

    function applyFilters() {
        renderCatalogue(store.filterProducts(store.products, $search.val(), $category.val()));
    }

    function resetFilters() {
        $search.val('');
        $category.val('all');
        $feedback.stop(true, false).removeAttr('style').text('');
        applyFilters();
        $search.trigger('focus');
    }

    // Direct binding would miss buttons created later when filtering rebuilds the cards.
    $gallery.on('click', '[data-add-product]', function () {
        const $button = $(this);
        const $card = $button.closest('[data-product-id]');
        const product = store.findProduct($button.attr('data-add-product'));
        if (!product) return;
        const wasSelected = $card.hasClass('selected');
        const name = $button.siblings('.card-title').text();
        const added = store.addToCart(product.id);
        showFeedback(added
            ? (wasSelected ? 'Another ' : '') + name + ' added to your cart. Use View cart to check quantities and totals.'
            : 'Could not add another ' + name + '. Check its quantity in your cart.');
    });
    $search.on('input', applyFilters);
    $category.on('change', applyFilters);
    $reset.on('click', resetFilters);
    $(window).on('cart-updated', updateSelectedCards);
    applyFilters();
});
