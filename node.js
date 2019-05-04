var mysql = require("mysql2");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "tian3401",
    database: "bamazondb",
    multipleStatements: true
}); 

connection.connect(function(err){
    if(err){
        throw err; 
    }
    else{
        console.log("connected as id" + connection.threadId +"\n");
        //add runApp function here 
        runApp();
    }
});

//global variables used across functions 
var items; //the object to show the user the available items for sale 
var product_id;// the id the user chooses 
var quant;// the available quantity of the given product 
var buyQuant; // the amount the user wants to purchase
var invUpdate;// updated inventory value after a successful purchase

//main function that runs the app 
function runApp(){

connection.query("SELECT * FROM item", function(err,productList_item){
    items = productList_item;
    setTimeout(function(){console.log(items);},2000);
});
    
inquirer.prompt([{
    type: "input",
    name: "id",
    message: "What is the id of the product you would like to buy?"
}
]).then(function products (data){ 

    product_id = data.id;    
    //for loop to match up product_id and the mysql id of the product
    for(i=0;i<items.length;i++){
        if(items[i].id==product_id){ 
        quant= items[i].quantity;
        var product_name= items[i].product;
        var product_price= items[i].price; 
        }
    }
    if(product_id>0)
    inquirer.prompt([{
        type: "input",
        name: "units",
        message: "How many units would you like to purchase?"
    }]).then(function(data){
        buyQuant= data.units;
        
        if(buyQuant <= quant){
        var query= connection.query(
            "SELECT (item.quantity - "+ buyQuant +") AS new_value FROM item WHERE item.id ="+ product_id, function(err, updated_val){
                invUpdate=  updated_val[0].new_value;
                console.log("Your purchase order receipt: \n\n" + "product:" + product_name +"\n price:" + product_price*data.units + "\n quantity:" + buyQuant +"\n Thank you for your purchase!" );
                updateProduct();
            }
        );
        }
        else{
            console.log("Insufficient quantity"); 
            setTimeout(function(){resetPrompt();},2000);
            
        }
    })
    else{
        console.log("product not found");
        setTimeout(function(){runApp();},3000);
    }
})
};

function updateProduct() {
    var query = connection.query(
      "UPDATE item SET ? WHERE ?",
      [
        {
          quantity: invUpdate
        },
        {
          id: product_id
        }
      ],
      function(err, res) {
        console.log(res.affectedRows + " products updated!\n");
      }
    );
    setTimeout(function(){runApp();},3000);
}; 

function resetPrompt(){
    
    inquirer.prompt([{
        type: "list",
        name: "command",
        message: "Do you want to buy another product",
        choices: ["YES! Get me back in there!","no, I don't like amazing stuff."]
    }
    ]).then(function(proccess){
        if(proccess.command=="YES! Get me back in there!"){
           runApp();
        }
        else{
            console.log("Thank you for shopping at Bamazon!");
            connection.end();
        }
    })
}