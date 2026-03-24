import { Router, type IRouter } from "express";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const FACE_VALUES = [
  { id: "asiacell_5000", name: "رصيد 5,000", faceValue: 5000 },
  { id: "asiacell_10000", name: "رصيد 10,000", faceValue: 10000 },
  { id: "asiacell_25000", name: "رصيد 25,000", faceValue: 25000 },
  { id: "asiacell_50000", name: "رصيد 50,000", faceValue: 50000 },
  { id: "asiacell_100000", name: "رصيد 100,000", faceValue: 100000 },
];

export async function getRate(): Promise<number> {
  const [row] = await db
    .select()
    .from(settingsTable)
    .where(eq(settingsTable.key, "exchange_rate"));
  return row ? parseFloat(row.value) : 1.1;
}

export async function setRate(newRate: number): Promise<void> {
  await db
    .insert(settingsTable)
    .values({ key: "exchange_rate", value: String(newRate), updatedAt: new Date() })
    .onConflictDoUpdate({
      target: settingsTable.key,
      set: { value: String(newRate), updatedAt: new Date() },
    });
}

export function calcPackages(rate: number) {
  return FACE_VALUES.map((pkg) => ({
    ...pkg,
    price: Math.round(pkg.faceValue / rate / 500) * 500,
  }));
}

router.get("/settings/rate", async (_req, res) => {
  try {
    const rate = await getRate();
    const packages = calcPackages(rate);
    res.json({ rate, packages });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
