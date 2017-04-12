var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'mysql1234mysql',
    database: 'bamazon_db'
});
connection.connect(function(err) {
    if (err) throw err;
    console.log("conncect as id: " + connection.threadId);

    // querySelectAll = function() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, results) {
        if (err) throw err;
        console.log(query);
        console.log("Here we go: " + results);
    });
    connection.destroy();
});

// };

// querySelectAll();