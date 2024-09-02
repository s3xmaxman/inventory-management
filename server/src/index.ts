/**
 * @file サーバーのエントリポイント
 * @description Expressサーバーを起動し、APIエンドポイントを定義します。
 */

import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// 以下にルートのインポートを追加
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";

/**
 * 環境変数の読み込みとExpressアプリの初期化
 */
dotenv.config();
const app = express();

// ミドルウェアの設定
app.use(express.json()); // JSONリクエストの処理
app.use(helmet()); // セキュリティヘッダーの設定
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // CORSポリシーの設定
app.use(morgan("common")); // ログ出力
app.use(bodyParser.json()); // JSONリクエストの処理
app.use(bodyParser.urlencoded({ extended: false })); // URLエンコードされたリクエストの処理
app.use(cors()); // CORSの設定

// ルートの設定
app.use("/dashboard", dashboardRoutes);
app.use("/products", productRoutes);

/**
 * サーバーの起動
 * @param port サーバーのポート番号
 */
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port ${port}`);
});
