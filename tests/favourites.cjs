const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const file = path.join(__dirname, '../Grocery/js/favourites.js');
assert.ok(fs.existsSync(file), 'Favourites persistence module exists');
function run(initial, blocked = false) {
    let saved = initial;
    const events = [];
    const store = {products:[{id:'milk'},{id:'bread'}]};
    const window = {Lido:store, localStorage:{
        getItem(){if(blocked) throw Error('blocked');return saved;},
        setItem(key,value){if(blocked) throw Error('blocked');saved=value;}
    },dispatchEvent(e){events.push(e.type);},addEventListener(){}};
    vm.runInNewContext(fs.readFileSync(file,'utf8'), {window,Event:class{constructor(type){this.type=type;}}});
    return {store,events,saved:()=>saved};
}
let app = run('["milk","milk","unknown",null]');
assert.deepEqual(Array.from(app.store.favourites), ['milk']);
app.store.toggleFavourite('bread');
assert.deepEqual(JSON.parse(app.saved()), ['milk','bread']);
app.store.toggleFavourite('milk');
assert.deepEqual(JSON.parse(app.saved()), ['bread']);
app.store.toggleFavourite('invalid');
assert.deepEqual(JSON.parse(app.saved()), ['bread']);
assert.equal(app.events.length,2);
assert.equal(run('{broken').store.favourites.length,0);
assert.equal(run('{}').store.favourites.length,0);
app = run(null,true);
app.store.toggleFavourite('milk');
assert.deepEqual(Array.from(app.store.favourites), ['milk']);
assert.equal(app.store.favouritesPersistent,false);
console.log('PASS: favourite toggle, valid IDs, duplicate cleanup, corrupt and blocked storage');
