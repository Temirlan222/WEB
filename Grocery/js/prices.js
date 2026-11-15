'use strict';
// цены и каталог берут данные из одного массива, поэтому суммы совпадают с корзиной.
(function () {
    const store = window.Lido;
    const results = document.getElementById('price-results');
    const search = document.getElementById('price-search');
    const sort = document.getElementById('price-sort');
    const categories = document.getElementById('price-categories');
    const count = document.getElementById('price-count');
    const more = document.getElementById('price-more');
    const less = document.getElementById('price-less');
    const pageSize = 8;
    let visibleLimit = pageSize;
    let selectedCategory = 'all';

    function make(tag, text, classes) {
        const element = document.createElement(tag);
        element.textContent = text;
        element.className = classes || '';
        return element;
    }

    // кнопки категорий остаются на месте: выбор не сбрасывает фокус клавиатуры.
    for (const category of [{id:'all', label:'All essentials'}, ...store.categories]) {
        const button = make('button', category.label, 'btn btn-outline-success');
        button.type = 'button';
        button.dataset.priceCategory = category.id;
        button.setAttribute('aria-pressed', String(category.id === selectedCategory));
        categories.append(button);
    }

    function render() {
        // сначала фильтруем и сортируем все 50 товаров, затем показываем нужную часть.
        const matching = store.sortProducts(store.filterProducts(store.products, search.value, selectedCategory), sort.value);
        const visible = matching.slice(0, visibleLimit);
        results.replaceChildren();
        for (const product of visible) {
            const column = make('article', '', 'col-12 col-md-6');
            column.dataset.priceProduct = product.id;
            const link = make('a', '', 'price-card d-flex align-items-center gap-3 h-100');
            link.href = 'products.html?q=' + encodeURIComponent(product.englishName) + '#product-gallery';
            const image = document.createElement('img');
            image.src = product.image;
            image.alt = product.englishName;
            image.width = 72;
            image.height = 72;
            image.loading = 'lazy';
            const description = make('div', '', 'price-card-description flex-grow-1');
            description.append(make('h3', product.englishName, 'h6 mb-1'), make('p', product.unit, 'small text-body-secondary mb-0'));
            const price = make('div', '', 'price-card-amount text-end flex-shrink-0');
            price.append(make('strong', store.formatMoney(product.price)), make('span', 'View item ↗'));
            link.append(image, description, price);
            column.append(link);
            results.append(column);
        }
        count.textContent = visible.length + ' of ' + matching.length + ' matching prices';
        document.getElementById('price-empty').hidden = matching.length > 0;
        more.hidden = visible.length >= matching.length;
        more.textContent = 'Show ' + Math.min(pageSize, matching.length - visible.length) + ' more ↓';
        less.hidden = visible.length <= pageSize;
        document.getElementById('price-pager').classList.toggle('d-none', matching.length <= pageSize);
        for (const button of categories.children) {
            const active = button.dataset.priceCategory === selectedCategory;
            button.setAttribute('aria-pressed', String(active));
            button.classList.toggle('btn-success', active);
            button.classList.toggle('btn-outline-success', !active);
        }
    }

    function restart() { visibleLimit = pageSize; render(); }
    search.addEventListener('input', restart);
    sort.addEventListener('change', restart);
    categories.addEventListener('click', function (event) {
        const button = event.target.closest('[data-price-category]');
        if (!button) return;
        selectedCategory = button.dataset.priceCategory;
        restart();
    });
    document.getElementById('price-reset').addEventListener('click', function () {
        search.value = '';
        sort.value = 'price-asc';
        selectedCategory = 'all';
        restart();
        search.focus();
    });
    more.addEventListener('click', function () {
        const previousCount = results.children.length;
        visibleLimit += pageSize;
        render();
        results.children[previousCount].querySelector('a').focus();
    });
    less.addEventListener('click', function () {
        visibleLimit = pageSize;
        render();
        results.focus();
        results.scrollIntoView({block:'start'});
    });
    render();
})();
