import express from 'express';
import User from './User.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();

const router = express.Router();

const SECRET_KEY = "GOD_BLESS_NO_STRESS";
const REFRESH_SECRET_KEY = "GOD_BLESS_YOU";

app.use(express.json());
app.use(cookieParser());
app.use(router);

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try{

        const user = await User.findOne({
            email: email
        });

        if(user) return res.status(400).json({
            code: 400,
            meassage: "Cet email est déjà utilisé"
        });

        const newUser = await User.create({ email: email, password: password });

        return res.status(201).json({
            code: 201,
            message: "Utilisateur crée avec succès",
            data: {
                email: newUser.email
            }
        })

    }catch(error){
        return res.status(400).json({
            status: 400,
            message: "L'inscription a échoué"
        })
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email });
        
        if(!user) return res.status(401).json({
            code: 401,
            message: "Identifiants invalides"
        });
    
        const isCorrect = await user.comparePassword(password);

        if(!isCorrect) return res.status(401).json({
            code: 401,
            message: "Identifiants invalides"
        });

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '15m' });

        const refresh_token = jwt.sign({userId: user._id}, REFRESH_SECRET_KEY, { expiresIn: '7d' })
    
        res.cookie('refreshToken', refresh_token, {
            sameSite: 'Lax',
            httpOnly: true
        })

        return res.status(200).json({
            code: 200,
            message: "Utilisateur connecté",
            data: {
                user: {
                    email: user.email
                },
                accessToken: token,
            }
        })
    }catch(error){
        return res.status(400).json({
            code: 400,
            message: "Connexion échouée"
        })
    }
});

router.post('/refresh', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) return res.status(401).json({
        code: 401,
        message: "Accès non autorisé"
    });

    try{

        const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);

        if(!decoded) return res.status(403).json({
            code: 403,
            message: "Accès non autorisé"
        });

        const new_access_token = jwt.sign({ userId: decoded.userId }, SECRET_KEY, { expiresIn: '15m' });

        return res.status(200).json({
            code: 200,
            accessToken: new_access_token
        })

    }catch(error){
        if(error.name == "JsonWebTokenError"){
            return res.status(400).json({
                code: 400,
                message: "Failed to refresh token"
            })
        }
    }
});

app.listen(3000, () => {
    console.log("The server is listening on the port: 3000");
});