import { authenticator } from "otplib";
import qrcode from 'qrcode';

const generateSecret = () => {
    return authenticator.generateSecret();
}

const verifyCode = (token, secret) => {
    return authenticator.verify({ token, secret });
}

const generateQRCode = async (userEmail, secret) => {
    const uri = authenticator.keyuri(userEmail, 'Test2FA', secret);

    return await qrcode.toDataURL(uri);
}


const secret = generateSecret();
const email = "test@gmail.com";

console.log(await generateQRCode(email, secret));