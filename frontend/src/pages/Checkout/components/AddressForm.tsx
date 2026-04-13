import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, Hash, Check, Loader2, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const addressSchema = z.object({
  recipient_name: z.string().min(3, "Nama penerima terlalu pendek (min. 3 karakter)"),
  phone: z.string().regex(/^08[0-9]{8,11}$/, "Format nomor HP tidak valid (contoh: 08123456789)"),
  province_id: z.string().min(1, "Harap pilih provinsi"),
  city_id: z.string().min(1, "Harap pilih kota"),
  postal_code: z.string().length(5, "Kode pos harus tepat 5 digit"),
  address: z.string().min(10, "Alamat harus lengkap (min. 10 karakter)"),
  is_default: z.boolean().optional()
});

type AddressFormValues = z.infer<typeof addressSchema>;

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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      recipient_name: "",
      phone: "",
      province_id: "",
      city_id: "",
      postal_code: "",
      address: "",
      is_default: false
    }
  });

  const selectedProvinceId = watch("province_id");

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvinceId) {
      fetchCities(selectedProvinceId);
    } else {
      setCities([]);
    }
  }, [selectedProvinceId]);

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

  const onSubmit = async (data: AddressFormValues) => {
    setLoading(true);
    try {
      const res = await api.post("/user/addresses", data);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Penerima</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              {...register("recipient_name")}
              className={`w-full h-12 bg-muted/30 border ${errors.recipient_name ? 'border-red-500' : 'border-border'} rounded-xl pl-11 pr-4 text-sm font-body font-medium outline-none focus:ring-2 focus:ring-accent/20`}
              placeholder="Contoh: Budi Santoso"
            />
          </div>
          {errors.recipient_name && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.recipient_name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nomor Telepon</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="tel"
              {...register("phone")}
              className={`w-full h-12 bg-muted/30 border ${errors.phone ? 'border-red-500' : 'border-border'} rounded-xl pl-11 pr-4 text-sm font-body font-medium outline-none focus:ring-2 focus:ring-accent/20`}
              placeholder="0812xxxxxx"
            />
          </div>
          {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Provinsi</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              {...register("province_id")}
              className={`w-full h-12 bg-muted/30 border ${errors.province_id ? 'border-red-500' : 'border-border'} rounded-xl pl-11 pr-4 text-sm font-body font-medium outline-none focus:ring-2 focus:ring-accent/20 appearance-none`}
              disabled={regionsLoading.provinces}
            >
              <option value="">{regionsLoading.provinces ? "Memuat..." : "Pilih Provinsi"}</option>
              {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          {errors.province_id && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.province_id.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kota / Kabupaten</label>
          <div className="relative">
            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              {...register("city_id")}
              className={`w-full h-12 bg-muted/30 border ${errors.city_id ? 'border-red-500' : 'border-border'} rounded-xl pl-11 pr-4 text-sm font-body font-medium outline-none focus:ring-2 focus:ring-accent/20 appearance-none disabled:opacity-50`}
              disabled={!selectedProvinceId || regionsLoading.cities}
            >
              <option value="">{regionsLoading.cities ? "Memuat..." : "Pilih Kota"}</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {errors.city_id && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.city_id.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="md:col-span-3 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Alamat Lengkap</label>
          <div className="relative">
            <textarea 
              {...register("address")}
              className={`w-full bg-muted/30 border ${errors.address ? 'border-red-500' : 'border-border'} rounded-xl p-4 text-sm font-body font-medium outline-none focus:ring-2 focus:ring-accent/20 min-h-[100px]`}
              placeholder="Nama Jalan, No. Rumah, RT/RW, dsb..."
            />
          </div>
          {errors.address && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.address.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kode Pos</label>
          <div className="relative">
            <Hash className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
            <input 
              {...register("postal_code")}
              className={`w-full h-12 bg-muted/30 border ${errors.postal_code ? 'border-red-500' : 'border-border'} rounded-xl pl-11 pr-4 text-sm font-body font-medium outline-none focus:ring-2 focus:ring-accent/20`}
              placeholder="12345"
            />
          </div>
          {errors.postal_code && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.postal_code.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-accent/5 border border-accent/20 rounded-2xl">
        <input 
          type="checkbox"
          id="is_default"
          {...register("is_default")}
          className="w-5 h-5 rounded border-border text-accent focus:ring-accent/30"
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

export default AddressForm;
