import UserSchema from "./UserSchema.js"

// create user model
export const registerUserModel = (formObj) => {
    return UserSchema(formObj).save();
}

// finding user by email
export const getUserByEmail = (email) => {
    return UserSchema.findOne(email)
}



//update user 
export const updateUser = (_id, formObj)=>{
    return UserSchema.findByIdAndUpdate(_id, formObj, { new: true })
}


//delete user by id
export const deleteUserById = (_id) => {
    return UserSchema.findByIdAndDelete(_id)
}
