export interface UCPackage {
  id: string;
  name: string;
  price: number;
  quantity: number;
  bonus?: number;
  popular?: boolean;
}

export const UC_PACKAGES: UCPackage[] = [
  { id: "uc_60", name: "60 UC", price: 0.99, quantity: 60 },
  { id: "uc_325", name: "325 UC", price: 4.99, quantity: 300, bonus: 25 },
  { id: "uc_660", name: "660 UC", price: 9.99, quantity: 600, bonus: 60, popular: true },
  { id: "uc_1800", name: "1800 UC", price: 24.99, quantity: 1500, bonus: 300 },
  { id: "uc_3850", name: "3850 UC", price: 49.99, quantity: 3000, bonus: 850 },
  { id: "uc_8100", name: "8100 UC", price: 99.99, quantity: 6000, bonus: 2100 }
];
