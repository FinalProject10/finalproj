const Client = require("../models/clients");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "salim123";
module.exports = {
  register: async (req, res) => {
    try {
      const { name, lastName, email, pass, phone, cinNum, batinda } = req.body;
      if (phone.toString().length !== 8) {
        return res.status(404).json({ err: "phone number not valid" });
      }
      let a = await Client.findOne({ where: { email } });
      if (a) {
        return res.status(404).json({ err: "email in use" });
      }
      const hashed = await bcrypt.hash(pass, 10);
      let d = await Client.create({
        name,
        lastName,
        email,
        password: hashed,
        telNumb: phone,
        cinNum,
        batinda,
      });
      res.status(201).json({
        name: d.name,
        lastName: d.lastName,
        email: d.email,
      });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      let user = await Client.findAll({ where: { email } });
      if (user.length === 0) {
        return res.status(404).json("user not found");
      }
      if (user) {
        const hashed = await bcrypt.compare(password, user[0].password);
        if (hashed) {
          const token = jwt.sign(
            { id: user[0].id, role: "client" },
            secretKey,
            { expiresIn: "24h" }
          );
          console.log(token);
          return res.status(200).json(token);
        }
        return res.status(404).json("password is incorrect");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getHome: async (req, res) => {
    try {
      if (!req.id) {
        return res.status(404).json({ err: "err" });
      }
      if (req.id) {
        let d = await Client.findAll({ where: { id: req.id } });
        res.status(200).json(d);
      }
    } catch (err) {
      res.status(500).json({ err: "server err" });
    }
  },
  updateProfileClient:async(req,res)=>{
    try{
      const {fname,lname,email,newPass}=req.body
      let hashed=await bcrypt.hash(newPass,10)
      let d=Client.update({name:fname,lastName:lname,email,password:hashed},{where:{id:req.params.id}})
      if(d) return res.status(200).json('updated')
      return res.status(404).json('not updated')

    }catch(err){
      res.status(500).json('internal server err')
    }

  }
  
};
// exports.login = functions.https.onRequest(this.login);
