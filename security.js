import bcrypt from 'bcrypt';

export const securePassword = async (password) => {
    const salt = 10;

    return await bcrypt.hash(password, salt);
}


const verifyPassword = async (password, hash) => {
    const result = await bcrypt.compare(password, hash);

    return result;
}

let hashedPassword = await securePassword("Nitro123");


let result = await verifyPassword("Nitro123", hashedPassword);
console.log(result);

result = await verifyPassword("PasLeBonMotDePasse", hashedPassword);
console.log(result)