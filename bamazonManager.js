const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'Bamazon'
});


//Prompt the manager
function promptManager() {

	// Prompt the user to select an item
	inquirer.prompt([
		{
			type: 'list',
			name: 'action',
			message: 'Please choose the action.',
			choices:['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product']
		}

	]).then(function(input) {

		if(input.action==='View Products for Sale'){
            displayInventory()
        }
        else if(input.action==='View Low Inventory'){
            displayLowInventory()
        }
        else if(input.action==='Add to Inventory'){
            addInventory()
        }
        else if(input.action==='Add New Product'){
            addProduct()
        }

			
		
    })
}

// Display inventory
function displayInventory() {
	// Construct the db query string
	selection = 'SELECT * FROM products';
	db.query(selection, function(e, data) {
		if (e) throw e;

		console.log('Inventory: ');
		console.log('...................\n');

		
		for (let i = 0; i < data.length; i++) {
			let result = '';
			result += 'Item ID: ' + data[i].item_id + '  //  '
			result += 'Product Name: ' + data[i].product_name + '  //  '
			result += 'Department: ' + data[i].department_name + '  //  '
			result += 'Price: $' + data[i].price + '//'
            result += 'Quantity in stock' + data[i].stock_quantity + '\n'
			console.log(result);
		}

          console.log("---------------------------------------------------------------------\n")
          process.exit()
	})
}
// Display Low Inventory
function displayLowInventory() {
	// Construct the db query string
	selection = 'SELECT * FROM products';
	db.query(selection, function(e, data) {
		if (e) throw e;

		console.log('Inventory: ');
		console.log('...................\n');

		
		for (let i = 0; i < data.length; i++) {
            if(data[i].stock_quantity <=5){
			let result = '';
			result += 'Item ID: ' + data[i].item_id + '  //  '
			result += 'Product Name: ' + data[i].product_name + '  //  '
			result += 'Department: ' + data[i].department_name + '  //  '
			result += 'Price: $' + data[i].price + '//'
            result += 'Quantity in stock' + data[i].stock_quantity + '\n'
            console.log(result)
            }
		}

          console.log("---------------------------------------------------------------------\n")
          process.exit()
	})
}
// Display Low Inventory
function displayLowInventory() {
	// Construct the db query string
	selection = 'SELECT * FROM products';
	db.query(selection, function(e, data) {
		if (e) throw e;

		console.log('Inventory: ');
		console.log('...................\n');

		
		for (let i = 0; i < data.length; i++) {
            if(data[i].stock_quantity <=5){
			let result = '';
			result += 'Item ID: ' + data[i].item_id + '  //  '
			result += 'Product Name: ' + data[i].product_name + '  //  '
			result += 'Department: ' + data[i].department_name + '  //  '
			result += 'Price: $' + data[i].price + '//'
            result += 'Quantity in stock' + data[i].stock_quantity + '\n'
            console.log(result)
            }
		}

		  console.log("---------------------------------------------------------------------\n")
		  process.exit()
	})
}
function addInventory() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID for stock_count update.',
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many would you like to add?',
			filter: Number
		}
	]).then(function(input) {
		let item = input.item_id;
		let addQuantity = input.quantity;
		let queryStr = 'SELECT * FROM products WHERE ?';

		db.query(queryStr, {item_id: item}, function(e, data) {
			if (e) throw e;
			if (data.length === 0) {
				console.log('Invalid Item ID');
				addInventory();
			} else {
				let productData = data[0];
				console.log('Updating Inventory...');
				let updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;
				// Update the inventory
				db.query(updateQueryStr, function(e, data) {
					if (e) throw e;

					console.log('New quantity for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');
					console.log("\n---------------------------------------------------------------------\n");

					// End the database connection
					process.exit();
				})
			}
		})
	})
}

function addProduct() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'product_name',
			message: 'Please enter the new product name.',
		},
		{
			type: 'input',
			name: 'department_name',
			message: 'Which department does the new product belong to?',
		},
		{
			type: 'input',
			name: 'price',
			message: 'What is the price per unit?',
			filter: Number
		},
		{
			type: 'input',
			name: 'stock_quantity',
            message: 'How many items are in stock?',
            filter: Number
		}
	]).then(function(input) {
		console.log('Adding New Item: \n    product_name = ' + input.product_name + '\n' +  
									   '    department_name = ' + input.department_name + '\n' +  
									   '    price = ' + input.price + '\n' +  
									   '    stock_quantity = ' + input.stock_quantity);
		let queryStr = 'INSERT INTO products SET ?';

		// Add new product to the db
		db.query(queryStr, input, function (eor, results) {
			if (eor) throw eor;

			console.log('New product has been added to the inventory under Item ID ' + results.insertId + '.');
            console.log("\n---------------------------------------------------------------------\n")
            process.exit()
		});
	})
}
promptManager()
