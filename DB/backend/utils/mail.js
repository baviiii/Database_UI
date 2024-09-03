/**
 *  Email utility to send emails to members
 *  @module utils/mail
 *
 *  @requires nodemailer
 *  @requires dotenv
 */


require('dotenv').config()

const nodemailer = require("nodemailer");     // Nodemailer instance

const user = "kokathatest61@outlook.com";
const pass = "qWERTY@254";


/**
 * Function creates and sends a mail to a specified email.
 *
 * @param {string} to email of the recipient
 * @param {string} subject Subject of the email
 * @param {string} text Body of the email
 * @returns {Promise<string|awaited Promise<ResultType> | Promise<R> | Promise<any>>}
 */
const sendEmail = async (to, subject, text) => {
  try {
    // Create a transporter object that will handle the smtp protocols
    // that sends the email from our server to a client.
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: user,
        pass: pass
      }
    });

    // Email details
    const mailOptions = {
      from: user,
      to: to,
      subject: subject,
      text: text
    };

    console.log(mailOptions);

    // Send the mail and wait for a success or mail.
    return await transporter.sendMail(mailOptions).catch((err) => {
      console.log("Error: ");
      console.log(err);
    });

  } catch (err) {
    return "Failed";
  }
}

exports.sendEmail = sendEmail