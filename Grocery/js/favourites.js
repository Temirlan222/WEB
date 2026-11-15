'use strict';
// избранное хранит только ID существующих товаров, отдельно от корзины.
(function () {
    const store = window.Lido;
    const key = 'lido-favourites';
    store.favourites = [];
    store.favouritesPersistent = true;
    function read() {
        let raw;
        try {
            raw = window.localStorage.getItem(key);
        } catch (error) {
            store.favouritesPersistent = false;
            return store.favourites;
        }
        try {
            const values = JSON.parse(raw);
            if (!Array.isArray(values)) return [];
            return [...new Set(values)].filter(id => store.products.some(product => product.id === id));
        } catch (error) {
            // неверный JSON не должен ломать страницу или возвращать старые значения.
            return [];
        }
    }
    store.favourites = read();
    store.toggleFavourite = function (id) {
        if (!store.products.some(product => product.id === id)) return;
        if (store.favouritesPersistent) store.favourites = read();
        store.favourites = store.favourites.includes(id)
            ? store.favourites.filter(value => value !== id)
            : [...store.favourites, id];
        try {
            window.localStorage.setItem(key, JSON.stringify(store.favourites));
            store.favouritesPersistent = true;
        } catch (error) { store.favouritesPersistent = false; }
        window.dispatchEvent(new Event('favourites-updated'));
    };
    window.addEventListener('storage', function (event) {
        if (event.key === key || event.key === null) {
            store.favourites = read();
            window.dispatchEvent(new Event('favourites-updated'));
        }
    });
})();
