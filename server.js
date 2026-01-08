import express from 'express';
import User from './User.js';
import jwt from 'jsonwebtoken';

const app = express();

const router = express.Router();

const SECRET_KEY = "GOD_BLESS_NO_STRESS";
const REFRESH_SECRET_KEY = "GOD_BLESS_YOU";

app.use(express.json());
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
        
            return res.status(200).json({
                code: 200,
                message: "Utilisateur connecté",
                data: {
                    user: {
                        email: user.email
                    },
                    accessToken: token,
                    refreshToken: refresh_token
                }
            })
        }catch(error){
            return res.status(400).json({
                code: 400,
                message: "Connexion échouée"
            })
        }
    });

app.listen(3000, () => {
    console.log("The server is listening on the port: 3000");
});