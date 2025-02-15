import authRoutes from "./routes/auth";
import quizRoutes from './routes/quiz'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors())
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", quizRoutes);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
