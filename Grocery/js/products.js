'use strict';

// jQuery 3.7.1 is loaded first; ready waits until the page elements are available.
$(function () {
    // $(), .append(), .text(), .toggleClass() and .on() replace native lookup, creation and events.
    // Traversal and delegation are clearer; building the same cards is not much shorter.
    const $gallery = $('#product-gallery');
    if (!$gallery.length || !window.Lido) return;

    const store = window.Lido;
    const categories = store.categories;
    const $shopPhotos = $gallery.children('div').detach();
    const $title = $('<h2>').text('Shop everyday groceries').addClass('h3 fw-bold col-12');
    const source = store.catalogueSource;
    const $note = $('<p>').text('Prices from ' + source.retailer + ', ' + source.city + ', recorded on ' + source.checkedAt + '. Confirm Lido prices and availability before visiting.')
        .addClass('col-12 small text-body-secondary mb-0');
    const $controls = $('<div>').addClass('col-12');
    const $fields = $('<div>').addClass('row g-3 align-items-end');
    const $searchField = $('<div>').addClass('col-12');
    const $searchLabel = $('<label>').text('Search products').addClass('form-label').attr('for', 'catalogue-search');
    const $search = $('<input>').addClass('form-control').attr({
        type: 'search', id: 'catalogue-search', placeholder: 'Search a product or brand in English or Russian'
    });
    const $categoryField = $('<div>').addClass('col-12 col-md-6');
    const $categoryLabel = $('<label>').text('Category').addClass('form-label').attr('for', 'catalogue-category');
    const $category = $('<select>').addClass('form-select').attr('id', 'catalogue-category');
    $('<option>').val('all').text('All categories').appendTo($category);
    for (const category of categories) {
        // .val() sets the option value, .text() its safe label, .appendTo() inserts it.
        $('<option>').val(category.id).text(category.label).appendTo($category);
    }
    const $sortField = $('<div>').addClass('col-12 col-md-6');
    const $sortLabel = $('<label>').text('Sort by').addClass('form-label').attr('for', 'catalogue-sort');
    const $sort = $('<select>').addClass('form-select').attr('id', 'catalogue-sort');
    $('<option>').val('default').text('Recommended order').appendTo($sort);
    $('<option>').val('price-asc').text('Price: low to high').appendTo($sort);
    $('<option>').val('price-desc').text('Price: high to low').appendTo($sort);
    const $reset = $('<button>').text('Reset filters').addClass('btn btn-outline-success mt-3')
        .attr({ id: 'catalogue-reset', type: 'button' });
    const $count = $('<p>').addClass('col-12 mb-0').attr({ id: 'catalogue-count', role: 'status' });
    const $feedback = $('<p>').addClass('col-12 mb-0').attr({ id: 'catalogue-feedback', role: 'status' });
    const $cartLink = $('<a>').text('View your cart and total').addClass('col-12 link-success d-lg-none').attr('href', '#shopping-cart');
    const $empty = $('<p>').text('No products match. Change your search or choose Reset filters.')
        .addClass('col-12').attr('id', 'catalogue-empty');
    const $results = $('<div>').addClass('col-12 row g-3 m-0 px-0').attr('id', 'catalogue-results').prop('tabIndex', -1);
    $searchField.append($searchLabel, $search);
    $categoryField.append($categoryLabel, $category);
    $sortField.append($sortLabel, $sort);
    $fields.append($searchField, $categoryField, $sortField);
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
    const $shortcuts = $('<div>').addClass('d-flex flex-wrap gap-2').attr('id', 'catalogue-category-shortcuts');
    if ($categorySection.length) {
        for (const category of categories) {
            const count = store.products.filter(function (product) { return product.category === category.id; }).length;
            $('<button>').addClass('btn btn-outline-success').attr({
                type: 'button', 'data-category-shortcut': category.id, 'aria-pressed': 'false'
            }).text(category.label + ' (' + count + ')').appendTo($shortcuts);
        }
        $categorySection.append($shortcuts);
    }

    function updateSelectedCards() {
        $results.find('[data-product-id]').each(function () {
            const $card = $(this);
            const line = store.cart.find(function (item) {
                return item.id === $card.attr('data-product-id');
            });
            $card.toggleClass('selected', Boolean(line));
            $card.find('.product-cart-quantity').text(line ? 'In your cart: ' + line.quantity : '');
            $card.find('[data-add-product]').text(line ? 'Add one more' : 'Add to cart');
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
            const $column = $('<div>').addClass('col-12 col-md-6 col-xl-4');
            const $card = $('<article>').addClass('product-card card h-100 shadow-sm')
                .attr('data-product-id', product.id).appendTo($column);
            const $body = $('<div>').addClass('card-body d-flex flex-column');
            const $image = $('<img>').addClass('catalogue-product-photo w-100 rounded mb-3').attr({
                src: product.image, alt: product.name, width: 240, height: 180, loading: 'lazy', decoding: 'async'
            });
            const $name = $('<h3>').text(product.name).addClass('card-title h5 fw-bold');
            const $translation = $('<p>').text(product.englishName).addClass('small text-body-secondary mb-2');
            const $unit = $('<p>').text(product.unit).addClass('small text-body-secondary mb-2');
            const $price = $('<p>').text(store.formatMoney(product.price)).addClass('card-text fs-5 fw-bold mb-2');
            const $quantity = $('<p>').addClass('product-cart-quantity small text-success mb-2').attr('aria-live', 'polite');
            const $add = $('<button>').text('Add to cart').addClass('btn btn-success mt-auto').attr({
                type: 'button', 'data-add-product': product.id, 'aria-label': 'Add ' + product.name + ' to cart'
            });
            const $sourceLink = $('<a>').text('Price source').addClass('small link-secondary mt-2').attr({
                href: product.sourceUrl, target: '_blank', rel: 'noopener noreferrer',
                'aria-label': 'View price source for ' + product.name
            });
            const $mobileCart = $('<a>').text('View cart and total').addClass('small link-success d-lg-none mt-2')
                .attr('href', '#shopping-cart');
            $body.append($image, $name, $translation, $unit, $price, $quantity, $add, $mobileCart, $sourceLink).appendTo($card);
            $results.append($column);
        }
        updateSelectedCards();
    }

    function applyFilters() {
        const items = store.filterProducts(store.products, $search.val(), $category.val());
        renderCatalogue(store.sortProducts(items, $sort.val()));
        $shortcuts.find('button').each(function () {
            const $button = $(this);
            const active = $button.attr('data-category-shortcut') === $category.val();
            $button.toggleClass('btn-success', active).toggleClass('btn-outline-success', !active)
                .attr('aria-pressed', String(active));
        });
    }

    function resetFilters() {
        $search.val('');
        $category.val('all');
        $sort.val('default');
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
    $sort.on('change', applyFilters);
    $shortcuts.on('click', '[data-category-shortcut]', function () {
        $category.val($(this).attr('data-category-shortcut'));
        $search.val('');
        applyFilters();
        $search.trigger('focus');
    });
    $reset.on('click', resetFilters);
    $(window).on('cart-updated', updateSelectedCards);
    $('[href="#product-request"]').on('click', function () {
        $('#product-request').prop('open', true);
    });
    if (location.hash === '#product-request' || location.hash === '#request-result') {
        $('#product-request').prop('open', true);
    }
    const initialCategory = new URLSearchParams(location.search).get('category');
    if (categories.some(function (category) { return category.id === initialCategory; })) {
        $category.val(initialCategory);
    }
    applyFilters();
});
