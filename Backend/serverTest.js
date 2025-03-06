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

const app = express();
dotenv.config();

const http = require("http").Server(app);

const PORT = 5000;
const socketIO = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:3000",
	},
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

const generateID = () => Math.random().toString(36).substring(2, 10); // Generate a random ID
let chatRooms = [];

socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on("createRoom", (name) => {
		socket.join(name);
		chatRooms.unshift({ id: generateID(), name, messages: [] });
		socket.emit("roomsList", chatRooms);
	});

	socket.on("findRoom", (id) => {
		let result = chatRooms.filter((room) => room.id == id);
		// console.log(chatRooms);
		socket.emit("foundRoom", result[0].messages);
		// console.log("Messages Form", result[0].messages);
	});

	socket.on("newMessage", (data) => {
		const { room_id, message, user, timestamp } = data;
		let result = chatRooms.filter((room) => room.id == room_id);
		const newMessage = {
			id: generateID(),
			text: message,
			user,
			time: `${timestamp.hour}:${timestamp.mins}`,
		};
		console.log("New Message", newMessage);
		socket.to(result[0].name).emit("roomMessage", newMessage);
		result[0].messages.push(newMessage);

		socket.emit("roomsList", chatRooms);
		socket.emit("foundRoom", result[0].messages);
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

app.get("/api/chat", (req, res) => {
	res.json(chatRooms);
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