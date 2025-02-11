import mongoose from "mongoose";
import { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    phoneNo: {
        type: Number,
        unique: true
    },
    address: {
        type: String
    },
    pincode: {
        type: Number
    },
    bloodGroup: {
        type: String
    },
    dateOfBirth: {
        type: Number
    },
    isDetailsFilled: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    donationNo: {
        type: Number,
        default: 0
    },
    requestNo: {
        type: Number,
        default: 0
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

// hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// verify user password
userSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// generates tokens with id
userSchema.methods.generateAccessToken = function () {
    return (
        jwt.sign({
            email: this.email,
            _id: this._id
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
    )
}

userSchema.methods.generateRefreshToken = function () {
    return (
        jwt.sign({
            _id: this._id
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
    )
}

export const User = mongoose.model('User', userSchema);