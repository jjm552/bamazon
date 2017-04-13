var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

// connection info for bamazon_db
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'mysql1234mysql',
    database: 'bamazon_db'
});

// function returns all itmes from bamazon_db.products table
function querySelectAll() {
    connection.connect(function(err) {
        if (err) throw err;
    });
    productTableDisplay();
}


function productTableDisplay() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, initialResults) {
        if (err) throw err;
        console.log("==================");
        console.log("Items in inventory");
        console.log("==================");
        console.table(initialResults);
        console.log("=======================================================================================\n");
        bamazonMenuStart(initialResults);
    });
}

// function runs first menu for user purchase and verifies item is in stock
function bamazonMenuStart(initialResults) {
    inquirer.prompt([{
        type: "input",
        message: "Welcom to BAMAZON!!! let's get shopping -- \n Please enter the Item Id of the product you would like to buy: ",
        name: "userItemId"
    }, {
        type: "input",
        message: "How many of them bad boys do you want to buy? ",
        name: "userPurchaseQty"
    }, ]).then(function(UserPurchase) {
        var userItem = UserPurchase.userItemId;
        var userQty = UserPurchase.userPurchaseQty;
        var itemToBePurchDesc = initialResults[userItem - 1].product_name;
        var itemToBePurchAval = initialResults[userItem - 1].stock_quantity;
        var itemToBePurcPrice = initialResults[userItem - 1].price;
        if (UserPurchase.userItemId != initialResults[userItem - 1].item_id) {
            inquirer.prompt([{
                type: "list",
                message: "Oh no!, looks like you chose an item number that's not on our list. Would you like to: ",
                choices: ["Return to order prompt", "I'm done get me out of here!"],
                name: "choice"
            }, ]).then(function(userOut) {
                if (userOut.choice == "I'm done get me out of here!") {
                    connection.destroy();
                } else {
                    productTableDisplay();
                }
            });
        } else if (itemToBePurchAval < userQty) {
            console.log("\nSorry insufficient quantity of " + itemToBePurchDesc + " to fulfill your order");
            console.log("\n=======================================\n");
            inquirer.prompt([{
                type: "list",
                message: "Oh no!, sorry we're out of that item would you like to: ",
                choices: ["Return to order prompt", "I'm done get me out of here!"],
                name: "choice"
            }, ]).then(function(userOut) {
                if (userOut.choice == "I'm done get me out of here!") {
                    connection.destroy();
                } else {
                    productTableDisplay();
                }
            });
        } else {
            var adjQty = itemToBePurchAval - userQty;
            var userTotalPrice = itemToBePurcPrice * userQty;
            var queryDbQtyAdj = "UPDATE `bamazon_db`.`products` SET `stock_quantity`=" + "'" + adjQty + "'" + " WHERE `item_id`=" + "'" + userItem + "'";
            connection.query(queryDbQtyAdj, function(err, adjustResults) {
                if (err) throw err;
                console.log("\nOrder processed, your total today is $" + userTotalPrice);
                inquirer.prompt([{
                    type: "list",
                    message: "Awesome Choice I hope you enjoy, now what: ",
                    choices: ["Return to order prompt", "I'm done get me out of here!"],
                    name: "choice"
                }, ]).then(function(userOut) {
                    if (userOut.choice == "I'm done get me out of here!") {
                        connection.destroy();
                    } else {
                        productTableDisplay();
                    }
                });
            });
        }
    });
}
querySelectAll();