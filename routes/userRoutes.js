const express=require('express')
const router=express.Router()
const usersController=require('../controllers/usersController')

router.get('/users', usersController.getAllUsers);

// POST create new user
router.post('/users', usersController.createNewUser);

// PATCH update user
router.patch('/users', usersController.updateUser);

// DELETE delete user
router.delete('/users', usersController.deleteUser);

module.exports = router;

