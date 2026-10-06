const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(
  '<img src="/logo.png" alt="Ahmad Scales Logo" style={{ width: \'70px\', height: \'auto\', objectFit: \'contain\' }} />',
  '<img src="/logo.png" alt="Ahmad Scales Logo" style={{ width: \'70px\', height: \'auto\', objectFit: \'contain\', transform: \'translateX(-6px)\' }} />'
);

// Also scale down the massive fonts slightly to fix "everything looks too big"
code = code.replace(/clamp\(5rem, 10vw, 12rem\)/g, 'clamp(4.5rem, 9vw, 10.5rem)'); // Brand story title
code = code.replace(/clamp\(4rem, 8vw, 8rem\)/g, 'clamp(3.5rem, 7vw, 7rem)'); // About/Contact titles
code = code.replace(/clamp\(3\.5rem, 8vw, 6rem\)/g, 'clamp(3rem, 7vw, 5.5rem)'); // Listing Images title

fs.writeFileSync('src/App.jsx', code);

let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/clamp\(4rem, 12vw, 12rem\)/g, 'clamp(3.5rem, 10vw, 10rem)'); // Hero title
css = css.replace(/clamp\(4rem, 15vw, 15rem\)/g, 'clamp(3.5rem, 12vw, 12rem)'); // .text-huge
css = css.replace(/clamp\(3rem, 8vw, 8rem\)/g, 'clamp(2.5rem, 7vw, 7rem)'); // .text-impact
fs.writeFileSync('src/index.css', css);
