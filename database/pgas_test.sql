CREATE DATABASE pgas_test;

USE pgas_test;

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100)
);

CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_name VARCHAR(100),
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES departments(department_id)
);

CREATE TABLE spendings (
    spending_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    spending_date DATE,
    value DECIMAL(12,2),
    FOREIGN KEY (employee_id)
    REFERENCES employees(employee_id)
);

INSERT INTO departments (department_name)
VALUES
('IT'),
('Finance'),
('HR'),
('Marketing');

INSERT INTO employees (employee_name, department_id)
VALUES
('Restu', 1),
('Azis', 2),
('Nita', 3),
('Shifa', 4);

INSERT INTO spendings (employee_id, spending_date, value)
VALUES
(1, '2020-01-15', 500000),
(1, '2021-03-10', 750000),
(2, '2022-05-20', 300000),
(3, '2023-07-12', 900000),
(4, '2024-11-01', 450000),
(2, '2025-02-28', 1200000);
