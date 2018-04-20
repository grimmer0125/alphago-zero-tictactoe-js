const nj = require('numjs');

const a = nj.array([0, 1, 2]);
console.log(a);
const b = nj.multiply(a, 3);
console.log(b);
console.log('a again');
console.log(a);

const c = nj.array([[0, 1, 2], [0, 1, 2]]);
console.log('c shape:', c.shape[0]);
console.log('1');
console.log(c);
console.log('cc:', c.tolist());
c2 = c.clone();
console.log(c2);
console.log('c2');

const k = [1, 2];
console.log(k);

