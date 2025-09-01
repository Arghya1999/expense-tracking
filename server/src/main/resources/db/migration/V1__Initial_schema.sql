CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE expense (
    id BIGSERIAL PRIMARY KEY,
    description VARCHAR(255),
    amount DOUBLE PRECISION,
    date DATE,
    category VARCHAR(255)
);