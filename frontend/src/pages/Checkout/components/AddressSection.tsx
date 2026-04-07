import React from "react";
import { CheckoutSection } from "./CheckoutForm";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, CheckCircle2 } from "lucide-react";

interface AddressSectionProps {
  selectedAddress: any;
  onEdit: () => void;
}

const AddressSection = ({ selectedAddress, onEdit }: AddressSectionProps) => {
  return (
    <CheckoutSection 
      title="Alamat Pengiriman" 
      subtitle="Masukin alamat pengiriman" 
      icon={<MapPin className="w-5 h-5" />}
    >
      <div className="space-y-6">
        {selectedAddress ? (
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 p-6 bg-black border border-white/5 rounded-xl hover:border-orange-600 transition-all group">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <h4 className="font-display font-bold text-lg text-white uppercase italic tracking-tight">{selectedAddress.recipient_name}</h4>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-600/10 px-2 py-0.5 rounded uppercase tracking-wider">{selectedAddress.label || 'Utama'}</span>
               </div>
               <div className="space-y-1">
                  <p className="font-bold text-[11px] text-white/40 uppercase tracking-widest">{selectedAddress.phone}</p>
                  <p className="font-bold text-xs text-white/60 uppercase leading-relaxed max-w-sm">
                    {selectedAddress.address_line || selectedAddress.address}, <br />
                    {selectedAddress.city?.name || selectedAddress.city}, {selectedAddress.province?.name || selectedAddress.state} {selectedAddress.postal_code}
                  </p>
               </div>
            </div>
            
            <Button 
               variant="outline" 
               onClick={onEdit}
               className="h-12 border-white/10 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all active:scale-[0.97] px-6"
            >
               Ganti Alamat
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-black border border-dashed border-white/10 rounded-2xl space-y-6">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                <MapPin className="w-8 h-8" />
             </div>
             <div className="text-center space-y-1">
                <h4 className="font-display font-bold text-lg text-white uppercase italic tracking-tight leading-none">Belum Ada Alamat</h4>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none">Silakan tambahin alamat lo biar ga nyasar 😄</p>
             </div>
             <Button 
                onClick={onEdit}
                className="h-14 bg-orange-600 text-white hover:bg-white hover:text-orange-600 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all active:scale-[0.97] border-none px-10 gap-3"
             >
                <Plus className="w-4 h-4" /> Tambah Alamat
             </Button>
          </div>
        )}
      </div>
    </CheckoutSection>
  );
};

export default AddressSection;
