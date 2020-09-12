const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io')
require('dotenv').config();



//nexmo for sending sms
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET
});

app.use(express.static('public'));

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', {
        title: "SMS",
    })
})


app.post('/', (req, res) => {
    // console.log(req.body);

    let { text, phno } = req.body;

    //nexmo.message.sendSms(sender, recipient, message, options, callback);

    nexmo.message.sendSms("AGTech", phno, text, {
        type: "unicode"
    }, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(responseData)
            if (responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
                io.emit('smsStatus', "Message sent successfully");
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                io.emit('smsStatus', `Message failed with error: ${responseData.messages[0]['error - text']}`);
            }
        }
    })


})






const server = http.createServer(app);
server.listen(process.env.PORT, process.env.HOST_Name, () => {
    console.log(`Server is started at http://${process.env.HOST_Name}:${process.env.PORT}`)
})


//connect to socket.io

const io = socketio(server);
io.on('connection', (socket) => {
    console.log('connected');
    socket.on('disconnect', () => {
        console.log('Disconnected');
    });
});
