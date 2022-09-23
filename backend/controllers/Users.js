import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id','name','eth_Acc','ic_Num']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async(req, res) => {
    const { eth_Acc, name, ic_Num } = req.body;
    const salt = await bcrypt.genSalt();
    const hashIc = await bcrypt.hash(ic_Num, salt);
    const hashAdd = await bcrypt.hash(eth_Acc, salt);
    try {
        await Users.create({
            eth_Acc: hashAdd,
            name: name,
            ic_Num: hashIc
        });
        res.json({msg: "Register succesful"});
    } catch (error) {
        console.log(error);
    }
}

export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                name: req.body.name
            }
        });
        const match1 = await bcrypt.compare(req.body.ic_Num, user[0].ic_Num);
        const match2 = await bcrypt.compare(req.body.eth_Acc, user[0].eth_Acc);
        if(!match1) return res.status(400).json({msg: "Ic not registered"});
        if(!match2) return res.status(400).json({msg: "Ethereum address not registered"});
        if(match1 && match2) return res.json({msg: "You are eligible"})
    } catch (error) {
        res.status(404).json({msg:"Name not registered"});
    }
}