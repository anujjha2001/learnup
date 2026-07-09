const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace literal '$' that is not part of '${'
  // Also avoid replacing '$' in internal symbols like 'db.$transaction' or regexes like '/^\+?[1-9]\d{1,14}$/'
  
  // We can use a regex that matches '$' only if it's not followed by '{', '_', or a letter (e.g. '$transaction', '$extend', etc.), and not part of regex patterns.
  // But wait! A simpler way is to look at where '$' is used for pricing: e.g. '$199', '$99', '$' sign in UI.
  // Let's replace:
  // - '$' prefix in JSX: e.g. `$` or `{"$"}` or `$` followed by digits.
  // Let's check for matches:
  const rxJSXDollar = /([^A-Za-z0-9_.\-\/])\$([0-9]+)/g; // matches $199
  const rxSymbolDollar = /([^A-Za-z0-9_.\-\/\$\{])\$([^A-Za-z0-9_])/g; // matches standalone $

  content = content.replace(rxJSXDollar, '$1₹$2');
  
  // Let's also check for standalone '$' strings like "'$'" or `"$"`
  content = content.replace(/['"]\$['"]/g, "'₹'");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated currency in: ${file}`);
  }
});
