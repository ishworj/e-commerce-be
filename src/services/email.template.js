

export const userActivatedEmailTempalate = ({ email, userName, url }) => {
    return ({
        from: `${process.env.COMPANY_NAME} <${process.env.SMTP_EMAIL}>`, // sender address
        to: email, // list of receivers
        subject: "Action Required! Activate your Account!", // Subject line
        text: `Click the url to activate your Account. ${url}`, // plain text body
        html: `<div style="max-width: 600px; margin: auto; text-align: center; font-family: Arial, sans-serif;">
        <h1>Hello, ${userName}</h1>
            <br />
            <p>Your account has been created. Click the button to Activate your account.</p>
            <a href=${url}><button style="color: white; background : blue; padding: 1rem; border-radius: 10px;">Activate Now</button></a>
            <br />
            <br />
            <p>Regards,</p>
            <p>Ram</p>
            <p>Manager</p>
            <p>${process.env.COMPANY_NAME}</p>
        </div>`, // html body
    });
}
export const OTPemailTemplate = ({ OTP, userName, email }) => {
    return ({
        from: `${process.env.COMPANY_NAME} <${process.env.SMTP_EMAIL}>`, // sender address
        to: email, // list of receivers
        subject: "Your single-use code", // Subject line
        html: `<div style="max-width: 600px; margin: auto; text-align: center; font-family: Arial, sans-serif;">
        <h1>Hello, ${userName}</h1>
            <br />
            <p>Verification Code</p>
           <div>
            <p>Please use the verification code below to update youer new password.</p>
             <strong style="font-size: 130%">${OTP}</strong>
              <p>If you didn’t request this, you can ignore this email.</p>
            </div>
            <br />
            <br />
            <p>Regards,</p>
            <p>${process.env.COMPANY_NAME}</p>
        </div>`, // html body
    })
}
