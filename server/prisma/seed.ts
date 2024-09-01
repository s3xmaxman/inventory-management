import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

/**
 * Prisma Client を初期化し、データベースとの接続を確立します。
 *
 * @example
 * const prisma = new PrismaClient();
 */
const prisma = new PrismaClient();

/**
 * 指定されたファイル名の順序に従って、すべてのデータを削除します。
 *
 * @param orderedFileNames ファイル名の配列。
 */
async function deleteAllData(orderedFileNames: string[]) {
  /**
   * ファイル名からモデル名を取得します。
   * 例：products.json -> Product
   */
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    /**
     * Prisma Client のモデルを取得します。
     */
    const model: any = prisma[modelName as keyof typeof prisma];
    if (model) {
      await model.deleteMany({});
      console.log(`${modelName} のデータをクリアしました`);
    } else {
      console.error(
        `${modelName} モデルが見つかりませんでした。モデル名が正しく指定されていることを確認してください。`
      );
    }
  }
}

/**
 * データをデータベースにシードします。
 */
async function main() {
  /**
   * シードデータのディレクトリパスを取得します。
   */
  const dataDirectory = path.join(__dirname, "seedData");

  /**
   * シードするファイル名の配列。
   * ファイル名の順序は重要です。
   * 依存関係のあるデータは、先にシードする必要があります。
   */
  const orderedFileNames = [
    "products.json",
    "expenseSummary.json",
    "sales.json",
    "salesSummary.json",
    "purchases.json",
    "purchaseSummary.json",
    "users.json",
    "expenses.json",
    "expenseByCategory.json",
  ];

  // すべてのデータを削除
  await deleteAllData(orderedFileNames);

  for (const fileName of orderedFileNames) {
    /**
     * ファイルパスを取得します。
     */
    const filePath = path.join(dataDirectory, fileName);
    /**
     * JSON データを読み込みます。
     */
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    /**
     * ファイル名からモデル名を取得します。
     */
    const modelName = path.basename(fileName, path.extname(fileName));
    /**
     * Prisma Client のモデルを取得します。
     */
    const model: any = prisma[modelName as keyof typeof prisma];

    // モデルが存在しない場合、エラーメッセージを出力して次のファイルに進みます。
    if (!model) {
      console.error(`Prisma モデルが見つかりませんでした: ${fileName}`);
      continue;
    }

    // JSON データをデータベースに挿入します。
    for (const data of jsonData) {
      await model.create({
        data,
      });
    }

    console.log(
      `${modelName} にデータをシードしました (ファイル: ${fileName})`
    );
  }
}

// メイン関数を実行します。
main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
