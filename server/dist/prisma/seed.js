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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Prisma Client を初期化し、データベースとの接続を確立します。
 *
 * @example
 * const prisma = new PrismaClient();
 */
const prisma = new client_1.PrismaClient();
/**
 * 指定されたファイル名の順序に従って、すべてのデータを削除します。
 *
 * @param orderedFileNames ファイル名の配列。
 */
function deleteAllData(orderedFileNames) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * ファイル名からモデル名を取得します。
         * 例：products.json -> Product
         */
        const modelNames = orderedFileNames.map((fileName) => {
            const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName));
            return modelName.charAt(0).toUpperCase() + modelName.slice(1);
        });
        for (const modelName of modelNames) {
            /**
             * Prisma Client のモデルを取得します。
             */
            const model = prisma[modelName];
            if (model) {
                yield model.deleteMany({});
                console.log(`${modelName} のデータをクリアしました`);
            }
            else {
                console.error(`${modelName} モデルが見つかりませんでした。モデル名が正しく指定されていることを確認してください。`);
            }
        }
    });
}
/**
 * データをデータベースにシードします。
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * シードデータのディレクトリパスを取得します。
         */
        const dataDirectory = path_1.default.join(__dirname, "seedData");
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
        yield deleteAllData(orderedFileNames);
        for (const fileName of orderedFileNames) {
            /**
             * ファイルパスを取得します。
             */
            const filePath = path_1.default.join(dataDirectory, fileName);
            /**
             * JSON データを読み込みます。
             */
            const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
            /**
             * ファイル名からモデル名を取得します。
             */
            const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName));
            /**
             * Prisma Client のモデルを取得します。
             */
            const model = prisma[modelName];
            // モデルが存在しない場合、エラーメッセージを出力して次のファイルに進みます。
            if (!model) {
                console.error(`Prisma モデルが見つかりませんでした: ${fileName}`);
                continue;
            }
            // JSON データをデータベースに挿入します。
            for (const data of jsonData) {
                yield model.create({
                    data,
                });
            }
            console.log(`${modelName} にデータをシードしました (ファイル: ${fileName})`);
        }
    });
}
// メイン関数を実行します。
main()
    .catch((e) => {
    console.error(e);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
