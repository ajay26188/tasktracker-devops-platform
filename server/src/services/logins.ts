import User from "../models/user";
import bcrypt from 'bcrypt';
import { SECRET } from "../config/env";
import jwt from 'jsonwebtoken';

export const loginService = async(email: string, password: string) => {
    const user  = await User.findOne({email});

    if (!user) return null;

    if (!user.isVerified) {
        return "unverified email";
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) return null;

    const userForToken = {
        id: user._id.toString(),
        role: user.role,
        organizationId: user.organizationId.toString()
    };

    const token = jwt.sign(userForToken, SECRET);

    return {
        id: user._id.toString(),
        email: user.email, 
        name: user.name, 
        role: user.role,
        organizationId: user.organizationId.toString(),
        token 
    };
};