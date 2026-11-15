'use strict';
// общий счётчик ведёт в отдельную корзину на каждой странице.
(function () {
    const store = window.Lido;
    if (!store) return;
    const siteSearch = document.getElementById('site-search');
    if (siteSearch) siteSearch.value = (new URLSearchParams(location.search).get('q') || '').slice(0,200);
    if (window.jQuery) jQuery.fx.off = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const notice = document.createElement('p');
    notice.className = 'alert alert-warning';
    notice.id = 'storage-notice';
    notice.setAttribute('role', 'status');
    notice.hidden = true;
    document.querySelector('main').prepend(notice);
    function updateNavigation() {
        const quantity = store.cartTotals(store.cart).quantity;
        document.querySelectorAll('[data-cart-link]').forEach(function (link) {
            link.textContent = 'Cart (' + quantity + ')';
        });
        notice.hidden = store.storageAvailable;
        notice.textContent = 'Your browser cannot save this list. Items will be lost when you leave this page. Allow site storage to keep your cart.';
    }
    window.addEventListener('cart-updated', updateNavigation);
    updateNavigation();
})();
