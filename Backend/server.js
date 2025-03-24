const {
    express,
    dotenv,
    cors,
    connectDB,
    userRoutes,
    gpuRoutes,
    cpuRoutes,
    storageTypeRoutes,
    storageRoutes,
    ramRoutes,
    categoryRoutes,
    conditionRoutes,
    brandRoutes,
    versionRoutes,
    laptopRoutes,
    productRoutes,
    screenRoutes,
    homeRoutes,
    uploadImageRoutes,
    phoneRoutes,
    postManagementRoutes,
    orderRoutes,
    reportRoutes,
    paypal,
    ChatRoom,
    User,
    Product, rootURL
} = require('./helpers');

const app = express();
dotenv.config(); // Load environment variables from .env file

const http = require("http").Server(app);

const PORT = 5000;
const socketIO = require("socket.io")(http, {
    cors: {
        origin: "*",
    },
});

// Configure PayPal SDK
paypal.configure({
    mode: process.env.PAYPAL_MODE || 'sandbox',
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware for socket authentication
socketIO.use((socket, next) => {
    const { userId, userName } = socket.handshake.auth;
    if (!userId || !userName) {
        return next(new Error("Authentication error"));
    }
    socket.userId = userId;
    socket.userName = userName;
    next();
});

// Socket.IO connection handling
socketIO.on("connection", (socket) => {
    console.log(" ");
    console.log(`⚡: ${socket.id} user just connected!`);

    // Handle room creation
    socket.on("createRoom", async (receiverId, senderId, productId, roomCode) => {
        socket.join(roomCode);
        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);
        const product = await Product.findById(productId);
        let chatRoom = await ChatRoom.findOne({ roomCode: roomCode });

        if (!chatRoom) {
            chatRoom = new ChatRoom({
                roomCode,
                senderId,
                receiverId,
                senderName: sender.name,
                receiverName: receiver.name,
                senderAvatar: sender.avatarUrl,
                receiverAvatar: receiver.avatarUrl,
                productImage: product.images[0],
                productTitle: product.title,
                productPrice: product.price,
                messages: [],
                senderMessagesNotRead: [],
                receiverMessagesNotRead: [],
            });
            await chatRoom.save();
            socket.emit("createdRoom", chatRoom);
        } else {
            if (chatRoom.senderId === senderId) {
                chatRoom.senderMessagesNotRead = [];
                await chatRoom.save();
            } else {
                chatRoom.receiverMessagesNotRead = [];
                await chatRoom.save();

            }
        }
    });

    // Handle finding a room
    socket.on("findRoom", async (roomCode) => {
        try {
            let chatRoom = await ChatRoom.findOne({ roomCode: roomCode });
            if (chatRoom) {
                socket.emit("foundRoom", chatRoom);
            } else {
                console.log(" ");
                console.log("⚠️ Room not found");
            }
        } catch (error) {
            console.error("Error finding room:", error);
        }
    });

    // Handle new messages
    socket.on("sendMessage", async (data) => {
        const { roomCode, senderId, text, senderN } = data;
        try {
            let chatRoom = await ChatRoom.findOne({ roomCode: roomCode });
            if (chatRoom) {
                const newMessage = {
                    senderId: senderId,
                    text: text,
                    senderN: senderN,
                    time: new Date()
                };

                if (chatRoom.senderId === senderId) {
                    chatRoom.senderMessagesNotRead = []; // Clear sender's unread messages
                    chatRoom.receiverMessagesNotRead.push(newMessage);
                } else {
                    chatRoom.receiverMessagesNotRead = []; // Clear receiver's unread messages
                    chatRoom.senderMessagesNotRead.push(newMessage);
                }

                chatRoom.messages.push(newMessage);
                chatRoom.haveNewMessage = false;
                await chatRoom.save();

                // Send message to all users in the room
                socket.to(roomCode).emit("receiveMessage", newMessage);
                socket.emit("receiveMessage", newMessage);

                const updateMessageList = await ChatRoom.find(); // Update message list
                // socket.emit("newMessageCreated", updateMessageList);
                socket.to(roomCode).emit("newMessageCreated", updateMessageList);

            } else {
                console.log(" ");
                console.log("⚠️ Room not found");
            }
        } catch (error) {
            console.error("Error adding new message:", error);
        }
    });

    // Handle reading messages
    socket.on("read", async (roomCode, userId) => {
        try {
            let chatRoom = await ChatRoom.findOne({ roomCode: roomCode });
            if (chatRoom) {
                socket.join(roomCode);
                console.log("Nguoi dung vua tham gia phong co ID", roomCode);
                if (chatRoom.senderId === userId) {
                    chatRoom.senderMessagesNotRead = [];
                } else {
                    chatRoom.receiverMessagesNotRead = [];
                }
                await chatRoom.save();
                const newChatList = await ChatRoom.find(); // Update message list
                socket.emit("newMessageCreated", newChatList);
            } else {
                console.log("⚠️ Room not found");
            }
        } catch (error) {
            console.error("Error reading message:", error);
        }
    });

    // Handle hiding notifications
    socket.on("hiddenNotification", async () => {
        try {
            const updateMessageList = await ChatRoom.find(); // Update message list
            socket.emit("deleteNotification", updateMessageList);
        } catch (error) {
            console.error("Error hiding notification:", error);
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        socket.disconnect();
        console.log(" ");
        console.log("🔥 A user disconnected");
    });
});

// Middleware to log requests
app.use((req, res, next) => {
    console.log(" ");
    console.log(`📅 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// API endpoint to fetch chat rooms
app.get("/api/chat", async (req, res) => {
    try {
        const chatRooms = await ChatRoom.find();
        res.json(chatRooms);
    } catch (error) {
        console.error("Error fetching chat rooms:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Default route for the root path
app.get('/', (req, res) => {
    console.log(" ");
    console.log('🚀 Client accessed root route');
    res.json({
        message: 'Welcome to API Server',
        status: 'running'
    });
});

// PayPal payment route
app.post('/api/paypal/payment', (req, res) => {
    const { amount, currency } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Số tiền không hợp lệ!" });
    }

    const create_payment_json = {
        intent: "sale",
        payer: { payment_method: "paypal" },
        redirect_urls: {
            return_url: `${rootURL}/api/paypal/success`,
            cancel_url: `${rootURL}/api/paypal/cancel`
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

// Route to handle successful PayPal payment
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

// Route to handle PayPal payment cancellation
app.get('/api/paypal/cancel', (req, res) => {
    res.send('Thanh toán đã bị hủy.'); // Or redirect to a cancellation page
});

// Use various routes
app.use('/api', userRoutes);
app.use('/api', uploadImageRoutes);
app.use('/api', gpuRoutes);
app.use('/api', cpuRoutes);
app.use('/api', storageTypeRoutes);
app.use('/api', storageRoutes);
app.use('/api', ramRoutes);
app.use('/api', categoryRoutes);
app.use('/api', conditionRoutes);
app.use('/api', brandRoutes);
app.use('/api', versionRoutes);
app.use('/api/laptops', laptopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/screens', screenRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/phones', phoneRoutes);
app.use('/api/post-management', postManagementRoutes);
app.use('/api/reports', reportRoutes);

// Connect to the database and start the server
const startServer = async () => {
    try {
        await connectDB();
        const server = http.listen(PORT, () => {
            console.log(" ");
            console.log(`🏃 Server is running at ${PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(" ");
                console.log(`⚠️ Port ${PORT} is used, try port ${PORT + 1}`);
                server.close();
                http.listen(PORT + 1, () => {
                    console.log(" ");
                    console.log(`🏃 Server is running at ${PORT + 1}`);
                });
            } else {
                console.error('❌ Error when starting server:', err);
            }
        });

    } catch (error) {
        console.error('Không thể khởi động server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();

// Handle unexpected errors
process.on('unhandledRejection', (err) => {
    console.error('Lỗi không mong muốn:', err);
    process.exit(1);
});
