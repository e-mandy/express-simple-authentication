import express from 'express';
import User from './User.js';

const app = express();

const router = express.Router();

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

app.listen(3000, () => {
    console.log("The server is listening on the port: 3000");
});