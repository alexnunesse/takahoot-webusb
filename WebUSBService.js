const ARDUINO_VENDOR_ID = 0x2341;
const ARDUINO_PRODUCT_ID = 0x8036;
const IN_ENDPOINT = 5; // In endpoint ID of WebUSB for Arduino (4 for Out endpoint)
const CONFIG_NUMBER = 1; // Device specific configuration value
const INTERFACE_NUMBER = 2; // Device specific interface number
const REQUEST_TYPE = 'class'; // industry-standard class of devices
const TRANSFER_RECIPIENT = "interface"; // target on the transfer on the device
const ARDUINO_CORE_REQUEST = 0x22; // see 'USBCore.h' > #define CDC_SET_CONTROL_LINE_STATE	0x22
const ARDUINO_CONTROL_CONNECT = 0x01; // Vendor-specific, 0x00 for DISCONNECT
const RECIPIENT_INTERFACE_NUMBER = 0x02; // Interface number on the recipient

export default class WebUSBService {
    devices = [];

    async connect() {
        try {
            if (this.devices && this.devices.length > 0) {
                for (let device of this.devices) {
                    await device.open();
                    await device.selectConfiguration(CONFIG_NUMBER);
                    await device.claimInterface(INTERFACE_NUMBER);
                    await device.controlTransferOut({
                        requestType: REQUEST_TYPE,
                        recipient: TRANSFER_RECIPIENT,
                        request: ARDUINO_CORE_REQUEST,
                        value: ARDUINO_CONTROL_CONNECT,
                        index: RECIPIENT_INTERFACE_NUMBER
                    });
                }
                return this.devices;
            }
        } catch (e) {
            console.error(`Error while setting up the devices:\n${e.toString()}`);
            throw e;
        }
    };

    // Get the plugged devices and extract the one having the Arduino's vendor id, then asks the user
    // to choose from the resulting list
    async configureNewDevices() {
        const authorizedDevice = await navigator.usb.requestDevice({
            filters: [{ vendorId: ARDUINO_VENDOR_ID, productId: ARDUINO_PRODUCT_ID }]
        });
        this.devices.push(authorizedDevice);
    };
}