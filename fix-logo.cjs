const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Replace the image tag with transform to use marginLeft for a more noticeable shift
code = code.replace(
  '<img src="/logo.png" alt="Ahmad Scales Logo" style={{ width: \'70px\', height: \'auto\', objectFit: \'contain\', transform: \'translateX(-6px)\' }} />',
  '<img src="/logo.png" alt="Ahmad Scales Logo" style={{ width: \'70px\', height: \'auto\', objectFit: \'contain\', marginLeft: \'-20px\' }} />'
);

fs.writeFileSync('src/App.jsx', code);
