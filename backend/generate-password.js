import bcrypt from 'bcryptjs';

const password = 'admin123';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nSQL Update:');
console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';`);
console.log(`UPDATE users SET password = '${hash}' WHERE username = 'superadmin';`);
