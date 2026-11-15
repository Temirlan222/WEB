'use strict';

// jQuery грузится раньше. Внутри $(function () {}) запускаем код, когда HTML уже готов.
$(function () {
    // через $('#id') ищем элемент. $ в имени переменной просто подсказывает, что это объект jQuery.
    // через $('<tag>') создаём новый элемент. .text() кладёт текст, .append() вставляет его в блок.
    const $gallery = $('#product-gallery');
    if (!$gallery.length || !window.Lido) return;

    // window.Lido даёт нам каталог, корзину и общие функции.
    const store = window.Lido;
    const $selectedLabel = $('<label>').addClass('form-check-label ms-2').attr('for', 'catalogue-selected').text('Only products in my cart');
    const $selected = $('<input>').addClass('form-check-input').attr({id: 'catalogue-selected', type: 'checkbox'});
    const $favourites = $('<input>').addClass('form-check-input').attr({id: 'catalogue-favourites', type: 'checkbox'});
    const $favouritesLabel = $('<label>').addClass('form-check-label ms-2').attr('for', 'catalogue-favourites').text('Saved favourites');
    const categories = store.categories;
    // временно вынимаем старые фото из галереи, чтобы потом вернуть их под каталогом.
    const $shopPhotos = $gallery.children('div').detach();
    const $title = $('<h2>').text('Shop everyday groceries').addClass('visually-hidden');
    const source = store.catalogueSource;
    const $note = $('<p>').text('Reference prices · ' + source.retailer + ', ' + source.city + ' · Recorded ' + source.checkedAt + '. Confirm current prices with Lido.')
        .addClass('col-12 small text-body-secondary mb-0');
    const $controls = $('<div>').addClass('col-12 catalogue-controls');
    const $fields = $('<div>').addClass('row g-3 align-items-end');
    // тут создаём поиск и поле максимальной цены. Как они фильтруют, смотри в applyFilters().
    const $searchField = $('<div>').addClass('col-12 col-md-8');
    const $searchLabel = $('<label>').text('Search products').addClass('form-label').attr('for', 'catalogue-search');
    const $search = $('<input>').addClass('form-control').attr({
        type: 'search', id: 'catalogue-search', placeholder: 'Search a product or brand in English or Russian'
    });
    const $maxPriceField = $('<div>').addClass('col-12 col-md-4');
    const $maxPriceLabel = $('<label>').text('Maximum price (₸)').addClass('form-label').attr('for', 'catalogue-max-price');
    const $maxPrice = $('<input>').addClass('form-control').attr({
        type: 'number', id: 'catalogue-max-price', min: '0', step: 'any', placeholder: 'No limit'
    });
    const $categoryField = $('<div>').addClass('col-12 col-md-6');
    const $categoryLabel = $('<label>').text('Category').addClass('form-label').attr('for', 'catalogue-category');
    const $category = $('<select>').addClass('form-select').attr('id', 'catalogue-category');
    // all значит, что оставляем товары из любых категорий.
    $('<option>').val('all').text('All categories').appendTo($category);
    for (const category of categories)
     {
        $('<option>').val(category.id).text(category.label).appendTo($category);
    }
    // эти значения передаём в sortProducts(), чтобы она знала порядок цен.
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
    const $empty = $('<p>').text('No products match. Change your search or choose Reset filters.')
        .addClass('col-12').attr('id', 'catalogue-empty');
    // карточки кладём в отдельный блок, чтобы при фильтрации очищать только его.
    const $results = $('<div>').addClass('col-12 row g-3 m-0 px-0').attr('id', 'catalogue-results').prop('tabIndex', -1);
    const pageSize = 8;
    let visibleLimit = pageSize;
    const $more = $('<button>').addClass('btn btn-success').attr({id:'catalogue-more', type:'button', 'aria-controls':'catalogue-results'});
    const $less = $('<button>').addClass('btn btn-outline-success').attr({id:'catalogue-less', type:'button', 'aria-controls':'catalogue-results'}).text('Show fewer ↑');
    const $pager = $('<div>').addClass('col-12 catalogue-pager d-flex flex-wrap justify-content-center gap-2').append($more,$less);
    $searchField.append($searchLabel, $search);
    $maxPriceField.append($maxPriceLabel, $maxPrice);
    $categoryField.append($categoryLabel, $category);
    $sortField.append($sortLabel, $sort);
    $fields.append($searchField, $maxPriceField, $categoryField, $sortField);
    $controls.append($fields, $('<div>').addClass('form-check mt-3').append($selected, $selectedLabel), $('<div>').addClass('form-check mt-3').append($favourites, $favouritesLabel), $reset);
    $gallery.empty().append($title, $note, $controls, $count, $feedback, $empty, $results, $pager);

    // возвращаем фото под каталогом в блок, который можно раскрыть.
    if ($shopPhotos.length) {
        const $photos = $('<details>').addClass('col-12 mt-4');
        const $summary = $('<summary>').text('Inside Lido: our store photos').addClass('fw-bold');
        const $photoRow = $('<div>').addClass('row g-3 mt-1').append($shopPhotos);
        $photos.append($summary, $photoRow).appendTo($gallery);
    }

    const $categorySection = $('#product-categories');
    const $shortcuts = $('<div>').addClass('category-shortcuts d-flex flex-wrap gap-2').attr('id', 'catalogue-category-shortcuts');
    if ($categorySection.length) {
        for (const category of categories) {
            // filter оставляет товары этой категории, а length говорит, сколько их.
            const count = store.products.filter(function (product) { return product.category === category.id; }).length;
            $('<button>').addClass('btn btn-outline-success').attr({
                type: 'button', 'data-category-shortcut': category.id, 'aria-pressed': 'false'
            }).text(category.label + ' (' + count + ')').appendTo($shortcuts);
        }
        $categorySection.append($shortcuts);
    }

    // проходим по видимым карточкам и ищем каждый товар в корзине по ID.
    function updateSelectedCards() {
        $results.find('[data-product-id]').each(function () {
            const $card = $(this);
            const line = store.cart.find(function (item) {
                return item.id === $card.attr('data-product-id');
            });
            // если нашли товар, показываем его количество и кнопку Remove one.
            $card.toggleClass('selected', Boolean(line));
            $card.find('.product-cart-quantity').text(line ? 'In your cart: ' + line.quantity : '');
            $card.find('[data-add-product]').text(line ? 'Add one more' : 'Add to cart');
            $card.find('[data-remove-product]').toggleClass('hidden', !line);
        });
    }

    function showFeedback(message) {
        // останавливаем прошлую анимацию, чтобы при быстрых кликах сообщения не шли очередью.
        // стили от анимации чистим, чтобы они не мешали следующему сообщению.
        $feedback.stop(true, false).removeAttr('style').fadeOut(80, function () {
            $(this).text(message).fadeIn(120, function () {
                $(this).removeAttr('style');
            });
        });
    }

    // items уже отфильтрован и отсортирован. Тут только рисуем карточки.
    function renderCatalogue(items) {
        $results.empty();
        const visibleItems = items.slice(0, visibleLimit);
        $count.text(visibleItems.length + ' of ' + items.length + ' matching products shown');
        $more.toggleClass('hidden', visibleItems.length >= items.length).text('Show ' + Math.min(pageSize, items.length - visibleItems.length) + ' more ↓');
        $less.toggleClass('hidden', visibleItems.length <= pageSize);
        $pager.toggleClass('d-none', items.length <= pageSize);
        $empty.toggleClass('hidden', items.length !== 0);
        // на каждый товар делаем карточку. data-product-id связывает её с товаром из каталога.
        for (const product of visibleItems) {
            const $column = $('<div>').addClass('col-6 col-lg-4 col-xl-3');
            const $card = $('<article>').addClass('product-card card h-100')
                .attr('data-product-id', product.id).appendTo($column);
            const saved = store.favourites.includes(product.id);
            $('<button>').addClass('favourite-button').attr({type:'button', 'data-favourite':product.id, 'aria-pressed':String(saved), 'aria-label':(saved ? 'Unsave ' : 'Save ') + product.englishName}).text(saved ? '♥' : '♡').appendTo($card);
            const $photo = $('<button>').addClass('product-image-button').attr({type:'button', 'data-view-product':product.id, 'aria-label':'View details for ' + product.englishName});
            $('<img>').attr({src:product.image, alt:product.englishName, width:240, height:150, loading:'lazy'}).appendTo($photo);
            $photo.appendTo($card);
            const $body = $('<div>').addClass('card-body d-flex flex-column');
            const category = categories.find(item => item.id === product.category);
            const $categoryName = $('<p>').text(category.label).addClass('product-category mb-2');
            const $name = $('<h3>').text(product.englishName).addClass('card-title h5 fw-bold');
            const $unit = $('<p>').text(product.unit).addClass('small text-body-secondary mb-2');
            const $price = $('<p>').text(store.formatMoney(product.price)).addClass('card-text fs-5 fw-bold mb-2');
            const $quantity = $('<p>').addClass('product-cart-quantity small text-success mb-2').attr('aria-live', 'polite');
            // кладём ID и на кнопки, чтобы по клику понять, какой товар добавить или убрать из корзины.
            const $add = $('<button>').text('Add to cart').addClass('btn btn-success mt-auto').attr({
                type: 'button', 'data-add-product': product.id, 'aria-label': 'Add ' + product.name + ' to cart'
            });
            const $remove = $('<button>').text('Remove one').addClass('btn btn-outline-success mt-2 hidden').attr({
                type: 'button', 'data-remove-product': product.id, 'aria-label': 'Remove one ' + product.name + ' from cart'
            });
            const $details = $('<button>').addClass('product-detail-link').attr({type:'button', 'data-view-product':product.id, 'aria-label':'View details for ' + product.englishName}).text('Details ↗');
            const $links = $('<div>').addClass('d-flex justify-content-between gap-2').append($details);
            $body.append($categoryName, $name, $unit, $price, $quantity, $add, $remove, $links).appendTo($card);
            $results.append($column);
        }
        // карточки только что создались, теперь показываем на них актуальное количество из корзины.
        updateSelectedCards();
    }

    // сначала поиск и категория, потом цена и галочка корзины, в конце сортировка и отрисовка.
    function applyFilters() {
        const $focused = $results.find(':focus');
        const focusedProduct = $focused.closest('[data-product-id]').attr('data-product-id');
        const focusedAction = ['data-favourite', 'data-view-product', 'data-add-product', 'data-remove-product', 'href']
            .find(function (attribute) { return $focused.attr(attribute) !== undefined; });
        let items = store.filterProducts(store.products, $search.val(), $category.val());
        const maxPriceValue = $maxPrice.val();
        const maxPrice = Number(maxPriceValue);
        // пустое поле значит «без лимита». Если ввели 500, товар за 500 тоже подходит из-за <=.
        if (maxPriceValue !== '' && Number.isFinite(maxPrice) && maxPrice >= 0) {
            items = items.filter(function (product) { return product.price <= maxPrice; });
        }
        // some вернёт true, если в корзине есть хотя бы одна позиция с таким ID.
        if ($selected.prop('checked')) items = items.filter(function (product) { return store.cart.some(function (line) { return line.id === product.id; }); });
        if ($favourites.prop('checked')) items = items.filter(product => store.favourites.includes(product.id));
        renderCatalogue(store.sortProducts(items, $sort.val()));
        if (focusedProduct && focusedAction) {
            const $card = $results.find('[data-product-id="' + focusedProduct + '"]');
            const $control = $card.find('[' + focusedAction + ']:visible');
            ($control.length ? $control.first() : $results).trigger('focus');
        }
        // подсвечиваем быструю кнопку той категории, которая сейчас выбрана.
        $shortcuts.find('button').each(function () {
            const $button = $(this);
            const active = $button.attr('data-category-shortcut') === $category.val();
            $button.toggleClass('btn-success', active).toggleClass('btn-outline-success', !active)
                .attr('aria-pressed', String(active));
        });
    }

    // возвращаем поля в начальное состояние и заново показываем каталог.
    function resetFilters() {
        visibleLimit = pageSize;
        // убираем параметры входной ссылки, иначе обновление страницы вернёт старый фильтр.
        const url = new URL(location.href);
        ['q', 'category', 'favourites'].forEach(key => url.searchParams.delete(key));
        history.replaceState(null, '', url.pathname + url.search + url.hash);
        $('#site-search').val('');
        $search.val('');
        $maxPrice.val('');
        $selected.prop('checked', false);
        $favourites.prop('checked', false);
        $category.val('all');
        $sort.val('default');
        $feedback.stop(true, false).removeAttr('style').text('');
        applyFilters();
        $search.trigger('focus');
    }

    // слушаем клик на галерее, потому что карточки пересоздаются. Это делегирование событий.
    // клик доходит до галереи, а jQuery по селектору понимает, что нажали Add to cart.
    $gallery.on('click', '[data-add-product]', function () {
        const $button = $(this);
        const $card = $button.closest('[data-product-id]');
        const product = store.findProduct($button.attr('data-add-product'));
        if (!product) return;
        const wasSelected = $card.hasClass('selected');
        const name = $button.siblings('.card-title').text();
        // addToCart меняет количество и сохраняет корзину. По результату показываем сообщение.
        const added = store.addToCart(product.id);
        $results.find('[data-add-product]').filter(function () { return $(this).attr('data-add-product') === product.id; }).trigger('focus');
        showFeedback(added
            ? (wasSelected ? 'Another ' : '') + name + ' added to your cart. Open Cart in the menu to check quantities and totals.'
            : 'Could not add another ' + name + '. Check its quantity in your cart.');
    });
    // находим позицию по ID и убираем одну штуку. Когда остаётся 0, позиция удаляется из корзины.
    $gallery.on('click', '[data-remove-product]', function () {
        const id = $(this).attr('data-remove-product');
        const line = store.cart.find(function (item) { return item.id === id; });
        if (!line) return;
        const nextQuantity = line.quantity - 1;
        store.setCartQuantity(id, nextQuantity);
        showFeedback('One ' + store.findProduct(id).name + ' removed from your cart.');
        // после обновления карточка новая. Возвращаем фокус на Remove, Add или сам блок результатов.
        const selector = nextQuantity > 0 ? '[data-remove-product]' : '[data-add-product]';
        const $target = $results.find(selector).filter(function () {
            return $(this).attr(nextQuantity > 0 ? 'data-remove-product' : 'data-add-product') === id;
        });
        ($target.length ? $target : $results).trigger('focus');
    });
    // input срабатывает прямо при наборе текста. change слушаем на галочке и выпадающих списках.
    // поиск всегда проверяет весь каталог; ограничиваем только число видимых карточек.
    function startFiltering() {
        visibleLimit = pageSize;
        applyFilters();
    }
    $selected.on('change', startFiltering);
    $favourites.on('change', startFiltering);
    $search.on('input', startFiltering);
    $maxPrice.on('input', startFiltering);
    $category.on('change', startFiltering);
    $sort.on('change', startFiltering);
    $more.on('click', function () {
        const previousCount = $results.find('[data-product-id]').length;
        visibleLimit += pageSize;
        applyFilters();
        $results.find('.product-image-button').eq(previousCount).trigger('focus');
    });
    $less.on('click', function () {
        visibleLimit = pageSize;
        applyFilters();
        $results.trigger('focus');
        $results[0].scrollIntoView({block:'start'});
    });
    // быстрая кнопка выбирает категорию и очищает поиск, чтобы показать товары из неё.
    $shortcuts.on('click', '[data-category-shortcut]', function () {
        $category.val($(this).attr('data-category-shortcut'));
        $search.val('');
        startFiltering();
        $search.trigger('focus');
    });
    $reset.on('click', resetFilters);
    // корзина поменялась, значит пересобираем каталог с актуальным количеством на карточках.
    $(window).on('cart-updated', applyFilters);
    $(window).on('favourites-updated', applyFilters);
    $gallery.on('click', '[data-favourite]', function () {
        const id = $(this).attr('data-favourite');
        store.toggleFavourite(id);
        showFeedback(store.favouritesPersistent
            ? (store.favourites.includes(id) ? 'Saved to your favourites.' : 'Removed from your favourites.')
            : 'Saved for this page only. Your browser is blocking storage.');
    });

    // одно окно для всех товаров. Данные подставляем через text, поэтому ввод не станет HTML.
    const dialog = document.createElement('dialog');
    dialog.id = 'product-dialog';
    dialog.className = 'product-dialog';
    dialog.setAttribute('aria-labelledby', 'dialog-title');
    dialog.innerHTML = '<button class="dialog-close" type="button" aria-label="Close product details">×</button><div class="row g-4 align-items-center"><div class="col-12 col-md-5" id="dialog-picture"></div><div class="col-12 col-md-7"><p class="eyebrow" id="dialog-category"></p><h2 class="h3" id="dialog-title">Product details</h2><p class="small text-body-secondary" id="dialog-original"></p><p id="dialog-unit"></p><p class="h3 fw-bold" id="dialog-price"></p><p class="small" id="dialog-description"></p><button class="btn btn-success w-100" id="dialog-add" type="button">Add to cart</button><p class="small mt-2" id="dialog-status" role="status"></p></div></div>';
    document.body.append(dialog);
    let currentProduct = null;
    let openedFromImage = true;
    $gallery.on('click', '[data-view-product]', function () {
        openedFromImage = $(this).hasClass('product-image-button');
        currentProduct = store.findProduct($(this).attr('data-view-product'));
        const category = categories.find(item => item.id === currentProduct.category);
        $('#dialog-title').text(currentProduct.englishName);
        $('#dialog-original').text(currentProduct.name);
        $('#dialog-category').text(category.label);
        $('#dialog-unit').text('Pack / unit: ' + currentProduct.unit);
        $('#dialog-price').text(store.formatMoney(currentProduct.price));
        $('#dialog-description').text(category.description + ' Reference price recorded ' + source.checkedAt + '; confirm price and availability with Lido.');
        $('#dialog-picture').empty().append($('<img>').addClass('dialog-image').attr({src:currentProduct.image, alt:currentProduct.englishName, width:280, height:240}));
        $('#dialog-status').text('');
        dialog.showModal();
    });
    $(dialog).find('.dialog-close').on('click', function () { dialog.close(); });
    $('#dialog-add').on('click', function () {
        const added = store.addToCart(currentProduct.id);
        $('#dialog-status').text(added ? 'Added to your cart. Keep browsing or open Cart in the menu.' : 'This item has reached the quantity limit.');
    });
    dialog.addEventListener('close', function () {
        if (!currentProduct) return;
        const $opener = $results.find('[data-view-product="' + currentProduct.id + '"]')
            .filter(openedFromImage ? '.product-image-button' : '.product-detail-link').first();
        ($opener.length ? $opener : $results).trigger('focus');
    });
    // если пришли с Home по ?category=..., выбираем категорию, но только если такой ID есть.
    const params = new URLSearchParams(location.search);
    const initialCategory = params.get('category');
    $search.val((params.get('q') || '').slice(0,200));
    $favourites.prop('checked', params.get('favourites') === '1');
    if (categories.some(function (category) { return category.id === initialCategory; })) {
        $category.val(initialCategory);
    }
    // первый запуск нужен сразу, чтобы карточки появились ещё до ввода в поиск.
    applyFilters();
});
