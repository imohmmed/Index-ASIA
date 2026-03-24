import { useState, useEffect } from "react";

export interface AsiacellPackage {
  id: string;
  name: string;
  faceValue: number;
  price: number;
}

const DEFAULT_PACKAGES: AsiacellPackage[] = [
  { id: "asiacell_5000", name: "رصيد 5,000", faceValue: 5000, price: 4500 },
  { id: "asiacell_10000", name: "رصيد 10,000", faceValue: 10000, price: 9000 },
  { id: "asiacell_25000", name: "رصيد 25,000", faceValue: 25000, price: 20000 },
  { id: "asiacell_50000", name: "رصيد 50,000", faceValue: 50000, price: 40000 },
  { id: "asiacell_100000", name: "رصيد 100,000", faceValue: 100000, price: 80000 },
];

export function usePackages() {
  const [packages, setPackages] = useState<AsiacellPackage[]>(DEFAULT_PACKAGES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || "/";
    fetch(`${baseUrl}api/settings/rate`)
      .then((r) => r.json())
      .then((data) => {
        if (data.packages && data.packages.length > 0) {
          setPackages(data.packages);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { packages, loading };
}

export const ASIACELL_PACKAGES = DEFAULT_PACKAGES;
