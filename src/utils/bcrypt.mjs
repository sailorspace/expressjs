import bcrypt from "bcrypt";

const saltRunds = 10; //means how much time needed to calculate the bcrypt
//more rounds means more complexity

export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRunds);
    console.log(salt);
    return bcrypt.hashSync(password, salt);

}
//now to authenticate a login we might want to re-has the given password while loggin in
//or we can call the below already provided function from bcrypt compareSynn or compare
export const comparePassword = (plain, hashed) => {
    return bcrypt.compareSync(plain, hashed);
};


