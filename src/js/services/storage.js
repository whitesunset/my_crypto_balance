'use strict'

const angular = require('angular')
const CryptoJS = require("crypto-js")
const storage = {
    settings: {
        goal: true,
        goal_limit: 100000,
        subgoal: false,
        subgoal_limit: 10000,
        currency: 'USD'
    },
    coins: []
}

angular.module('app').service('$storage', function ($rootScope) {
    this.passphrase = null

    this.get = function (passphrase) {
        if (!passphrase) return storage

        this.passphrase = passphrase
        var obj = JSON.parse(localStorage.getItem('storage'))
        var key = CryptoJS.SHA256(this.passphrase).toString()

        if (!obj) return storage
        if (!obj.hasOwnProperty(key)) return storage

        var encrypted = obj[key]
        var bytes = CryptoJS.AES.decrypt(encrypted.toString(), this.passphrase)
        var decrypted = bytes.toString(CryptoJS.enc.Utf8)
        var result = JSON.parse(decrypted)

        return result
    }

    this.set = function (data) {
        var obj = JSON.parse(localStorage.getItem('storage')) || {}
        var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.passphrase).toString()
        var key = CryptoJS.SHA256(this.passphrase).toString()

        obj[key] = encrypted

        localStorage.setItem('storage', JSON.stringify(obj))
    }
});