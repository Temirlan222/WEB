# Assignment 3 — аудит двух страниц

Область работы: **Home (`index.html`) и Products (`products.html`)**. Основа — GitHub `main` на коммите `e24d43e`, с сохранением локальных изменений главной страницы. Страницы, тексты, адреса ссылок, изображения, поля формы и порядок основных разделов сохранены. Новых HTML-страниц нет.

| Критерий | Результат и место проверки |
| --- | --- |
| Продолжение существующего сайта | Сохранены обе страницы, семантические разделы и контент; добавлены классы и необходимые обёртки |
| Bootstrap CDN и комментарий версии | CSS и bundle **5.3.8** на обеих страницах; комментарий в `head`; личный CSS подключён после Bootstrap |
| `container` и `container-fluid` | `main` и меню ограничивают ширину; шапка и подвал занимают всю ширину. Причины описаны HTML-комментариями |
| Responsive grid минимум в 3 блоках | Фото с описанием, Opening Hours, товары, описания категорий, форма, подвал |
| Nested row | `.request-form.row > fieldset.col-12 > .row.g-3`, с комментарием |
| Телефон / планшет / компьютер | Обе страницы проверены в Edge при **375 / 768 / 1366 px**; ширина документа равна ширине окна, горизонтального переполнения нет |
| Collapsing navbar | `navbar-expand-lg`, toggler и `collapse`; открытие и закрытие проверены на 375 и 768 px, обычное меню — на 1366 px |
| Responsive utilities на двух элементах | Шапка и подвал: `text-center text-md-start`; ссылка Top: `d-none d-md-inline-block`; дополнительно блок цитаты |
| Typography | `display-5`, `lead`, `h3`, `h5`, `fw-bold`, `small`, `text-body-secondary`, `text-warning`, `blockquote` |
| Минимум 4 button classes | `btn`, `btn-success`, `btn-outline-success`, `btn-lg`, `btn-sm`, `disabled`; настоящие reset/submit и ссылка Top |
| Disabled state | `Submit Request` имеет настоящий атрибут `disabled`, класс и пояснение через `aria-describedby`; форма не имеет сервера для отправки |
| Минимум 10 utility classes | Например: `py-4`, `mb-4`, `pb-4`, `p-3`, `ms-3`, `gap-2`, `bg-white`, `text-warning`, `border`, `rounded`, `shadow-sm`, `d-flex`, `flex-wrap`, `align-items-center`, `d-none`, `text-md-start` |
| Уместный Bootstrap component | `Card` для трёх существующих товаров; комментарий над галереей объясняет адаптацию официальной разметки |
| Короткий correction layer | `css/temirlan.css`: **25 строк**, только фирменные цвета. Старые layout-правила удалены; `base.css` на этих страницах отключён |
| Список удалённых правил и замен | `css-replacements.md` |
| Запреты | В двух страницах и подключённом личном CSS нет inline styles, внутренних style-блоков, `!important`, собственного JS, других frameworks или ручных flex/grid/float-раскладок |
| Сохранность | Сравнение текста до/после пройдено; добавлены пояснение формы и реальный Popular badge вместо прежнего CSS-псевдоэлемента. Локальные ссылки и изображения существуют |
| W3C Nu HTML Checker | Локальный Nu **26.9.27 (0788818)**: **0 ошибок** в обеих страницах. После удаления тестового блока на Home обе страницы имеют **0 предупреждений**. Результат: `evidence/html-validation.json` |
| 4 скриншота | `evidence/products-375.png`, `products-768.png`, `products-1366.png`, `navigation-375-collapsed.png` |
| README | Обновлён раздел с областью Assignment 3, запуском, проверками и источниками |

## Область работы и проверок

- Зона ответственности Temirlan в Assignment 3 — только **Home (`index.html`) и Products (`products.html`)**. Другие страницы относятся к работе остальных участников и не входят в этот аудит.
- AI policy и AI log исключены по указанию пользователя.
- История коммитов отражается в GitHub; даты не изменяются искусственно. Подготовка к защите вынесена в отдельное руководство.
- Тестовая статья на главной странице удалена по последующему указанию пользователя; остальные разделы сохранены.
- Внешние телефонные, почтовые и 2GIS-ссылки сохранены; звонки, отправка писем и реальные обращения не выполнялись.

Источники: [Bootstrap CDN](https://getbootstrap.com/docs/5.3/getting-started/introduction/), [Card](https://getbootstrap.com/docs/5.3/components/card/), [Navbar](https://getbootstrap.com/docs/5.3/components/navbar/).
