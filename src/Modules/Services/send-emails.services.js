import nodemailer from 'nodemailer'

const sendEmailService = async({to = '',subject = 'no-replay',message = '<h1>no content</h1>',attachments = []})=>{
  const transporter = nodemailer.createTransport({
    host: 'localhost',
    service: 'gmail',
    port: 587,
    secure: false,  
    auth: {
      user:  process.env.EMAIL_SERVICE,
      pass:  process.env.PASSWORD_SERVICE
    }
  })

  const info = await transporter.sendMail({
    from: `"ElSORY 🎂🍰" <${process.env.EMAIL_SERVICE}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    html:message, // html body
    attachments:attachments
  })
  return info.accepted.length ? true : false
}
export default sendEmailService;