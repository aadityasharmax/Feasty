// import dotenv from 'dotenv';
// import express from 'express';
// dotenv.config()
// import connectDB from './config/db.js';
// import cookieParser from 'cookie-parser';
// import authRouter from './routes/routes.auth.js';
// import userRouter from './routes/routes.user.js';
// import cors from 'cors';
// import shopRoutes from './routes/routes.shop.js';
// import itemRouter from './routes/routes.items.js';
// import orderRoutes from './routes/routes.order.js';
// import http from 'http'
// import { Server } from 'socket.io';
// import { socketHandler } from './socket.js';



// const app = express();
// const server = http.createServer(app)

// const io = new Server(server, {
//     cors:{
//     origin: 'http://localhost:5173',
//     credentials: true,
//     methods:['GET','POST']
// }
// })

// app.set('io',io)



// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }))
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(cookieParser());
// app.use("/api/auth", authRouter)
// app.use("/api/user", userRouter)
// app.use("/api/shop", shopRoutes)
// app.use("/api/item",itemRouter)
// app.use("/api/order",orderRoutes)

// socketHandler(io)



// server.listen(process.env.PORT, () => {
//     connectDB()
//     console.log(`Server running on port ${process.env.PORT}`);
// })


import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/routes.auth.js';
import userRouter from './routes/routes.user.js';
import cors from 'cors';
import shopRoutes from './routes/routes.shop.js';
import itemRouter from './routes/routes.items.js';
import orderRoutes from './routes/routes.order.js';
import http from 'http';
import { Server } from 'socket.io';
import { socketHandler } from './socket.js';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Configure socket.io with CORS and transports
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST']
  },
  // Prefer websocket but allow polling as fallback.
  // You can remove 'polling' to force websocket-only if needed.
  transports: ['websocket', 'polling']
});

app.set('io', io);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/shop', shopRoutes);
app.use('/api/item', itemRouter);
app.use('/api/order', orderRoutes);

// Optional: quick connection logging on server side (helps debug)
io.on('connection', socket => {
  console.log('socket connected (server):', socket.id);
  socket.on('disconnect', reason => {
    console.log('socket disconnected (server):', socket.id, reason);
  });
});

// use your handler (still fine)
socketHandler(io);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
