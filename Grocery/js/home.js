'use strict';

// тут чистый JS. store.js грузится раньше и даёт нам категории и функции для корзины.
// из-за defer HTML уже разобран, поэтому можно искать блоки на странице.
(function () {
    const store = window.Lido;
    const host = document.getElementById('products-summary');
    // если нет данных или блока, выходим, чтобы не пытаться работать с пустым элементом.
    if (!store || !host) return;

    // хтмл элемент с помощью докумнт креат и потому вставляем в страницу
    // в  make() задаём текст и классы, а ниже вставляем готовый элемент через append().
    function make(tag, text, classes) {
        const element = document.createElement(tag);
        element.textContent = text;
        element.className = classes || '';
        return element;
    }
    const guide = make('div', '', 'row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 mb-3');
    guide.id = 'home-category-list';
    // по одной кнопке на категорию. ID в ?category= нужен, чтобы Products сразу выбрал её.
    for (const category of store.categories) {
        const column = make('div', '', 'col');
        const products = store.products.filter(function (product) { return product.category === category.id; });
        const link = make('a', '', 'category-tile');
        const image = document.createElement('img');
        image.src = products[0].image;
        image.alt = products[0].englishName;
        image.width = 180;
        image.height = 105;
        image.loading = 'lazy';
        link.append(image, make('strong', category.label), make('span', products.length + ' essentials to explore ↗'));
        link.href = 'products.html?category=' + encodeURIComponent(category.id) + '#product-gallery';
        column.append(link);
        guide.append(column);
    }
    host.append(guide);
    // подборка ведёт к реальному товару в каталоге; цены берём из общего массива.
    const featured = make('section', '', 'home-featured');
    featured.append(make('p', 'A FEW EVERYDAY ESSENTIALS', 'eyebrow'), make('h2', 'For the week ahead', 'section-title mb-4'));
    const featuredRow = make('div', '', 'row row-cols-2 row-cols-md-4 g-3');
    for (const product of [store.products[0], store.products[10], store.products[30], store.products[40]]) {
        const column = make('div', '', 'col');
        const productLink = make('a', '', 'featured-link');
        productLink.href = 'products.html?q=' + encodeURIComponent(product.englishName) + '#product-gallery';
        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.englishName;
        image.width = 220;
        image.height = 130;
        image.loading = 'lazy';
        productLink.append(image, make('strong', product.englishName), make('span', store.formatMoney(product.price)));
        column.append(productLink);
        featuredRow.append(column);
    }
    featured.append(featuredRow);
    host.after(featured);

})();
