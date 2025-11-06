-- Up
CREATE TABLE sales (
  id INTEGER PRIMARY KEY,
  product TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  customer TEXT NOT NULL,
  date TEXT NOT NULL
);

-- Down
DROP TABLE sales;
