import mongoose from 'mongoose';
import { securePassword } from './security';
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
});


UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    
    this.password = await securePassword(this.password);
    next();
});


UserSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

export default mongoose.model('User', UserSchema);