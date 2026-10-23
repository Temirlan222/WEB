const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const clean = text => text.replace(/\r\n/g, '\n');
const git = file => clean(cp.execFileSync('git', ['show', 'midterm:' + file], {cwd:root, encoding:'utf8'}));
const pages = ['index', 'products', 'prices', 'delivery', 'contacts', 'colophon'];
for (const page of pages) {
    const file = 'Grocery/' + page + '.html';
    const source = clean(fs.readFileSync(path.join(root,file),'utf8'));
    const withoutScripts = source.replace(/^[ \t]*<script src="js\/(store|main|products|request)\.js" defer><\/script>\n/gm, '');
    assert.equal(withoutScripts, git(file), file + ': only deferred script links may differ');
    const expected = page === 'products' ? ['store','main','products','request'] : ['store','main'];
    assert.deepEqual([...source.matchAll(/<script src="js\/(\w+)\.js" defer>/g)].map(m=>m[1]),expected);
}
for (const name of fs.readdirSync(path.join(root,'Grocery/css'))) {
    if (!name.endsWith('.css')) continue;
    const file = 'Grocery/css/' + name;
    assert.equal(clean(fs.readFileSync(path.join(root,file),'utf8')),git(file),file+': CSS must remain frozen');
}
for (const name of fs.readdirSync(path.join(root,'Grocery/js'))) {
    if (!name.endsWith('.js')) continue;
    const source = fs.readFileSync(path.join(root,'Grocery/js',name),'utf8');
    assert.ok(source.startsWith("'use strict';"),name+': strict mode');
    assert.equal(/\bvar\s|\.innerHTML\b|\.style\b|\beval\s*\(|(?<![=!])==(?!=)|(?<!!)!=(?!=)/.test(source),false,name+': prohibited code');
    assert.equal(/\bon\w+\s*=/.test(source),false,name+': no inline events');
}
const verificationDate = process.env.VERIFIED_ON || new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Qyzylorda'}).format(new Date());
const result = {date:verificationDate,sourceHtml:'six midterm snapshots plus deferred script links only',css:'all four stylesheets unchanged',javascript:'strict mode; const/let; no unsafe HTML, styles, inline events or loose equality',passed:true};
fs.writeFileSync(path.join(root,'Grocery/Temirlan_Assignment4-5/evidence/source-checks.json'),JSON.stringify(result,null,2));
console.log('PASS: six HTML snapshots, four frozen stylesheets, script order and prohibited-pattern checks.');
