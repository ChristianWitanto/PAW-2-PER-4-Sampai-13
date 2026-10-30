import moongose from "mongoose";

const schema = moongose.Schema({
    name : {
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        select : false
    }
},{
    timestamps : true
    },
);

const UserModel = moongose.model("users", schema);
export default UserModel;