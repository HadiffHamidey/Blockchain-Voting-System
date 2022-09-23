import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users',{
    eth_Acc:{
        type: DataTypes.STRING
    },
    name:{
        type: DataTypes.STRING
    },
    ic_Num:{
        type: DataTypes.STRING
    }
},{
    freezeTableName:true
});

export default Users;