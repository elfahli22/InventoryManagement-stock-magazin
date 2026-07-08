import { User } from "@/lib/db/models/user.model";
import { connectDB } from "@/lib/db/connection";
import { hashPassword, comparePassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { AuthenticationError, ConflictError } from "@/lib/api/api-error";

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    await connectDB();

    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw new ConflictError("Email already registered");
    }

    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "super_admin" : "staff";

    const hashedPassword = await hashPassword(data.password);
    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    const accessToken = await signAccessToken({ userId: user._id.toString(), role: user.role });
    const refreshToken = await signRefreshToken({ userId: user._id.toString(), role: user.role });

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  },

  async login(email: string, password: string) {
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new AuthenticationError("Account is deactivated");
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    user.lastLogin = new Date();
    await user.save();

    const accessToken = await signAccessToken({ userId: user._id.toString(), role: user.role });
    const refreshToken = await signRefreshToken({ userId: user._id.toString(), role: user.role });

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
      accessToken,
      refreshToken,
    };
  },

  async getCurrentUser(userId: string) {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      throw new AuthenticationError("User not found");
    }
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    };
  },
};
