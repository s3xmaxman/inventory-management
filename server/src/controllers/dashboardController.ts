import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashBoardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const getMetrics = async (model: any, take: number) =>
      await model.findMany({
        take,
        orderBy: {
          date: "desc",
        },
      });

    const popularProducts = await prisma.products.findMany({
      take: 15,
      orderBy: {
        stockQuantity: "desc",
      },
    });

    const salesSummary = await getMetrics(prisma.salesSummary, 5);
    const purchaseSummary = await getMetrics(prisma.purchaseSummary, 5);
    const expenseSummary = await getMetrics(prisma.expenseSummary, 5);
    const expenseByCategorySummaryRaw = await getMetrics(
      prisma.expenseByCategory,
      5
    );

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
