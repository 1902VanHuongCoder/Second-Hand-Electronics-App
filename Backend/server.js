const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const gpuRoutes = require('./routes/gpuRoutes');
const cpuRoutes = require('./routes/cpuRoutes');
const storageTypeRoutes = require('./routes/storageTypeRoutes');
const storageRoutes = require('./routes/storageRoutes');
const ramRoutes = require('./routes/ramRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const conditionRoutes = require('./routes/conditionRoutes');
const brandRoutes = require('./routes/brandRoutes');
const versionRoutes = require('./routes/versionRoutes');
const laptopRoutes = require('./routes/laptopRoutes');
const productRoutes = require('./routes/productRoutes');
const screenRoutes = require('./routes/screenRoutes');
const homeRoutes = require('./routes/homeRoutes');
const uploadImageRoutes = require('./routes/uploadImageRoutes');
const phoneRoutes = require('./routes/phoneRoutes');
const postManagementRoutes = require('./routes/postManagementRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paypal = require('paypal-rest-sdk');
const ChatRoom = require('./models/Chat');

const app = express();
dotenv.config();

const http = require("http").Server(app);

const PORT = 5000;
const socketIO = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:3000",
	},
});

paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(
	{
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization']
	}
));

// const generateID = () => Math.random().toString(36).substring(2, 10); // Generate a random ID

socketIO.use((socket, next) => {
    const { userId, userName } = socket.handshake.auth;
    if (!userId || !userName) {
        return next(new Error("Authentication error"));
    }
    socket.userId = userId;
    socket.userName = userName;
    next();
});


socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on("createRoom", async (receiverName, receiverId, receiverAvatar, senderId, senderName, senderAvatar, productImage, productTitle, productPrice) => {
		const roomCode = `${receiverId}-${senderId}`;
		socket.join(roomCode);
		let chatRoom = await ChatRoom.findOne({ roomCode: roomCode });
		
		if (!chatRoom) {
			chatRoom = new ChatRoom({
				roomCode,
				senderId,
				receiverId,
				senderName,
				receiverName,
				senderAvatar,
				receiverAvatar,
				productImage,
				productTitle,
				productPrice,
				messages: []
			});
			await chatRoom.save();
		}
		socket.emit("createdRoom", chatRoom);
	})

	socket.on("findRoom", async (roomCode) => {
		try {
			let chatRoom = await ChatRoom.findOne({ roomCode: roomCode });
			if (chatRoom) {
				socket.emit("foundRoom", chatRoom);
			} else {
				console.log("Room not found");
			}
		} catch (error) {
			console.error("Error finding room:", error);
		}
	});

	socket.on("newMessage", async (data) => {
		const { roomCode, senderId, text, senderN} = data;
		console.log(data);
		try {
			let chatRoom = await ChatRoom.findOne({ roomCode: roomCode });
			if (chatRoom) {
				const newMessage = {
					senderId: senderId,
					text: text,
					senderN: senderN,
					time: new Date()
				};
				chatRoom.messages.push(newMessage);
				await chatRoom.save();
				socket.to(roomCode).emit("receiveMessage", newMessage);
			} else {
				console.log("Room not found");
			}
		} catch (error) {
			console.error("Error adding new message:", error);
		}
	});

	socket.on("disconnect", () => {
		socket.disconnect();
		console.log("🔥: A user disconnected");
	});
});

// Middleware để log requests
app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});

