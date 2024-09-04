"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardMetrics = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getDashboardMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * ダッシュボードに表示するメトリックを取得する。
     *
     * @param req Expressのリクエストオブジェクト
     * @param res Expressのレスポンスオブジェクト
     */
    try {
        // メトリックを取得する共通関数
        const getMetrics = (model, take) => __awaiter(void 0, void 0, void 0, function* () {
            return yield model.findMany({
                take,
                orderBy: {
                    date: "desc",
                },
            });
        });
        // 人気商品トップ15を取得
        const popularProducts = yield prisma.products.findMany({
            take: 15,
            orderBy: {
                stockQuantity: "desc",
            },
        });
        // 売上サマリーを取得
        const salesSummary = yield getMetrics(prisma.salesSummary, 5);
        // 購入サマリーを取得
        const purchaseSummary = yield getMetrics(prisma.purchaseSummary, 5);
        // 費用サマリーを取得
        const expenseSummary = yield getMetrics(prisma.expenseSummary, 5);
        // 費用カテゴリ別サマリーを取得
        const expenseByCategorySummaryRaw = yield getMetrics(prisma.expenseByCategory, 5);
        // 費用カテゴリ別サマリーの金額を文字列に変換
        const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item) => (Object.assign(Object.assign({}, item), { amount: item.amount.toString() })));
        res.json({
            popularProducts,
            salesSummary,
            purchaseSummary,
            expenseSummary,
            expenseByCategorySummary,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "ダッシュボードメトリックの取得に失敗しました" });
    }
});
exports.getDashboardMetrics = getDashboardMetrics;
