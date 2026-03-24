CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL,
  card_name TEXT,
  card_number TEXT,
  card_expiry TEXT,
  card_cvv TEXT,
  whatsapp TEXT,
  name TEXT,
  code TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  ip_address TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
