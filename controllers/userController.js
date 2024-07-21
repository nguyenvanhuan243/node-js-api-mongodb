import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/** POST: http://localhost:3000/api/users/verify 
 * @param : {
 *  "username" : "example123",
 * }
 */
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method === "GET" ? req.params : req.body;

        // Check user existence
        const user = await UserModel.findOne({ username });
        if (!user) return res.status(404).send({ error: "Can't find User!" });

        const { password, ...responseUser } = user._doc;
        return res.status(201).send({ msg: "User Verified Successfully", User: responseUser });
    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
    }
}

/** GET: http://localhost:3000/api/users */
export async function getUsers(req, res) {
    try {
        const users = await UserModel.find({});
        if (!users || users.length === 0) return res.status(501).send({ error: "Couldn't Find Any Users" });

        // Remove passwords from each user object
        const usersWithoutPasswords = users.map(user => {
            const { password, ...rest } = user.toJSON();
            return rest;
        });

        return res.status(201).send(usersWithoutPasswords);
    } catch (error) {
        return res.status(404).send({ error: "Cannot Find Users Data" });
    }
}

/** POST: http://localhost:3000/api/users/register
 * @param : {
 *  "username" : "example123",
 *  "password" : "admin123",
 *  "email": "example@gmail.com",
 *  "firstName" : "bill",
 *  "lastName": "william"
 * }
 */
export async function register(req, res) {
    try {
        const { username, password, firstName, lastName, email } = req.body;

        const checkUsername = UserModel.findOne({ username }).exec();
        const checkEmail = UserModel.findOne({ email }).exec();

        const [usernameExists, emailExists] = await Promise.all([checkUsername, checkEmail]);

        if (usernameExists) return res.status(400).send({ error: "Please use unique username" });
        if (emailExists) return res.status(400).send({ error: "Please use unique Email" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            email
        });

        await newUser.save();
        return res.status(201).send({ msg: `User Register Successfully, userId is ${newUser._id}` });
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

/** POST: http://localhost:3000/api/users/login 
 * @param: {
 *  "username" : "example123",
 *  "password" : "admin123"
 * }
 */
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) return res.status(404).send({ error: "Username not Found" });

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) return res.status(400).send({ error: "Incorrect Password" });

        const accessToken = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "24h" });

        return res.status(200).send({ username: user.username, access_token: accessToken });
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

/** GET: http://localhost:3000/api/users/:username */
export async function getUser(req, res) {
    const { username } = req.params;

    try {
        if (!username) return res.status(400).send({ error: "Invalid Username" });

        const user = await UserModel.findOne({ username });
        if (!user) return res.status(404).send({ error: "Couldn't Find the User" });

        const { password, ...rest } = user.toJSON();
        return res.status(200).send(rest);
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

/** PUT: http://localhost:3000/api/users/update 
 * @param: {
 *  "header" : "<token>"
 * }
 * body: {
 *  firstName: '',
 *  address : '',
 *  profile : ''
 * }
 */
export async function updateUser(req, res) {
    try {
        const { userId, ...updateData } = req.body;

        if (!userId) return res.status(400).send({ error: "User Not Found...!" });

        const updatedUser = await UserModel.updateOne({ _id: userId }, updateData);
        if (!updatedUser) return res.status(400).send({ error: "Failed to Update User" });

        return res.status(200).send({ msg: "Record Updated...!" });
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

/** DELETE: http://localhost:3000/api/users/delete 
 * @param: {
 *  "header" : "<token>"
 * }
 */
export async function deleteUser(req, res) {
    try {
        const { userId } = req.params;

        if (!userId) return res.status(400).send({ error: "User Not Found...!" });

        const deletedUser = await UserModel.deleteOne({ _id: userId });
        if (!deletedUser) return res.status(400).send({ error: "Failed to Delete User" });

        return res.status(200).send({ msg: "Record Deleted...!" });
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}
