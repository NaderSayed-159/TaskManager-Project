var express = require('express');
var app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


const cors = require('cors');
app.use(cors());

app.use(express.static('./'));

var port = 8000; // you can use any port
app.listen(port, listening);

function listening() {
    console.log(`running on localhost: ${port}`);
};


app.get('/', (req, res) => {

    res.send('index.html')


});


let data;
app.post('/storeTasks', storeTasks)

function storeTasks(req, res) {
    data = req.body;
    console.log(data);
    var dictstring = JSON.stringify(data);

    var fs = require('fs');

    fs.writeFile("BackUp.json", dictstring, function (err, result) {
        if (err) {
            console.log('error', err)
        };
    });

}