import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, Hash, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";

interface Province {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
  province_id: string;
}

interface AddressFormProps {
  onSuccess: (newAddress: any) => void;
  onCancel: () => void;
}

const AddressForm = ({ onSuccess, onCancel }: AddressFormProps) => {
  const [loading, setLoading] = useState(false);
  const [regionsLoading, setRegionsLoading] = useState({ provinces: false, cities: false });
  
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  
  const [formData, setFormData] = useState({
    recipient_name: "",
    phone: "",
    province_id: "",
    city_id: "",
    postal_code: "",
    address: "",
    is_default: false
  });

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    setRegionsLoading(prev => ({ ...prev, provinces: true }));
    try {
      const res = await api.get("/regions/provinces");
      setProvinces(res.data?.data || []);
    } catch (err) {
      toast.error("Gagal memuat daftar provinsi");
    } finally {
      setRegionsLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  const fetchCities = async (provinceId: string) => {
    setRegionsLoading(prev => ({ ...prev, cities: true }));
    try {
      const res = await api.get(`/regions/provinces/${provinceId}/cities`);
      setCities(res.data?.data || []);
    } catch (err) {
      toast.error("Gagal memuat daftar kota");
    } finally {
      setRegionsLoading(prev => ({ ...prev, cities: false }));
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, province_id: val, city_id: "" }));
    if (val) fetchCities(val);
    else setCities([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.province_id || !formData.city_id) {
       toast.error("Harap pilih provinsi dan kota");
       return;
    }

    setLoading(true);
    try {
      const res = await api.post("/user/addresses", formData);
      toast.success("Alamat baru berhasil disimpan!");
      onSuccess(res.data?.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Gagal menyimpan alamat";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Penerima</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              required
              className="w-full h-12 bg-muted/30 border border-border rounded-xl pl-11 pr-4 text-sm font-body font-medium outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Contoh: Budi Santoso"
              value={formData.recipient_name}
              onChange={e => setFormData({...formData, recipient_name: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nomor Telepon</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              required
              type="tel"
              className="w-full h-12 bg-muted/30 border border-border rounded-xl pl-11 pr-4 text-sm font-body font-medium outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="0812xxxxxx"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Provinsi</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              required
              className="w-full h-12 bg-muted/30 border border-border rounded-xl pl-11 pr-4 text-sm font-body font-medium outline-none focus:ring-2 focus:ring-accent/20 appearance-none"
              value={formData.province_id}
              onChange={handleProvinceChange}
              disabled={regionsLoading.provinces}
            >
              <option value="">{regionsLoading.provinces ? "Memuat..." : "Pilih Provinsi"}</option>
              {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kota / Kabupaten</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              required
              className="w-full h-12 bg-muted/30 border border-border rounded-xl pl-11 pr-4 text-sm font-body font-medium outline-none focus:ring-2 focus:ring-accent/20 appearance-none disabled:opacity-50"
              value={formData.city_id}
              onChange={e => setFormData({...formData, city_id: e.target.value})}
              disabled={!formData.province_id || regionsLoading.cities}
            >
              <option value="">{regionsLoading.cities ? "Memuat..." : "Pilih Kota"}</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="md:col-span-3 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Alamat Lengkap</label>
          <div className="relative">
            <textarea 
              required
              className="w-full bg-muted/30 border border-border rounded-xl p-4 text-sm font-body font-medium outline-none focus:ring-2 focus:ring-accent/20 min-h-[100px]"
              placeholder="Nama Jalan, No. Rumah, RT/RW, dsb..."
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kode Pos</label>
          <div className="relative">
            <Hash className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
            <input 
              required
              className="w-full h-12 bg-muted/30 border border-border rounded-xl pl-11 pr-4 text-sm font-body font-medium outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="12345"
              value={formData.postal_code}
              onChange={e => setFormData({...formData, postal_code: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-accent/5 border border-accent/20 rounded-2xl">
        <input 
          type="checkbox"
          id="is_default"
          className="w-5 h-5 rounded border-border text-accent focus:ring-accent/30"
          checked={formData.is_default}
          onChange={e => setFormData({...formData, is_default: e.target.checked})}
        />
        <label htmlFor="is_default" className="text-xs font-bold text-slate-700 cursor-pointer">Jadikan Alamat Utama</label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1 h-14 rounded-xl font-black uppercase text-xs tracking-widest"
        >
          Batal
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="flex-1 h-14 rounded-xl font-black uppercase text-xs tracking-widest gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {loading ? "Menyimpan..." : "Simpan Alamat"}
        </Button>
      </div>
    </form>
  );
};

const Building2 = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
    <path d="M10 6h4"/>
    <path d="M10 10h4"/>
    <path d="M10 14h4"/>
    <path d="M10 18h4"/>
  </svg>
);

export default AddressForm;
