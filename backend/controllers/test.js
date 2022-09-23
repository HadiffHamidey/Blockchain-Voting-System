import Users from "../models/UserModel.js";
import Users2 from "../models/UserModel2.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async(req, res) => {
    try {
        const users = await Users2.findAll({
            attributes:['id','name','eth_Acc','ic_Num','phone_Num']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register1 = async(req, res) => {
    const { name, ic_Num } = req.body;
    const salt = await bcrypt.genSalt();
    const hashIc = await bcrypt.hash(ic_Num, salt);
    try {
        await Users.create({
            name: name,
            ic_Num: hashIc
        });
        res.json({msg: "Register succesful"});
    } catch (error) {
        console.log(error);
    }
}

export const Register2 = async(req, res) => {
    const { name, eth_Acc, ic_Num, phone_Num, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password does not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const hashIc = await bcrypt.hash(ic_Num, salt);

    try {
        await Users2.create({
            name: name,
            eth_Acc: eth_Acc,
            ic_Num: hashIc,
            phone_Num: phone_Num,
            password: hashPassword
        });
        res.json({msg: "Register succesful"});
    } catch (error) {
        console.log(error);
    }
}

export const Login1 = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                name: req.body.name
            }
        });
        const match = await bcrypt.compare(req.body.ic_Num, user[0].ic_Num);
        if(!match) return res.status(400).json({msg: "Ic not registered"});
        if(match) return res.json({msg: "You are eligible"})
    } catch (error) {
        res.status(404).json({msg:"Name not registered"});
    }
}

export const Login2 = async(req, res) => {
    try {
        const user = await Users2.findAll({
            where:{
                eth_Acc: req.body.eth_Acc
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const userId = user[0].id;
        const name = user[0].name;
        const eth_Acc = user[0].eth_Acc;
        const ic_Num = user[0].ic_Num;
        const phone_Num = user[0].phone_Num;
        const accessToken = jwt.sign({userId, name, eth_Acc, ic_Num, phone_Num}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({userId, name, eth_Acc, ic_Num, phone_Num}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users2.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"ID not registered"});
    }
}

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users2.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}