// Firebaseの初期設定
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebaseの初期化
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storage = firebase.storage();

let currentUser = "user1";

function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const fileInput = document.getElementById("fileInput");
    const messageText = messageInput.value.trim();

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const storageRef = storage.ref('uploads/' + file.name);
        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then((url) => {
                const message = {
                    text: messageText,
                    sender: currentUser,
                    fileUrl: url,
                    fileName: file.name,
                    read: false
                };
                database.ref('messages').push(message);
                displayMessages();
                messageInput.value = "";
                fileInput.value = "";
            });
        });
    } else if (messageText !== "") {
        const message = {
            text: messageText,
            sender: currentUser,
            read: false
        };
        database.ref('messages').push(message);
        displayMessages();
        messageInput.value = "";
    }
}

function displayMessages() {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    database.ref('messages').on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const message = childSnapshot.val();
            const messageElement = document.createElement("div");
            messageElement.classList.add("message");
            if (message.sender === currentUser) {
                messageElement.classList.add("sent");
            }

            if (message.fileUrl) {
                messageElement.innerHTML = `
                    <p>${message.text}</p>
                    <a href="${message.fileUrl}" target="_blank">${message.fileName}</a>
                    <div class="read-receipt">${message.read ? "既読" : ""}</div>
                `;
            } else {
                messageElement.innerHTML = `
                    <p>${message.text}</p>
                    <div class="read-receipt">${message.read ? "既読" : ""}</div>
                `;
            }
            messagesDiv.appendChild(messageElement);

            // スクロールを下に移動
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            // メッセージが表示されたら既読にする
            if (!message.read && message.sender !== currentUser) {
                const messageKey = childSnapshot.key;
                setTimeout(() => {
                    database.ref('messages/' + messageKey).update({ read: true });
                    displayMessages();
                }, 1000); // 既読になるまでのディレイ
            }
        });
    });
}

// ページが読み込まれたときにメッセージを表示
window.onload = displayMessages;
