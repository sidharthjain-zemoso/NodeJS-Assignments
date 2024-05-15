import express from "express";
import bodyParser from "body-parser";
import { syncModels } from "./utils/db";
import userRoutes from "./routes/user";
import candidateRoutes from "./routes/candidate";
import cors from "cors";
import { config } from "dotenv";
import { errorMiddleware } from "./common/middlewares/error-middleware";

config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use("/", userRoutes);
app.use("/candidate", candidateRoutes);

app.use(errorMiddleware);

syncModels().then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Server is running on port', process.env.PORT);
    });
});