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
// POST /api/users/register - 회원가입
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User_1.default({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        res.status(400).json({ message: 'Error registering user', error: error.message });
    }
});
// POST /api/users/login - 로그인
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User_1.default.findOne({ username });
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
        const secret = config_1.jwt.secret;
        const options = {
            expiresIn: config_1.jwt.expiresIn,
        };
        const token = jsonwebtoken_1.default.sign(payload, secret, options);
        res.json({ token, username: user.username });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
// GET /api/users/ranking - 랭킹 조회
router.get('/ranking', async (req, res) => {
    try {
        const topUsers = await User_1.default.find().sort({ highScore: -1 }).limit(10).select('username highScore');
        res.json(topUsers);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map