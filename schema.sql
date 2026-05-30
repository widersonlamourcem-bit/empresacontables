-- Esquema de Base de Datos para Expertos Contables RD
-- Este archivo define la estructura ideal para un servidor SQL (MySQL, PostgreSQL, Supabase)

-- 1. Tabla de Usuarios / Empleados
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hasheada
    role VARCHAR(20) DEFAULT 'employee', -- 'admin', 'employee'
    position VARCHAR(50), -- Cargo (Gerente, Contador, etc.)
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'offline', 'busy'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Mensajes de Contacto
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread', -- 'unread', 'read', 'replied'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Productos / Servicios (Tienda)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50), -- 'template', 'service', 'consultancy'
    image_url VARCHAR(255),
    active BOOLEAN DEFAULT TRUE
);

-- 4. Tabla de Pedidos / Órdenes
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100),
    customer_email VARCHAR(100),
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20), -- 'card', 'paypal'
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Detalles de Pedido (Relación N:M entre pedidos y productos)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    product_name VARCHAR(100),
    price DECIMAL(10, 2)
);

-- 6. Tabla de Agenda / Eventos
CREATE TABLE agenda_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    type VARCHAR(50), -- 'meeting', 'workshop', 'deadline'
    created_by INT REFERENCES users(id)
);
