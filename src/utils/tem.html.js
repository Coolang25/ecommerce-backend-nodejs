'use strict';

const htmlEmailToken = () => {
    return `
        <h3>Verify your email</h3>
        <p>Use the following OTP to verify your email: <b>{{link_verify}}</b></p>
        <p>This OTP is valid for 1 minute</p>
    `
}

module.exports = {
    htmlEmailToken
}