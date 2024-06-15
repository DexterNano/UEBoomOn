# UEBoomOn
 
Este fichero utiliza las capacidades BLE de puck.js para encender altavoces UE BOOM, actualmente está harcodeada la 
dirección MAC del altavoz enmascarda, pero se puede implementar fácilmente que responda a cualquier altavoz 
usando NRF.requestDevice(serviceuuid), si queréis ver un ejemplo podéis usar mi otro repositorio donde esta funcion
se usa (https://github.com/DexterNano/HID_DOS_BLE).

Para la investigación se ha usado BTLEJack y el btsnoop_haci.log presente en el zip accesible atraves de adb bugreport 
(hay que habilitarlo en el móvil primero).
