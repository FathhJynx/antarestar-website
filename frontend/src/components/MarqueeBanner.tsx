import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const MarqueeBanner = () => {
  const { data: activeCampaign } = useQuery({
    queryKey: ['active-flash-sale-marquee'],
    queryFn: async () => {
      const res = await api.get('/promotions/flash-sales');
      const campaigns = res.data.data || [];
      return campaigns[0] || null;
    }
  });

  const items = activeCampaign?.products?.map((p: any) => p.product_variant?.product?.name.toUpperCase()) || [
    "JACKETS", "BAGS", "FOOTWEAR", "ACCESSORIES", "APPAREL", "CAMPING",
    "JACKETS", "BAGS", "FOOTWEAR", "ACCESSORIES", "APPAREL", "CAMPING",
  ];

  return (
    <section className="py-6 bg-accent overflow-hidden relative">
      <div className="marquee-track">
        {items.map((item: string, i: number) => (
          <span key={i} className="flex items-center gap-4 px-8 font-display font-black text-sm tracking-[0.3em] text-white whitespace-nowrap">
            {activeCampaign && <Zap className="w-4 h-4 fill-current text-white/50" />}
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeBanner;
