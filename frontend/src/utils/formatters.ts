/**
 * Currency formatter for Indonesian Rupiah (IDR)
 * @param n number to format
 * @returns formatted currency string (e.g. Rp 1.250.000)
 */
export const rp = (n: number) =>
  new Intl.NumberFormat("id-ID", { 
    style: "currency", 
    currency: "IDR", 
    minimumFractionDigits: 0 
  }).format(n);
