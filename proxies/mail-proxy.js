const nodemailer = require("nodemailer");
const Promise = require("bluebird");
const mailGunTransport = require("nodemailer-mailgun-transport");

const logger = require("../utils/logger");

class MailProxy {
  send(to, subject, text, html) {
    const auth = {
      auth: {
        api_key: "key-ddc3f2211dda0a6460b440419849c109",
        domain: "mail.poriyiyal.com"
      }
    };

    logger.log("Sending Email");
    const transporter = nodemailer.createTransport(mailGunTransport(auth));

    logger.log("Transport Created");
    // setup e-mail data with unicode symbols
    const mailOptions = {
      from: "\"Swapcents\" <noreply@swapcents.com>",
      to,
      subject,
      text,
      html
    };

    console.log("MAILER:", to, subject, text);

    // send mail with defined transport object
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error("Error sending the message");
          logger.error(error);
          return reject(error);
        }
        logger.log("Message sent: ", info);
        return resolve(info);
      });
    });
  }
}

module.exports = new MailProxy();
