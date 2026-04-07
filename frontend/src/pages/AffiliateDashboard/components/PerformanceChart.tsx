import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', clicks: 400, sales: 240 },
  { name: 'Tue', clicks: 300, sales: 139 },
  { name: 'Wed', clicks: 200, sales: 980 },
  { name: 'Thu', clicks: 278, sales: 390 },
  { name: 'Fri', clicks: 189, sales: 480 },
  { name: 'Sat', clicks: 239, sales: 380 },
  { name: 'Sun', clicks: 349, sales: 430 },
];

const PerformanceChart = () => {
  return (
    <div className="bg-[#111111] border border-white/5 p-8 sm:p-12 space-y-12 h-full min-h-[400px]">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
           <p className="font-body font-bold text-[9px] uppercase tracking-[0.4em] text-orange-600 italic">PERFORMA LO</p>
           <h3 className="font-display font-black text-2xl md:text-5xl uppercase text-white tracking-tighter">DATA DASHBOARD.</h3>
        </div>
        <div className="flex items-center gap-10">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-600" />
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30">KLIK</p>
           </div>
           <div className="flex items-center gap-3 md:block hidden">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30">ORDER</p>
           </div>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }}
              dy={20}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0px' }}
              itemStyle={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 900 }}
            />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="#EA580C" 
              strokeWidth={4} 
              dot={false}
              activeDot={{ r: 8, fill: '#EA580C', stroke: '#000', strokeWidth: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
