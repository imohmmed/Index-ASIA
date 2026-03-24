import { Router, type IRouter } from "express";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

export const PACKAGES = [
  { id: "asiacell_5000", name: "رصيد 5,000", faceValue: 5000, defaultPrice: 4500 },
  { id: "asiacell_10000", name: "رصيد 10,000", faceValue: 10000, defaultPrice: 9000 },
  { id: "asiacell_25000", name: "رصيد 25,000", faceValue: 25000, defaultPrice: 20000 },
  { id: "asiacell_50000", name: "رصيد 50,000", faceValue: 50000, defaultPrice: 40000 },
  { id: "asiacell_100000", name: "رصيد 100,000", faceValue: 100000, defaultPrice: 80000 },
];

export async function getPackagePrice(faceValue: number): Promise<number> {
  const [row] = await db
    .select()
    .from(settingsTable)
    .where(eq(settingsTable.key, `price_${faceValue}`));
  if (row) return parseInt(row.value);
  const pkg = PACKAGES.find((p) => p.faceValue === faceValue);
  return pkg?.defaultPrice || faceValue;
}

export async function setPackagePrice(faceValue: number, price: number): Promise<void> {
  await db
    .insert(settingsTable)
    .values({ key: `price_${faceValue}`, value: String(price), updatedAt: new Date() })
    .onConflictDoUpdate({
      target: settingsTable.key,
      set: { value: String(price), updatedAt: new Date() },
    });
}

export async function getAllPackages() {
  const result = [];
  for (const pkg of PACKAGES) {
    const price = await getPackagePrice(pkg.faceValue);
    result.push({ ...pkg, price });
  }
  return result;
}

router.get("/settings/rate", async (_req, res) => {
  try {
    const packages = await getAllPackages();
    res.json({ rate: 1, packages });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
