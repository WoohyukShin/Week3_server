"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../db/models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const router = express_1.default.Router();
// GET /api/users/check-username/:username - 사용자명 중복확인
router.get('/check-username/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const existingUser = await User_1.default.findOne({ username });
        if (existingUser) {
            res.json({ available: false, message: '이미 사용 중인 사용자명입니다.' });
        }
        else {
            res.json({ available: true, message: '사용 가능한 사용자명입니다.' });
        }
    }
    catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
});
// GET /api/users/check-nickname/:nickname - 닉네임 중복확인
router.get('/check-nickname/:nickname', async (req, res) => {
    const { nickname } = req.params;
    try {
        const existingUser = await User_1.default.findOne({ nickname });
        if (existingUser) {
            res.json({ available: false, message: '이미 사용 중인 닉네임입니다.' });
        }
        else {
            res.json({ available: true, message: '사용 가능한 닉네임입니다.' });
        }
    }
    catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
});
// POST /api/users/register - 회원가입
router.post('/register', async (req, res) => {
    const { username, password, nickname } = req.body;
    try {
        // 중복 확인
        const existingUsername = await User_1.default.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: '이미 사용 중인 사용자명입니다.' });
        }
        const existingNickname = await User_1.default.findOne({ nickname });
        if (existingNickname) {
            return res.status(400).json({ message: '이미 사용 중인 닉네임입니다.' });
        }
        const user = new User_1.default({ username, password, nickname });
        await user.save();
        res.status(201).json({ message: '회원가입이 완료되었습니다!' });
    }
    catch (error) {
        res.status(400).json({ message: '회원가입 중 오류가 발생했습니다.', error: error.message });
    }
});
// POST /api/users/login - 로그인
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User_1.default.findOne({ username });
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
        const secret = config_1.jwt.secret;
        const options = {
            expiresIn: config_1.jwt.expiresIn,
        };
        const token = jsonwebtoken_1.default.sign(payload, secret, options);
        res.json({ token, username: user.username });
    }
    catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
});
// GET /api/users/ranking - 랭킹 조회
router.get('/ranking', async (req, res) => {
    try {
        // highScore를 기준으로 내림차순 정렬하고 상위 10명만 조회
        const topUsers = await User_1.default.find().sort({ highScore: -1 }).limit(10).select('username highScore');
        res.json(topUsers);
    }
    catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map