app.get("/api/chat", async (req, res) => {
	try {
		const chatRooms = await ChatRoom.find();
		res.json(chatRooms);
	} catch (error) {
		console.error("Error fetching chat rooms:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Route mặc định cho đường dẫn gốc
app.get('/', (req, res) => {
	console.log('Client accessed root route');
	res.json({
		message: 'Welcome to API Server',
		status: 'running'
	});
});

// Test API endpoint
app.get('/api/test', (req, res) => {
	console.log('Client tested connection');
	res.json({
		message: 'Kết nối thành công đến server!',
		timestamp: new Date().toISOString()
	});
});

// Test API với POST request
app.post('/api/hello', (req, res) => {
	const { name } = req.body;
	console.log(`Received hello request from: ${name || 'Anonymous'}`);
	res.json({
		message: `Xin chào, ${name || 'Người dùng'}!`,
		timestamp: new Date().toISOString()
	});
});

// Thêm route cho thanh toán PayPal
app.post('/api/paypal/payment', (req, res) => {
	const { amount, currency } = req.body;

	if (!amount || isNaN(amount) || amount <= 0) {
		return res.status(400).json({ error: "Số tiền không hợp lệ!" });
	}

	const create_payment_json = {
		intent: "sale",
		payer: { payment_method: "paypal" },
		redirect_urls: {
			return_url: "http://10.0.2.2:5000/api/paypal/success",
			cancel_url: "http://10.0.2.2:5000/api/paypal/cancel"
		},
		transactions: [
			{
				amount: { total: parseFloat(amount).toFixed(2), currency: currency || "USD" },
				description: "Thanh toán React Native WebView"
			}
		]
	};

	paypal.payment.create(create_payment_json, (error, payment) => {
		if (error) {
			console.error("Lỗi tạo thanh toán:", error.response);
			res.status(500).json({ error });
		} else {
			const approvalUrl = payment.links.find(link => link.rel === "approval_url")?.href;
			if (!approvalUrl) {
				return res.status(500).json({ error: "Không tìm thấy approval_url" });
			}
			res.json({ approvalUrl });
		}
	});
});

// Route để xử lý khi thanh toán thành công
app.get("/api/paypal/success", (req, res) => {
	const { paymentId, PayerID } = req.query;

	if (!paymentId || !PayerID) {
		return res.status(400).send("Thiếu paymentId hoặc PayerID");
	}

	const execute_payment_json = {
		payer_id: PayerID,
		transactions: [{ amount: { total: "10.00", currency: "USD" } }]
	};

	paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
		if (error) {
			console.error("Lỗi xác nhận thanh toán:", error.response);
			res.status(500).send("Thanh toán thất bại");
		} else {
			res.send("Thanh toán thành công!");
		}
	});
});

// Route để xử lý khi người dùng hủy thanh toán
app.get('/api/paypal/cancel', (req, res) => {
	res.send('Thanh toán đã bị hủy.'); // Hoặc chuyển hướng đến trang hủy
});

app.use('/api', userRoutes);

app.use('/api', uploadImageRoutes);

app.use('/api', gpuRoutes);

app.use('/api', cpuRoutes);

app.use('/api', storageTypeRoutes);

// Sử dụng các route Storage
app.use('/api', storageRoutes);

// Sử dụng các route RAM
app.use('/api', ramRoutes);

// Sử dụng các route Category
app.use('/api', categoryRoutes);

// Sử dụng các route Condition
app.use('/api', conditionRoutes);

// Sử dụng các route Brand
app.use('/api', brandRoutes);

// Sử dụng các route Version
app.use('/api', versionRoutes);

// Sử dụng các route Laptop
app.use('/api/laptops', laptopRoutes);

// Sử dụng các route Product
app.use('/api/products', productRoutes);

app.use('/api/orders', orderRoutes);

// Sử dụng các route Screen
app.use('/api/screens', screenRoutes);

// Sử dụng các route Home
app.use('/api/home', homeRoutes);

app.use('/api/phones', phoneRoutes);

app.use('/api/post-management', postManagementRoutes);


// Kết nối database
const startServer = async () => {
	try {
		await connectDB();

		const PORT = process.env.PORT || 5000;

		const server = app.listen(PORT, () => {
			console.log(`Server đang chạy tại port ${PORT}`);
		}).on('error', (err) => {
			if (err.code === 'EADDRINUSE') {
				console.log(`Port ${PORT} đã được sử dụng, thử port ${PORT + 1}`);
				server.close();
				app.listen(PORT + 1, () => {
					console.log(`Server đang chạy tại port ${PORT + 1}`);
				});
			} else {
				console.error('Lỗi khởi động server:', err);
			}
		});

	} catch (error) {
		console.error('Không thể khởi động server:', error);
		process.exit(1);
	}
};

// Khởi động server
startServer();

// Xử lý lỗi không mong muốn
process.on('unhandledRejection', (err) => {
	console.error('Lỗi không mong muốn:', err);
	process.exit(1);
});

http.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});