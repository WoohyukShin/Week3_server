import express, { Request, Response, Router } from 'express';
import User, { IUser } from '../db/models/User';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { jwt as jwtConfig } from '../config/config';

const router: Router = express.Router();

// POST /api/users/register - 회원가입
router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
});

// POST /api/users/login - 로그인
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user: (IUser & { _id: any }) | null = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      userId: user._id.toString(),
      username: user.username,
    };
    const secret: Secret = jwtConfig.secret;
    const options: SignOptions = {
      expiresIn: jwtConfig.expiresIn as any,
    };
    const token = jwt.sign(payload, secret, options);

    res.json({ token, username: user.username });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/users/ranking - 랭킹 조회
router.get('/ranking', async (req: Request, res: Response) => {
  try {
    // highScore를 기준으로 내림차순 정렬하고 상위 10명만 조회
    const topUsers = await User.find().sort({ highScore: -1 }).limit(10).select('username highScore');
    res.json(topUsers);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
