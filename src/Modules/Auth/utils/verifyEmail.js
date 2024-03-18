
import  jwt from 'jsonwebtoken';
import sendEmailService from '../../Services/send-emails.services.js';

const verifyEmailService = async(email,req)=>{
  // email Token 
  const token = jwt.sign({email},process.env.VERIFICATION,{expiresIn: '2m'})
  const message = `
  <body dir="rtl" style="border: 5px dotted #eedfbb;width: fit-content;margin: auto;display: flex;justify-content: center;align-items: center">
    <div style="background-color: #fff;padding: 20px 15px;border-radius: 20px;">
      <h2>مرحبا بك .. </h2>
      <hr/>
      <p style="margin-block:40px ;">
        للتحقق من حسابك يرجي الضغط علي الزر الي بالاسفل للتحقق من حسابك
      </p>
      <button style="border: none;background-color: transparent;"><a href=${req.protocol}://${req.headers.host}/api/v1/auth/verify?email=${token} style="text-decoration: none; background-color:#eedfbb; padding: 5px 15px;color:#000;border-radius: 5px;font-size: 16px;">اضغط هنا</a></button>
      <hr style="margin-block:40px ;">
      <p style="text-align: center;">
        اذا لم تقم بطلب تحقق , فقط قم بتجاهل هذا الرسالة
      </p>
      <h4 style="font-style: italic; font-size: large; margin: 30px 5px;border: 3px solid #eedfbb;width: fit-content; padding: 10px;border-radius: 50%;color:#444;">السوري</h4>
    </div>
  </body>
  `
  // send email verification
  const verification = await sendEmailService({to:email,subject:'Verification',message})
    // check is email valid
  if(!verification) return null;
  return true
}

export default verifyEmailService
