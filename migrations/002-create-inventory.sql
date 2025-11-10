DROP TABLE IF EXISTS inventory;
CREATE TABLE inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  description TEXT,
  purchase_price REAL,
  selling_price REAL,
  stk_date TEXT,
  stk_qty INTEGER,
  sales_qty INTEGER DEFAULT 0
);

INSERT INTO inventory (name, sku, description, purchase_price, selling_price, stk_date, stk_qty) VALUES
('Laptop', 'LP-001', 'A powerful laptop', 1200.00, 1500.00, '2023-01-01', 10),
('Mouse', 'MS-001', 'An ergonomic mouse', 25.00, 40.00, '2023-01-01', 25),
('Keyboard', 'KB-001', 'A mechanical keyboard', 80.00, 120.00, '2023-01-01', 15);
