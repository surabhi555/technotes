const User=require('../models/User')

const Note=require('../models/Note')

const asyncHandler=require('express-async-handler')

const bcrypt=require('bcrypt')
// @desc get all user
// @route GET/URLSearchParams
// @access Private
const getAllUser=asyncHandler(async(req,res)=>{
    console.log("in get")
   const users=await User.find().select('-password').lean()
   if(!users.length){
    return res.status(400).json({message:'No users found!'})
   } 
   res.json(users)
})

// @desc create new user
// @route POST/users
// @access Private
const createNewUser=asyncHandler(async(req,res)=>{
    const{ username,password,roles}=req.body

    //confirm data

    if(!username || !password ||!Array.isArray(roles) ||!roles.length){
        return res.status(400).json({
            message:'All fields are requiired'
        })
    }

    //check for dups
    const duplicate=await User.findOne({ username}).lean().exec()

    if(duplicate){
        return res.status(409).json({
            message:'Duplicate Username'
        })
    }
    //hash the password
    const hasedPWD=await bcrypt.hash(password,10) //salt rounds

    const userObject={
        username,
        "password":hashedPWD,
        roles
    }
    //create and store new user
    const user=await User.create(userObject)

    if(user){
        res.status(201).json({ message:`New user ${username} created`})
    }
    else{
        res.status(400).json({
            message:'Invlaid user data recieved'
        })
    }
    
})
// @desc  update user
// @route PATCH/users
// @access Private
const updateUser=asyncHandler(async(req,res)=>{
    const{id,username,password,roles,active}=req.body

    //confirm data
    if(!id || !username ||!Array.isArray(roles) || !roles.length ||typeof active!=='boolean'){
        return res.status(400).json({
            message:'All fields are required!'
        })
    }
    const user=await User.findById(id).exec()

    if(!user){
        return res.status(400).json({
            message:'user not found'
        })
    }
    //check for duplicates
    const duplicate=await User.findOne({username}).lean().exec()
    //allow updates to the original user
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({
            message:'duplicate username'
        })
    }
    user.username=username
    user.roles=roles
    user.active=active

    if(password){
        //hash password
        user.password = await bcrypt.hash(password,10)
    }
    const updatedUser = await user.save()
    res.json({
        message:`${updatedUser.username} updated!`
    })
})

// @desc  delete user
// @route DELETE/users
// @access Private
const deleteUser=asyncHandler(async(req,res)=>{
    const {id} =req.body
    if(!id){
        return res.status(400).json({message:'user id is required'})
    }
    const notes= await Note.findOne({user:id}).lean().exec()

    if(notes?.length){
        return res.status(400).json({
            message:'User has assigned notes'
        })
    }
    const user=await User.findById(id).exec()

    if(!user){
        return res.status(400).json({
            message:'user not found'
        })
    }
    const result = await user.deleteOne()

    const reply=`Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports={
    getAllUser,
    createNewUser,
    updateUser,
    deleteUser
}