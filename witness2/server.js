"use strict";
require("ocore/wallet.js");
const witness = require('obyte-witness');
// const explorer = require('obyte-explorer/explorer.js');
const headlessWallet = require('headless-obyte');
const eventBus = require('ocore/event_bus.js');
const validationUtils = require("ocore/validation_utils.js");
const conf = require('ocore/conf.js');
const constants = require('ocore/constants.js');

function postTimestamp(address) {
	var composer = require('ocore/composer.js');
	var network = require('ocore/network.js');
	var callbacks = composer.getSavingCallbacks({
		ifNotEnoughFunds: function(err) {
			console.error(err);
		},
		ifError: function(err) {
			console.error(err);
		},
		ifOk: function(objJoint) {
			network.broadcastJoint(objJoint);
		}
	});

	var datafeed = {
		time: new Date().toString(),
		timestamp: Date.now()
	};
	composer.composeDataFeedJoint(address, datafeed, headlessWallet.signer, callbacks);
}

eventBus.once('headless_wallet_ready', function() {
	headlessWallet.readSingleAddress(function(address) {
		setInterval(postTimestamp, conf.TIMESTAMPING_INTERVAL, address);
	});
});

eventBus.on('paired', function(from_address) {
    console.log('Sucessfully paired with:' + from_address);
    const device = require('ocore/device.js');
    device.sendMessageToDevice(from_address, "text", "Welcome to devnet Witness!");
});
