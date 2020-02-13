let serial = {};

(function() {

    serial.getPorts = function() {
        return navigator.usb.getDevices().then(devices => {
            return devices.map(device => new serial.Port(device));
        });
    };

    serial.requestPort = function() {
        const filters = [
            { 'vendorId': 0x2341, 'productId': 0x8036 }, // Arduino Leonardo
        ];
        return navigator.usb.requestDevice({ 'filters': filters }).then(
            device => new serial.Port(device)
        );
    };

    serial.Port = function(device) {
        this.device_ = device;
    };


    serial.Port.prototype.connect = async function() {
        let readLoop = () => {
          console.log("In readloop");
          console.log(this.device_);
            const {
                endpointNumber
            } = this.device_.configuration.interfaces[0].alternates[0].endpoints[0];
            const that = this;
            console.log(endpointNumber);
            this.device_.transferIn(endpointNumber, 64).then(result => {
                that.onReceive(result.data);
                readLoop();
            }, error => {
              if (that.onReceiveError) {
                that.onReceiveError(error);
              } else {
                throw error;
              }

            });
        };

        const connectDevice = async (usbDevice) => {
          await usbDevice.open();
          if (usbDevice.configuration === null)
            await usbDevice.selectConfiguration(1);
          await usbDevice.claimInterface(0);
          return await readLoop();
        }

        await connectDevice(this.device_);
    }

    serial.Port.prototype.disconnect = function() {
        return this.device_.close();
    };

    serial.Port.prototype.send = function(data) {
        const {
            endpointNumber
        } = this.device_.configuration.interfaces[0].alternate.endpoints[1]
        return this.device_.transferOut(endpointNumber, data);
    };
})();

let port;

function hexStringToByte(byteAsHexString) {
  return parseInt(byteAsHexString, 16);
}

/**
 * Converts a Hex String or a Pretty Hex String to an array of bytes (Uint8Array)
 * @param hexStr
 * @returns {Uint8Array}
 */
function hexStringToBytes(hexStr) {
  const SEPARATORS = new RegExp('[-:]', 'g');
  let str = hexStr.replace(SEPARATORS,'');
  let size = str.length / 2;
  let bytes = new Uint8Array(size + 2);
  for (let i = 0; i < size; ++i) {
    bytes[i] = hexStringToByte(str.substr(2 *  i, 2));
  }
  bytes[size] = 0x0D;
  bytes[size + 1] = 0x0A;
  return bytes;
}

function byteToHexString(byte) {
  return (((byte & 0xF0) >> 4).toString(16) + (byte & 0x0F).toString(16)).toLowerCase();
}

function bytesToPrettyHexString(bytes) {
  let hex = '';
  for (let byte of bytes.values()) {
    if (hex.length > 0) {
      hex += ':';
    }
    hex += byteToHexString(byte);
  }
  return hex.toLowerCase();
}

function connect() {
    port.connect().then(() => {
        port.onReceive = data => {
            console.log("Received:", bytesToPrettyHexString(data));
            document.getElementById('output').value += bytesToPrettyHexString(data);
        };
        port.onReceiveError = error => {
            console.error(error);
            document.querySelector("#connect").style = "visibility: initial";
            port.disconnect();
        };
    });
}

function send(string) {
    string = string.trim();
    console.log("sending to serial:" + string.length);
    if (string.length === 0)
        return;
    console.log("sending to serial: [" + string +"]\n");
    const bytes = hexStringToBytes(string);
    console.log(bytes);
    if (port) {
        port.send(bytes);
    }
}

window.onload = () => {
    document.querySelector("#connect").onclick = function() {
        serial.requestPort().then(selectedPort => {
            port = selectedPort;
            this.style = "visibility: hidden";
            connect();
        });
    };

    document.querySelector("#submit").onclick = () => {
        let source = document.querySelector("#editor").value;
        send(source);
    }

    document.querySelector("#sendConnect").onclick = () => {
        document.querySelector("#editor").innerHTML = "30";
    }

    document.querySelector("#calibrate").onclick = () => {
        document.querySelector("#editor").innerHTML = "3100310131023103";
    }

    document.querySelector("#changeTolerance").onclick = () => {
        document.querySelector("#editor").innerHTML = "32XXYY";
    }

    document.querySelector("#enableTarget").onclick = () => {
        document.querySelector("#editor").innerHTML = "34XX";
    }

    document.querySelector("#disableTarget").onclick = () => {
        document.querySelector("#editor").innerHTML = "35XX";
    }

    document.querySelector("#disableTargetAndBlink").onclick = () => {
        document.querySelector("#editor").innerHTML = "36XX";
    }

    document.querySelector("#disableTargetsAndBlink").onclick = () => {
        document.querySelector("#editor").innerHTML = "37";
    }

    document.querySelector("#getState").onclick = () => {
        document.querySelector("#editor").innerHTML = "38";
    }

    document.querySelector("#reset").onclick = () => {
        document.querySelector("#editor").innerHTML = "3F";
    }
};
