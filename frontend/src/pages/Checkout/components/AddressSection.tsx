import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Address {
  recipient_name?: string;
  name?: string;
  phone: string;
  label?: string;
  address: string;
  isDefault?: boolean;
  is_primary?: boolean;
}

interface AddressSectionProps {
  selectedAddress: Address;
  onEdit: () => void;
}

const AddressSection = ({ selectedAddress, onEdit }: AddressSectionProps) => {
  if (!selectedAddress) {
    return (
      <section className="bg-card border border-border rounded-xl md:rounded-2xl overflow-hidden shadow-sm animate-pulse">
        <div className="h-1.5 bg-slate-200" />
        <div className="p-4 md:p-8 space-y-6">
          <div className="w-40 h-5 bg-slate-200 rounded" />
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="w-60 h-6 bg-slate-200 rounded" />
              <div className="w-80 h-4 bg-slate-200 rounded" />
              <div className="w-40 h-4 bg-slate-200 rounded" />
            </div>
            <div className="w-24 h-10 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card border border-border rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
      <div className="h-1.5 bg-gradient-to-r from-accent via-orange-400 to-red-500" />
      <div className="p-4 md:p-8">
        <div className="flex items-center gap-2 mb-6 text-accent">
          <MapPin className="w-5 h-5 fill-current" />
          <h2 className="font-display font-black text-sm uppercase tracking-widest">Alamat Pengiriman</h2>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-display font-black text-base uppercase">{selectedAddress.recipient_name || selectedAddress.name}</span>
              <span className="text-[10px] font-black uppercase text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                {selectedAddress.label || 'Alamat'}
              </span>
            </div>
            <p className="font-body text-sm text-foreground/80 leading-relaxed max-w-lg">
              {selectedAddress.phone}<br />
              {selectedAddress.address}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={onEdit}
            className="text-xs font-bold uppercase tracking-widest border-2 hover:bg-accent/5 rounded-xl px-6 h-10"
          >
            Ubah Alamat
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AddressSection;
