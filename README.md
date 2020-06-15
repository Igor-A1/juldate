# juldate

javascript functions for converting date to julian day and vice versa.
ES6 re-implementation from [Mivion's Moshier Ephemeris](https://github.com/mivion/ephemeris/blob/master/astronomy/moshier/julian.js)

Note: only works with dates older than 1582!

## Installation

```bash
npm install juldate
```

## Usage

```javascript

const juldate = require('juldate')

let d = new Date(), 
  j = juldate.date2julian(d);

console.log(d);
console.log(j);
console.log(juldate.julian2date(j));

```

## License

MIT
