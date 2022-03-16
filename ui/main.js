const btnCall = document.getElementById('btn-call')
const btnClose = document.getElementById('btn-close')
const phoneNumber = document.getElementById('phone-number')


phoneNumber.addEventListener('input', (e) => {
    console.log(e.target.value)
})

const postDevice = async (number) => {
    try {
        const result = await fetch("http://localhost:5000/voice", {
            method: 'POST', body: JSON.stringify({ number: 8091231232 }),
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        const res = await result.json()
        console.log({ res })
    } catch (error) {
        console.log(error)
    }
}

const getToken = async () => await fetch("http://localhost:5000/token").then(res => res.json()).then(data => data);

window.addEventListener("DOMContentLoaded", () => {
    getToken()
        .then(async (data) => {
            let device = new Twilio.Device(data.token);
            console.log({ data, device })
            
            device.on("ready", (_device) => {
                console.log('I am ready')
                btnCall.addEventListener('click', () => {
                    const params = {
                        To: phoneNumber.value
                    };

                    console.log("Calling " + params.To + "...");
                    var outgoingConnection = _device.connect(params);

                    outgoingConnection.on("ringing", function () {
                        btnCall.classList.add("btn-calling")
                        console.log("Ringing...");
                    });
                });
            })

            device.on("error", function (error) {
                console.log("Twilio.Device Error: " + error.message);
                btnCall.classList.remove("btn-calling")
            });

            device.on("connect", function () {
                console.log("Call initiated");
                document.getElementById("button-call").style.display = "none";
                document.getElementById("button-hangup").style.display = "inline";
            });

            device.on("disconnect", function () {
                console.log("Call ended.");
                document.getElementById("button-call").style.display = "inline";
                document.getElementById("button-hangup").style.display = "none";
            });

            document.getElementById("button-hangup").addEventListener('click', () => {
                console.log("Disconnecting...");
                if (device) {
                    device.disconnectAll();
                    btnCall.classList.remove("btn-calling")
                }
            })
        })
        .catch(err => err)

})


