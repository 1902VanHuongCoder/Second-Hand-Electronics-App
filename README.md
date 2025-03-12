<h1>📱 Tech Market Mobile Application</h1>

<p>This project is a mobile application developed during our practical internship at <strong>Thoi So Company</strong>. It allows users to post news about selling second-hand laptops and phones.</p>

<h2>👨‍💻 Team Members</h2>
<ul>
  <li>👤 <strong>Hoài Đức</strong> – CTU, Information Technology Major</li>
  <li>👤 <strong>Hoàng Anh</strong> – CTU, Information Technology Major</li>
  <li>👤 <strong>Văn Hưởng</strong> – CTU, Information Technology Major</li>
</ul>

<h2>🚀 Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong> React Native (Expo Framework)</li>
  <li><strong>Backend:</strong> Express.js, MongoDB, Socket.IO</li>
</ul>

<h2>🎯 Main Features</h2>
<ul>
  <li>✅ <strong>Authentication:</strong> Sign up & Log in 🔑</li>
  <li>✅ <strong>Post Listings:</strong> Sell second-hand laptops & phones 🖥️📱</li>
  <li>✅ <strong>AI-powered Image Recognition:</strong> Prevent duplicate images in the database 🖼️⚡</li>
  <li>✅ <strong>Duplicate Post Detection:</strong> Avoid multiple posts with the same title 🚫📝</li>
  <li>✅ <strong>Real-time Chat:</strong> Direct messaging between buyers & sellers using Socket.IO 💬</li>
  <li>✅ <strong>User Profile Management:</strong> Update user information 👤</li>
  <li>✅ <strong>Post Management:</strong> View, edit, or delete posts 📌</li>
</ul>

<h2>⚙️ Setup Guide</h2>

<h3>1️⃣ Clone the Project</h3>
<pre><code>
git clone &lt;repository-url&gt;
cd Second-Hand-Electronics-App
</code></pre>

<h3>2️⃣ Open the Project</h3>
<p>You will find two folders:</p>
<ul>
  <li>📁 <strong>Frontend</strong> - React Native (Expo)</li>
  <li>📁 <strong>Backend</strong> - Express.js (Node.js)</li>
</ul>

<h3>3️⃣ Setup Frontend</h3>
<pre><code>
cd Frontend
npm install
npx expo start  # Start the app
</code></pre>

<h3>4️⃣ Setup Backend</h3>
<pre><code>
cd ..
cd Backend
npm install
npm start  # Run backend server
</code></pre>

<p>🎉 Now your app is up and running!</p>

<h2>🏗 Project Structure</h2>
<pre>
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
</pre>

<h2>🛠 Additional Notes</h2>
<ul>
  <li>✅ This project is built with <strong>React Native Expo</strong>, so no need to set up Xcode, Android Studio for running the app on an emulator.</li>
  <li>✅ Uses <strong>Cloudinary</strong> for image uploads.</li>
  <li>✅ The backend follows the <strong>MVC architecture</strong> for better scalability.</li>
  <li>✅ If your computer is too weak, you can use <strong>BlueStack</strong> software to run the app instead of using Android Studio (which is too heavy).</li>
</ul>

<h2>🛑 Common Errors & Solutions</h2>

<h3>⚠️ Warning: Text strings must be rendered within a &lt;Text&gt; component</h3>
<p>🔹 <strong>Cause:</strong> This happens when using <strong>NativeWind</strong> instead of the usual style properties.</p>
<p>✅ <strong>Solution:</strong> Wrap text content inside a &lt;Text&gt; component. Example:</p>

<pre><code>
// ❌ Wrong
&lt;View&gt;{'Hello, World!'}&lt;/View&gt;

// ✅ Correct
&lt;View&gt;&lt;Text&gt;Hello, World!&lt;/Text&gt;&lt;/View&gt;
</code></pre>

<h3>📉 App runs too slow on Android Studio Emulator</h3>
<p>🔹 <strong>Cause:</strong> Android Studio’s emulator is heavy on system resources.</p>
<p>✅ <strong>Solution:</strong> Use <strong>BlueStacks</strong> instead.</p>
<ol>
  <li>Download and install <strong>BlueStacks</strong>.</li>
  <li>Install the <strong>Expo Go</strong> app in BlueStacks.</li>
  <li>Copy the Expo development URL (e.g., <code>exp://192.168.1.9:8081</code>).</li>
  <li>Open <strong>Expo Go</strong> in BlueStacks and paste the URL to run the app.</li>
</ol>
