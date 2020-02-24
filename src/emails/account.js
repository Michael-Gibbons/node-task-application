const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'michael.gibbons92407@gmail.com',
    subject: 'Thanks for Joining Task App!',
    text: `Welcome to the app ${name}! Let me know how you get along with the app.`
  })
}

const sendDeletedEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'michael.gibbons92407@gmail.com',
    subject: 'Sorry to see you go!',
    text: `Thanks for using task app ${name}! Was there anything we could have done to keep you around?`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendDeletedEmail
}