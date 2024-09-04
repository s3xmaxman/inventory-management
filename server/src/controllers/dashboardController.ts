import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  /**
   * ダッシュボードに表示するメトリックを取得する。
   *
   * @param req Expressのリクエストオブジェクト
   * @param res Expressのレスポンスオブジェクト
   */
  try {
    // メトリックを取得する共通関数
    const getMetrics = async (model: any, take: number) =>
      await model.findMany({
        take,
        orderBy: {
          date: "desc",
        },
      });

    // 人気商品トップ15を取得
    const popularProducts = await prisma.products.findMany({
      take: 15,
      orderBy: {
        stockQuantity: "desc",
      },
    });

    // 売上サマリーを取得
    const salesSummary = await getMetrics(prisma.salesSummary, 5);
    // 購入サマリーを取得
    const purchaseSummary = await getMetrics(prisma.purchaseSummary, 5);
    // 費用サマリーを取得
    const expenseSummary = await getMetrics(prisma.expenseSummary, 5);
    // 費用カテゴリ別サマリーを取得
    const expenseByCategorySummaryRaw = await getMetrics(
      prisma.expenseByCategory,
      5
    );

    // 費用カテゴリ別サマリーの金額を文字列に変換
    const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
      (item: any) => ({
        ...item,
        amount: item.amount.toString(),
      })
    );

    res.json({
      popularProducts,
      salesSummary,
      purchaseSummary,
      expenseSummary,
      expenseByCategorySummary,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "ダッシュボードメトリックの取得に失敗しました" });
  }
};
