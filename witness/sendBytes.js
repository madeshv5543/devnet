"use strict";
require("ocore/wallet.js");
const headlessWallet = require('headless-obyte');
const eventBus = require('ocore/event_bus.js');
const validationUtils = require("ocore/validation_utils.js");
const conf = require('ocore/conf.js');
const constants = require('ocore/constants.js');
const Address ="TCOCMSQL2EELIA7SJQDHJITIKIB2POTV";
const amount = 12345678;

const sendBytes = function(){
    if(validationUtils.isValidAddress(Address)){
        headlessWallet.issueChangeAddressAndSendPayment(null, amount, Address, null, function(err, unit){
            console.log("err", err, unit)
        })
    }
};

sendBytes()