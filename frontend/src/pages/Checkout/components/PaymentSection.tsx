import { CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: any;
  color: string;
  bg: string;
}

interface PaymentSectionProps {
  paymentMethods: PaymentMethod[];
  selectedPayment: PaymentMethod;
  onSelect: (pm: PaymentMethod) => void;
  onShowAll: () => void;
}

const PaymentSection = ({ paymentMethods, selectedPayment, onSelect, onShowAll }: PaymentSectionProps) => (
  <section className="bg-card border border-border rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
    <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border flex items-center justify-between bg-muted/10">
      <div className="flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-accent" />
        <h2 className="font-display font-black text-sm uppercase tracking-widest">Metode Pembayaran</h2>
      </div>
      <Button variant="link" className="text-[10px] font-black uppercase text-accent hover:no-underline tracking-widest" onClick={onShowAll}>
        Lihat Semua
      </Button>
    </div>
    
    <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {paymentMethods.slice(0, 4).map((pm) => (
            <button 
              key={pm.id}
              onClick={() => onSelect(pm)}
              className={`relative p-3 sm:p-5 rounded-2xl border-2 flex flex-col items-center gap-2 sm:gap-3 transition-all ${
                selectedPayment.id === pm.id 
                  ? "border-accent bg-accent/5 shadow-md shadow-accent/5" 
                  : "border-border/40 bg-muted/10 hover:border-accent/40 hover:bg-white"
              }`}
            >
              <div className={`p-2.5 sm:p-3 rounded-xl ${pm.bg} ${pm.color} shadow-sm`}>
                <pm.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase text-center leading-tight tracking-tight px-1">{pm.name}</span>
            {selectedPayment.id === pm.id && (
              <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-1 shadow-sm">
                <Check className="w-2.5 h-2.5" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  </section>
);

export default PaymentSection;
