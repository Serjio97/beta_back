// generate-hash.mjs
import bcrypt from 'bcrypt';

const password = 'admin123';

const hash = await bcrypt.hash(password, 10);
console.log('Generated hash:', hash);
