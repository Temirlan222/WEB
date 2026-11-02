'use strict';

// jQuery ready keeps the shared data API available before later ready callbacks run.
$(function () {
    // Galmart Astana listing snapshots; these are not live Lido stock or price promises.
    const storeCategories = [
        {
            "id": "dairy",
            "label": "Dairy & eggs",
            "description": "Milk, cheese, cream and eggs for everyday meals."
        },
        {
            "id": "produce",
            "label": "Fruit & vegetables",
            "description": "Fresh produce, with the price shown per item or kilogram."
        },
        {
            "id": "meat",
            "label": "Meat & fish",
            "description": "Poultry, beef and seafood. Check the listed pack size."
        },
        {
            "id": "bakery",
            "label": "Bakery",
            "description": "Bread, baguettes and loaves for breakfast and dinner."
        },
        {
            "id": "pantry",
            "label": "Pantry",
            "description": "Flour, grains and pasta to keep your kitchen stocked."
        }
    ];
    const catalogueSource = {
        "retailer": "Galmart via Wolt",
        "store": "Avstriyskiy Kvartal, Kaldayakov 6",
        "city": "Astana",
        "checkedAt": "2026-11-02",
        "url": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal"
    };
    const storeProducts = [
        {
            "id": "milk-rodina",
            "name": "Молоко пастеризованное Родина 3,2%, 1000 мл финпак",
            "englishName": "Rodina pasteurised milk 3.2%",
            "category": "dairy",
            "unit": "1 L",
            "price": 525,
            "image": "images/catalogue/milk-rodina.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/moloko-pasterizovannoe-rodina-3-2-1000-ml-finpak-itemid-39e64293b6c358f14ae08271"
        },
        {
            "id": "milk-prostokvashino",
            "name": "Молоко ультрапастеризованное Простоквашино 3,2%, 950 мл",
            "englishName": "Prostokvashino UHT milk 3.2%",
            "category": "dairy",
            "unit": "950 mL",
            "price": 1387,
            "image": "images/catalogue/milk-prostokvashino.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/moloko-ultrapasterizovannoe-prostokvashino-3-2-950-ml-itemid-4def5fefb2b85463c8c7cc7d"
        },
        {
            "id": "milk-lactel",
            "name": "Молоко стерилизованное Lactel с витамином D 1,5%, 1000 мл тетра пак",
            "englishName": "Lactel milk with vitamin D 1.5%",
            "category": "dairy",
            "unit": "1 L",
            "price": 895,
            "image": "images/catalogue/milk-lactel.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/moloko-sterilizovannoe-lactel-s-vitaminom-d-1-5-1000-ml-tetra-pak-itemid-6a9e88701adc2863357d2112"
        },
        {
            "id": "cream-petropavlovsk",
            "name": "Сливки Петропавловские 10% 250 мл",
            "englishName": "Petropavlovsk cream 10%",
            "category": "dairy",
            "unit": "250 mL",
            "price": 640,
            "image": "images/catalogue/cream-petropavlovsk.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/slivki-petropavlovskie-10-250-ml-itemid-31f5b3e42030490a1572d2b6"
        },
        {
            "id": "cheese-hochland",
            "name": "Сыр плавленный Hochland сливочный, 200 г",
            "englishName": "Hochland creamy processed cheese",
            "category": "dairy",
            "unit": "200 g",
            "price": 1850,
            "image": "images/catalogue/cheese-hochland.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/syr-plavlennyj-hochland-slivochnyj-200-g-itemid-cf69b41e5d07ddaf29929a0a"
        },
        {
            "id": "mozzarella-galbani",
            "name": "Сыр Galbani моцарелла санта лючиа 48%, 125 г полиэтиленовый пакет",
            "englishName": "Galbani Santa Lucia mozzarella 48%",
            "category": "dairy",
            "unit": "125 g",
            "price": 1775,
            "image": "images/catalogue/mozzarella-galbani.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/syr-galbani-mocarella-santa-lyuchia-48-125-g-polietilenovyj-paket-itemid-f8f9c1f3567c84c794b76977"
        },
        {
            "id": "eggs-kazger",
            "name": "Яйца Казгер Кус отборное, 10 шт пластиковая упаковка",
            "englishName": "Kazger Kus selected eggs",
            "category": "dairy",
            "unit": "10 item(s)",
            "price": 940,
            "image": "images/catalogue/eggs-kazger.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/yajca-kazger-kus-otbornoe-10-sht-plastikovaya-upakovka-itemid-5ed6f9626ea1a33305583a34"
        },
        {
            "id": "quail-eggs",
            "name": "Яйца перепелиное Птицыно-Курицыно, 20 шт",
            "englishName": "Ptitsyno-Kuritsyno quail eggs",
            "category": "dairy",
            "unit": "20 item(s)",
            "price": 1500,
            "image": "images/catalogue/quail-eggs.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/yajca-perepelinoe-pticyno-kuricyno-20-sht-itemid-0b3f15b68eb95f1dad993a36"
        },
        {
            "id": "ayran-selo-lesnoe",
            "name": "Айран Село Лесное 1,5%, 930 мл пластиковая бутылка",
            "englishName": "Selo Lesnoe ayran 1.5%",
            "category": "dairy",
            "unit": "930 mL",
            "price": 700,
            "image": "images/catalogue/ayran-selo-lesnoe.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/ajran-selo-lesnoe-1-5-930-ml-plastikovaya-butylka-itemid-4090b1b17618da966574e987"
        },
        {
            "id": "sour-cream-emil",
            "name": "Сметана Эмиль 15%, 380 г",
            "englishName": "Emil sour cream 15%",
            "category": "dairy",
            "unit": "380 g",
            "price": 1119,
            "image": "images/catalogue/sour-cream-emil.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/smetana-emil-15-380-g-itemid-3623a3fc9717ef3850b475ff"
        },
        {
            "id": "potatoes",
            "name": "Картофель свежий, кг",
            "englishName": "Fresh potatoes",
            "category": "produce",
            "unit": "1 kg",
            "price": 304,
            "image": "images/catalogue/potatoes.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/kartofel-svezhij-kg-itemid-0ae07622f17f0ef48f3503ad"
        },
        {
            "id": "carrots",
            "name": "Морковь свежая, кг",
            "englishName": "Fresh carrots",
            "category": "produce",
            "unit": "1 kg",
            "price": 277,
            "image": "images/catalogue/carrots.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/morkov-svezhaya-kg-itemid-1e65f49b21a869cb6849a3f1"
        },
        {
            "id": "onions",
            "name": "Лук репчатый свежий, кг",
            "englishName": "Fresh onions",
            "category": "produce",
            "unit": "1 kg",
            "price": 165,
            "image": "images/catalogue/onions.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/luk-repchatyj-svezhij-kg-itemid-e95379292e7c30ca460b3e9d"
        },
        {
            "id": "cucumbers",
            "name": "Огурцы миринда Караганда Топар, кг",
            "englishName": "Mirinda cucumbers",
            "category": "produce",
            "unit": "1 kg",
            "price": 1344,
            "image": "images/catalogue/cucumbers.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/ogurcy-mirinda-karaganda-topar-kg-itemid-e8e54575f274ead7c4a546e9"
        },
        {
            "id": "tomatoes",
            "name": "Томаты на ветке красные кг",
            "englishName": "Red tomatoes on the vine",
            "category": "produce",
            "unit": "1 kg",
            "price": 1120,
            "image": "images/catalogue/tomatoes.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/tomaty-na-vetke-krasnye-kg-itemid-5d5dbaf5c22a7effdc9a5861"
        },
        {
            "id": "bananas",
            "name": "Бананы свежие, кг",
            "englishName": "Fresh bananas",
            "category": "produce",
            "unit": "1 kg",
            "price": 1445,
            "image": "images/catalogue/bananas.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/banany-svezhie-kg-itemid-602c2c2e582d83ffb4708831"
        },
        {
            "id": "apples",
            "name": "Яблоки Amal Bio ред делишес, кг",
            "englishName": "Amal Bio Red Delicious apples",
            "category": "produce",
            "unit": "1 kg",
            "price": 706,
            "image": "images/catalogue/apples.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/yabloki-amal-bio-red-delishes-kg-itemid-b086fc9d232a0bdc3ad7d185"
        },
        {
            "id": "oranges",
            "name": "Апельсин, кг",
            "englishName": "Oranges",
            "category": "produce",
            "unit": "1 kg",
            "price": 1985,
            "image": "images/catalogue/oranges.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/apelsin-kg-itemid-114f0fbee81c23c485b41a89"
        },
        {
            "id": "avocado",
            "name": "Авокадо свежиий, шт",
            "englishName": "Fresh avocado",
            "category": "produce",
            "unit": "1 item(s)",
            "price": 1610,
            "image": "images/catalogue/avocado.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/avokado-svezhiij-sht-itemid-b177a8e0bc4c9f9605b49663"
        },
        {
            "id": "mandarins",
            "name": "Мандарины  Sweet, вес",
            "englishName": "Sweet mandarins",
            "category": "produce",
            "unit": "1 kg",
            "price": 1885,
            "image": "images/catalogue/mandarins.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/mandariny-sweet-ves-itemid-7e7067e791c219960af2db81"
        },
        {
            "id": "chicken-fillet",
            "name": "Филе Кус Вкус на подложке охлажденное, кг",
            "englishName": "Kus Vkus chilled chicken fillet",
            "category": "meat",
            "unit": "1 kg",
            "price": 3680,
            "image": "images/catalogue/chicken-fillet.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/file-kus-vkus-na-podlozhke-ohlazhdennoe-kg-itemid-c9d4fbb41a451619a720e7a5"
        },
        {
            "id": "chicken-thigh",
            "name": "Бедро Кус-Вкус на подложке охлажденное, кг",
            "englishName": "Kus Vkus chilled chicken thighs",
            "category": "meat",
            "unit": "1 kg",
            "price": 2348,
            "image": "images/catalogue/chicken-thigh.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/bedro-kus-vkus-na-podlozhke-ohlazhdennoe-kg-itemid-43756c2df022f1d8b89720a9"
        },
        {
            "id": "chicken-drumstick",
            "name": "Голень Кус Вкус на подложке охлажденное, кг",
            "englishName": "Kus Vkus chilled chicken drumsticks",
            "category": "meat",
            "unit": "1 kg",
            "price": 2727,
            "image": "images/catalogue/chicken-drumstick.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/golen-kus-vkus-na-podlozhke-ohlazhdennoe-kg-itemid-2db00ac14b7753d1994640b3"
        },
        {
            "id": "beef-mince",
            "name": "П/ф фарш говяжий диетический kazbeef охл в/у",
            "englishName": "KazBeef chilled lean beef mince",
            "category": "meat",
            "unit": "1 kg",
            "price": 8217,
            "image": "images/catalogue/beef-mince.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/p-f-farsh-govyazhij-dieticheskij-kazbeef-ohl-v-u-itemid-a08bb28aa4e5396736ae977c"
        },
        {
            "id": "beef-goulash",
            "name": "П/ф говядина гуляш kazbeef охл в/у",
            "englishName": "KazBeef chilled beef goulash",
            "category": "meat",
            "unit": "1 kg",
            "price": 8930,
            "image": "images/catalogue/beef-goulash.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/p-f-govyadina-gulyash-kazbeef-ohl-v-u-itemid-b1b4e0045210da4675d74c09"
        },
        {
            "id": "trout-smoked",
            "name": "Филе-кусок Санта Бремор форель подкопченная, 200 г пластиковая упаковка",
            "englishName": "Santa Bremor smoked trout fillet",
            "category": "meat",
            "unit": "200 g",
            "price": 4225,
            "image": "images/catalogue/trout-smoked.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/file-kusok-santa-bremor-forel-podkopchennaya-200-g-plastikovaya-upakovka-itemid-2b07fd3902a24ed91df25ae9"
        },
        {
            "id": "trout-salted",
            "name": "Филе-кусок Санта Бремор форель слабосоленая, 200 г пластиковая упаковка",
            "englishName": "Santa Bremor lightly salted trout fillet",
            "category": "meat",
            "unit": "200 g",
            "price": 4025,
            "image": "images/catalogue/trout-salted.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/file-kusok-santa-bremor-forel-slabosolenaya-200-g-plastikovaya-upakovka-itemid-fdc385358f6fed812bff0687"
        },
        {
            "id": "mackerel-vici",
            "name": "Скумбрия Vici атлант рез без головы крупная охлажденная холодного.копч, 480 г",
            "englishName": "Vici cold-smoked Atlantic mackerel",
            "category": "meat",
            "unit": "480 g",
            "price": 6300,
            "image": "images/catalogue/mackerel-vici.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/skumbriya-vici-atlant-rez-bez-golovy-krupnaya-ohlazhdennaya-holodnogo-kopch-480-g-itemid-7ff7931bede5e9282e65be01"
        },
        {
            "id": "salmon-russkoe-more",
            "name": "Семга русское море подкопч 200 г",
            "englishName": "Russkoe More smoked salmon",
            "category": "meat",
            "unit": "200 g",
            "price": 5970,
            "image": "images/catalogue/salmon-russkoe-more.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/semga-russkoe-more-podkopch-200-g-itemid-c679d76dbc0609c7ee8666d7"
        },
        {
            "id": "tuna-celeste",
            "name": "Тунец Celeste филе натуральный 140г",
            "englishName": "Celeste natural tuna fillet",
            "category": "meat",
            "unit": "140 g",
            "price": 1620,
            "image": "images/catalogue/tuna-celeste.webp",
            "sourceUrl": "https://wolt.com/en/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/tunec-celeste-file-naturalnyj-140g-itemid-19cf5dd6068eedc86dbf37e8"
        },
        {
            "id": "malt-baguette",
            "name": "Багет солодовый, шт",
            "englishName": "Malt baguette",
            "category": "bakery",
            "unit": "1 item(s)",
            "price": 400,
            "image": "images/catalogue/malt-baguette.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/baget-solodovyj-sht-itemid-808b2d2428af6f67ff624f94"
        },
        {
            "id": "garlic-baguette",
            "name": "Багет чесночный, шт",
            "englishName": "Garlic baguette",
            "category": "bakery",
            "unit": "1 item(s)",
            "price": 480,
            "image": "images/catalogue/garlic-baguette.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/baget-chesnochnyj-sht-itemid-d13976548abbe4bd75744903"
        },
        {
            "id": "rye-bran-loaf",
            "name": "Батон бездрожжевой ржаной отрубной, шт",
            "englishName": "Yeast-free rye and bran loaf",
            "category": "bakery",
            "unit": "1 item(s)",
            "price": 440,
            "image": "images/catalogue/rye-bran-loaf.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/baton-bezdrozhzhevoj-rzhanoj-otrubnoj-sht-itemid-23731bc7267571739861af71"
        },
        {
            "id": "bran-loaf",
            "name": "Батон бездрожжевой с отрубями, шт",
            "englishName": "Yeast-free bran loaf",
            "category": "bakery",
            "unit": "1 item(s)",
            "price": 500,
            "image": "images/catalogue/bran-loaf.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/baton-bezdrozhzhevoj-s-otrubyami-sht-itemid-4c57835d861af428c3876061"
        },
        {
            "id": "yeast-free-loaf",
            "name": "Батон бездрожжей, шт",
            "englishName": "Yeast-free loaf",
            "category": "bakery",
            "unit": "500 g",
            "price": 620,
            "image": "images/catalogue/yeast-free-loaf.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/baton-bezdrozhzhej-sht-itemid-dcf44bd06af9c57054b112b7"
        },
        {
            "id": "rye-loaf",
            "name": "Батон бездрожжей ржаной, шт",
            "englishName": "Yeast-free rye loaf",
            "category": "bakery",
            "unit": "1 item(s)",
            "price": 490,
            "image": "images/catalogue/rye-loaf.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/baton-bezdrozhzhej-rzhanoj-sht-itemid-1ff28bff442bee5e027d1a89"
        },
        {
            "id": "kefir-loaf",
            "name": "Батон нарезной на кефире, шт",
            "englishName": "Sliced kefir loaf",
            "category": "bakery",
            "unit": "1 item(s)",
            "price": 450,
            "image": "images/catalogue/kefir-loaf.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/baton-nareznoj-na-kefire-sht-itemid-872eadb588f7430c42f41812"
        },
        {
            "id": "bavarian-bread",
            "name": "Хлеб баварский бездрожжевой, 300 г",
            "englishName": "Bavarian yeast-free bread",
            "category": "bakery",
            "unit": "300 g",
            "price": 450,
            "image": "images/catalogue/bavarian-bread.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/hleb-bavarskij-bezdrozhzhevoj-300-g-itemid-9f5ff5be9d1750c2353a2194"
        },
        {
            "id": "homemade-bread",
            "name": "Хлеб домашний, шт",
            "englishName": "Homemade bread",
            "category": "bakery",
            "unit": "1 item(s)",
            "price": 196,
            "image": "images/catalogue/homemade-bread.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/hleb-domashnij-sht-itemid-5128d314fb3762fbcdfaf366"
        },
        {
            "id": "corn-bread",
            "name": "Хлеб кукурузный бездрожжевой, шт",
            "englishName": "Yeast-free corn bread",
            "category": "bakery",
            "unit": "1 item(s)",
            "price": 550,
            "image": "images/catalogue/corn-bread.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/hleb-kukuruznyj-bezdrozhzhevoj-sht-itemid-4ed884d40949bd1709ac8bf5"
        },
        {
            "id": "sto-pudov-flour",
            "name": "Мука Сто Пудов высший сорт 2000 г",
            "englishName": "Sto Pudov premium wheat flour",
            "category": "pantry",
            "unit": "2000 g",
            "price": 1210,
            "image": "images/catalogue/sto-pudov-flour.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/muka-sto-pudov-vysshij-sort-2000-g-itemid-bc994f4605886e5f497949ef"
        },
        {
            "id": "makfa-flour",
            "name": "Мука Makfa высший сорт 2000 г",
            "englishName": "Makfa premium wheat flour",
            "category": "pantry",
            "unit": "2000 g",
            "price": 1255,
            "image": "images/catalogue/makfa-flour.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/muka-makfa-vysshij-sort-2000-g-itemid-aabce1569b53912e2a853a87"
        },
        {
            "id": "galmart-buckwheat",
            "name": "Крупа galmart гречка 800г мяг/упак",
            "englishName": "Galmart buckwheat",
            "category": "pantry",
            "unit": "800 g",
            "price": 513,
            "image": "images/catalogue/galmart-buckwheat.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/krupa-galmart-grechka-800g-myag-upak-itemid-2761277400b987430d013618"
        },
        {
            "id": "tsar-oats",
            "name": "Хлопья Царь овсяная геркулесовая, 400 г",
            "englishName": "Tsar rolled oats",
            "category": "pantry",
            "unit": "400 g",
            "price": 595,
            "image": "images/catalogue/tsar-oats.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/hlopya-car-ovsyanaya-gerkulesovaya-400-g-itemid-19a9cfb7def669911f864457"
        },
        {
            "id": "natural-kitchen-peas",
            "name": "Крупа Натуральная Кухня горох колотый, 700 г",
            "englishName": "Natural Kitchen split peas",
            "category": "pantry",
            "unit": "700 g",
            "price": 515,
            "image": "images/catalogue/natural-kitchen-peas.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/krupa-naturalnaya-kuhnya-goroh-kolotyj-700-g-itemid-3fe246369dc99a955c807bbd"
        },
        {
            "id": "uvelka-semolina",
            "name": "Крупа Увелка манная 700 г",
            "englishName": "Uvelka semolina",
            "category": "pantry",
            "unit": "700 g",
            "price": 820,
            "image": "images/catalogue/uvelka-semolina.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/krupa-uvelka-mannaya-700-g-itemid-f62db578f8da44fe605c8a58"
        },
        {
            "id": "barilla-fettuccine",
            "name": "Макароны Barilla феттучине, 500 г",
            "englishName": "Barilla fettuccine",
            "category": "pantry",
            "unit": "500 g",
            "price": 3085,
            "image": "images/catalogue/barilla-fettuccine.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/makarony-barilla-fettuchine-500-g-itemid-4423dfda111d5c2ac0849a29"
        },
        {
            "id": "granoro-spaghetti",
            "name": "Макароны Granoro spaghetti ristoranti №14, 500 г",
            "englishName": "Granoro spaghetti ristoranti No.14",
            "category": "pantry",
            "unit": "500 g",
            "price": 1015,
            "image": "images/catalogue/granoro-spaghetti.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/itemid-7a2ad9ad6128ae96962437dc"
        },
        {
            "id": "kemmi-beshbarmak",
            "name": "Лапша Кэмми бесбармачная мега дастархан особо тонкая яичная, 450 г",
            "englishName": "Kemmi Mega Dastarkhan egg noodles",
            "category": "pantry",
            "unit": "450 g",
            "price": 980,
            "image": "images/catalogue/kemmi-beshbarmak.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/lapsha-kemmi-besbarmachnaya-mega-dastarhan-osobo-tonkaya-yaichnaya-450-g-itemid-40ebe1e5bd6e1df54143dc1b"
        },
        {
            "id": "kemmi-egg-noodles",
            "name": "Лапша Кэмми яичная, 250 г",
            "englishName": "Kemmi egg noodles",
            "category": "pantry",
            "unit": "250 g",
            "price": 470,
            "image": "images/catalogue/kemmi-egg-noodles.webp",
            "sourceUrl": "https://wolt.com/ru/kaz/nur-sultan/venue/galmart-avstriyskiy-kvartal/lapsha-kemmi-yaichnaya-250-g-itemid-47afcf3361b7168d9f7a1bf7"
        }
    ];

    function findProduct(id) {
        return storeProducts.find(function (product) {
            return product.id === id;
        });
    }

    function filterProducts(items, search, category) {
        const query = search.trim().toLowerCase();
        return items.filter(function (product) {
            const searchableName = product.name + ' ' + product.englishName;
            const matchesText = searchableName.toLowerCase().includes(query);
            const matchesCategory = category === 'all' || product.category === category;
            return matchesText && matchesCategory;
        });
    }

    function sortProducts(items, order) {
        const result = items.slice();
        if (order === 'price-asc') result.sort(function (a, b) { return a.price - b.price; });
        if (order === 'price-desc') result.sort(function (a, b) { return b.price - a.price; });
        return result;
    }

    function validQuantity(value) {
        if (typeof value !== 'number' && typeof value !== 'string') {
            return false;
        }
        const quantity = Number(value);
        return Number.isInteger(quantity) && quantity >= 1 && quantity <= 999;
    }

    function normalizeCart(items) {
        const result = [];
        if (!Array.isArray(items)) {
            return result;
        }
        for (const item of items) {
            if (!item || !findProduct(item.id) || !validQuantity(item.quantity)) {
                continue;
            }
            const existing = result.find(function (line) { return line.id === item.id; });
            if (existing) {
                existing.quantity = Math.min(999, existing.quantity + Number(item.quantity));
            } else {
                result.push({ id: item.id, quantity: Number(item.quantity) });
            }
        }
        return result;
    }

    function changeQuantity(cart, id, quantity) {
        const result = normalizeCart(cart);
        if (!findProduct(id)) {
            return result;
        }
        if (quantity === 0) {
            return result.filter(function (line) { return line.id !== id; });
        }
        if (!validQuantity(quantity)) {
            return result;
        }
        const line = result.find(function (item) { return item.id === id; });
        if (line) {
            line.quantity = Number(quantity);
        } else {
            result.push({ id: id, quantity: Number(quantity) });
        }
        return result;
    }

    function addItem(cart, id) {
        const line = normalizeCart(cart).find(function (item) { return item.id === id; });
        const quantity = line ? line.quantity + 1 : 1;
        return changeQuantity(cart, id, quantity);
    }

    function cartTotals(cart) {
        let quantity = 0;
        let total = 0;
        for (const line of normalizeCart(cart)) {
            const product = findProduct(line.id);
            quantity += line.quantity;
            total += product.price * line.quantity;
        }
        return { quantity: quantity, total: total };
    }

    function formatMoney(amount) {
        return new Intl.NumberFormat('en-US').format(amount) + ' ₸';
    }

    function makeReference() {
        return 'DEMO-' + Math.floor(100000 + Math.random() * 900000);
    }

    function formatDate(date) {
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    }

    function today() {
        return formatDate(new Date());
    }

    function validDate(value) {
        const parsed = new Date(value + 'T00:00:00');
        return !Number.isNaN(parsed.getTime()) && formatDate(parsed) === value;
    }

    function validateRequest(values, currentDate) {
        const errors = {};
        const name = String(values.name || '').trim();
        const email = String(values.email || '').trim();
        const phone = String(values.phone || '').trim();
        const product = String(values.product || '').trim();
        const date = String(values.date || '');
        const categories = storeCategories.map(function (category) { return category.id; });
        if (name.length < 2 || name.length > 100) {
            errors.name = 'Enter a name with 2 to 100 characters.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Enter a valid email address.';
        }
        const digits = phone.replace(/\D/g, '');
        if (values.method === 'phone' && phone === '') {
            errors.phone = 'Enter a phone number when choosing phone contact.';
        } else if (phone !== '' && (!/^\+?[\d\s()-]+$/.test(phone) || digits.length < 10 || digits.length > 15)) {
            errors.phone = 'Enter a valid phone number with 10 to 15 digits.';
        }
        if (product.length === 0 || product.length > 100) {
            errors.product = 'Enter a product name with 1 to 100 characters.';
        }
        if (!validQuantity(values.quantity)) {
            errors.quantity = 'Enter a whole quantity from 1 to 999.';
        }
        if (date !== '' && (!validDate(date) || date < currentDate)) {
            errors.date = 'Choose today or a future date.';
        }
        if (!categories.includes(values.category)) {
            errors.category = 'Choose a product category.';
        }
        if (values.method !== 'email' && values.method !== 'phone') {
            errors.method = 'Choose email or phone contact.';
        }
        if (values.permission !== true) {
            errors.permission = 'Confirm that you understand this is a demonstration.';
        }
        if (String(values.comment || '').length > 1000) {
            errors.comment = 'Keep your comment within 1000 characters.';
        }
        return errors;
    }


    window.Lido = {
        products: storeProducts,
        categories: storeCategories,
        catalogueSource: catalogueSource,
        sortProducts: sortProducts,
        cart: [],
        findProduct: findProduct,
        filterProducts: filterProducts,
        validQuantity: validQuantity,
        normalizeCart: normalizeCart,
        changeQuantity: changeQuantity,
        addItem: addItem,
        cartTotals: cartTotals,
        formatMoney: formatMoney,
        makeReference: makeReference,
        today: today,
        validateRequest: validateRequest
    };
});
