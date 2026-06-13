/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { 
  Check, 
  X, 
  Star, 
  Lock, 
  BookOpen, 
  Clock, 
  Heart, 
  HelpCircle, 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Sparkles,
  Phone,
  Mail,
  Award
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";

// LINK DO HOTMART - SUBSTUTUÍVEL FACILMENTE PELO UTILIZADOR
const HOTMART_LINK = "https://pay.hotmart.com/C106096630V?checkoutMode=10";

// --- SUB-COMPONENTS FOR CINEMATIC REDESIGN ---

// Particle Gold system on dark hero background
function GoldParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const canvas = canvasRef.current;
      if (canvas) canvas.style.display = 'none';
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particlesCount = 60;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1, // 1px to 3px
        vx: (Math.random() - 0.5) * 0.15, // very slow
        vy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.5 + 0.15,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particlesCount; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 165, 116, ${p.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-40 md:opacity-100" />;
}

// Staggered letters or words for premium typewriter animation
function TypewriterHeading({ text }: { text: string }) {
  const words = useMemo(() => text.split(" "), [text]);
  const highlightWord = "€500–1.500/mês";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.h1 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="font-serif text-3xl font-black leading-[1.12] text-white sm:text-4xl md:text-[46px] tracking-tight mb-6"
    >
      {words.map((word, idx) => {
        const isHighlight = word.includes("€500–1.500/mês");
        return (
          <motion.span 
            key={idx} 
            variants={wordVariants} 
            className={`inline-block mr-2.5 ${isHighlight ? 'text-[#D4A574] underline decoration-[#8B4513] decoration-4 underline-offset-4' : 'text-white'}`}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.h1>
  );
}

// Live numeric increment on scroll visibility
function AnimatedCount({ end, prefix = "", suffix = "" }: { end: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * end);
      setCount(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("pt-PT")}{suffix}
    </span>
  );
}

// Scrolling Pain Frases
function PainFrase({ text, subtext, isHighlight }: { text: string; subtext: string; isHighlight?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{ type: "spring", stiffness: 60, damping: 15 }}
      className="flex flex-col items-center justify-center text-center py-12 md:py-16 max-w-3xl mx-auto border-b border-white/5 last:border-0"
    >
      <h3 className={`font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 leading-tight ${isHighlight ? 'text-[#D4A574]' : 'text-white'}`}>
        {text}
      </h3>
      <p className="text-zinc-400 text-xs sm:text-sm md:text-base max-w-xl font-medium tracking-wide">
        {subtext}
      </p>
    </motion.div>
  );
}

// Visual Double Bar Comparativo Chart
function VisualBarComparativa() {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.2 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id="comparativo-barras"
      className="col-span-1 sm:col-span-2 lg:col-span-4 bg-white/80 backdrop-blur-sm border-2 border-[#D4A574]/30 rounded-2xl p-6 sm:p-8 my-6 shadow-md transition-all duration-300 hover:shadow-lg flex flex-col gap-6"
    >
      <p className="text-sm font-bold text-[#8B4513] font-serif text-center uppercase tracking-wide">
        Uma mala. Dois números. Uma decisão fácil.
      </p>

      {/* Barra 1 — Custo */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs sm:text-sm font-semibold text-stone-600">
          <span>Custo de produção</span>
          <span className="font-bold text-[#854F0B]">€5</span>
        </div>
        <div className="w-full bg-[#F1EFE8] rounded-full h-3.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "6.25%" } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-[#D4A574] h-full rounded-full"
          />
        </div>
      </div>

      {/* Barra 2 — Venda */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs sm:text-sm font-semibold text-stone-600">
          <span>Preço de venda</span>
          <span className="font-bold text-[#3B6D11]">€80</span>
        </div>
        <div className="w-full bg-[#F1EFE8] rounded-full h-3.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "100%" } : {}}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            className="bg-[#8B4513] h-full rounded-full"
          />
        </div>
      </div>

      {/* Margem appears triggered when bar animations conclude */}
      <AnimatePresence>
        {isInView && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="text-xs sm:text-sm text-stone-500 text-center font-medium italic mt-1"
          >
            Margem de lucro: <strong className="text-[#3B6D11] not-italic font-black text-base">1.500%</strong> — numa única mala.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// Flipping Method Detail Item
function GridItemFlip({ number, title, text, index }: { number: string; title: string; text: string; index: number }) {
  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      whileInView={{ rotateY: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      className="relative rounded-xl border-2 border-[#D4A574]/25 bg-white p-6 shadow-md flex flex-col justify-between overflow-hidden group min-w-[280px] sm:min-w-0 snap-center hover:border-[#8B4513] hover:shadow-xl transition-all duration-300"
      style={{ transformStyle: "preserve-3d" }}
    >
      <span className="absolute -bottom-4 -right-2 text-[100px] font-serif font-black text-[#D4A574]/10 select-none pointer-events-none transition-transform duration-300 group-hover:scale-110">
        {number}
      </span>

      <div className="relative z-10">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#8B4513] text-white font-serif font-black text-xs mb-4">
          {number}
        </span>
        <h4 className="text-[16px] font-black text-[#1A1A1A] mb-2 leading-tight">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed font-semibold">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

// Zoom bonus cards
function BonusCard({ index, bonusNumber, title, text, value }: { index: number; bonusNumber: string; title: string; text: string; value: number }) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasAnimated(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.2 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.82 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 70, damping: 15, delay: index * 0.1 }}
      className="bg-[#1A1A1A] p-6 rounded-2xl border-2 border-[#D4A574]/30 shadow-md flex flex-col justify-between transition-all duration-300 hover:border-[#8B4513] hover:shadow-2xl hover:scale-[1.01]"
    >
      <div>
        <div className="h-10 w-10 rounded-lg bg-[#8B4513]/20 flex items-center justify-center text-[#D4A574] mb-4 shadow">
          {index === 0 && <FileText className="h-5 w-5" />}
          {index === 1 && <TrendingUp className="h-5 w-5" />}
          {index === 2 && <MessageCircle className="h-5 w-5" />}
          {index === 3 && <Clock className="h-5 w-5" />}
        </div>
        <h3 className="text-[16px] font-black text-white mb-2 leading-tight tracking-tight">
          {bonusNumber}: {title}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-semibold">
          {text}
        </p>
      </div>

      <div className="mt-6 pt-2 flex items-center justify-between overflow-hidden min-h-[40px]">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <span className="text-zinc-500 text-xs sm:text-sm font-bold uppercase tracking-wider">Valor: €{value}</span>
            {hasAnimated && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute top-1/2 left-0 h-0.5 bg-red-650"
              />
            )}
          </div>

          <AnimatePresence>
            {hasAnimated && (
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="inline-block px-3 py-1 rounded bg-[#EAF3DE] text-[#3B6D11] text-[10px] font-extrabold tracking-widest uppercase border border-[#3B6D11]/25 animate-pulse"
              >
                Incluído grátis
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// Timeline vertical con border animada draw
function TimelinePassos() {
  const steps = [
    {
      num: 1,
      title: "Acedes ao método",
      desc: "Escolhes um modelo, segues o passo a passo de cinco minutos. Hoje mesmo, terás a tua primeira mala totalmente pontilhada e concluída.",
      icon: <ShoppingBag className="h-5 w-5 text-white" />,
    },
    {
      num: 2,
      title: "Produzes em série",
      desc: "Apenas 5 minutos por peça. Com um investimento irrisório de €15, consegues produzir até 10 unidades requintadas numa única tarde de tranquilidade.",
      icon: <Award className="h-5 w-5 text-white" />,
    },
    {
      num: 3,
      title: "Começas a vender",
      desc: "Aplica o roteiro simplificado incluído na obra. Com apenas algumas conversas no WhatsApp, obterás as primeiras vendas monetizadas ainda esta semana.",
      icon: <TrendingUp className="h-5 w-5 text-white" />,
    },
  ];

  return (
    <div className="relative max-w-2xl mx-auto pl-8 sm:pl-16 space-y-12 py-4">
      {/* Scroll timeline column vector indicator */}
      <div className="absolute left-[19px] sm:left-[27px] top-6 bottom-6 w-[2px] bg-zinc-200 z-0">
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="bg-[#8B4513] w-full"
        />
      </div>

      {steps.map((step, idx) => (
        <motion.div
          key={step.num}
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: idx * 0.2 }}
          className="relative flex gap-6 items-start"
        >
          {/* Timeline node */}
          <div className="absolute -left-[35px] sm:-left-[51px] z-10 flex h-[40px] w-[40px] items-center justify-center bg-[#8B4513] rounded-full overflow-hidden shadow">
            {/* SVG circle stroke borders animation */}
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <motion.circle
                cx="20"
                cy="20"
                r="18"
                stroke="#D4A574"
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray="120"
                initial={{ strokeDashoffset: 120 }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 + 0.2 }}
              />
            </svg>
            <div className="relative z-20">
              {step.icon}
            </div>
          </div>

          <div className="bg-[#F8F5F0]/50 rounded-2xl p-6 border-2 border-[#D4A574]/30 w-full hover:border-[#8B4513] hover:bg-[#F8F5F0] transition-all duration-300 shadow-sm">
            <span className="text-[11px] font-bold text-[#8B4513] uppercase tracking-widest block mb-1">Passo 0{step.num}</span>
            <h4 className="text-lg font-black text-zinc-900 mb-1.5 leading-tight">
              {step.title}
            </h4>
            <p className="text-sm text-zinc-650 leading-relaxed font-semibold">
              {step.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Double side column triggers checks/crosses animations
function AnimatedCheck() {
  return (
    <svg className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <motion.path
        d="M20 6L9 17L4 12"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </svg>
  );
}

function AnimatedCross() {
  return (
    <svg className="h-5 w-5 text-red-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <motion.path
        d="M18 6L6 18M6 6l12 12"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
    </svg>
  );
}

// Typewriter qualified subtitle
function TypewriterPhrase({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [isInView, text]);

  return (
    <p ref={ref} className="text-sm sm:text-base italic text-zinc-400 font-semibold leading-relaxed min-h-[50px]">
      "{displayText}"
    </p>
  );
}

// Testimonials automatic carrossel
function TestimonialsCarousel() {
  const testimonials = [
    {
      name: "Ana",
      text: '"Logo na primeira semana já tinha a minha primeira mala pronta. Três meses depois nem reconheço a minha vida. Estou a vender todos os dias."',
      tag: "Compradora Verificada",
    },
    {
      name: "Marta",
      text: '"Vendi uma mala por €80 que custou menos de €5 a fazer. Foi quando percebi que o método tinha mudado tudo para mim."',
      tag: "Compradora Verificada",
    },
    {
      name: "Conceição, 58 anos",
      text: '"Tinha 58 anos e ninguém me dava emprego. Este método devolveu-me a autonomia financeira numa idade em que já tinha desistido."',
      tag: "Autonomia Financeira",
    },
    {
      name: "Fátima",
      text: '"Este ano, com o dinheiro que comecei a ganhar com as malas, fiz a viagem que sempre sonhei. Nunca pensei que fosse possível."',
      tag: "Resultado Verificado",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="relative max-w-xl mx-auto overflow-hidden px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#D4A574]/20 shadow-md flex flex-col justify-between h-[230px]"
        >
          <div>
            <div className="flex gap-1 mb-4 h-5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                </motion.div>
              ))}
            </div>
            <p className="text-zinc-700 text-sm leading-relaxed italic font-semibold">
              {testimonials[currentIndex].text}
            </p>
          </div>
          <div className="border-t border-zinc-100 pt-3 mt-2 flex items-center justify-between">
            <span className="text-xs font-black text-zinc-900 uppercase">
              {testimonials[currentIndex].name}
            </span>
            <span className="text-[9px] uppercase font-bold text-[#8B4513] tracking-widest bg-[#8B4513]/5 border border-[#8B4513]/25 px-2.5 py-0.5 rounded">
              {testimonials[currentIndex].tag}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Index dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              currentIndex === idx ? "bg-[#8B4513] w-6" : "bg-zinc-300"
            }`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Visualizar depoimento ${idx+1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Live numeric increment or strike on final stack
function RealTimeStrike({ startText, strikedText, resultText, animatedOnView }: { startText?: string; strikedText: string; resultText: string; animatedOnView: boolean }) {
  return (
    <div className="text-center mb-6">
      <div className="relative inline-block pb-1">
        <span className="text-zinc-500 text-xs sm:text-sm font-bold tracking-wide uppercase">
          {startText} {strikedText}
        </span>
        {animatedOnView && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute top-1/2 left-0 h-0.5 bg-red-650"
          />
        )}
      </div>
      <p className="font-serif text-4xl sm:text-5xl font-black text-[#D4A574] leading-tight mt-1 mb-2">
        {resultText}
      </p>
    </div>
  );
}

// Autora section paragraph transitions
function AutoraParagraph({ text, index }: { text: string; index: number }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={index === 0 ? "italic text-stone-850 font-medium" : index === 3 ? "font-bold text-[#1A1A1A]" : "text-[#1A1A1A]/80"}
    >
      {text}
    </motion.p>
  );
}

// Final draw line divider inside card
function FinalDrawDivider() {
  return (
    <div className="relative h-1 w-full bg-zinc-800/40 my-6 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
        className="h-full bg-gradient-to-r from-transparent via-[#D4A574] to-transparent"
      />
    </div>
  );
}

// --- MAIN CONTAINER WORKFLOW ---

export default function App() {




  // 2. Barra de Progresso de Leitura
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Dynamic counter of active women in Portugal Live
  const [liveCount, setLiveCount] = useState(847);
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((prev) => prev + 1);
    }, Math.random() * 45000 + 45000); // 45s-90s
    return () => clearInterval(interval);
  }, []);

  // Modals for compliance footer
  const [activeModal, setActiveModal] = useState<"privicidade" | "termos" | "contacto" | null>(null);

  // Smooth scroll
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Parallax subtle text translation on scroll
  const [scrollOffset, setScrollOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      setScrollOffset(window.scrollY);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Autora line growth percentage calculation based on visual scroll of autora section
  const [timelineVisiblePercent, setTimelineVisiblePercent] = useState(0);
  const autoraRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (!autoraRef.current) return;
      const rect = autoraRef.current.getBoundingClientRect();
      const elementHeight = rect.height;
      const visibleFromTop = window.innerHeight - rect.top;
      if (visibleFromTop > 0 && rect.top < window.innerHeight) {
        const percent = Math.min((visibleFromTop / (elementHeight + 200)) * 100, 100);
        setTimelineVisiblePercent(Math.max(percent, 0));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stack visible markers inside final checkout CTA
  const [stackVisible, setStackVisible] = useState(false);
  const finalCtaRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!finalCtaRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStackVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    observer.observe(finalCtaRef.current);
    return () => observer.disconnect();
  }, []);

  // Masonry visual gallery bags datasets
  const visualProofs = [
    { img: "https://i.postimg.cc/T1rrdrXR/2d7f3ec787ca5ae6013fcd2a58fc914d.jpg", name: "Ana · Porto", price: "Vendida por €85", height: "h-[240px]" },
    { img: "https://i.postimg.cc/26WWG4yv/fa69d4e6fc1d76c1bb4e4326da207f7e.jpg", name: "Conceição · Braga", price: "Vendida por €60", height: "h-[180px]" },
    { img: "https://i.postimg.cc/3xbDHLDK/4e2aae93dcf73e6e4bc2435d36f2ba29.jpg", name: "Marta · Lisboa", price: "Vendida por €95", height: "h-[260px]" },
    { img: "https://i.postimg.cc/CxdzJj6Z/9dde040bdf4a1b330d6e4d29f052f608.jpg", name: "Filomena · Coimbra", price: "Vendida por €70", height: "h-[190px]" },
    { img: "https://i.postimg.cc/dV7VGJLh/f6218e1e03f855d2ac6f005bd7a4b7e8.jpg", name: "Sandra · Setúbal", price: "Vendida por €80", height: "h-[250px]" },
    { img: "https://i.postimg.cc/gjkYjWCb/d2765fdc2e6b7ddb8c4ccf995a61a7be.jpg", name: "Teresa · Aveiro", price: "Vendida por €65", height: "h-[170px]" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#1A1A1A] antialiased selection:bg-[#D4A574]/30 selection:text-[#8B4513] scroll-smooth">
      
      {/* READING SCROLL PROGRESS BAR */}
      <div 
        style={{ width: `${scrollProgress}%` }}
        className="fixed top-0 left-0 h-[4px] bg-[#8B4513] z-50 transition-all duration-75"
        id="reading-progress-bar"
      />



      {/* 2. INSTANT HERO SECTION - DEEP BLACK WITH GOLD PARTICLES */}
      <section 
        className="relative overflow-hidden bg-[#1A1A1A] px-6 pt-20 pb-24 sm:px-8 md:pt-32 md:pb-36 flex flex-col justify-center min-h-[92vh]" 
        id="hero-section"
      >
        {/* Particle Canvas on backdrop */}
        <GoldParticlesCanvas />

        {/* Ambient Radial Vignette */}
        <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/15 to-transparent pointer-events-none z-10" />

        <div className="mx-auto max-w-[960px] relative z-20">
          <div className="grid items-center gap-12 md:gap-16 md:grid-cols-12">
            
            {/* Left aligned copy column with parallax scroll */}
            <motion.div 
              style={{ y: scrollOffset * 0.12 }} // elegant slow motion background text drift
              className="md:col-span-7 py-2 text-left"
            >
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-[#8B4513]/30 border border-[#D4A574]/40 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4A574] mb-6 rounded-full"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#D4A574]" /> Metodologia Europeia Exclusiva
              </motion.span>
              
              {/* Headline animation typewriter-word fade */}
              <TypewriterHeading text="O método que está a fazer mulheres comuns em Portugal ganhar €500–1.500/mês com uma tela, um fio e 5 minutos por dia." />
              
              {/* Subheadline displays with transition delay */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="text-base leading-relaxed text-zinc-300 mb-8 max-w-xl md:text-lg font-medium"
              >
                Sem precisar de talento, loja física ou publicar nas redes sociais. Um método europeu documentado e validado por mais de 850 mulheres a trabalhar em casa.
              </motion.p>

              {/* LIVE WOMEN COUNTER banner bar */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="flex items-center gap-3 py-2 px-4 bg-white/5 border border-white/15 rounded-full w-fit mb-8"
              >
                <div className="w-2.5 h-2.5 bg-[#3B6D11] rounded-full animate-ping shrink-0" />
                <span className="text-xs sm:text-sm text-zinc-300">
                  <strong className="text-[#D4A574] font-bold" id="contador-ao-vivo">
                    {liveCount.toLocaleString("pt-PT")}
                  </strong> mulheres já acederam ao método em Portugal
                </span>
              </motion.div>

              {/* CTAs anchors slide inputs */}
              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="flex flex-col gap-3 sm:max-w-md"
              >
                <button 
                  onClick={() => scrollToSection('dor')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#D4A574] bg-transparent text-[#D4A574] px-8 py-4 text-base font-bold transition-all duration-300 hover:bg-[#D4A574]/10 hover:text-white hover:border-white focus:outline-none"
                  id="hero-cta-button"
                >
                  Descobrir o método ↓
                </button>
                <p className="text-stone-400 text-xs mt-1.5 font-medium">
                  Mais de 800 mulheres já acederam · Garantia de 7 dias
                </p>
              </motion.div>
            </motion.div>

            {/* Right side books mockup graphic cover */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="md:col-span-5 flex justify-center z-25 relative"
            >
              <div className="relative w-full max-w-[280px] sm:max-w-[320px]">
                {/* Gold glowing shadow vignette */}
                <div className="absolute inset-0 bg-[#D4A574]/10 rounded-2xl blur-3xl transform rotate-6 scale-110 pointer-events-none" />
                
                <img 
                  src="https://i.postimg.cc/Sx100wNK/image.png" 
                  alt="Atelier de Malas Premium" 
                  className="relative w-full h-auto rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-[#D4A574]/30 z-10 transition-transform duration-500 hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. BLOCO DE DOR - STORYTELLING VIEWS */}
      <section className="bg-[#1A1A1A] px-6 py-20 sm:px-8 sm:py-28 border-t border-[#D4A574]/10" id="dor">
        <div className="mx-auto max-w-[960px]">
          
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D4A574] block mb-2 font-sans">A TUA LIBERDADE</span>
            <h2 className="font-serif text-3xl font-black leading-tight text-white sm:text-4xl max-w-xl mx-auto">
              Até quando vais esperar para teres uma renda que seja só tua?
            </h2>
            <div className="mx-auto mt-6 h-[2px] w-12 bg-[#8B4513]"></div>
          </div>

          {/* Real scrolling focused pain points */}
          <div className="space-y-6">
            <PainFrase 
              text="&quot;Cansaste de ter de pedir dinheiro para comprares coisas para ti própria.&quot;"
              subtext="A dependência financeira desgasta até a mulher mais forte."
            />
            <PainFrase 
              text="&quot;Sentes que o tempo está a passar, e as tuas vontades ficam sempre para depois.&quot;"
              subtext="Há quanto tempo estás a adiar o teu início e a tua liberdade?"
            />
            <PainFrase 
              text="&quot;Querias ter algo que fosse só teu. Que ninguém te pudesse dar nem tirar.&quot;"
              subtext="Uma habilidade segura que reside nas tuas próprias mãos e cabeça."
            />
            <PainFrase 
              text="&quot;Esse caminho existe. E está documentado dentro deste método.&quot;"
              subtext="As chaves do método europeu que mudou as finanças de +800 portuguesas."
              isHighlight={true}
            />
          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={() => scrollToSection('produto')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#D4A574] px-10 py-4 text-center text-sm font-bold tracking-wider uppercase text-[#D4A574] bg-transparent shadow transition-all duration-300 hover:bg-[#D4A574]/5 hover:text-white"
            >
              Ver como funciona ↓
            </button>
          </div>

        </div>
      </section>

      {/* 4. PRODUTO (SPLIT SCREEN VIEW COMPONENT DESIGN) */}
      <section className="bg-white px-6 py-20 sm:px-8 sm:py-28 border-y border-zinc-100" id="produto">
        <div className="mx-auto max-w-[960px]">
          
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B4513]">CONTEÚDO COMPLETO E EXCLUSIVO</span>
            <h2 className="font-serif text-3xl font-black text-[#1A1A1A] sm:text-4xl mt-3">
              Conhece o Método
            </h2>
            <div className="mx-auto mt-5 h-[2px] w-12 bg-[#8B4513]"></div>
          </div>

          <div className="grid gap-12 lg:grid-cols-12 items-center bg-[#F8F5F0]/30 rounded-3xl border-2 border-[#D4A574]/20 p-6 sm:p-12 relative overflow-hidden shadow-sm">
            
            {/* Left: Image slides in from left */}
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-5 flex justify-center lg:pr-6"
            >
              <div className="relative w-full max-w-[240px] group">
                <div className="absolute inset-0 bg-[#8B4513]/10 rounded-xl blur-xl transform scale-105" />
                
                {/* Genuine book layout construct */}
                <div className="relative aspect-[3/4] w-full bg-gradient-to-br from-[#8B4513] to-[#4A2306] p-5 shadow-2xl border-2 border-[#D4A574]/40 flex flex-col justify-between text-white overflow-hidden rounded-r-2xl rounded-l-md" style={{ transformStyle: "preserve-3d" }}>
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] opacity-35" />
                  <div className="border border-[#D4A574]/30 h-full w-full rounded p-4 flex flex-col justify-between relative bg-black/10">
                    <div className="text-center">
                      <span className="text-[9px] tracking-[0.25em] font-extrabold uppercase text-[#D4A574]">MÉTODO DIGITAL (PDF)</span>
                      <div className="h-[1px] w-6 bg-[#D4A574]/30 mx-auto my-2" />
                    </div>
                    
                    <div className="text-center">
                      <p className="font-serif text-xl font-extrabold tracking-wider text-[#fffaf0] leading-none mb-1">ATELIER DE</p>
                      <p className="font-sans text-[10px] tracking-[0.3em] font-semibold text-[#D4A574] my-2">MALAS</p>
                      <p className="font-serif text-xl font-extrabold tracking-wider text-[#fffaf0] leading-none">PREMIUM</p>
                    </div>

                    <div className="text-center border-t border-[#D4A574]/15 pt-2">
                      <p className="text-[8px] tracking-widest text-[#D4A574] font-bold uppercase">EDITION LUXE</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vertical Golden Divider separating layouts on desktop */}
            <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#D4A574]/5 via-[#D4A574]/40 to-[#D4A574]/5" />

            {/* Right: Items stagger from right side with 150ms delay bounds */}
            <div className="lg:col-span-7 lg:pl-10">
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed mb-8 font-medium">
                "O registo completo de mais de uma década de descobertas, viagens, experiências e malas produzidas pelas próprias mãos da autora. O único método em Portugal que reúne, num só material, os modelos europeus, os modelos exclusivos da autora e o método que está a fazer mulheres comuns ganharem €500–1.500 por mês a trabalhar de casa."
              </p>

              <div className="grid gap-6 sm:grid-cols-2 pt-6 border-t border-zinc-200">
                
                {/* Lists trigger staggered */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#8B4513] mb-3">Este método é para ti...</h4>
                  <ul className="space-y-2.5 text-xs text-zinc-650 font-semibold">
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4A574] shrink-0 mt-0.5 font-bold">✔</span>
                      <span>Mesmo que nunca tenhas feito artesanato</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4A574] shrink-0 mt-0.5 font-bold">✔</span>
                      <span>Mesmo que já tenhas tentado e desistido</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4A574] shrink-0 mt-0.5 font-bold">✔</span>
                      <span>Mesmo que aches que não tens tempo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4A574] shrink-0 mt-0.5 font-bold">✔</span>
                      <span>Mesmo que aches que não tens talento</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#8B4513] mb-3">O que recebes...</h4>
                  <ul className="space-y-2.5 text-xs text-zinc-650 font-semibold">
                    <li className="flex items-start gap-2">
                      <span className="text-[#8B4513] shrink-0 mt-0.5">★</span>
                      <span className="text-zinc-800 font-bold">6 capítulos · 500+ modelos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8B4513] shrink-0 mt-0.5">★</span>
                      <span className="text-zinc-800 font-bold">Método Express completo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8B4513] shrink-0 mt-0.5">★</span>
                      <span className="text-zinc-800 font-bold">Lista de fornecedores em PT e ES</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8B4513] shrink-0 mt-0.5">★</span>
                      <span className="text-zinc-800 font-bold">Caminho de vendas pelo WhatsApp</span>
                    </li>
                  </ul>
                </motion.div>

              </div>
            </div>

          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => scrollToSection('viabilidade')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#8B4513] px-10 py-4 text-center text-sm font-extrabold tracking-wider uppercase text-[#8B4513] bg-transparent shadow transition-all duration-300 hover:bg-[#8B4513]/5"
            >
              Ver o conteúdo completo ↓
            </button>
          </div>

        </div>
      </section>

      {/* 5. VIABILIDADE ECONÓMICA (8 CARDS CASCADE EFFECT) */}
      <section className="bg-white px-6 py-20 sm:px-8 sm:py-28" id="viabilidade">
        <div className="mx-auto max-w-[960px]">
          
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8B4513] block">VIABILIDADE ECONÓMICA</span>
            <h2 className="font-serif text-3xl font-black text-[#1A1A1A] sm:text-4xl mt-3">
              Mesmo para quem já tentou de tudo
            </h2>
            <div className="mx-auto mt-5 h-[2px] w-12 bg-[#8B4513]"></div>
          </div>

          {/* Grid with cards alternating styles */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              whileHover={{ y: -8 }}
              className="bg-white p-6 rounded-2xl border-2 border-[#D4A574]/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-serif font-black text-[#8B4513]/30 block mb-3">01</span>
                <h4 className="text-[15px] font-black text-[#1A1A1A] mb-1.5 leading-tight">Parte do zero</h4>
                <p className="text-xs text-zinc-600 leading-relaxed font-semibold">Nenhum conhecimento prévio necessário.</p>
              </div>
            </motion.div>

            {/* Card 2 - creme bg */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -8 }}
              className="bg-[#F8F5F0] p-6 rounded-2xl border-2 border-[#D4A574]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-serif font-black text-[#8B4513]/30 block mb-3">02</span>
                <h4 className="text-[15px] font-black text-[#1A1A1A] mb-1.5 leading-tight">
                  <AnimatedCount end={15} prefix="€" /> para começar
                </h4>
                <p className="text-xs text-zinc-650 leading-relaxed font-semibold">10 malas produzidas com o investimento de um jantar fora.</p>
              </div>
            </motion.div>

            {/* Card 3 - white bg */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              whileHover={{ y: -8 }}
              className="bg-white p-6 rounded-2xl border-2 border-[#D4A574]/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-serif font-black text-[#8B4513]/30 block mb-3">03</span>
                <h4 className="text-[15px] font-black text-[#1A1A1A] mb-1.5 leading-tight">
                  Margem de <AnimatedCount end={1000} suffix="%" />
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed font-semibold">Mala que custa €5 vende a €80. Faz as contas.</p>
              </div>
            </motion.div>

            {/* BARRA COMPARATIVA CHART TRIGGERING */}
            <VisualBarComparativa />

            {/* Card 4 - creme bg */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              whileHover={{ y: -8 }}
              className="bg-[#F8F5F0] p-6 rounded-2xl border-2 border-[#D4A574]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-serif font-black text-[#8B4513]/30 block mb-3">04</span>
                <h4 className="text-[15px] font-black text-[#1A1A1A] mb-1.5 leading-tight">
                  <AnimatedCount end={5} suffix=" min" /> por mala
                </h4>
                <p className="text-xs text-zinc-655 leading-relaxed font-semibold">Uma tarde produz a semana inteira de vendas.</p>
              </div>
            </motion.div>

            {/* Card 5 - white bg */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
              whileHover={{ y: -8 }}
              className="bg-white p-6 rounded-2xl border-2 border-[#D4A574]/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-serif font-black text-[#8B4513]/30 block mb-3">05</span>
                <h4 className="text-[15px] font-black text-[#1A1A1A] mb-1.5 leading-tight">Antifalhas</h4>
                <p className="text-xs text-zinc-600 leading-relaxed font-semibold">Erro zero, mesmo na primeira tentativa.</p>
              </div>
            </motion.div>

            {/* Card 6 - creme bg */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.55 }}
              whileHover={{ y: -8 }}
              className="bg-[#F8F5F0] p-6 rounded-2xl border-2 border-[#D4A574]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-serif font-black text-[#8B4513]/30 block mb-3">06</span>
                <h4 className="text-[15px] font-black text-[#1A1A1A] mb-1.5 leading-tight">Sem redes sociais</h4>
                <p className="text-xs text-zinc-655 leading-relaxed font-semibold">Sem posts, sem vídeos, sem aparecer. O caminho está no método.</p>
              </div>
            </motion.div>

            {/* Card 7 - white bg */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.65 }}
              whileHover={{ y: -8 }}
              className="bg-white p-6 rounded-2xl border-2 border-[#D4A574]/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-serif font-black text-[#8B4513]/30 block mb-3">07</span>
                <h4 className="text-[15px] font-black text-[#1A1A1A] mb-1.5 leading-tight">Procura eterna</h4>
                <p className="text-xs text-zinc-600 leading-relaxed font-semibold">Toda a mulher quer malas. Todos os meses. Em todas as classes.</p>
              </div>
            </motion.div>

            {/* Card 8 - creme bg */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.75 }}
              whileHover={{ y: -8 }}
              className="bg-[#F8F5F0] p-6 rounded-2xl border-2 border-[#D4A574]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-serif font-black text-[#8B4513]/30 block mb-3">08</span>
                <h4 className="text-[15px] font-black text-[#1A1A1A] mb-1.5 leading-tight">
                  <AnimatedCount end={800} suffix="+" /> provas
                </h4>
                <p className="text-xs text-zinc-655 leading-relaxed font-semibold">Não é teste. É método validado por gente como tu.</p>
              </div>
            </motion.div>

          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => scrollToSection('conteudo')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#8B4513] px-10 py-4 text-center text-sm font-extrabold tracking-wider uppercase text-[#8B4513] bg-transparent shadow transition-all duration-300 hover:bg-[#8B4513]/5"
            >
              Continuar a ler ↓
            </button>
          </div>

        </div>
      </section>

      {/* 6. DENTRO DO MÉTODO (GRID ON DESKTOP, SWIPE ON MOBILE WITH FLIP-IN) */}
      <section className="bg-[#F8F5F0] px-6 py-20 sm:px-8 sm:py-28 border-y border-[#D4A574]/20" id="conteudo">
        <div className="mx-auto max-w-[960px] relative">
          
          <div className="text-center mb-16 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B4513]">POR DENTRO DESTA EDIÇÃO</span>
            <h2 className="font-serif text-3xl font-black text-[#1A1A1A] sm:text-4xl mt-3">
              Dentro do método vais encontrar
            </h2>
            <div className="mx-auto mt-5 h-[2px] w-12 bg-[#8B4513]"></div>
          </div>

          {/* Connect horizontal connector on viewport check (desktop) */}
          <div className="relative">
            <div className="hidden lg:block absolute top-[45px] left-10 right-10 h-0.5 bg-zinc-200/50 z-0">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="h-full bg-[#D4A574]"
              />
            </div>

            {/* Layout responsive scroll mobile flow */}
            <div className="flex gap-6 overflow-x-auto pb-4 pt-1 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0 scrollbar-none snap-x snap-mandatory relative z-10">
              
              <GridItemFlip 
                number="01"
                title="O Método Express"
                text="Como produzir a tua primeira mala comercializável na primeira hora, seguindo um cronograma simples que poupa o teu tempo precioso."
                index={0}
              />

              <GridItemFlip 
                number="02"
                title="O Protocolo Antifalhas"
                text="Passo a passo gráfico completo para evitar desperdício de tela e fio, garantindo acabamento idêntico ao de lojas de luxo europeias."
                index={1}
              />

              <GridItemFlip 
                number="03"
                title="A Lista de Fornecedores PT"
                text="Os contactos e sites diretos dos maiores distribuidores grossistas de fitas e fechos em Portugal e Espanha para maximizar a tua margem de lucro."
                index={2}
              />

              <GridItemFlip 
                number="04"
                title="6 Capítulos · 500+ modelos"
                text="Uma recolha impressionante organizada por complexidade, garantindo que tens sempre novidades atraentes para entregar às tuas clientes fiéis."
                index={3}
              />

              <GridItemFlip 
                number="05"
                title="Os Modelos Exclusivos"
                text="Acederás aos moldes e designs exclusivos que a Maria João desenvolveu ao longo de dez anos de sucesso no mercado europeu de luxo informal."
                index={4}
              />

              <GridItemFlip 
                number="06"
                title="Caminho pelo WhatsApp"
                text="O roteiro exato de mensagens prontas para enviar a amigas, familiares ou compradoras locais. Vende sem precisar de ser chata ou insignente."
                index={5}
              />

            </div>
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => scrollToSection('bonus')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#8B4513] px-10 py-4 text-center text-sm font-extrabold tracking-wider uppercase text-[#8B4513] bg-transparent shadow transition-all duration-300 hover:bg-[#8B4513]/5"
            >
              Ver o que está incluído ↓
            </button>
          </div>

        </div>
      </section>

      {/* 7. EXTRA BONUS SECTION (DARK CANVAS WITH REAL-TIME MARKER EFFECTS) */}
      <section className="bg-[#1A1A1A] px-6 py-20 sm:px-8 sm:py-28 border-y border-[#D4A574]/25" id="bonus">
        <div className="mx-auto max-w-[960px]">
          
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4A574]">OFERTA DE LANÇAMENTO</span>
            <h2 className="font-serif text-3xl font-black text-white sm:text-4xl mt-3">
              E ainda recebes estes bónus, sem custo adicional
            </h2>
            <div className="mx-auto mt-5 h-[2px] w-12 bg-[#8B4513]"></div>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            
            <BonusCard 
              index={0}
              bonusNumber="Bónus 1"
              title="Lista de Fornecedores Exclusiva"
              text="Os contactos directos dos melhores distribuidores grossistas de fitas, tecidos e fechos em Portugal e Espanha. Os mesmos fornecedores que abastecem ateliês profissionais, agora acessíveis a ti, com preços que tornam a tua margem impossível de ignorar."
              value={19}
            />

            <BonusCard 
              index={1}
              bonusNumber="Bónus 2"
              title="Guia de Preços e Lucros"
              text="Uma tabela simples que te diz exactamente quanto cobrar por cada tipo de mala, com base no custo real dos materiais e no mercado português actual. Acabou a incerteza de &quot;será que estou a cobrar bem?&quot;"
              value={12}
            />

            <BonusCard 
              index={2}
              bonusNumber="Bónus 3"
              title="Roteiro de Vendas pelo WhatsApp"
              text="As mensagens exactas, prontas a copiar e adaptar, para apresentares as tuas malas a amigas, familiares e conhecidas sem parecer chata nem insistente. O caminho mais curto entre a tua primeira mala pronta e o primeiro dinheiro na conta."
              value={17}
            />

            <BonusCard 
              index={3}
              bonusNumber="Bónus 4"
              title="Calendário de Procura Anual"
              text="Os 12 meses do ano organizados pelos momentos de maior procura por malas artesanais em Portugal: datas comemorativas, épocas de ofertas, alturas de mercados e feiras. Sabe sempre o que produzir e quando vender para maximizar as tuas semanas de maior rendimento."
              value={9}
            />

          </div>

          <div className="mt-12 text-center">
            <p className="text-sm sm:text-base font-extrabold text-[#D4A574] tracking-wide bg-[#8B4513]/10 border-2 border-[#D4A574]/40 rounded-xl py-4 px-6 inline-block">
              Valor total dos bónus: €57, incluídos sem custo adicional com o teu método.
            </p>
          </div>

          <div className="mt-10 text-center">
            <button 
              onClick={() => scrollToSection('passos')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#D4A574] px-10 py-4 text-center text-sm font-extrabold tracking-wider uppercase text-[#D4A574] bg-transparent shadow transition-all duration-300 hover:bg-[#D4A574]/5"
            >
              Ver os bónus em detalhe ↓
            </button>
          </div>

        </div>
      </section>

      {/* 8. 3 PASSOS PARA LUCRAR (ANIMATED PATH TIMELINE) */}
      <section className="bg-white px-6 py-20 sm:px-8 sm:py-28 border-y border-zinc-100" id="passos">
        <div className="mx-auto max-w-[960px]">
          
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8B4513] block">PLANIFICAÇÃO RÁPIDA</span>
            <h2 className="font-serif text-3xl font-black text-[#1A1A1A] sm:text-4xl mt-3">
              Em 3 passos começas a ganhar dinheiro
            </h2>
            <div className="mx-auto mt-5 h-[2px] w-12 bg-[#8B4513]"></div>
          </div>

          {/* Timeline component */}
          <TimelinePassos />

          <div className="mt-12 text-center">
            <button 
              onClick={() => scrollToSection('comparacao')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#8B4513] px-10 py-4 text-center text-sm font-extrabold tracking-wider uppercase text-[#8B4513] bg-transparent shadow transition-all duration-300 hover:bg-[#8B4513]/5"
            >
              Continuar ↓
            </button>
          </div>

        </div>
      </section>

      {/* 9. DIFERENCIAÇÃO COMPARAÇÃO (SIDE TRANSLATE WITH DRAW CHECKMARKS) */}
      <section className="bg-white px-6 py-20 sm:px-8 sm:py-28" id="comparacao">
        <div className="mx-auto max-w-[960px]">
          
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8B4513] block">COMPARAÇÃO DIRETA</span>
            <h2 className="font-serif text-3xl font-black text-[#1A1A1A] sm:text-4xl mt-3">
              Este método é diferente de tudo o que está na internet
            </h2>
            <div className="mx-auto mt-5 h-[2px] w-12 bg-[#8B4513]"></div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            
            {/* O QUE NÃO É - SLIDE FROM LEFT */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="rounded-2xl border border-red-200 bg-[#FFF5F5]/60 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-800 font-extrabold text-sm shadow-sm">✕</span>
                <h3 className="font-serif text-xl font-extrabold text-stone-900">O que NÃO é</h3>
              </div>
              
              <ul className="space-y-4">
                {[
                  "Um material genérico de artesanato copiado de outros",
                  "Uma colectânea aleatória de modelos sem método",
                  "Uma promessa vazia de \"trabalha em casa\" sem caminho real",
                  "Um material amador feito de qualquer maneira"
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 + 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <AnimatedCross />
                    <span className="text-zinc-700 text-sm sm:text-base leading-relaxed font-semibold">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* O QUE É - SLIDE FROM RIGHT */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="rounded-2xl border-2 border-[#D4A574]/35 bg-[#F5FFF5]/60 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-sm shadow-sm">✓</span>
                <h3 className="font-serif text-xl font-extrabold text-stone-900">O que É</h3>
              </div>
              
              <ul className="space-y-4">
                {[
                  "A primeira documentação completa do método europeu adaptado para Portugal.",
                  "O único material que combina o \"como fazer\" com o \"como vender\" no mesmo método.",
                  "Validado comercialmente por mais de 800 mulheres reais.",
                  "O método prático detalhado que estimula dedicação e gera resultados de verdade."
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 + 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <AnimatedCheck />
                    <span className="text-zinc-750 text-sm sm:text-base leading-relaxed font-black">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => scrollToSection('qualificacao')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#8B4513] px-10 py-4 text-center text-sm font-extrabold tracking-wider uppercase text-[#8B4513] bg-transparent shadow transition-all duration-300 hover:bg-[#8B4513]/5"
            >
              Continuar ↓
            </button>
          </div>

        </div>
      </section>

      {/* 10. QUALIFICAÇÃO (DARK CANVAS WITH DELAY CHECKS AND TYPEWRITER FINALE) */}
      <section className="bg-[#1A1A1A] px-6 py-20 sm:px-8 sm:py-28 border-y border-[#D4A574]/15" id="qualificacao">
        <div className="mx-auto max-w-[960px]">
          
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4A574] block">PERFIL DO CANDIDATO</span>
            <h2 className="font-serif text-3xl font-black text-white sm:text-4xl mt-3">
              Este método é para ti?
            </h2>
            <div className="mx-auto mt-5 h-[2px] w-12 bg-[#8B4513]"></div>
          </div>

          <div className="grid gap-8 md:grid-cols-12 max-w-4xl mx-auto items-start">
            
            {/* Sim, é para ti checklist draws */}
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-7 rounded-2xl border-2 border-[#D4A574]/35 bg-[#1F1F1F] p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-extrabold text-sm">✓</span>
                <h3 className="text-base font-black text-[#D4A574] uppercase tracking-wider">Sim, é para ti:</h3>
              </div>
              
              <ul className="space-y-4">
                {[
                  "És uma mulher que quer uma renda própria ou alcançar a tua autonomia financeira.",
                  "Estás cansada de tentar coisas na Internet que não dão resultados reais ou palpáveis.",
                  "Tens algumas horas vagas por semana que gostarias de monetizar de forma produtiva.",
                  "És dona de casa, reformada, mãe, autónoma ou queres complementar o teu salário atual.",
                  "Estás disposta a abrir o método digital, ler as páginas e aplicar os passos simples apresentados.",
                  "Já alguma vez pensaste \"eu gostava de ter o meu próprio dinheiro, só meu\", mesmo que nunca tenhas feito nada a este respeito."
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                    className="flex items-start gap-3 text-zinc-300"
                  >
                    <div className="pt-0.5"><AnimatedCheck /></div>
                    <span className="text-xs sm:text-sm leading-relaxed font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Não é para ti list */}
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-5 rounded-2xl border border-red-950 bg-red-950/10 p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-950/50 text-red-500 border border-red-900 font-extrabold text-sm">✕</span>
                <h3 className="text-base font-black text-white uppercase tracking-wider">Não é para ti:</h3>
              </div>
              
              <ul className="space-y-4">
                {[
                  "Se achas que vais ficar rica numa semana sem fazer absolutamente nada.",
                  "Se apenas queres acumular métodos digitais sem intenção de os aplicar.",
                  "Se procuras truques ou uma fórmula mágica mirabolante rápida em vez de um método artesanal comprovado."
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + 0.3 }}
                    className="flex items-start gap-3 text-zinc-400"
                  >
                    <div className="pt-0.5"><AnimatedCross /></div>
                    <span className="text-xs sm:text-sm leading-relaxed font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

          </div>

          {/* Typewriter phrase conclusion loading on view */}
          <div className="mt-16 text-center max-w-2xl mx-auto border-t border-white/5 pt-10">
            <TypewriterPhrase text="Se te identificaste com pelo menos um ponto da lista acima, o método foi feito para ti. A única diferença entre as mulheres que começaram e as que ainda estão a pensar é esta página, e a decisão que tomas a seguir." />
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => scrollToSection('autora')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#D4A574] px-10 py-4 text-center text-sm font-bold tracking-wider uppercase text-[#D4A574] bg-transparent shadow transition-all duration-300 hover:bg-[#D4A574]/5"
            >
              Ver os resultados reais ↓
            </button>
          </div>

        </div>
      </section>

      {/* MID SECTION ANCHOR TEXT COMPONENT */}
      <div className="text-center py-10 px-6 text-[#8B4513] font-serif text-base sm:text-lg italic bg-[#F8F5F0] border-b border-[#D4A574]/20">
        "Ainda tens dúvidas? Conhece a pessoa que criou este método."
      </div>

      {/* 11. HISTÓRIA DA AUTORA (CINEMATIC COLS WITH PROGRESS LINE) */}
      <section ref={autoraRef} className="bg-[#F8F5F0] px-6 py-20 sm:px-8 sm:py-28 relative" id="autora">
        <div className="mx-auto max-w-[960px] relative z-10">
          
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Elegant Portrait side layout split-screen */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[320px] lg:max-w-full">
                <div className="absolute inset-0 bg-[#D4A574]/20 rounded-2xl transform -rotate-3 scale-105" />
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border-2 border-[#8B4513]/40 shadow-2xl bg-[#FFFFFF]">
                  <img 
                    src="https://i.postimg.cc/QxsV7Lrz/image.png" 
                    alt="Maria João Silva" 
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Scrolling chronological history paragraphs with indicator border left */}
            <div className="lg:col-span-7 relative pl-6 sm:pl-10">
              
              {/* Chrono indicators path left side */}
              <div className="absolute left-0 top-2 bottom-2 w-1 bg-zinc-300/40 rounded-full overflow-hidden">
                <div 
                  style={{ height: `${timelineVisiblePercent}%` }}
                  className="w-full bg-[#8B4513] transition-all duration-300"
                />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B4513] block mb-2 font-sans">A HISTÓRIA POR TRÁS DO MÉTODO</span>
              <h2 className="font-serif text-3xl font-black text-[#1A1A1A] sm:text-4xl mb-6 leading-tight">
                Quem criou este método, e porquê
              </h2>
              <div className="h-[2px] w-12 bg-[#8B4513] mb-8" />

              <div className="space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base font-semibold">
                <AutoraParagraph 
                  text="&quot;Houve um tempo em que pensava duas vezes antes de comprar um café. Que abria a carteira ao fim do mês e ficava em branco.&quot;"
                  index={0}
                />
                <AutoraParagraph 
                  text="&quot;Tentei de tudo. Trabalhei por conta de outrém, fui autónoma, vendi roupa em consignação. Até abrir um pequeno negócio que faliu em menos de um ano.&quot;"
                  index={1}
                />
                <AutoraParagraph 
                  text="&quot;Até ao dia em que descobri as malas artesanais, e um método europeu que ninguém em Portugal ainda usava da forma certa.&quot;"
                  index={2}
                />
                <AutoraParagraph 
                  text="&quot;Hoje, mais de 800 mulheres já mudaram a sua situação financeira com o que aprendi e passei para a frente. Este método é o que eu gostaria de ter recebido na minha pior fase.&quot;"
                  index={3}
                />
              </div>
            </div>

          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={() => scrollToSection('depoimentos')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#8B4513] px-10 py-4 text-center text-sm font-extrabold tracking-wider uppercase text-[#8B4513] bg-transparent shadow transition-all duration-300 hover:bg-[#8B4513]/5"
            >
              Ver resultados de mulheres reais ↓
            </button>
          </div>

        </div>
      </section>

      {/* 12. TESTIMONIALS (AUTO-SLIDING CAROUSEL) */}
      <section className="bg-white px-6 py-20 sm:px-8 sm:py-28 border-y border-zinc-100" id="depoimentos">
        <div className="mx-auto max-w-[960px]">
          
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B4513]">PROVA REAL EM PORTUGAL</span>
            <h2 className="font-serif text-3xl font-black text-[#1A1A1A] sm:text-4xl mt-3">
              Vê o que mulheres como tu estão a conseguir
            </h2>
            <div className="mx-auto mt-5 h-[2px] w-12 bg-[#8B4513]"></div>
          </div>

          {/* Testimonial slides */}
          <TestimonialsCarousel />

          <div className="mt-12 text-center">
            <motion.a 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={HOTMART_LINK}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#8B4513] px-10 py-4.5 text-center text-base font-bold text-white shadow-md transition-all duration-300 hover:bg-[#70370f] hover:shadow-xl"
            >
              Quero resultados como estes — €7,90
              <ArrowRight className="h-5 w-5" />
            </motion.a>
          </div>

        </div>
      </section>

      {/* 13. PROVA SOCIAL VISUAL (PINTEREST MASONRY GRID WITH HOVER DETAIL OVERLAYS) */}
      <section className="bg-white px-6 py-20 sm:px-8 sm:py-28 border-b border-zinc-100" id="provas">
        <div className="mx-auto max-w-[960px]">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B4513]">PROVA DE SUCESSO DE PORTUGAL</span>
            <h2 className="font-serif text-3xl font-black text-[#1A1A1A] sm:text-4xl mt-3">
              Malas feitas com o método — vendidas em Portugal
            </h2>
            <div className="mx-auto mt-5 h-[2px] w-12 bg-[#8B4513]"></div>
          </div>

          {/* Pinterest style columns masonry with responsive stagger details */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {visualProofs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.15 }}
                className="break-inside-avoid-column relative bg-white rounded-2xl shadow-[0_2px_18px_rgba(0,0,0,0.06)] overflow-hidden border border-zinc-200/40 group hover:shadow-2xl hover:border-[#8B4513]/10 transition-all duration-300 cursor-pointer"
              >
                <div className="relative overflow-hidden bg-zinc-50 rounded-t-2xl">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                  {/* Absolute elegant visual dark modal over item image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                    <span className="text-sm font-bold font-serif">{item.name}</span>
                    <span className="text-xs font-semibold text-[#D4A574]">{item.price}</span>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-1 text-left pb-4 px-[14px]">
                  <span className="text-[14px] font-extrabold text-[#1A1A1A]">{item.name}</span>
                  <span className="text-[16px] font-bold text-[#8B4513]">{item.price}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12 pb-4">
            <p className="text-[15px] italic text-[#666666]">
              "Estas malas foram feitas com o método. A próxima pode ser tua."
            </p>
          </div>

          <div className="mt-8 text-center">
            <motion.a 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={HOTMART_LINK}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#8B4513] px-10 py-4.5 text-center text-base font-bold text-white shadow-md transition-all duration-300 hover:bg-[#70370f] hover:shadow-xl"
            >
              Quero fazer malas como estas — €7,90
              <ArrowRight className="h-5 w-5" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* 14. STACK DE VALOR + CTA FINAL (DARK SCHEME WITH SEQUENTIAL REVEAL AND MARKERS) */}
      <section ref={finalCtaRef} className="bg-zinc-950 px-6 py-20 text-white sm:px-8 sm:py-28 border-t-2 border-[#8B4513]" id="cta-final">
        <div className="mx-auto max-w-[960px] text-center">
          
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4A574] inline-block mb-3">O TEU INVESTIMENTO</span>
          <h2 className="font-serif text-3xl font-black leading-tight tracking-tight sm:text-4xl max-w-xl mx-auto mb-4 text-white">
            Tudo o que recebes — por apenas €7,90
          </h2>

          <div className="max-w-xl mx-auto text-left bg-zinc-900/60 border-2 border-zinc-800/80 rounded-3xl p-6 sm:p-10 space-y-6 mb-10 mt-10 shadow-2xl relative overflow-hidden">
            {/* Elegant upper highlight panel inside card */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8B4513] to-transparent pointer-events-none" />

            {/* List trigger on viewport with sequenced delay */}
            <div className="space-y-4">
              {[
                { label: "Atelier de Malas Premium: método digital completo", price: "€19" },
                { label: "6 capítulos · 500+ modelos europeus e exclusivos", price: "incluído" },
                { label: "Método Express: primeira mala pronta hoje", price: "incluído" },
                { label: "Protocolo Antifalhas: erro zero na primeira tentativa", price: "incluído" },
                { label: "Bónus 1: Lista de Fornecedores PT e ES", price: "€19" },
                { label: "Bónus 2: Guia de Preços e Lucros", price: "€12" },
                { label: "Bónus 3: Roteiro de Vendas pelo WhatsApp", price: "€17" },
                { label: "Bónus 4: Calendário de Procura Anual", price: "€9" }
              ].map((item, idx) => {
                const itemVisible = stackVisible;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    animate={itemVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                    className="flex justify-between items-center gap-4 text-xs sm:text-sm font-medium border-b border-zinc-800/60 pb-3 last:border-b-0 last:pb-0 font-sans text-zinc-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.price === "incluído" ? (
                      <span className="text-zinc-500 text-xs font-semibold select-none uppercase tracking-wider">{item.price}</span>
                    ) : (
                      <span className="text-zinc-400 font-mono font-bold">{item.price}</span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Separator animating left-to-right drawing */}
            <FinalDrawDivider />

            {/* Total struck calculation live animate */}
            <RealTimeStrike 
              startText="Valor total: "
              strikedText="€76"
              resultText="Hoje por apenas €7,90"
              animatedOnView={stackVisible}
            />

            <div className="max-w-md mx-auto mb-6">
              <motion.a 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                animate={{ 
                  boxShadow: ["0 0 0 0 rgba(22,163,74,0)", "0 0 20px 4px rgba(22,163,74,0.4)", "0 0 0 0 rgba(22,163,74,0)"] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.2, 
                  ease: "easeInOut" 
                }}
                href={HOTMART_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#16A34A] px-6 py-4.5 text-center text-sm sm:text-base font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#15803D] focus:outline-none"
                id="final-cta-button"
              >
                Quero tudo isto por €7,90 — acesso imediato
              </motion.a>
              <p className="text-zinc-400 text-xs text-center mt-3 font-semibold tracking-wide">
                Pagamento único. Sem mensalidades. Acesso imediato e vitalício.
              </p>
            </div>

            <div className="text-zinc-400 text-[10px] sm:text-xs font-semibold tracking-wider flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 pt-2">
              <span>Pagamento seguro</span>
              <span>•</span>
              <span>MB Way</span>
              <span>•</span>
              <span>Cartão bancário</span>
              <span>•</span>
              <span>PayPal</span>
              <span>•</span>
              <span>Garantia de 7 dias</span>
            </div>
          </div>

          {/* SECURE SHIELD VALUE CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto bg-zinc-900 border-2 border-[#D4A574]/40 rounded-2xl p-6 sm:p-8 text-left mb-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4A574] to-transparent pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-6 w-6 text-[#D4A574] shrink-0" />
              <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Garantia total de 7 dias</h4>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-semibold">
              Se acederes ao método, seguires os passos, e achares que não é para ti, devolvo-te 100% do valor pago. Sem perguntas, sem burocracia. O risco é completamente meu.
            </p>
          </motion.div>

          <p className="text-zinc-500 text-xs sm:text-sm italic font-semibold max-w-lg mx-auto leading-relaxed">
            "Já vendeste uma mala? Pagaste o método e ainda sobra. Se não venderes nenhuma, eu devolvo-te o dinheiro. É assim tão simples."
          </p>

        </div>
      </section>

      {/* 15. COMPLIANCE FOOTER & MODALS */}
      <footer className="bg-zinc-950 px-6 py-16 text-zinc-500 border-t border-zinc-900" id="main-footer">
        <div className="mx-auto max-w-[960px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
            <div className="font-serif text-lg text-[#D4A574] tracking-[0.2em] uppercase font-bold text-center md:text-left">
              ATELIER DE MALAS PREMIUM
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <button onClick={() => setActiveModal("privicidade")} className="hover:text-[#D4A574] transition-colors">POLÍTICA DE PRIVACIDADE</button>
              <button onClick={() => setActiveModal("termos")} className="hover:text-[#D4A574] transition-colors">TERMOS E CONDIÇÕES</button>
              <button onClick={() => setActiveModal("contacto")} className="hover:text-[#D4A574] transition-colors">CONTACTO</button>
            </div>
          </div>

          <div className="border-t border-zinc-900/60 pt-8 text-center text-[10px] text-zinc-600 font-semibold tracking-wide space-y-2">
            <p>© {new Date().getFullYear()} Atelier de Malas Premium Portugal. Todos os direitos reservados.</p>
            <p className="max-w-2xl mx-auto leading-relaxed">Este material digital não é afiliado de nenhuma rede social ou plataforma externa, sendo toda a responsabilidade de operacionalização e garantia do proprietário legal.</p>
          </div>
        </div>
      </footer>

      {/* OVERLAY COMPLIANCE DIALOG MODALS */}
      <AnimatePresence>
        {activeModal && (
          <section className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-2xl z-10 border border-[#D4A574]/30"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 p-1 bg-zinc-50 rounded-full transition-colors"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4 text-left">
                
                {activeModal === "privicidade" && (
                  <div>
                    <h3 className="font-serif text-2xl font-black text-zinc-900 mb-4 tracking-tight">Política de Privacidade</h3>
                    <div className="space-y-4 text-xs sm:text-sm text-zinc-650 leading-relaxed font-semibold">
                      <p>A tua privacidade é de extrema relevância para nós. Respeitamos a privacidade em relação a qualquer informação tua que possamos recolher.</p>
                      <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para te fornecer o acesso seguro ao material digital. Fazemo-lo por meios justos e legais, com o teu total conhecimento e consentimento informado.</p>
                      <p>Não partilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido estritamente por lei em vigor.</p>
                      <p>Os pagamentos são processados em plataformas externas seguras cifradas com SSL (Hotmart). Não guardamos os teus dados bancários ou cartões nos nossos sistemas.</p>
                    </div>
                  </div>
                )}

                {activeModal === "termos" && (
                  <div>
                    <h3 className="font-serif text-2xl font-black text-zinc-900 mb-4 tracking-tight">Termos e Condições</h3>
                    <div className="space-y-4 text-xs sm:text-sm text-zinc-650 leading-relaxed font-semibold">
                      <p>Ao acederes ao método digital Atelier de Malas Premium, concordas em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis.</p>
                      <p>O conteúdo deste método, incluindo textos, moldes, fornecedores e estratégias comerciais, está protegido por leis de direitos de autor aplicáveis.</p>
                      <p>A licença fornecida após a compra é estritamente de caráter pessoal e intransmissível. É terminantemente proibido piratear, partilhar ou revender os ficheiros PDF sem autorização por escrito dos detentores legais.</p>
                    </div>
                  </div>
                )}

                {activeModal === "contacto" && (
                  <div className="text-center py-6">
                    <h3 className="font-serif text-2xl font-black text-zinc-900 mb-3 tracking-tight">Contacto Comercial</h3>
                    <p className="text-xs sm:text-sm text-zinc-650 max-w-md mx-auto mb-6 font-semibold">
                      Tens alguma dúvida em relação ao teu acesso, acompanhamento ou fornecimento? A nossa equipa de apoio em Portugal está pronta para te responder!
                    </p>
                    <div className="mx-auto max-w-sm space-y-4 pt-6 border-t border-zinc-100">
                      <div className="flex items-center justify-center gap-3 text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-150">
                        <Mail className="h-5 w-5 text-[#8B4513]" />
                        <span className="text-xs sm:text-sm font-bold text-zinc-900">suporte@atelierdemalas.pt</span>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-150">
                        <Phone className="h-5 w-5 text-[#8B4513]" />
                        <span className="text-xs sm:text-sm font-bold text-zinc-900">+351 912 345 678 (WhatsApp pós-venda)</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              <div className="mt-8 pt-4 border-t border-zinc-100 flex justify-end">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="rounded-lg bg-zinc-100 hover:bg-zinc-200 px-5 py-2.5 text-xs font-bold text-zinc-700 transition-colors"
                >
                  Fechar Janela
                </button>
              </div>
            </motion.div>
          </section>
        )}
      </AnimatePresence>

    </div>
  );
}
