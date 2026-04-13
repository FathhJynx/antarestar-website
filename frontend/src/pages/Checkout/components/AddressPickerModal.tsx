import React from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddressForm from "./AddressForm";
import CustomModal from "./Modal";

interface AddressPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  showAddAddressForm: boolean;
  setShowAddAddressForm: (val: boolean) => void;
  addresses: any[];
  selectedAddress: any;
  onSelect: (addr: any) => void;
  fetchAddresses: () => Promise<any>;
}

const AddressPickerModal = ({
  isOpen,
  onClose,
  showAddAddressForm,
  setShowAddAddressForm,
  addresses,
  selectedAddress,
  onSelect,
  fetchAddresses
}: AddressPickerModalProps) => {
  return (
    <CustomModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={showAddAddressForm ? "Tambah Alamat Baru" : "Pilih Alamat Pengiriman"}
    >
      {showAddAddressForm ? (
        <AddressForm 
          onCancel={() => setShowAddAddressForm(false)}
          onSuccess={async (newAddr) => {
             const freshAddresses = await fetchAddresses();
             const matched = freshAddresses.find((a: any) => a.id === newAddr.id) || newAddr;
             onSelect(matched);
             setShowAddAddressForm(false);
             onClose();
          }}
        />
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => { onSelect(addr); onClose(); }}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                selectedAddress?.id === addr.id ? "border-orange-600 bg-orange-600/5" : "border-white/5 hover:border-orange-600/40 bg-black/50"
              }`}
            >
               <div className="flex justify-between items-start mb-3 text-white">
                  <div className="flex items-center gap-3">
                     <span className="font-display font-bold text-sm uppercase tracking-wide">{addr.recipient_name}</span>
                     <span className="text-[9px] font-bold text-orange-600 bg-orange-600/10 px-2 py-0.5 rounded uppercase tracking-wider">{addr.label || 'Alamat'}</span>
                  </div>
                  {selectedAddress?.id === addr.id && <Check className="w-4 h-4 text-orange-600" />}
               </div>
               <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{addr.phone}</p>
               <p className="text-xs text-white/60 font-bold uppercase leading-relaxed mt-2">{addr.address}</p>
            </button>
          ))}
          <Button 
             variant="outline" 
             onClick={() => setShowAddAddressForm(true)} 
             className="w-full h-16 rounded-2xl border-dashed border-white/10 hover:border-orange-600 hover:text-white hover:bg-orange-600/5 text-white/30 font-bold uppercase text-[10px] tracking-[0.2em] gap-3 group transition-all"
          >
             <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform"><Plus className="w-4 h-4" /></div>
             Tambah Alamat Baru
          </Button>
        </div>
      )}
    </CustomModal>
  );
};

export default AddressPickerModal;
