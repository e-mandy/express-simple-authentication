import express from 'express';
import { generateQRCode, generateSecret, verifyCode } from './authenticator';
import { db } from './db';


const app = express();

const router = express.Router();

router.get('/setup', async (req, res) => {
    const { email } = req.body;

    const secret = generateSecret();
    db.user.twoFactorSecret = secret;

    const qrCode = await generateQRCode(email, secret);

    res.status(200).json({
        code: 200,
        qrcode: qrCode,
        // C'était un cas d'entrainement sinon nous ne sommes pas censé envoyer le secret
        //secret: secret
    });
});

router.post('/verify', (req, res) => {
    const { token } = req.body;

    const secret = db.user.twoFactorSecret;
    const result = verifyCode(token, secret);

    if(!result) return res.status(401).json({
        code: 401,
        message: "Incorrect code"
    });

    res.status(200).json({
        code: 200,
    });
});

router.post('/activate', (req, res) => {
    const { token } = req.body;

    const secret = db.user.twoFactorSecret;

    if(!verifyCode(token, secret)) return res.status(401).json({
        code: 401,
        message: "Token incorrect"
    });

    db.user.is2FAActive = true;

    return res.status(200).json({
        code: 200,
        message: "2FA Activé"
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // On admet que le password est bon c'est bien ça ?

    if(!db.user.is2FAActive) return res.status(200).json({
        code: 200,
        message: "Accès accordé"
    });

    return res.status(200).json({
        code: 200,
        message: "Attente du code TOTP"
    });
});