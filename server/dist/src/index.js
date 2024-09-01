"use strict";
/**
 * @file サーバーのエントリポイント
 * @description Expressサーバーを起動し、APIエンドポイントを定義します。
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// 以下にルートのインポートを追加
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
/**
 * 環境変数の読み込みとExpressアプリの初期化
 */
dotenv_1.default.config();
const app = (0, express_1.default)();
// ミドルウェアの設定
app.use(express_1.default.json()); // JSONリクエストの処理
app.use((0, helmet_1.default)()); // セキュリティヘッダーの設定
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" })); // CORSポリシーの設定
app.use((0, morgan_1.default)("common")); // ログ出力
app.use(body_parser_1.default.json()); // JSONリクエストの処理
app.use(body_parser_1.default.urlencoded({ extended: false })); // URLエンコードされたリクエストの処理
app.use((0, cors_1.default)()); // CORSの設定
// ルートの設定
app.use("/dashboard", dashboardRoutes_1.default);
/**
 * サーバーの起動
 * @param port サーバーのポート番号
 */
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server started on port ${port}`);
});
