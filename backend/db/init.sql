-- Sentinel AI PostgreSQL Schema Dump

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    risk_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) UNIQUE,
    image_url VARCHAR(255),
    trust_score FLOAT DEFAULT 100.0,
    threat_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL,
    title VARCHAR(255),
    content TEXT,
    is_suspicious BOOLEAN DEFAULT FALSE,
    threat_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS suspicious_flags (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    flag_type VARCHAR(50) NOT NULL,
    severity VARCHAR(50) DEFAULT 'low',
    confidence_score FLOAT DEFAULT 0.0,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS threat_reports (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    overall_threat_score FLOAT DEFAULT 0.0,
    summary TEXT,
    top_reasons JSON,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Views

CREATE OR REPLACE VIEW v_fraud_timeline AS
SELECT 
    DATE_TRUNC('hour', created_at) as hour,
    COUNT(*) as total_reviews,
    SUM(CASE WHEN is_suspicious THEN 1 ELSE 0 END) as threat_count
FROM reviews
GROUP BY 1
ORDER BY 1 DESC;

CREATE OR REPLACE VIEW v_user_risk_profile AS
SELECT 
    u.id,
    u.username,
    COUNT(r.id) as total_reviews,
    SUM(CASE WHEN r.is_suspicious THEN 1 ELSE 0 END) as suspicious_reviews,
    AVG(r.rating) as avg_rating
FROM users u
LEFT JOIN reviews r ON u.id = r.user_id
GROUP BY 1, 2;
