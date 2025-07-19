import express, { Request, Response, Router } from 'express';
import User, { IUser } from '../db/models/User';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { jwt as jwtConfig } from '../config/config';

const router: Router = express.Router();

// GET /api/users/check-username/:username - 사용자명 중복확인
router.get('/check-username/:username', async (req: Request, res: Response) => {
  const { username } = req.params;
  console.log(`🔍 Checking username availability: ${username}`);
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`❌ Username already exists: ${username}`);
      res.json({ available: false, message: '이미 사용 중인 사용자명입니다.' });
    } else {
      console.log(`✅ Username available: ${username}`);
      res.json({ available: true, message: '사용 가능한 사용자명입니다.' });
    }
  } catch (error: any) {
    console.log(`❌ Error checking username: ${error.message}`);
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

// GET /api/users/check-nickname/:nickname - 닉네임 중복확인
router.get('/check-nickname/:nickname', async (req: Request, res: Response) => {
  const { nickname } = req.params;
  console.log(`🔍 Checking nickname availability: ${nickname}`);
  try {
    const existingUser = await User.findOne({ nickname });
    if (existingUser) {
      console.log(`❌ Nickname already exists: ${nickname}`);
      res.json({ available: false, message: '이미 사용 중인 닉네임입니다.' });
    } else {
      console.log(`✅ Nickname available: ${nickname}`);
      res.json({ available: true, message: '사용 가능한 닉네임입니다.' });
    }
  } catch (error: any) {
    console.log(`❌ Error checking nickname: ${error.message}`);
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

// POST /api/users/register - 회원가입
router.post('/register', async (req: Request, res: Response) => {
  const { username, password, nickname } = req.body;
  try {
    // 중복 확인
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: '이미 사용 중인 사용자명입니다.' });
    }

    const existingNickname = await User.findOne({ nickname });
    if (existingNickname) {
      return res.status(400).json({ message: '이미 사용 중인 닉네임입니다.' });
    }

    const user = new User({ username, password, nickname });
    await user.save();
    res.status(201).json({ message: '회원가입이 완료되었습니다!' });
  } catch (error: any) {
    res.status(400).json({ message: '회원가입 중 오류가 발생했습니다.', error: error.message });
  }
});

// POST /api/users/login - 로그인
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user: (IUser & { _id: any }) | null = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: '사용자명 또는 비밀번호가 올바르지 않습니다.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '사용자명 또는 비밀번호가 올바르지 않습니다.' });
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
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

// GET /api/users/ranking - 랭킹 조회
router.get('/ranking', async (req: Request, res: Response) => {
  try {
    // highScore를 기준으로 내림차순 정렬하고 상위 10명만 조회
    const topUsers = await User.find().sort({ highScore: -1 }).limit(10).select('username highScore');
    res.json(topUsers);
  } catch (error: any) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

export default router;
