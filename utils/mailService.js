import nodemailer from 'nodemailer'
import config from '../config/default.mjs'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
})

export const sendCodeToEmail = async (to, code) => {
  const mailOptions = {
    from: '"MiniStore" <your-email@gmail.com>',
    to,
    subject: 'Verification code',
    text: `Your confirmation code: ${code}`,
    html: `<p>Your confirmation code: <strong>${code}</strong></p>`,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.response)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}
