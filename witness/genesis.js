"use strict";
const db = require('ocore/db.js');
const headlessWallet = require('headless-obyte');
const eventBus = require('ocore/event_bus.js');
const constants = require('ocore/constants.js');
const conf = require('ocore/conf.js');

function onError(err) {
    throw Error(err);
}

function createGenesisUnit(witness, onDone) {
    console.log("witness", witness)
    var composer = require('ocore/composer.js');
    var network = require('ocore/network.js');

    var savingCallbacks = composer.getSavingCallbacks({
        ifNotEnoughFunds: onError,
        ifError: onError,
        ifOk: function(objJoint) {
            network.broadcastJoint(objJoint);
            onDone(objJoint.unit.unit);
        }
    });

    composer.setGenesis(true);
    composer.composeJoint({
        witnesses: witness,
        paying_addresses: witness,
        outputs: [
            { address: witness[0], amount: 1000000 },
            { address: witness[0], amount: 1000000 },
            { address: witness[0], amount: 1000000 },
            { address: witness[0], amount: 1000000 },
            { address: witness[0], amount: 1000000 },
            { address: witness[0], amount: 0 }, // change output
        ],
        signer: headlessWallet.signer,
        callbacks: {
            ifNotEnoughFunds: onError,
            ifError: onError,
            ifOk: function(objJoint, assocPrivatePayloads, composer_unlock) {
                constants.GENESIS_UNIT = objJoint.unit.unit;
                savingCallbacks.ifOk(objJoint, assocPrivatePayloads, composer_unlock);
            }
        }
    });

}

function addMyWitness(witness, onDone) {
    db.query("INSERT INTO my_witnesses (address) VALUES (?)", witness, onDone);    
}

eventBus.once('headless_wallet_ready', function() {
    headlessWallet.readSingleAddress(function(address) {
        createGenesisUnit(conf.initial_witnesses, function(genesisHash) {
            console.log("Genesis created, hash=" + genesisHash);
            console.log("my witness", conf.initial_witnesses)
            addMyWitness(conf.initial_witnesses, function() {
                process.exit(0);
            });
        });
    });
});
