/* 
Hola gentes

Este fichero utiliza las capacidades BLE de puck.js para encender altavoces UE BOOM, actualmente está harcodeada la 
dirección MAC del altavoz que he usado pero se puede fácilmente implementar para que responda a cualquier altavoz 
(usando NRF.requestDevice(serviceuuid)), si queréis ver un ejemplo podéis usar mi otro repositorio donde esta funcion
se usa (https://github.com/DexterNano/HID_DOS_BLE).

Para la investigación se ha usado BTLEJack y el btsnoop_haci.log presente en el zip accesible atraves de adb bugreport 
(hay que habilitarlo en el móvil primero).



*/




let serviceUuid = 0x61FE;
let characteristicUuid = "C6D6DC0D-07F5-47EF-9B59-630622B01FD3";

var on = new Uint8Array([0xA0, 0x27, 0xB6, 0x9F, 0x69, 0x5E, 0x01]); //Data to encederlo papi

function attack() {
    // Nivel de batería por pantalla porque check de sanidad mental
    console.log("Nivel Batería:  ", Puck.getBatteryPercentage());
    NRF.connect("c0:28:**:**:**:** public")
        .then(function (server) {
            gatt = server;
            return server.getPrimaryService(0x61FE);
        })
        .then(function (service) {
            return service.getCharacteristic(characteristicUuid);
        })
        .then(function (characteristic) {
            characteristic.writeValue(on);
        });
}



/*

A partir de aquí está el código usado para controlar diferentes funncionalidades dependiendo de la cantidad de clicks que se dan en el puck

*/


let clickcount = 0;
let clickevent = null;

const setLEDS = (LED1on, LED2on, LED3on) => {
    LED1.reset();
    LED2.reset();
    LED3.reset();

    if (LED1on) LED1.set();
    if (LED2on) LED2.set();
    if (LED3on) LED3.set();
};


setWatch((e2) => {
    clickcount++;
    try {
        if (clickevent !== null) clearTimeout(clickevent);
    } catch (e3) {
        console.log("Oops!", e3);
    }

    if (clickcount === 1) {
        setLEDS(true, false, false);
    } else if (clickcount === 2) {
        setLEDS(false, true, false);
    } else if (clickcount === 3) {
        setLEDS(false, false, true);
    } else {
        setLEDS(true, true, true);
    }

    clickevent = setTimeout(() => {
        if (clickcount === 1) {
            console.log("Click 1");
            attack();
        } else if (clickcount === 2) {
            console.log("Reinicia");
            NRF.restart();
        } else {
            console.log("Click 3");
        }
        clickcount = 0;
    }, 350);
}, BTN, {
    edge: "rising",
    debounce: 10,
    repeat: true
});


setWatch((e2) => {
    setLEDS(false, false, false);
    setTimeout(() => {
        clickevent = null;
    }, 400);
}, BTN, {
    edge: "falling",
    debounce: 10,
    repeat: true
});
