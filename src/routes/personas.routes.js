import {Router} from "express"
import pool from "../database.js"

const router = Router();

router.get("/add", (req,res)=>{
    res.render("personas/add");
})

router.post("/add", async(req, res)=>{
    try{
            const{name, lastname, age} = req.body;
            const newPersona = {
                name, lastname, age
            }
            await pool.query("INSERT INTO Personas SET ?",[newPersona]);
            res.redirect("/list");
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});



router.get("/list", async(req, res)=>{
    try{
        const [result] = await pool.query("SELECT * FROM Personas");
        res.render("personas/list", {personas: result});
        
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get("/edit/:id", async(req, res)=>{
    try{
        const {id} = req.params;
        const [persona] = await pool.query("SELECT * FROM Personas WHERE id = ? ", [id]);
        const personaedit = persona[0];
        res.render("personas/edit", {persona: personaedit});
    }
    
    catch(err){
        res.status(500).json({message:err.message});
    }
})


router.post("/edit/:id", async(req, res)=>{
    try{
        const {name, lastname, age} = req.body;
        const {id} = req.params;
        const editpersona ={name, lastname, age};
        await pool.query("UPDATE Personas SET ?  WHERE id = ?", [editpersona, id]);
        res.redirect("/list");
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

router.get("/delete/:id", async(req, res)=>{
    try{
        const {id} = req.params;
        await pool.query("DELETE FROM Personas WHERE id = ?", [id])
        res.redirect("/list");
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})



export default router;