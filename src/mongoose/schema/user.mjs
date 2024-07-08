import mongoose from "mongoose";

var userSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        require: true,
        unique: true
    },
    city: mongoose.Schema.Types.String,
    password: {
        type: mongoose.Schema.Types.String,
        require: true
    }
});

export const User = mongoose.model("user",userSchema);



