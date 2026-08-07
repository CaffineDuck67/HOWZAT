// HOWZAT?! player dataset
// Career TEST statistics chosen deliberately: Test cricket has been recorded
// continuously since 1877, so it's the one format that lets us fairly mix
// eras — Bradman (1930s) next to Kohli (2020s) — on the same stat sheet.
// Figures are the well-established career records; a handful of still-active
// players (marked "active: true") are approximate as of the 2025/26 season.
//
// Fields: name, country, era (debut-retire or "active"), matches, runs,
// average, hundreds, highestScore, notOut (HS was not out), wickets

const PLAYERS = [
  { name: "Don Bradman", country: "Australia", era: "1928–1948", matches: 52, runs: 6996, average: 99.94, hundreds: 29, highestScore: 334, notOut: false, wickets: 2 },
  { name: "Garfield Sobers", country: "West Indies", era: "1954–1974", matches: 93, runs: 8032, average: 57.78, hundreds: 26, highestScore: 365, notOut: true, wickets: 235 },
  { name: "Sachin Tendulkar", country: "India", era: "1989–2013", matches: 200, runs: 15921, average: 53.78, hundreds: 51, highestScore: 248, notOut: true, wickets: 46 },
  { name: "Brian Lara", country: "West Indies", era: "1990–2006", matches: 131, runs: 11953, average: 52.88, hundreds: 34, highestScore: 400, notOut: true, wickets: 0 },
  { name: "Ricky Ponting", country: "Australia", era: "1995–2012", matches: 168, runs: 13378, average: 51.85, hundreds: 41, highestScore: 257, notOut: false, wickets: 5 },
  { name: "Jacques Kallis", country: "South Africa", era: "1995–2013", matches: 166, runs: 13289, average: 55.37, hundreds: 45, highestScore: 224, notOut: false, wickets: 292 },
  { name: "Viv Richards", country: "West Indies", era: "1974–1991", matches: 121, runs: 8540, average: 50.23, hundreds: 24, highestScore: 291, notOut: false, wickets: 32 },
  { name: "Kumar Sangakkara", country: "Sri Lanka", era: "2000–2015", matches: 134, runs: 12400, average: 57.40, hundreds: 38, highestScore: 319, notOut: false, wickets: 0 },
  { name: "Rahul Dravid", country: "India", era: "1996–2012", matches: 164, runs: 13288, average: 52.31, hundreds: 36, highestScore: 270, notOut: false, wickets: 1 },
  { name: "Steve Waugh", country: "Australia", era: "1985–2004", matches: 168, runs: 10927, average: 51.06, hundreds: 32, highestScore: 200, notOut: false, wickets: 92 },
  { name: "Sunil Gavaskar", country: "India", era: "1971–1987", matches: 125, runs: 10122, average: 51.12, hundreds: 34, highestScore: 236, notOut: true, wickets: 1 },
  { name: "Allan Border", country: "Australia", era: "1978–1994", matches: 156, runs: 11174, average: 50.56, hundreds: 27, highestScore: 205, notOut: false, wickets: 39 },
  { name: "Wally Hammond", country: "England", era: "1927–1947", matches: 85, runs: 7249, average: 58.45, hundreds: 22, highestScore: 336, notOut: true, wickets: 83 },
  { name: "Len Hutton", country: "England", era: "1937–1955", matches: 79, runs: 6971, average: 56.67, hundreds: 19, highestScore: 364, notOut: false, wickets: 3 },
  { name: "Javed Miandad", country: "Pakistan", era: "1976–1993", matches: 124, runs: 8832, average: 52.57, hundreds: 23, highestScore: 280, notOut: true, wickets: 17 },
  { name: "Virat Kohli", country: "India", era: "2011–present", matches: 113, runs: 8848, average: 46.85, hundreds: 29, highestScore: 254, notOut: true, wickets: 0 },
  { name: "Steve Smith", country: "Australia", era: "2010–present", matches: 109, runs: 9601, average: 56.82, hundreds: 32, highestScore: 239, notOut: false, wickets: 19 },
  { name: "Joe Root", country: "England", era: "2012–present", matches: 150, runs: 12716, average: 50.66, hundreds: 35, highestScore: 262, notOut: false, wickets: 39 },
  { name: "Kane Williamson", country: "New Zealand", era: "2010–present", matches: 100, runs: 8743, average: 54.31, hundreds: 32, highestScore: 251, notOut: false, wickets: 1 },
  { name: "AB de Villiers", country: "South Africa", era: "2004–2018", matches: 114, runs: 8765, average: 50.66, hundreds: 22, highestScore: 278, notOut: true, wickets: 0 },
  { name: "Shivnarine Chanderpaul", country: "West Indies", era: "1994–2015", matches: 164, runs: 11867, average: 51.37, hundreds: 30, highestScore: 203, notOut: true, wickets: 9 },
  { name: "Younis Khan", country: "Pakistan", era: "2000–2017", matches: 118, runs: 10099, average: 52.05, hundreds: 34, highestScore: 313, notOut: false, wickets: 0 },
  { name: "Matthew Hayden", country: "Australia", era: "1994–2009", matches: 103, runs: 8625, average: 50.73, hundreds: 30, highestScore: 380, notOut: false, wickets: 0 },
  { name: "Herbert Sutcliffe", country: "England", era: "1924–1935", matches: 54, runs: 4555, average: 60.73, hundreds: 16, highestScore: 194, notOut: false, wickets: 0 },
  { name: "George Headley", country: "West Indies", era: "1930–1954", matches: 22, runs: 2190, average: 60.83, hundreds: 10, highestScore: 270, notOut: true, wickets: 0 },
  { name: "Jack Hobbs", country: "England", era: "1908–1930", matches: 61, runs: 5410, average: 56.94, hundreds: 15, highestScore: 211, notOut: false, wickets: 1 },
  { name: "Clyde Walcott", country: "West Indies", era: "1948–1960", matches: 44, runs: 3798, average: 56.68, hundreds: 15, highestScore: 220, notOut: false, wickets: 11 },
  { name: "Everton Weekes", country: "West Indies", era: "1948–1958", matches: 48, runs: 4455, average: 58.61, hundreds: 15, highestScore: 207, notOut: false, wickets: 1 },
  { name: "Greg Chappell", country: "Australia", era: "1970–1984", matches: 87, runs: 7110, average: 53.86, hundreds: 24, highestScore: 247, notOut: true, wickets: 47 },
  { name: "Mahela Jayawardene", country: "Sri Lanka", era: "1997–2014", matches: 149, runs: 11814, average: 49.84, hundreds: 34, highestScore: 374, notOut: false, wickets: 0 },
  { name: "Inzamam-ul-Haq", country: "Pakistan", era: "1992–2007", matches: 120, runs: 8830, average: 49.60, hundreds: 25, highestScore: 329, notOut: false, wickets: 0 },
  { name: "Michael Clarke", country: "Australia", era: "2004–2015", matches: 115, runs: 8643, average: 49.10, hundreds: 28, highestScore: 329, notOut: true, wickets: 31 },
  { name: "Hashim Amla", country: "South Africa", era: "2004–2019", matches: 124, runs: 9282, average: 46.64, hundreds: 28, highestScore: 311, notOut: true, wickets: 0 },
  { name: "Shane Warne", country: "Australia", era: "1992–2007", matches: 145, runs: 3154, average: 17.32, hundreds: 0, highestScore: 99, notOut: false, wickets: 708 },
  { name: "Muttiah Muralitharan", country: "Sri Lanka", era: "1992–2010", matches: 133, runs: 1261, average: 11.67, hundreds: 0, highestScore: 67, notOut: false, wickets: 800 },
  { name: "Glenn McGrath", country: "Australia", era: "1993–2007", matches: 124, runs: 641, average: 7.36, hundreds: 0, highestScore: 61, notOut: false, wickets: 563 },
  { name: "James Anderson", country: "England", era: "2003–present", matches: 188, runs: 1298, average: 9.24, hundreds: 0, highestScore: 81, notOut: false, wickets: 704 },
  { name: "Anil Kumble", country: "India", era: "1990–2008", matches: 132, runs: 2506, average: 17.77, hundreds: 0, highestScore: 110, notOut: true, wickets: 619 },
  { name: "Courtney Walsh", country: "West Indies", era: "1984–2001", matches: 132, runs: 936, average: 7.54, hundreds: 0, highestScore: 30, notOut: true, wickets: 519 },
  { name: "Curtly Ambrose", country: "West Indies", era: "1988–2000", matches: 98, runs: 1439, average: 12.40, hundreds: 0, highestScore: 53, notOut: false, wickets: 405 },
  { name: "Wasim Akram", country: "Pakistan", era: "1985–2002", matches: 104, runs: 2898, average: 22.64, hundreds: 3, highestScore: 257, notOut: true, wickets: 414 },
  { name: "Kapil Dev", country: "India", era: "1978–1994", matches: 131, runs: 5248, average: 31.05, hundreds: 8, highestScore: 163, notOut: false, wickets: 434 },
  { name: "Richard Hadlee", country: "New Zealand", era: "1973–1990", matches: 86, runs: 3124, average: 27.16, hundreds: 2, highestScore: 151, notOut: true, wickets: 431 },
  { name: "Imran Khan", country: "Pakistan", era: "1971–1992", matches: 88, runs: 3807, average: 37.69, hundreds: 6, highestScore: 136, notOut: false, wickets: 362 },
  { name: "Pat Cummins", country: "Australia", era: "2011–present", matches: 68, runs: 1700, average: 23.0, hundreds: 0, highestScore: 63, notOut: false, wickets: 294 },
  { name: "Ben Stokes", country: "England", era: "2013–present", matches: 108, runs: 6800, average: 35.8, hundreds: 13, highestScore: 258, notOut: false, wickets: 205 },
  { name: "Ravindra Jadeja", country: "India", era: "2012–present", matches: 78, runs: 3600, average: 36.0, hundreds: 4, highestScore: 175, notOut: false, wickets: 320 },
  { name: "Ravichandran Ashwin", country: "India", era: "2011–present", matches: 106, runs: 3400, average: 25.0, hundreds: 5, highestScore: 124, notOut: false, wickets: 537 },
];

if (typeof module !== "undefined") module.exports = PLAYERS;
