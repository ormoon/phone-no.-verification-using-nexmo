const phno = document.getElementById('exampleInputNumber');
const text = document.getElementById('exampleFormControlTextarea1');
const button = document.querySelector('button');
const response = document.querySelector(".response");


//while sending data to server you need to convert it to string thus converting json object to string

const sendMsg = async () => {
    try {
        var data = await fetch('/', {
            method: 'post',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                phno: phno.value,
                text: text.value
            })
        })
        return data;
    } catch (e) {
        throw new Error("Error >> ", e.message);
    }
}




button.addEventListener('click', sendMsg);

//socket operation

const socket = io();
socket.on('smsStatus', (msg) => {
    response.innerHTML = '<h5>' + msg + '</h5>'
})