import UserModel from '../model/User.model.js';

/** POST: http://localhost:3000/health 
 * @param : {
 * }
 */
export async function checkHealth(req, res, next) {
    return res.status(200).send(
        { msg: 'OK' });
}
