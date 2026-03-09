'use strict';

const { NotFoundError } = require("../core/error.response");
const transport = require("../dbs/init.nodemailer");
const { replacePlaceholder } = require("../utils");
const { newOtp } = require("./otp.service");
const { getTemplate } = require("./template.service");

const sendEmailLinkVerify = async ({
    html,
    toEmail,
    subject = 'Verify your email',
    text = 'Verify your email'
}) => {
    try {
        const mailOptions = {
            from: '"Ecommerce App" <test@gmail.com>',
            to: toEmail,
            subject,
            text,
            html
        };

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }

            console.log('Email sent: ' + info.messageId);
        });

    } catch (error) {
        console.error('Error in sendEmailLinkVerify:', error);
        return error;
    }
}

const sendEmailToken = async ({
    email = null
}) => {
    try {
        // get token
        const token = await newOtp({ email });
        // get email template
        const template = await getTemplate({ tem_name: "HTML EMAIL TOKEN" });

        if (!template) {
            throw new NotFoundError('Email template not found');
        }
        const content = replacePlaceholder(template.tem_html, { link_verify: `http://localhost:3056/v1/api/user/welcome-back?token=${token.otp_token}` });

        // Send email to user
        sendEmailLinkVerify({
            html: content,
            toEmail: email,
            subject: "Verify your email",
            text: "Verify your email"
        }).catch(error => {
            console.error('Error in sendEmailLinkVerify:', error);
        });

        return 1;
    } catch (error) {

    }
}

module.exports = {
    sendEmailToken
}