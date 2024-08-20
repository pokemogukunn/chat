const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let verificationCodes = {}; // メールアドレスごとの認証コードを保存

// Nodemailerの設定
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR_EMAIL@gmail.com',
        pass: 'YOUR_EMAIL_PASSWORD'
    }
});

const transporter = nodemailer.createTransport({
    service: 'yoanamail',
    auth: {
        user: 'YOUR_EMAIL@yoanamail.com',
        pass: 'YOUR_EMAIL_PASSWORD'
    }
});

// サインアップ時のメール送信処理
app.post('/sendVerification', (req, res) => {
    const email = req.body.email;
    const code = Math.floor(100000 + Math.random() * 900000); // 6桁の認証コード

    // メールオプション
    const mailOptions = {
        from: 'YOUR_EMAIL@gmail.com',
        to: email,
        subject: '認証コード',
        text: `あなたの認証コードは ${code} です。`
    };

    // 認証コードを保存
    verificationCodes[email] = code;

    // メール送信
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('メールの送信に失敗しました。');
        }
        res.send('認証メールを送信しました。');
    });
});

// 認証コードの確認処理
app.post('/verifyCode', (req, res) => {
    const email = req.body.email;
    const code = req.body.code;

    if (verificationCodes[email] && verificationCodes[email] == code) {
        delete verificationCodes[email]; // 認証成功したらコードを削除
        res.send('認証成功');
    } else {
        res.status(400).send('認証コードが正しくありません。');
    }
});

// サーバーの開始
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
