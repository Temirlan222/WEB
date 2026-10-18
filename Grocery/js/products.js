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
