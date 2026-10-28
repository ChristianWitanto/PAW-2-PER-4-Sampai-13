import { registerSchema } from '../schemas/auth.schema.js'
import {  apiResponseValidation,apiResponse } from '../utils/response.js'
import userModel from '../model/user.model.js'
import {passwordHelper} from '../utils/password.helper.js'

class AuthController {
    static async register(req,res){
        const result = registerSchema.safeParse(req.body);

        if(!result.success) {
            return apiResponseValidation({
                res,
                errors: result.error
            })
        }
        const{name,email,password} = result.data;
        const newUser = await userModel.create({
            name,
            email,
            password : await userModel.hashPassword(password)
        })
        return apiResponse({
            res,
            status : 200,
            message : "register berhasil",
            data : null
        })
    }
    static async login(req,res){
    }
}

export default AuthController;