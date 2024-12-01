// import { error } from "console";
import User from "../models/User.js";
import { signToken } from "../services/auth.js";
// import { createUser, login } from "../controllers/user-controller";
// import exp from "constants";
// import typeDefs from "./typeDefs";

const resolvers = {
    Query: {
        me: async (_,__, context: any) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            const user = await User.findById(context.user._id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        },
    },
    Mutation: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Can`t find this user');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new Error('Wrong password!');
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        addUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        saveBook: async (_, { input }, context) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            const updatedUser =  await User.findByIdAndUpdate(
                context.user._id,
                { $addToSet: { savedBooks: input } },
                { new: true, runValidators: true }
            );
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser;
        },
        removeBook: async (_, { bookId }, context) => {
            if (!context.user) {
                throw new Error('Not authenticated')
            }
            const updatedUser = await User.findByIdAndUpdate(
                context.user._id,
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser;
        },
    },
};

export default resolvers;