import { Request, Response } from 'express';
import { User } from '../models/User';
import { registerSchema, loginSchema } from '../utils/validation';
import { generateAccessToken, generateRefreshToken, setAuthCookies, clearAuthCookies } from '../utils/jwt';
import { AuthRequest } from '../middlewares/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Create new user
    const user = await User.create(validatedData);

    // Generate tokens
    const tokenPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        leaveBalance: user.leaveBalance,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // Find user with password field
    const user = await User.findOne({ email: validatedData.email }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate tokens
    const tokenPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        leaveBalance: user.leaveBalance,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    clearAuthCookies(res);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        leaveBalance: user.leaveBalance,
      },
    });
  } catch (error) {
    throw error;
  }
};
