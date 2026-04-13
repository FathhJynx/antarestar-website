import React from "react";
import { Reveal } from "@/components/AnimationPrimitives";
import { Button } from "@/components/ui/button";

const JoinCTA = () => {
  return (
    <section className="relative py-24 md:py-48 bg-[#0B0B0B] overflow-hidden flex items-center justify-center">
         <div className="relative z-10 text-center max-w-4xl mx-auto px-6 space-y-12 md:space-y-16">
            <Reveal direction="scale">
                <h2 className="font-display font-black text-[clamp(2.5rem,9vw,6rem)] uppercase tracking-tighter italic leading-[0.85] text-white">
                    SIAP TULIS <br /> SEJARAH LO?
                </h2>
            </Reveal>
            <Reveal delay={0.2}>
                 <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
                    <Button className="bg-orange-600 text-white px-8 md:px-12 h-14 md:h-16 text-base md:text-lg font-display font-black uppercase italic tracking-widest hover:bg-white hover:text-black transition-all rounded-none w-full md:w-auto">
                        GABUNG KOMUNITAS
                    </Button>
                 </div>
            </Reveal>
         </div>
    </section>
  );
};

export default JoinCTA;
