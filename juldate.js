exports.date2julian = date => {
  /* The origin should be chosen to be a century year
   * that is also a leap year.  We pick 4801 B.C.
   */
  const YYYY = date.getFullYear ();
  if (YYYY <= 1582)
    throw new Error (`Year value = ${YYYY} is too small!`);
    
  let year = YYYY + 4800;

  /* The following magic arithmetic calculates a sequence
   * whose successive terms differ by the correct number of
   * days per calendar month.  It starts at 122 = March; January
   * and February come after December.
   */
  let month = date.getMonth ();
  if (month <= 2) {
    month += 12;
    year -= 1;
  }
  const e = Math.floor ((306 * (month + 1)) / 10);

  // number of centuries
  const centuries = Math.floor (year / 100);

  const b = Math.floor ((centuries / 4) - centuries);
  
  // Julian calendar years and leap years
  const c = Math.floor ((36525 * year) / 100);

  /* Add up these terms, plus offset from J 0 to 1 Jan 4801 B.C.
   * Also fudge for the 122 days from the month algorithm.
   */
  const jDate = b + c + e + date.getDate () - 32167.5;

  // Add time
  const jTime = (
    3600.0 * date.getHours () + 
    60.0 * date.getMinutes () +
    (
      date.getSeconds () +
      date.getMilliseconds () / 1000
    )
  ) / 86400.0;

  return jDate + jTime;
};


const hms = x => {

  let s = x * 12 / Math.PI;
  if (s < 0.0) {
    s += 24.0;
  };
  
  let h = Math.floor (s);
  
  s -= h;
  s *= 60;
  
  let m = Math.floor (s);
  
  s -= m;
  s *= 60;
  
  /* Handle shillings and pence roundoff. */
  let sfrac = Math.floor (1000.0 * s + 0.5);
  if ( sfrac >= 60000 ) {
    sfrac -= 60000;
    m += 1;
    if( m >= 60 ) {
      m -= 60;
      h += 1;
    };
  };
  
  let sint = Math.floor (sfrac / 1000);
  sfrac -= Math.floor (sint * 1000);

  return {
    hours:    h,
    minutes:  m,
    seconds:  sint,
    ms:       sfrac
  };
};


exports.julian2date = julian => {

  const jd = Math.floor (julian + 0.5); /* round Julian date up to integer */

  /* Find the number of Gregorian centuries
   * since March 1, 4801 B.C.
   */
  let a = Math.floor ((100 * jd + 3204500)/3652425);

  /* Transform to Julian calendar by adding in Gregorian century years
   * that are not leap years.
   * Subtract 97 days to shift origin of JD to March 1.
   * Add 122 days for magic arithmetic algorithm.
   * Add four years to ensure the first leap year is detected.
   */
  let c = jd + 1486;
  if( jd >= 2299160.5 ) {
    c += a - Math.floor (a / 4);
  } else {
    c += 38;
  };
  /* Offset 122 days, which is where the magic arithmetic
   * month formula sequence starts (March 1 = 4 * 30.6 = 122.4).
   */
  const d = Math.floor ((100 * c - 12210)/36525);
  /* Days in that many whole Julian years */
  let x = Math.floor ((36525 * d) / 100);

  /* Find month and day. */
  const y = Math.floor (((c - x) * 100) / 3061);
  const day = Math.floor (c - x - Math.floor ((306 * y) / 10));
  let month = Math.floor (y - 1);
  if ( y > 13 ) {
    month -= 12;
  }

  /* Get the year right. */
  let year = d - 4715;
  if (month > 2 ) {
    year -= 1;
  }

  /* Fractional part of day. */
  let dd = day + julian - jd + 0.5;

  let result = new Date (year, month, Math.floor (day));

  /* Display fraction of calendar day
   * as clock time.
   */
  a = Math.floor (dd);
  dd = dd - a;
  let dfrac = hms(2.0 * Math.PI * dd);

  return new Date (
    year,
    month,
    Math.floor (day),
    dfrac.hours,
    dfrac.minutes,
    dfrac.seconds,
    dfrac.ms
  );
};
