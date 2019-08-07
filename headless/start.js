var headlessWallet = require('headless-obyte');
var eventBus = require('ocore/event_bus.js');

function onReady() {
    console.log("wallet is ready")
    let amount = 1; //in bytes
    let user_address = "ZQFHJXFWT2OCEBXF26GFXJU4MPASWPJT"; // wallet address
    let user_device_address = null; // device address
    headlessWallet.issueChangeAddressAndSendPayment(null /*asset, null for bytes*/, amount, user_address, user_device_address, (err, unit) => {
        if (err){
            return console.error(err);
        }
        // handle successful payment
    });

    // received new payment
    eventBus.on('new_my_transactions', (arrUnits) => {
        // handle new unconfirmed units here
        // at this stage, payment is not yet confirmed
    });

    // payment is confirmed
    eventBus.on('my_transactions_became_stable', (arrUnits) => {
        // handle payments becoming confirmed
    });
};
eventBus.once('headless_wallet_ready', onReady);