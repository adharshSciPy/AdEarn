import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./mongoDb/connectDb.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cors());
app.use('/api/v1/user',userRouter)
app.use('/api/v1/admin',adminRouter)

const PORT = process.env.PORT || 8000;

connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Mongodb connection error", err);
    });
