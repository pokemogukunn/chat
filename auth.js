import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ログイン処理
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.location.href = "index.html"; // ログイン成功後にチャットページにリダイレクト
        })
        .catch((error) => {
            alert("ログインに失敗しました。もう一度お試しください。");
        });
}

// サインアップ処理
function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.location.href = "index.html"; // サインアップ成功後にチャットページにリダイレクト
        })
        .catch((error) => {
            alert("サインアップに失敗しました。もう一度お試しください。");
        });
}

// ユーザーの認証状態の確認
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "index.html"; // ユーザーがログイン済みの場合、チャットページにリダイレクト
    } else {
        // ログインページまたはサインアップページにとどまる
    }
});

export { login, signup };
