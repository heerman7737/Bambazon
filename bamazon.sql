DROP DATABASE IF EXISTS Bamazon;
CREATE DATABASE Bamazon;
USE Bamazon;

-- Create a table called 'products' which will contain the store inventory --
CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(30) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER(11) NOT NULL,
	PRIMARY KEY (item_id)
);

-- Insert data into the 'products' table --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ('Glock 17','Handgun',450.00,100),
		('CZ 75','Handgun',500.00,200),
        ('Magnum .45','Handgun',300.00,150),
        ('Luger','Handgun',430.00,30),
        ('Beretta Nano','Handgun',600.40,300),
        ('Desert Eagle','Handgun',1150.50,45),
        ('Karabiner 98k','Long-Rifle',720.00,30),
        ('Arisaka','Long-Rifle',600.00,40),
        ('Browning BLR','Long-Rifle',900.00,40),
        ('Gewehr 43','Long-Rifle',1200.00,120),
        ('M1 Garand','Long-Rifle',1120.00,400),
        ('AWM','Sniper Rifle',7300.00,40),
        ('M95','Sniper Rifle',4400.00,12),
        ('FN Ballista','Sniper Rifle',5400.00,40),
        ('M24','Sniper Rifle',6500.00,30),
        ('MG 42','Machinegun',26000.00,10),
        ('MG4','Machinegun',15000.00,10),
        ('MG3','Machinegun',16000.00,40),
        ('AR15','Assault Rifle',9000.00,400),
        ('AK 47','Assault Rifle',10000.00,200)
        