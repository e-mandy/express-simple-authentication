import { authenticator } from "otplib";
import qrcode from 'qrcode';

authenticator.options = { window: 1 };
export const generateSecret = () => {
    return authenticator.generateSecret();
}

export const verifyCode = (token, secret) => {
    return authenticator.verify({ token, secret });
}

export const generateQRCode = async (userEmail, secret) => {
    const uri = authenticator.keyuri(userEmail, 'Test2FA', secret);

    return await qrcode.toDataURL(uri);
}


const secret = generateSecret();
const email = "test@gmail.com";

console.log(await generateQRCode(email, secret));