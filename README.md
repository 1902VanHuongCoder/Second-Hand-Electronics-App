📱 Tech Market Mobile Application
This project is a mobile application developed during our practical internship at Thoi So Company. It allows users to post news about selling second-hand laptops and phones.

👨‍💻 Team Members
👤 Hoài Đức – CTU, Information Technology Major
👤 Hoàng Anh – CTU, Information Technology Major
👤 Văn Hưởng – CTU, Information Technology Major

🚀 **Tech Stack**
Frontend: React Native (Expo Framework)
Backend: Express.js, MongoDB, Socket.IO

🎯 **Main Features**
✅ Authentication: Sign up & Log in 🔑
✅ Post Listings: Sell second-hand laptops & phones 🖥️📱
✅ AI-powered Image Recognition: Prevent duplicate images in the database 🖼️⚡
✅ Duplicate Post Detection: Avoid multiple posts with the same title 🚫📝
✅ Real-time Chat: Direct messaging between buyers & sellers using Socket.IO 💬
✅ User Profile Management: Update user information 👤
✅ Post Management: View, edit, or delete posts 📌

⚙️ **Setup Guide**
1️⃣ Clone the Project
git clone <repository-url>
cd Second-Hand-Electronics-App

2️⃣ **Open the Project**
You will find two folders:
📁 Frontend - React Native (Expo)
📁 Backend - Express.js (Node.js)

3️⃣ **Setup Frontend**
cd Frontend
npm install
npx expo start  # Start the app

4️⃣ **Setup Backend**
cd ..
cd Backend
npm install
npm start  # Run backend server

🎉 Now your app is up and running!

🏗 **Project Structure**
Tech-Market-Mobile-Application/
├── Backend/
│   ├── .env
│   ├── package.json
│   ├── server.js          # Main backend entry point
│   ├── config/            # API keys, database connection
│   ├── controllers/       # Handle business logic
│   ├── middleware/        # Validate requests before controllers
│   ├── models/            # Database schemas
│   ├── routes/            # API route definitions
│   └── uploads/           # Image uploads (Cloudinary)
├── Frontend/
│   ├── .gitignore
│   ├── app.json           # General Expo config
│   ├── App.tsx            # Main UI entry point
│   ├── babel.config.js    # Babel configuration
│   ├── package.json       # Dependencies & scripts
│   ├── reducers.tsx       # Redux state management
│   ├── store.ts           # Global state store
│   ├── global.css         # Styling
│   ├── index.html
│   ├── metro.config.js
│   ├── nativewind-env.d.ts # UI styling with NativeWind
│   ├── tsconfig.json
│   ├── app/               # Screens/pages of the app
│   │   ├── homePage.tsx   
│   │   ├── postDetails.tsx 
│   │   ├── (tabs)/        # Bottom navigation tabs
│   │   │   ├── _layout.tsx
│   │   │   ├── postCreation.tsx
│   │   ├── admin/         # (Not used in this project)
│   │   │   ├── index.tsx
│   │   │   ├── reports.tsx
│   ├── components/
│   │   ├── HelloWave.tsx  
│   │   ├── Notification.tsx
│   └── utils/
│       └── socket.ts      # Socket.io configuration
├── .gitignore
├── README.md
└── .vscode/
    └── settings.json

🛠 **Additional Notes**
This project is built with React Native Expo, so no need to set up Xcode, Android Studio for running the app on an emulator.
Uses Cloudinary for image uploads.
The backend follows the MVC architecture for better scalability.
If your computer is too weak, you can use BlueStack software to run app instead using Android Studio (too heavy) 

🛑 **Common Errors & Solutions**

⚠️ Warning: Text strings must be rendered within a <Text> component
🔹 Cause: This happens when using NativeWind instead of the usual style properties.
✅ Solution: Wrap text content inside a <Text> component. Example:
// ❌ Wrong
<View>{'Hello, World!'}</View>

// ✅ Correct
<View><Text>Hello, World!</Text></View>

📉 App runs too slow on Android Studio Emulator
🔹 Cause: Android Studio’s emulator is heavy on system resources.
✅ Solution: Use BlueStacks instead.

Download and install BlueStacks.
Install the Expo Go app in BlueStacks.
Copy the Expo development URL (e.g., exp://192.168.1.9:8081).
Open Expo Go in BlueStacks and paste the URL to run the app.







