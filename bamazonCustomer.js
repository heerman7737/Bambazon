const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'Bamazon'
});


//Prompt the user
function promptUserPurchase() {

	// Prompt the user to select an item
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Enter the Item ID',
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many do you need?',
			filter: Number
		}
	]).then(function(input) {

		let item = input.item_id;
		let quantity = input.quantity;
		let selection = 'SELECT * FROM products WHERE ?';

		db.query(selection, {item_id: item}, function(e, data) {
			if (e) throw e
			// Check valid id
			if (data.length === 0) {
				console.log('Invalid Item ID')
				displayInventory();

			} else {
				let productData = data[0];
				// Check quantity
				if (quantity <= productData.stock_quantity) {
					console.log('Successful in placing order!');
					let updateselection = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item					
					// Update the inventory
					db.query(updateselection, function(e, data) {
						if (e) throw e

						console.log('Your oder has been placed! Your total is $' + productData.price * quantity)
						console.log("\n---------------------------------------------------------------------\n")
						// console.log(productData.stock_quantity)
						// End the database connection
						process.exit();
					})
				} else {
					displayInventory()
					console.log('Insufficient quantity!')
					console.log('Please modify your order.')
					console.log("\n---------------------------------------------------------------------\n")
				}
			}
		})
	})
}

// Display inventory
function displayInventory() {
	// Construct the db query string
	selection = 'SELECT * FROM products';
	db.query(selection, function(e, data) {
		if (e) throw e

		console.log('Inventory: ');
		console.log('...................\n');

		
		for (let i = 0; i < data.length; i++) {
			let result = ''
			result += 'Item ID: ' + data[i].item_id + '  //  '
			result += 'Product Name: ' + data[i].product_name + '  //  '
			result += 'Department: ' + data[i].department_name + '  //  '
			result += 'Price: $' + data[i].price + '\n'

			console.log(result)
		}

	  	console.log("---------------------------------------------------------------------\n")

	  	//Prompt the user
	  	promptUserPurchase();
	})
}

displayInventory();
