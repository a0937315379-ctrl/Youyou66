# 關係心情探索｜GitHub Pages + Firebase

這是靜態 GitHub Pages 問卷；回覆寫入私人 Firestore 資料庫，管理者透過 `admin.html` 登入查看。**GitHub 本身不儲存問卷答案**。

## 0. 準備
- 一個 GitHub 帳號。
- 一個 Google 帳號用來建立 Firebase 專案。
- 問卷作答者需願意將回覆分享給你；網站已附清楚告知與勾選同意。

## 1. 建立 Firebase 專案
1. 前往 https://console.firebase.google.com/ 建立專案。
2. 專案設定（齒輪）→「您的應用程式」→新增 **網頁** 應用程式，取得 `firebaseConfig`。
3. 打開 `firebase-config.js`，將 `REPLACE_WITH_...` 改為實際設定值。
4. Firebase → **Authentication** → Sign-in method：開啟 **Anonymous**（供填答者使用）與 **Email/Password**（供管理者使用）。
5. Authentication → Users →「新增使用者」，建立你自己的 Email / Password 管理者帳號。請不要把密碼寫進 GitHub。
6. 在 Authentication → Users 中，複製這位管理者的 **UID**。
7. Firebase → **Firestore Database** → 建立資料庫，建議先選擇靠近台灣的區域；請勿使用無限制的測試規則。
8. Firestore → **Rules**：將 `firestore.rules` 的內容貼上，先把 `REPLACE_WITH_ADMIN_UID` 改為步驟 6 的 UID，然後 **Publish**。

**安全警告：沒有完成 UID 取代、或用了 `allow read, write: if true`，可能導致隱私外洩。不要這樣部署。**

## 2. 放上 GitHub Pages
1. GitHub 建立一個 **Public** repository（例如 `heart-questions`）。請注意，公開 repo 會讓人看到題目及前端程式碼，**但不應該看到回覆**。
2. 上傳這個資料夾中的 `index.html`, `admin.html`, `style.css`, `app.js`, `admin.js`, `questions.js`, `firebase-config.js`。（`firestore.rules` 和本說明也可以上傳，當中不要放任何帳密。）
3. Repository → **Settings → Pages → Build and deployment** 選 **Deploy from a branch** → `main` / `(root)` → Save。
4. 待 GitHub 完成部署後，通常會得到 `https://你的帳號.github.io/heart-questions/`。
5. 把這個一般網址分享給對方。自己從 `https://你的帳號.github.io/heart-questions/admin.html` 登入查看記錄。

## 3. 測試
- 先用無痕模式打開問卷，勾選同意、送出一次測試資料，確認出現「已成功送出」。
- 打開管理頁用 Email/Password 登入，確認能看到測試回覆；若顯示 `permission-denied`，請檢查 UID 和 Rules。
- 若提交失敗，檢查 Firebase Auth 是否開啟 Anonymous，Firestore 是否已建立，網頁設定是否正確。

## 隱私與限制
- 問卷明確告知作答者：答案會被建立者看到並保存。請勿偷偷紀錄。
- **每次按送出都會新增一筆回覆**，目前沒有防重複提交設計。
- 管理者看到的是當下自願提供的答案，不能當成「測出真正感情」的證據。
- 問卷只顯示有限選項且可複選，可略過不想回答的題目。
- Firestore Rules 防止一般作答者讀取他人的回覆，但 Firebase 免費層也有配額限制；公開問卷仍可能遭濫用提交。想停用時，可停用 Anonymous 登入、修改 Firestore Rules 禁止新增、或關閉網站。
- Firebase 設定會寫在公開網頁中，這是正常的 Web SDK 設計；保護資料靠 Rules，不是隱藏 API Key。
- 請定期到 Firebase 控制台檢查資料、用量及管理帳號安全。
