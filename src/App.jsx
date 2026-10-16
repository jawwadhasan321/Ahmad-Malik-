import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ArrowUp, Mail, Phone, MapPin, Calendar, User, Pencil, Check, Copy, Loader2, CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { ReactLenis, useLenis } from 'lenis/react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './index.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
};

const MotionLink = motion(Link);

// Exact mathematical vector paths for the AS logo (extracted with sub-pixel fidelity)
const AS_PATH_A = "M 441 269 L 687 652 L 570 653 L 439 444 L 198 790 L 83 791 Z";
const AS_PATH_S = "M 584 269 L 860 269 L 795 360 L 632 361 L 906 665 L 910 690 L 904 707 L 843 790 L 612 791 L 544 686 L 800 684 L 617 486 L 525 341 L 523 336 L 560 283 Z";

const Preloader = ({ transitionKey }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isZooming, setIsZooming] = useState(false);
  const { pathname } = useLocation();

  const curtainRef = useRef(null);
  const svgRef = useRef(null);
  const logoGroupRef = useRef(null);
  const rafIdRef = useRef(null);
  const hasLoadedBeforeRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let timer = null;

    // Show preloader immediately on route change or menu navigation
    setIsVisible(true);
    setIsZooming(false);
    document.body.style.overflow = 'hidden';

    // Responsive initial coordinate span
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const startSpan = isMobile ? 2600 : 4800;
    const endSpan = 75;

    // Reset curtain and svg state if elements exist
    if (curtainRef.current) {
      curtainRef.current.style.opacity = '1';
    }
    if (svgRef.current) {
      const initX = 512 - startSpan / 2;
      const initY = 512 - startSpan / 2;
      svgRef.current.setAttribute('viewBox', `${initX} ${initY} ${startSpan} ${startSpan}`);
    }

    const isInitialLoad = !hasLoadedBeforeRef.current;
    hasLoadedBeforeRef.current = true;

    // Deliberate luxury pacing without blocking lag:
    // First entrance: 700ms so the user can experience the bespoke AS logo animation
    // Menu navigation transitions: 350ms for instantaneous, motorsport-sharp response
    const displayDuration = isInitialLoad ? 700 : 350;

    timer = setTimeout(() => {
      if (!isMounted) return;
      setIsZooming(true);

      const startTime = performance.now();
      const zoomDuration = 480; // ms

      const step = (now) => {
        if (!isMounted) return;
        const elapsed = now - startTime;
        const rawProgress = Math.min(1, elapsed / zoomDuration);

        // Exponential camera zoom: smooth acceleration diving right through the AS logo
        const easedProgress = rawProgress < 0.32
          ? Math.pow(rawProgress / 0.32, 2) * 0.2
          : 0.2 + Math.pow((rawProgress - 0.32) / 0.68, 2.5) * 0.8;

        const currentSpan = startSpan * Math.pow(endSpan / startSpan, easedProgress);
        const curX = 512 - currentSpan / 2;
        const curY = 512 - currentSpan / 2;

        if (svgRef.current) {
          svgRef.current.setAttribute('viewBox', `${curX} ${curY} ${currentSpan} ${currentSpan}`);
        }

        // Dissolve the dark curtain background as the logo approaches and expands past the screen
        if (curtainRef.current) {
          if (rawProgress < 0.28) {
            curtainRef.current.style.opacity = '1';
          } else {
            const fade = (rawProgress - 0.28) / 0.72;
            curtainRef.current.style.opacity = Math.max(0, 1 - fade).toString();
          }
        }

        if (rawProgress < 1) {
          rafIdRef.current = requestAnimationFrame(step);
        } else {
          if (isMounted) {
            setIsVisible(false);
            document.body.style.overflow = '';
          }
        }
      };

      rafIdRef.current = requestAnimationFrame(step);
    }, displayDuration);

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      document.body.style.overflow = '';
    };
  }, [pathname, transitionKey]);

  if (!isVisible) return null;

  return (
    <div
      ref={curtainRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#050604',
        zIndex: 9999999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <svg
        ref={svgRef}
        viewBox="-1888 -1888 4800 4800"
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="geometricPrecision"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          overflow: 'visible'
        }}
      >
        <defs>
          {/* Ahmad Malik Platinum White to Electric Lime Vector Gradient */}
          <linearGradient id="asPureLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d2ff00" />
          </linearGradient>

          {/* Dynamic Laser Specular Sheen Gliding Across the Logo Contours */}
          <linearGradient id="asSpecularSheen" x1="-100%" y1="0%" x2="200%" y2="0%">
            <stop offset="0%" stopColor="rgba(210, 255, 0, 0.15)" />
            <stop offset="45%" stopColor="rgba(210, 255, 0, 0.45)" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="rgba(210, 255, 0, 0.45)" />
            <stop offset="100%" stopColor="rgba(210, 255, 0, 0.15)" />
            <animate
              attributeName="x1"
              from="-100%"
              to="100%"
              dur="1.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              from="0%"
              to="200%"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        {/* AS LOGO ONLY: Pure Geometric Luxury with Zero Blurry Textures */}
        <g
          ref={logoGroupRef}
          transform="translate(15.5, -18)"
          className={isZooming ? "" : "as-preloader-idle"}
          style={{
            transformOrigin: '512px 512px',
            filter: isZooming ? 'none' : 'drop-shadow(0 0 22px rgba(210, 255, 0, 0.35))'
          }}
        >
          {/* Path A (Left angular wing) */}
          <path
            d={AS_PATH_A}
            fill="url(#asPureLogoGrad)"
            stroke="url(#asSpecularSheen)"
            strokeWidth="3.5"
            strokeLinejoin="miter"
          />

          {/* Path S (Right faceted lightning ribbon) */}
          <path
            d={AS_PATH_S}
            fill="url(#asPureLogoGrad)"
            stroke="url(#asSpecularSheen)"
            strokeWidth="3.5"
            strokeLinejoin="miter"
          />
        </g>
      </svg>
    </div>
  );
};


const PageContentWrapper = ({ children }) => {
  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      {children}
    </div>
  );
};

const RevealText = ({ text, delay = 0, triggerOnce = false }) => {
  const words = text.split(" ");
  return (
    <span style={{ display: 'inline-block' }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.1em', marginRight: '0.25em' }}>
          <motion.span
            initial={{ y: "120%", rotate: 5, opacity: 0 }}
            {...(triggerOnce ? {
              animate: { y: 0, rotate: 0, opacity: 1 },
              transition: { duration: 0.9, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }
            } : {
              whileInView: { y: 0, rotate: 0, opacity: 1 },
              viewport: { once: false, amount: 0.2, margin: "0px" },
              transition: { duration: 0.9, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }
            })}
            style={{ display: 'inline-block', transformOrigin: 'left bottom' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// Vertical Scroll Gallery Item
const VerticalGalleryItem = ({ item, index }) => {
  const ref = useRef(null);
  
  // Scale in as the top of the item enters the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 10%"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.15, 0.9, 1], [0.8, 1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.95, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.15, 0.9, 1], [150, 0, 0, -100]);
  const rotateX = useTransform(scrollYProgress, [0, 0.15, 0.9, 1], [25, 0, 0, -10]);

  return (
    <motion.div 
      ref={ref}
      className="vertical-gallery-item-wrapper"
      style={{ scale, opacity, y, rotateX, perspective: 1200, transformStyle: "preserve-3d" }}
    >
      {item.isText ? (
        <div style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', minHeight: '300px' }}>
          <h3 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', color: 'var(--color-lime)', lineHeight: 1, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            {item.title}
          </h3>
          {item.desc && <p style={{ fontSize: '1.6rem', color: 'var(--color-grey)', lineHeight: 1.4, fontFamily: 'var(--font-body)', maxWidth: '500px' }}>{item.desc}</p>}
        </div>
      ) : (
        <div className="vertical-gallery-item-inner">
          <img src={item.img} alt={item.title} className="vertical-gallery-img" />
          <div className="vertical-gallery-overlay">
            <h3 className="vertical-gallery-title">{item.title}</h3>
            <p className="vertical-gallery-desc">{item.desc}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const VerticalGallery = ({ items, titleNode, id }) => {
  return (
    <section className="vertical-scroll-section" id={id}>
      <div className="container">
        {titleNode && (
          <div className="section-header" style={{ padding: '0 2rem', display: 'flex', justifyContent: 'center', textAlign: 'center', overflow: 'visible' }}>
            {titleNode}
          </div>
        )}
        <div className="vertical-scroll-container">
          {items.map((item, index) => (
            <VerticalGalleryItem 
              key={item.id} 
              item={item} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const countries = [
  { code: "+1", flag: "🇺🇸", name: "US/Canada" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+7", flag: "🇷🇺", name: "Russia" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "+90", flag: "🇹🇷", name: "Turkey" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "+41", flag: "🇨🇭", name: "Switzerland" },
  { code: "+46", flag: "🇸🇪", name: "Sweden" },
  { code: "+47", flag: "🇳🇴", name: "Norway" },
  { code: "+45", flag: "🇩🇰", name: "Denmark" },
  { code: "+358", flag: "🇫🇮", name: "Finland" },
  { code: "+353", flag: "🇮🇪", name: "Ireland" },
  { code: "+64", flag: "🇳🇿", name: "New Zealand" },
  { code: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "+51", flag: "🇵🇪", name: "Peru" },
  { code: "+58", flag: "🇻🇪", name: "Venezuela" },
  { code: "+48", flag: "🇵🇱", name: "Poland" },
  { code: "+43", flag: "🇦🇹", name: "Austria" },
  { code: "+32", flag: "🇧🇪", name: "Belgium" },
  { code: "+420", flag: "🇨🇿", name: "Czechia" },
  { code: "+30", flag: "🇬🇷", name: "Greece" },
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+36", flag: "🇭🇺", name: "Hungary" },
  { code: "+40", flag: "🇷🇴", name: "Romania" },
  { code: "+380", flag: "🇺🇦", name: "Ukraine" },
  { code: "+972", flag: "🇮🇱", name: "Israel" },
  { code: "+98", flag: "🇮🇷", name: "Iran" },
  { code: "+964", flag: "🇮🇶", name: "Iraq" },
  { code: "+962", flag: "🇯🇴", name: "Jordan" },
  { code: "+961", flag: "🇱🇧", name: "Lebanon" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+973", flag: "🇧🇭", name: "Bahrain" },
  { code: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "+93", flag: "🇦🇫", name: "Afghanistan" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+977", flag: "🇳🇵", name: "Nepal" },
  { code: "+95", flag: "🇲🇲", name: "Myanmar" },
  { code: "+852", flag: "🇭🇰", name: "Hong Kong" },
  { code: "+886", flag: "🇹🇼", name: "Taiwan" },
  { code: "+84", flag: "🇻🇳", name: "Vietnam" },
  { code: "+855", flag: "🇰🇭", name: "Cambodia" },
  { code: "+856", flag: "🇱🇦", name: "Laos" },
  { code: "+673", flag: "🇧🇳", name: "Brunei" },
  { code: "+670", flag: "🇹🇱", name: "Timor-Leste" },
  { code: "+976", flag: "🇲🇳", name: "Mongolia" },
  { code: "+850", flag: "🇰🇵", name: "North Korea" }
].sort((a, b) => a.name.localeCompare(b.name));

const CustomCursor = ({ isMenuOpen }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e) => {
      if (e.target.closest('a, button, input, textarea, select, label, [role="button"], .screenshot-item, .play-button, .nav-brand')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('mouseover', updateHoverState, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Trailing Hollow Circle */}
      <motion.div
        animate={{
          x: mousePosition.x - (isHovering ? 9 : 21),
          y: mousePosition.y - (isHovering ? 9 : 21),
          width: isHovering ? 18 : 42,
          height: isHovering ? 18 : 42,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 22, mass: 0.4 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          border: `2px solid ${isMenuOpen ? 'var(--color-black)' : 'var(--color-lime)'}`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />
      
      {/* Primary Custom Cursor Image */}
      <motion.div
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{ type: 'tween', duration: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        <img 
          src="/custom-cursor.png" 
          alt="cursor" 
          style={{ 
            width: '28px', 
            height: 'auto', 
            filter: isMenuOpen ? 'brightness(0)' : 'none' 
          }} 
        />
      </motion.div>
    </>
  );
};

const GlobalBackground = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });
  
  // Parallax elements
  const ring1Y = useTransform(smoothProgress, [0, 1], ['-10vh', '30vh']);
  const ring2Y = useTransform(smoothProgress, [0, 1], ['10vh', '-40vh']);
  
  // Vertical line comets
  const cometY1 = useTransform(smoothProgress, [0, 1], ['-20vh', '120vh']);
  const cometY2 = useTransform(smoothProgress, [0, 1], ['120vh', '-20vh']);
  const cometY3 = useTransform(smoothProgress, [0, 1], ['-50vh', '150vh']);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="ambient-light-1" style={{ opacity: 0.5 }} />
      <div className="ambient-light-2" style={{ opacity: 0.5 }} />
      
      {/* Elegant Vertical Grid Layout */}
      <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%', height: '100%', position: 'absolute', opacity: 0.15 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ width: '1px', height: '100%', backgroundColor: 'var(--color-white)', position: 'relative' }}>
            {/* Scroll-driven comet */}
            <motion.div 
              style={{
                position: 'absolute',
                top: 0,
                left: '-1px', // center on the 1px line
                width: '3px',
                height: '15vh',
                background: 'linear-gradient(to bottom, transparent, var(--color-lime), var(--color-lime), transparent)',
                y: i % 2 === 0 ? cometY2 : (i === 3 ? cometY3 : cometY1),
                opacity: 0.9,
                filter: 'blur(1px)' // High budget glow effect
              }}
            />
          </div>
        ))}
      </div>

      {/* Abstract Parallax Geometric Lines */}
      <motion.svg 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', y: ring1Y, opacity: 0.08 }} 
        viewBox="0 0 1000 1000" 
        preserveAspectRatio="none"
      >
        <path d="M -100 500 Q 250 100 600 600 T 1100 300" fill="none" stroke="var(--color-white)" strokeWidth="2" />
        <path d="M -100 600 Q 350 200 700 700 T 1100 400" fill="none" stroke="var(--color-white)" strokeWidth="1" />
      </motion.svg>
      
      <motion.svg 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', y: ring2Y, opacity: 0.08 }} 
        viewBox="0 0 1000 1000" 
        preserveAspectRatio="none"
      >
        <path d="M -100 800 Q 400 900 1100 200" fill="none" stroke="var(--color-white)" strokeWidth="2" />
        <path d="M -100 900 Q 500 1000 1100 300" fill="none" stroke="var(--color-white)" strokeWidth="1" />
      </motion.svg>
    </div>
  );
};

const WavyLinesBackground = () => {
  return (
    <div style={{ position: 'absolute', top: '-25vh', left: 0, width: '100vw', height: '150vh', zIndex: 0, opacity: 0.5, pointerEvents: 'none', overflow: 'hidden' }}>
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 'calc(100vw + 2400px)', 
          height: '100%',
          backgroundImage: 'url(/topo.svg)',
          backgroundSize: '2400px 2400px',
          backgroundRepeat: 'repeat',
        }}
        animate={{
          x: [0, -2400]
        }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

const FullscreenMenu = ({ isOpen, setIsOpen, triggerTransition }) => {
  const location = useLocation();
  const menuVariants = {
    closed: {
      y: "-100%",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    },
    open: {
      y: "0%",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  };

  const linkVariants = {
    closed: { y: 150, rotate: 5, opacity: 0 },
    open: (i) => ({
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 + (i * 0.1) }
    }),
    exit: {
      y: 100,
      opacity: 0,
      transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
    }
  };

  const links = [
    { name: "Home", href: "/", id: 1 },
    { name: "Showcase", href: "/showcase", id: 2 },
    { name: "About Me", href: "/about", id: 3 },
    { name: "Get in touch", href: "/contact", id: 4 }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fullscreen-menu"
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          <WavyLinesBackground />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{ position: 'absolute', top: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', justifyContent: 'center', zIndex: 90, pointerEvents: 'none' }}
          >
            <img src="/logo.svg?v=2" alt="Ahmad Scales Logo" style={{ width: '70px', height: 'auto', objectFit: 'contain', filter: 'brightness(0)' }} />
          </motion.div>
          <div className="menu-inner container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="menu-header" style={{ minHeight: '64px' }}>
              {/* Navbar is fixed on top with z-index 10000, so we just leave space here */}
            </div>
            
            <div className="menu-links-container">
              {links.map((link, i) => (
                <div key={link.id} className="menu-link-wrapper">
                  <MotionLink 
                    to={link.href}
                    className="menu-link-huge"
                    variants={linkVariants}
                    custom={i}
                    initial="closed"
                    animate="open"
                    exit="exit"
                    onClick={() => {
                      if (location.pathname === link.href) {
                        if (triggerTransition) triggerTransition();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                      setIsOpen(false);
                    }}
                  >
                    <span className="menu-link-text">
                      {link.name.split('').map((char, index) => (
                        <span 
                          key={index} 
                          className="char" 
                          data-char={char === ' ' ? '\u00A0' : char}
                          style={{ transitionDelay: `${index * 0.03}s` }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))}
                    </span>
                  </MotionLink>
                </div>
              ))}
            </div>
            
            <motion.div 
              className="menu-footer-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="menu-footer-left">
                <p>Elevating E-Commerce.</p>
              </div>
              <div className="menu-footer-right">
                <a href="https://www.instagram.com/ahmadscales.co?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://www.linkedin.com/in/ahmadmalikcreative/?isSelfProfile=false" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://wa.me/923278545547" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BackToTopButton = () => {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      if (latest > 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });
  }, [scrollY]);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 50 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          style={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            zIndex: 9995,
          }}
        >
          <motion.button
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            onClick={scrollToTop}
            className="back-to-top-btn"
            style={{
              width: '65px',
              height: '65px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #eaff66, #d2ff00, #9fcc00)',
              color: 'var(--color-black)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'none',
              boxShadow: '0 15px 35px rgba(210, 255, 0, 0.3), inset 0 2px 5px rgba(255, 255, 255, 0.8), inset 0 -4px 8px rgba(0, 0, 0, 0.15)',
              outline: 'none',
              backdropFilter: 'blur(10px)',
            }}
            whileHover={{ 
              scale: 1.15, 
              rotate: 5,
              boxShadow: '0 20px 45px rgba(210, 255, 0, 0.5), inset 0 2px 5px rgba(255, 255, 255, 0.9), inset 0 -4px 8px rgba(0, 0, 0, 0.2)' 
            }}
            whileTap={{ scale: 0.9, rotate: -5 }}
          >
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ArrowUp size={30} strokeWidth={2.5} style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.2))' }} />
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Footer = ({ variant = 'default' }) => {
  if (variant === 'contact') {
    return (
      <footer id="footer" className="footer-executive">
        <div className="footer-executive-laser" />
        <div className="container footer-executive-container">
          <div className="footer-executive-grid">
            <div className="footer-executive-brand">
              <div className="footer-executive-logo">AHMAD MALIK</div>
              <p className="footer-executive-tagline">
                High-Impact E-Commerce Visuals, Amazon Brand Storytelling & Premium Creative Direction.
              </p>
              <div className="footer-executive-badge">
                <span className="contact-pulse-circle" style={{ width: '8px', height: '8px' }} />
                <span>AVAILABLE FOR Q2/Q3 COMMISSIONS</span>
              </div>
            </div>

            <div className="footer-executive-col">
              <span className="footer-executive-col-title">NAVIGATION</span>
              <div className="footer-executive-links">
                <Link to="/">Home</Link>
                <Link to="/showcase">Showcase</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Get in touch</Link>
              </div>
            </div>

            <div className="footer-executive-col">
              <span className="footer-executive-col-title">CONNECT</span>
              <div className="footer-executive-links">
                <a href="https://www.instagram.com/ahmadscales.co/" target="_blank" rel="noopener noreferrer">
                  <span>Instagram</span>
                  <ArrowUpRight size={14} />
                </a>
                <a href="https://www.linkedin.com/in/ahmadmalikcreative/" target="_blank" rel="noopener noreferrer">
                  <span>LinkedIn</span>
                  <ArrowUpRight size={14} />
                </a>
                <a href="https://wa.me/923278545547?text=Hi%20Ahmad%2C%20I%20saw%20your%20portfolio%20and%20I%27m%20interested%20in%20working%20with%20you!" target="_blank" rel="noopener noreferrer">
                  <span>WhatsApp</span>
                  <ArrowUpRight size={14} />
                </a>
                <a href="https://calendly.com/ahmadmalik1/creative-visuals-discussion" target="_blank" rel="noopener noreferrer">
                  <span>Calendly</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            <div className="footer-executive-col footer-executive-direct-col">
              <span className="footer-executive-col-title">DIRECT INBOX</span>
              <a href="mailto:ahmadmalikcreative@gmail.com" className="footer-executive-email-link">
                <Mail size={16} />
                <span>ahmadmalikcreative@gmail.com</span>
              </a>
              <div className="footer-executive-meta-row">
                <MapPin size={15} />
                <span>Lahore, Pakistan • PKT (GMT+5)</span>
              </div>
            </div>
          </div>

          <div className="footer-executive-divider" />

          <div className="footer-executive-bottom">
            <div className="footer-executive-copyright">
              © {new Date().getFullYear()} Ahmad Malik. All rights reserved. Crafted for visual excellence.
            </div>
            <button 
              type="button" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="footer-executive-backtotop"
              aria-label="Back to top"
            >
              <span>BACK TO TOP</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer id="footer" className="footer">
      <div className="container">
        <motion.div 
          className="footer-huge-text"
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          LET'S TALK
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ 
            fontSize: '1.3rem', 
            color: 'var(--color-black)', 
            maxWidth: '700px', 
            margin: '0 auto 5rem auto',
            lineHeight: '1.6',
            textAlign: 'center',
            fontFamily: '"Bricolage Grotesque", sans-serif'
          }}
        >
          Ready to elevate your brand's visual identity? Get in touch to discuss how we can collaborate to create high-converting A+ content, engaging Amazon storefronts, and premium product designs tailored perfectly for your audience.
        </motion.p>

        <motion.div 
          className="footer-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', paddingBottom: '2rem' }}
        >
          <div className="footer-links" style={{ display: 'flex', gap: '2rem', fontWeight: 600, fontSize: '1.25rem' }}>
            <a href="https://www.instagram.com/ahmadscales.co/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.linkedin.com/in/ahmadmalikcreative/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://wa.me/923278545547?text=Hi%20Ahmad%2C%20I%20saw%20your%20portfolio%20and%20I%27m%20interested%20in%20working%20with%20you!" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontWeight: 600, fontSize: '1.25rem' }}>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=hello@ahmadscales.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = 0.7} onMouseLeave={(e) => e.currentTarget.style.opacity = 1}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                hello@ahmadscales.com
              </a>
              <a href="https://calendly.com/ahmadmalik1/creative-visuals-discussion" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '54px', height: '54px', borderRadius: '50%', border: '2.5px solid currentColor', color: 'inherit', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-black)'; e.currentTarget.style.color = 'var(--color-lime)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'inherit'; }} title="Book a call on Calendly">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </a>
            </div>
            <div style={{ fontWeight: 500, fontSize: '1rem' }}>© {new Date().getFullYear()} All Rights Reserved</div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

function Home() {
  const lenis = useLenis();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });
  
  // Parallax values for Hero
  const yBg = useTransform(smoothProgress, [0, 1], [0, 800]);
  const yTitle = useTransform(smoothProgress, [0, 1], [0, 300]);
  const opacityTitle = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  // Floating animation for objects
  const floatAnim = {
    y: ["-10px", "10px"],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  const stats = [
    { number: "300+", label: "Listing Images" },
    { number: "200+", label: "Enhanced Brand Content" },
    { number: "100%", label: "Client Satisfaction" },
  ];

  const portfolio = [
    { 
      id: 1, 
      title: "Casidor Supplements", 
      desc: "Premium AM/PM System A+ Content. Designed to highlight morning energy and nighttime restoration through clean, sophisticated layouts.", 
      img: "/casidor.jpg.jpg" 
    },
    { 
      id: 2, 
      title: "Love+Chew Cookies", 
      desc: "Thoughtful Snacking A+ Design. Engaging, vibrant visuals showcasing the female-founded superfood cookie break.", 
      img: "/love-chew.jpg.jpg" 
    },
    {
      id: "text-1",
      isText: true,
      title: "Built for clicks. Designed for conversions.",
      desc: "Every pixel is carefully crafted to hold attention and drive high-intent shoppers to checkout. Premium aesthetics meet performance-driven layouts."
    },
    { 
      id: 3, 
      title: "Barrett Recovery CALMg", 
      desc: "Holistic Sleep Support A+ Content. High-end, calming design emphasizing night-time recovery and a premium 7-form magnesium formula.", 
      img: "/barrett-recovery.png" 
    },
    { 
      id: 4, 
      title: "TANRI Active Wipes", 
      desc: "On-the-go Freshness A+ Design. Clean, outdoorsy visuals highlighting natural ingredients and instant refresh for active lifestyles.", 
      img: "/wipes-aplus.png" 
    }
  ];

  const storefrontItems = [
    {
      id: 1,
      title: "Home Page",
      desc: "Ancient Diosa Homepage. A clean, high-end wellness storefront design highlighting 'Ancient Wisdom | Modern Wellness' for premium supplements.",
      img: "/ancient-home.jpg"
    },
    {
      id: 2,
      title: "Yerba Thé Mint",
      desc: "High-converting Product Page for Yerba Thé Mint. Showcasing 'Refresh Your Mind & Body' with vibrant, clean lifestyle imagery and natural ingredient highlights.",
      img: "/ancient-product1.jpg"
    },
    {
      id: "text-2",
      isText: true,
      title: "Elevating the Amazon Experience",
      desc: "Ahmad Malik turns standard product listings into immersive, high-budget shopping experiences that immediately build brand trust and skyrocket conversion rates."
    },
    {
      id: 3,
      title: "Berberine+ Detox",
      desc: "Premium Amazon Product Page for Berberine+. Highlighting 'Boost Your Metabolism Naturally' with striking contrasts and science-driven wellness details.",
      img: "/ancient-product4.jpg"
    },
    {
      id: 4,
      title: "Organ Nutrition",
      desc: "Clean and vibrant Product Page for Pure Organ Nutrition. Emphasizing 'Daily Support for Energy and Digestion' with modern typography and sleek visuals.",
      img: "/ancient-product3.jpg"
    },
    {
      id: 5,
      title: "Mushroom Coffee",
      desc: "Immersive Product Page layout for Mushroom Coffee with Collagen. Highlighting 'Stay Alert & Focused' with rich, earthy tones and premium feature callouts.",
      img: "/ancient-product2.jpg"
    }
  ];

  const listingImages = [
    "/listing-1.jpg.jpg",
    "/listing-2.jpg.jpg",
    "/new-listing-1.jpg",
    "/new-listing-2.jpg",
    "/listing-4.jpg.jpg",
    "/listing-5.jpg.jpg"
  ];

  const listingImagesRow2 = [
    "/new-listing-3.jpg",
    "/listing-6.jpg.jpg",
    "/listing-7.jpg.png",
    "/listing-8.jpg.png",
    "/listing-9.jpg.png",
    "/listing-10.jpg.png"
  ];

  return (
    <div className="home-page" style={{ position: 'relative', zIndex: 1 }}>
      {/* Hero Section */}
      <section className="hero">
        <motion.div className="hero-bg-text" style={{ y: yBg }}>
          DESIGNER
        </motion.div>
        
        <div className="container">
          <motion.div className="hero-content" style={{ y: yTitle, opacity: opacityTitle, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '4rem', textAlign: 'left', flexDirection: 'row', width: '100%' }}>
            
            {/* Left Column: Text */}
            <div style={{ flex: '1 1 450px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              
              <h1 className="hero-title-main" style={{ textAlign: 'left', margin: '0 0 1rem 0' }}>
                <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
                  <motion.div
                    initial={{ y: "110%", rotate: 2 }}
                    animate={{ y: "0%", rotate: 0 }}
                    transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
                    style={{ transformOrigin: 'left bottom' }}
                  >
                    <span className="hero-name-mask">AHMAD</span>
                  </motion.div>
                </div>
                <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
                  <motion.div
                    initial={{ y: "110%", rotate: 2 }}
                    animate={{ y: "0%", rotate: 0 }}
                    transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.22 }}
                    style={{ transformOrigin: 'left bottom' }}
                  >
                    MALIK
                  </motion.div>
                </div>
              </h1>
              
              <div className="hero-subtitle" style={{ justifyContent: 'flex-start', margin: '0', textAlign: 'left' }}>
                <RevealText text="E-Commerce Creative Designer" delay={0.28} triggerOnce={true} />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '2.5rem', mixBlendMode: 'lighten' }}
              >
                <img src="/logo1.png" alt="Amazon Logo" loading="lazy" decoding="async" style={{ width: '45px', height: '45px', objectFit: 'contain', opacity: 0.9 }} />
                <div style={{ width: '1px', height: '30px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
                <img src="/logo2.png" alt="Shopify Logo" loading="lazy" decoding="async" style={{ width: '45px', height: '45px', objectFit: 'contain', opacity: 0.9 }} />
                <div style={{ width: '1px', height: '30px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
                <img src="/logo3.png" alt="TikTok Logo" loading="lazy" decoding="async" style={{ width: '45px', height: '45px', objectFit: 'contain', opacity: 0.9 }} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.46, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginTop: '2.5rem' }}
              >
                <a 
                  href="#portfolio" 
                  className="btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    if (lenis) {
                      lenis.scrollTo('#portfolio', { offset: 0, duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                    } else {
                      document.querySelector('#portfolio').scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  View Projects <ArrowRight />
                </a>
              </motion.div>
            </div>

            {/* Right Column: Portrait and Description */}
            <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', padding: '1rem 0', transform: 'translateY(-1rem)' }}>
              
              <motion.div 
                initial={{ opacity: 0, clipPath: 'inset(100% -50% -50% -50%)', y: 50 }}
                animate={{ opacity: 1, clipPath: 'inset(-50% -50% -50% -50%)', y: 0 }}
                transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                style={{ position: 'relative', width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'center' }}
              >
                {/* Cinematic Glow Behind Photo */}
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '130%', height: '130%', background: 'radial-gradient(circle, var(--color-lime) 0%, transparent 65%)', filter: 'blur(80px)', zIndex: 0 }}
                />
                
                {/* Massive Portrait Container */}
                <div style={{ position: 'relative', zIndex: 1, borderRadius: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 40px rgba(210,255,0,0.2)', width: '100%', backgroundColor: '#000' }}>
                  <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '32px', overflow: 'hidden', clipPath: 'inset(0 round 32px)', WebkitClipPath: 'inset(0 round 32px)' }}>
                    <motion.img 
                      src="/ahmad-malik.jpg" 
                      alt="Ahmad Malik" 
                      loading="eager"
                      decoding="async"
                      initial={{ scale: 1.15 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                      style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', filter: 'contrast(1.1) brightness(0.95) saturate(1.05)', borderRadius: '32px' }} 
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)', pointerEvents: 'none', zIndex: 2, borderRadius: '0 0 32px 32px' }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg, rgba(210,255,0,0.05) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 3, borderRadius: '32px' }} />
                  </div>
                </div>
              </motion.div>

              {/* Classy High-Budget Description */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
                style={{ 
                  marginTop: '2.5rem', 
                  maxWidth: '500px', 
                  borderLeft: '2px solid var(--color-lime)', 
                  paddingLeft: '1.5rem',
                  alignSelf: 'center',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <p style={{ fontSize: '1.25rem', color: 'var(--color-grey)', lineHeight: 1.6, margin: 0, fontWeight: 300, fontFamily: '"Bricolage Grotesque", sans-serif' }}>
                  Specializing in premium visual strategy. I transform standard product pages into <span style={{ color: 'var(--color-white)', fontWeight: 500 }}>immersive, high-converting</span> shopping experiences that dominate the search results.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="stats-section">
        <div className="container">
          <div className="section-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem', marginBottom: '4rem' }}>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
              <RevealText text="The Numbers" />
            </h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2, margin: "0px" }}
              transition={{ duration: 0.8 }}
              style={{ color: 'var(--color-grey)', maxWidth: '600px', fontSize: '1.25rem', textAlign: 'center', lineHeight: '1.6' }}
            >
              Built for clicks. Designed for conversions. Driving results across Amazon, Shopify & TikTok Shop.
            </motion.p>
          </div>
          
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <motion.div 
                className="stat-card"
                key={i}
                initial={{ opacity: 0, y: 80, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2, margin: "0px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div 
                  className="stat-number"
                  animate={floatAnim}
                  style={{ y: floatAnim.y }}
                >
                  {stat.number}
                </motion.div>
                <motion.div 
                  className="stat-label"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.8, delay: 0.4 + (i * 0.1) }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-wrapper">
        <div className="marquee-content">
          {Array(2).fill([
            "Amazon Creative", "Shopify Design", "TikTok Shop", "A+ Content", "Listing Images"
          ]).flat().map((item, i) => (
            <div className="marquee-item" key={i}>{item}</div>
          ))}
        </div>
      </div>

      {/* Listing Images Section */}
      <section className="listing-images-section" id="listings">
        <div className="container">
          <div className="section-header" style={{ padding: '0 2rem', display: 'flex', justifyContent: 'center', textAlign: 'center', overflow: 'visible', marginBottom: '4rem' }}>
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ 
                fontSize: 'clamp(2rem, 4vw, 4.5rem)', 
                letterSpacing: '-0.02em',
                lineHeight: '1.1', 
                color: 'var(--color-white)',
                textShadow: '0 0 40px rgba(210, 255, 0, 0.4), 0 0 80px rgba(210, 255, 0, 0.2)',
                fontFamily: '"Bricolage Grotesque", sans-serif',
                textTransform: 'uppercase',
                margin: 0
              }}
            >
              Some of the Listing Images <br/> I Designed
            </motion.h2>
          </div>
        </div>
        
        <div className="listing-carousel-wrapper">
          <motion.div 
            className="listing-carousel-track"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
          >
            {[...listingImages, ...listingImages].map((img, i) => (
              <div className="listing-carousel-item" key={i}>
                <img src={img} alt={`Listing design showcase ${i}`} />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="listing-carousel-wrapper" style={{ marginTop: '2rem' }}>
          <motion.div 
            className="listing-carousel-track"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 18 }}
          >
            {[...listingImagesRow2, ...listingImagesRow2].map((img, i) => (
              <div className="listing-carousel-item" key={i}>
                <img src={img} alt={`Listing design showcase row 2 ${i}`} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vertical Scroll Portfolio Section */}
      <VerticalGallery 
        id="portfolio"
        items={portfolio} 
        titleNode={
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 6rem)', 
              letterSpacing: '-0.03em',
              lineHeight: '1.1', 
              color: 'var(--color-white)',
              textShadow: '0 0 40px rgba(210, 255, 0, 0.4), 0 0 80px rgba(210, 255, 0, 0.2)',
              fontFamily: '"Bricolage Grotesque", sans-serif',
              textTransform: 'uppercase',
              margin: 0
            }}
          >
            Featured A+ Designs <br/> By Me
          </motion.h2>
        }
      />

      <VerticalGallery 
        id="storefront"
        items={storefrontItems} 
        titleNode={
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 6rem)', 
              letterSpacing: '-0.03em',
              lineHeight: '1.1', 
              color: 'var(--color-white)',
              textShadow: '0 0 40px rgba(210, 255, 0, 0.4), 0 0 80px rgba(210, 255, 0, 0.2)',
              fontFamily: '"Bricolage Grotesque", sans-serif',
              textTransform: 'uppercase',
              margin: 0
            }}
          >
            Storefront
          </motion.h2>
        }
      />

      {/* View More Work Transition Section */}
      <section style={{ padding: '2rem 0 4rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Link 
            to="/showcase"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.2rem',
              padding: '1.2rem 4rem',
              borderRadius: '100px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--color-white)',
              textDecoration: 'none',
              fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
              fontWeight: 500,
              fontFamily: '"Bricolage Grotesque", sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              transformOrigin: 'center',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
              e.currentTarget.style.backgroundColor = 'rgba(210, 255, 0, 0.1)';
              e.currentTarget.style.border = '1px solid rgba(210, 255, 0, 0.4)';
              e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.5), 0 0 30px rgba(210, 255, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.2)';
              e.currentTarget.style.color = 'var(--color-lime)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'var(--color-white)';
            }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          >
            <span style={{ lineHeight: 1, paddingTop: '2px' }}>View more of my work</span>
            <motion.div 
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ArrowRight size={24} strokeWidth={2} />
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Client Feedback Section */}
      <section id="feedback" className="feedback-section">
        <div className="container">
          <div className="section-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem' }}>
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ 
                fontSize: 'clamp(3rem, 6vw, 6rem)', 
                lineHeight: '1.1', 
                color: 'var(--color-white)',
                textShadow: '0 0 40px rgba(210, 255, 0, 0.4), 0 0 80px rgba(210, 255, 0, 0.2)',
                fontFamily: '"Bricolage Grotesque", sans-serif',
                textTransform: 'uppercase',
                margin: '0 0 1.5rem 0'
              }}
            >
              Client Love
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ color: 'var(--color-grey)', maxWidth: '800px', fontSize: '1.5rem', textAlign: 'center', fontFamily: '"Bricolage Grotesque", sans-serif' }}
            >
              Don't just take our word for it. Here's what our partners have to say.
            </motion.p>
          </div>

          <div className="feedback-grid">
            {/* Video Container */}
            <motion.div 
              className="feedback-video-wrapper"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <div className="feedback-video-container">
                <video 
                  src="/client-review.mp4.mp4" 
                  controls 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className="review-author" style={{ paddingLeft: '1rem' }}>
                <h4>Robbie Paterson</h4>
                <p>Chief Marketing Officer (CMO), Konsort Social</p>
              </div>
            </motion.div>

            {/* Screenshots Container */}
            <motion.div 
              className="feedback-screenshots"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="screenshot-item">
                <div className="review-card">
                  <p className="review-text">"Used Ahmad for 2 projects, he is responsive, creative, understands expectations, has great ideas and can produce a great quality end product that genuinely elevates the brand. He delivered the Amazon listing images ahead of schedule, and the A+ content looks incredible. Highly recommended!"</p>
                  <div className="review-author">
                    <div className="review-stars" style={{ marginBottom: '0.5rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="var(--color-lime)" stroke="var(--color-lime)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      ))}
                    </div>
                    <h4>Pamela</h4>
                    <p>Amazon Brand Owner</p>
                  </div>
                </div>
              </div>
              <div className="screenshot-item">
                <div className="review-card">
                  <p className="review-text">"Understood the brief fully. Super customised graphic work on Photoshop and will be using Ahmad for the foreseeable future. Thanks again for making the entire process so seamless. The lifestyle images and infographics are exactly what we needed to make our product stand out against the competition. Great communication and a phenomenal final result."</p>
                  <div className="review-author">
                    <div className="review-stars" style={{ marginBottom: '0.5rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="var(--color-lime)" stroke="var(--color-lime)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      ))}
                    </div>
                    <h4>Kin Hussein</h4>
                    <p>Amazon Brand Owner</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="brands-section" style={{ padding: '8rem 0 2rem 0', backgroundColor: 'var(--color-black)', overflow: 'hidden' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2 style={{ 
              fontSize: '2rem', 
              color: 'var(--color-white)', 
              fontFamily: '"Bricolage Grotesque", sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              Brands I've Worked With
            </h2>
          </motion.div>
        </div>
        
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', display: 'flex' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '150px', height: '100%', background: 'linear-gradient(to right, var(--color-black), transparent)', zIndex: 2 }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '100%', background: 'linear-gradient(to left, var(--color-black), transparent)', zIndex: 2 }} />
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
            style={{ display: 'flex', gap: '8rem', width: 'max-content', padding: '0 4rem', alignItems: 'center' }}
          >
            {[
              "/ox.png.png", "/taxzap.png.png", "/boom-beauty.png.png", "/strands-of-faith.png.png",
              "/true-classic.png.png.png", "/natpat.png.png.png", "/tanri.png.png.png", "/seedsheet.png.png.png", "/celzo.png.png.png",
              "/ox.png.png", "/taxzap.png.png", "/boom-beauty.png.png", "/strands-of-faith.png.png",
              "/true-classic.png.png.png", "/natpat.png.png.png", "/tanri.png.png.png", "/seedsheet.png.png.png", "/celzo.png.png.png"
            ].map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt="Brand Logo" 
                className="brand-logo-img"
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Agencies Section */}
      <section className="agencies-section" style={{ padding: '2rem 0 8rem 0', backgroundColor: 'var(--color-black)' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{ 
              fontSize: '2rem', 
              color: 'var(--color-white)', 
              textShadow: '0 0 30px rgba(210, 255, 0, 0.4), 0 0 60px rgba(210, 255, 0, 0.2)',
              fontFamily: '"Bricolage Grotesque", sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              Agencies i have worked with
            </h2>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '2rem',
            alignItems: 'stretch'
          }}>
            {[
              { name: "Advance Amazon Agency", role: "Amazon Creative Designer", img: "/agency-1.png.jpg" },
              { name: "Konsort Social", role: "TikTok Shop Creative Designer", img: "/agency-2.png.jpg" },
              { name: "Selliqa", role: "Senior Graphics Designer", img: "/agency-3.png.jpg" },
              { name: "creatiWOW", role: "Senior Graphics Designer", img: "/agency-4.png.jpg" },
              { name: "Sellonics", role: "Amazon & Tiktok Creative Designer", img: "/sellonics.jpg" }
            ].map((agency, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  padding: '2rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ height: '80px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', overflow: 'hidden' }}>
                  <img src={agency.img} alt={agency.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-lime)', marginBottom: '0.5rem', fontFamily: '"Bricolage Grotesque", sans-serif' }}>{agency.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-grey)', lineHeight: '1.4' }}>{agency.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <BackToTopButton />
    </div>
  );
}

const StorefrontImageCard = ({ src, alt }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax the entire card to avoid cropping the image content
  const cardY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <motion.div 
      ref={ref}
      style={{ y: cardY }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          borderRadius: '16px', 
          overflow: 'hidden', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
          position: 'relative',
          background: 'var(--color-black)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
        whileHover="hover"
      >
        <motion.div 
          variants={{
            hover: { scale: 1.04, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
          }}
          style={{ width: '100%', height: '100%', transformOrigin: 'center center' }}
        >
          <img 
            src={src} 
            alt={alt} 
            loading="lazy"
            decoding="async"
            style={{ width: '100%', display: 'block', objectFit: 'contain' }} 
          />
        </motion.div>
        
        {/* Subtle gradient overlay to make it look premium and blend with the dark mode */}
        <motion.div 
          variants={{
            hover: { opacity: 0 }
          }}
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.3) 100%)',
            pointerEvents: 'none',
            transition: 'opacity 0.6s ease'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const StorefrontText = ({ title, desc }) => (
  <motion.div 
    initial={{ opacity: 0, y: 35 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    style={{ textAlign: 'center', marginTop: '1.5rem' }}
  >
    {title && (
      <p style={{ color: 'var(--color-lime)', fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 600, margin: '0 0 1rem 0', letterSpacing: '-0.02em', textTransform: 'capitalize' }}>
        {title}
      </p>
    )}
    <p style={{ color: 'var(--color-grey)', fontSize: '1.45rem', lineHeight: 1.6, maxWidth: '95%', margin: '0 auto', fontWeight: 300 }}>
      {desc}
    </p>
  </motion.div>
);

// Standalone StackingCard component adhering strictly to React Rules of Hooks
const StackingCard = ({ card, i, total, scrollYProgress }) => {
  const start = i === 0 ? 0 : i / (total - 1);
  const end = (i + 1) / (total - 1);
  const holdPoint = start + ((end - start) * 0.75);

  const scale = useTransform(scrollYProgress, [start, holdPoint, end], [1, 1, 0.94]);
  const opacity = useTransform(scrollYProgress, [start, holdPoint, end], [1, 1, 0.35]);
  const y = useTransform(scrollYProgress, [start, holdPoint, end], ["0vh", "0vh", "-6vh"]);
  const rotateX = useTransform(scrollYProgress, [start, holdPoint, end], ["0deg", "0deg", "6deg"]);

  return (
    <div 
      className="main-image-card-wrapper"
      style={{ 
        position: 'sticky', 
        top: '15vh', 
        height: '75vh', 
        marginBottom: i === total - 1 ? '0vh' : '100vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: i,
        perspective: '1500px'
      }}
    >
      <motion.div
        className="main-image-card"
        style={{
          scale: i === total - 1 ? 1 : scale,
          opacity: i === total - 1 ? 1 : opacity,
          y: i === total - 1 ? "0vh" : y,
          rotateX: i === total - 1 ? "0deg" : rotateX,
          width: '100%',
          maxWidth: '1200px',
          height: '100%',
          background: 'linear-gradient(145deg, rgba(210, 255, 0, 0.04) 0%, rgba(210, 255, 0, 0.01) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '28px',
          border: '1px solid rgba(210, 255, 0, 0.18)',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(210,255,0,0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexWrap: 'wrap',
          transformOrigin: 'top center'
        }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{ flex: '1 1 320px', padding: 'clamp(2rem, 5vw, 4.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.h3 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', color: 'var(--color-lime)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}
          >
            {card.title}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'rgba(255,255,255,0.88)', marginTop: '1.5rem', lineHeight: 1.6, fontWeight: 300 }}
          >
            {card.subtitle}
          </motion.p>
        </div>
        <div style={{ flex: '1 1 350px', padding: 'clamp(1.5rem, 3vw, 3rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '260px' }}>
          <motion.img 
            src={card.src} 
            alt={card.title} 
            loading="lazy"
            decoding="async"
            initial={{ scale: 0.88, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.6))', position: 'relative', zIndex: 2 }} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 0.3, ease: "easeOut" }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: '60%', height: '60%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(210, 255, 0, 0.14) 0%, transparent 70%)',
              borderRadius: '50%',
              zIndex: 1
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

const MainImagesSection = () => {
  const cardsContainerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardsContainerRef,
    offset: ["start start", "end end"]
  });

  const cards = [
    { src: '/main-image-1.jpg', title: 'L-Lysine Ointment', subtitle: 'Soothing relief with Vitamins A, D, E & Cocoa Butter. A clean, clinical presentation highlighting core active ingredients.' },
    { src: '/main-image-2.jpg', title: 'Herbal Cleanse Support', subtitle: 'Supports occasional bloating and digestive comfort. Featuring botanical props to establish organic trust.' },
    { src: '/main-image-3.jpg', title: 'Aluminium Containers', subtitle: 'Heavy duty, eco-friendly, reusable containers with foil lids. Clean lighting emphasizes material quality and durability.' },
    { src: '/main-image-4.jpg', title: 'Arnica+ Recovery', subtitle: 'Relief and restore recovery support supplement. High-end lighting with natural floral elements to enhance the organic vibe.' },
    { src: '/main-image-5.jpg', title: 'Beef Liver Plus', subtitle: 'Grass-fed New Zealand beef liver dietary supplement. Earthy tones and premium badges to validate quality.' },
    { src: '/main-image-6.jpg', title: 'Vitamin D3 with K2', subtitle: 'Puredose liposomal absorption vegan friendly dietary supplement. Vibrant orange layout to command attention.' },
    { src: '/main-image-7.jpg', title: 'Soma Leaf Deodorant', subtitle: 'Aluminum-free whole body deodorant infused with bergamot & ginger. Fresh, clean aesthetics that highlight natural ingredients.' },
    { src: '/main-image-8.jpg', title: 'Glitter Paint Additive', subtitle: 'Brilliant gold sparkle effect paint additive pack. High-contrast packaging visualization emphasizing premium quality.' },
  ];

  return (
    <div style={{ position: 'relative', paddingTop: '15vh', paddingBottom: '15vh', backgroundColor: 'var(--color-black)', zIndex: 2 }}>
      
      {/* High Budget Animated Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
          
          {/* Breathing Lime Glow Background */}
          <motion.div style={{ 
            position: 'absolute', top: '50%', left: '50%', width: '100vw', height: '100vw', 
            background: 'radial-gradient(circle, rgba(210, 255, 0, 0.05) 0%, transparent 60%)', 
            borderRadius: '50%',
            x: '-50%', y: '-50%',
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.8])
          }} />

          {/* Luxury Thin Lime Architectural Lines */}
          <div style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, pointerEvents: 'none', 
            backgroundImage: 'linear-gradient(to right, var(--color-lime) 1px, transparent 1px), linear-gradient(to bottom, var(--color-lime) 1px, transparent 1px)',
            backgroundSize: '15vw 15vh'
          }} />

          {/* Massive background typography */}
          <motion.div 
            style={{ 
              position: 'absolute', top: '30%', left: 0, width: '200%', whiteSpace: 'nowrap', opacity: 0.02,
              x: useTransform(scrollYProgress, [0, 1], ["-10%", "-50%"])
            }}
          >
            <h1 style={{ fontSize: '25vw', fontFamily: 'var(--font-heading)', margin: 0, lineHeight: 0.8, color: 'var(--color-white)' }}>HERO IMAGES</h1>
          </motion.div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '15vh', position: 'relative', zIndex: 1 }}>
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', color: 'var(--color-white)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}
        >
          Main Images
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', color: 'var(--color-grey)', maxWidth: '700px', margin: '1.5rem auto 0', lineHeight: 1.6, padding: '0 1rem' }}
        >
          High-conversion hero images that establish immediate trust and clarity on the Amazon search page.
        </motion.p>
      </div>

      <div ref={cardsContainerRef} style={{ position: 'relative', padding: '0 5vw', paddingBottom: '10vh', zIndex: 1 }}>
        {cards.map((card, i) => (
          <StackingCard 
            key={i} 
            card={card} 
            i={i} 
            total={cards.length} 
            scrollYProgress={scrollYProgress} 
          />
        ))}
      </div>
    </div>
  );
};


const Highlight = ({ children }) => (
  <span style={{ color: 'var(--color-lime)', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.01em' }}>
    {children}
  </span>
);

const AnimatedListingItem = ({ src, alt }) => (
  <motion.div 
    className="listing-item"
    initial={{ opacity: 0, y: 60, scale: 0.96 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
  >
    <img src={src} alt={alt} loading="lazy" decoding="async" />
  </motion.div>
);

const AnimatedPhraseBlock = ({ children }) => (
  <motion.div 
    className="listing-phrase-block"
    initial={{ opacity: 0, scale: 0.92 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
  >
    <h3 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', color: 'var(--color-white)', textAlign: 'center', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.25 }}>
      {children}
    </h3>
  </motion.div>
);

function Showcase() {
  const aplusItems = [
    { id: 1, title: 'Ancient Crown', desc: <>Ancestral wisdom for the modern woman. Featuring <Highlight>high-converting typography</Highlight> and cohesive brand colors that emphasize the product's natural origins.</>, src: '/ancient-crown-aplus.jpg' },
    { id: 2, title: 'Beef Liver Plus', desc: <>Clean, simple, <Highlight>whole-food nutrition</Highlight> layout. Leveraging rich green tones and lifestyle imagery to establish premium trust.</>, src: '/beef-liver-aplus.jpg' },
    { id: 3, title: 'Strength Protocol', desc: <>Dark mode <Highlight>athletic performance</Highlight> design. High-contrast typography and dramatic shadows for an intense, masculine aesthetic.</>, src: '/strength-protocol-aplus.jpg' },
    { id: 4, title: 'Compact EDC Knife', desc: <>Tough, rugged, and <Highlight>hand-sharpened details</Highlight>. Focused on material breakdown and high-quality macro shots of the Damascus steel.</>, src: '/edc-knife-aplus.jpg' },
    { id: 5, title: 'Inspector Crumb', desc: <>Playful and <Highlight>craving-inducing</Highlight> brand layout. Designed with warm tones and mouth-watering broken-cookie highlights.</>, src: '/inspector-crumb-aplus.jpg' },
    { id: 6, title: 'Soleze', desc: <>Cooling and <Highlight>refreshing layout</Highlight> for prickly heat treatment. Utilizing bright, beach-inspired aesthetics and clean ingredient iconography.</>, src: '/soleze-aplus.jpg' },
    { id: 7, title: 'Tick Patrol', desc: <><Highlight>Pet-friendly</Highlight> and approachable design for an essential tool. Combining earthy greens with warm tones to emphasize safety and reliability.</>, src: '/tick-patrol-aplus.jpg' },
    { id: 8, title: 'Fingersafe', desc: <>Trust-building <Highlight>commercial safety</Highlight> product layout. Using bold, clear instructional graphics and emotional lifestyle imagery to highlight protection.</>, src: '/fingersafe-aplus.jpg' },
    { id: 9, title: 'Body C.E.O. Magnesium', desc: <>Clinical yet <Highlight>calming wellness</Highlight> design. Featuring cool teal gradients and structured comparison tables to communicate premium quality.</>, src: '/body-ceo-magnesium-aplus.jpg' },
    { id: 10, title: 'True Classic', desc: <>Minimalist, <Highlight>high-end apparel</Highlight> showcase. Focused on fit, comfort, and direct comparison to establish an unmatched value proposition.</>, src: '/true-classic-aplus.jpg' },
  ];

  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Configuration for the carousel spacing
  const itemWidthVW = isMobile ? 88 : 75; // Width of each item
  const gapVW = isMobile ? 4 : 0.5; // Gap between items
  const paddingSideVW = (100 - itemWidthVW) / 2; // Padding to center the first and last item
  
  // Total width of the scrolling track
  const totalWidthVW = (aplusItems.length * itemWidthVW) + ((aplusItems.length - 1) * gapVW) + (paddingSideVW * 2);
  
  // How much we need to translate to reach the end
  const scrollEndVW = totalWidthVW - 100;
  const scrollEndPercent = (scrollEndVW / totalWidthVW) * 100;

  // Maps 0-1 vertical scroll progress into 0 to -X% horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${scrollEndPercent}%`]);

  return (
    <div className="page" style={{ position: 'relative', zIndex: 1 }}>
      {/* Listing Images Section */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: '15vh', paddingBottom: '20vh' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '8rem', textAlign: 'center' }}
          >
            <h1 style={{ color: 'var(--color-lime)', fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', lineHeight: 1 }}>Listing Images</h1>
            <p style={{ color: 'var(--color-grey)', fontSize: '1.3rem', maxWidth: '600px', margin: '1.5rem auto 0', lineHeight: 1.5 }}>
              Thumb-stopping gallery images designed to drive clicks and dominate the search results.
            </p>
          </motion.div>

          <div className="listing-grid">
             <AnimatedListingItem src="/listing-sparkle.jpg" alt="Sparkle Paint" />
             <AnimatedListingItem src="/listing-hydration.jpg" alt="Hydration" />
             <AnimatedListingItem src="/listing-purality.jpg" alt="Purality Health" />
             
             <AnimatedPhraseBlock>
                 "Design that doesn't just look good, <br/>
                 <span style={{ color: 'var(--color-lime)', fontStyle: 'normal', fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase', fontSize: '1.2em' }}>
                   it sells.
                 </span>"
             </AnimatedPhraseBlock>
             
             <AnimatedListingItem src="/listing-beefliver-1.jpg" alt="Beef Liver" />
             <AnimatedListingItem src="/listing-beefliver-2.jpg" alt="Beef Liver Energy" />
             <AnimatedListingItem src="/listing-plantmagic-1.jpg" alt="Organic Plant Magic Non-Toxic" />
             
             <AnimatedListingItem src="/listing-magnesium-routine.jpg" alt="Magnesium 9 Routine" />
             <AnimatedListingItem src="/listing-plantmagic-2.jpg" alt="Organic Plant Magic Gentle" />
             <AnimatedListingItem src="/listing-casidor-facts.jpg" alt="Casidor Supplement Facts" />
             
             <AnimatedListingItem src="/listing-pour-power.jpg" alt="Pour Power Proceed" />
             
             <AnimatedListingItem src="/showcase-water-bottle.jpg" alt="Water Bottle Showcase" />
             <AnimatedListingItem src="/showcase-yerba-mate.jpg" alt="Yerba Mate Showcase" />
             
             <AnimatedPhraseBlock>
                 "Stopping the scroll is just step one. <br/>
                 <span style={{ color: 'var(--color-lime)', fontStyle: 'normal', fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase', fontSize: '1.2em' }}>
                   Converting the click is the masterpiece.
                 </span>"
             </AnimatedPhraseBlock>

             <AnimatedListingItem src="/showcase-toolbelt.jpg" alt="Toolbelt Showcase" />
             <AnimatedListingItem src="/showcase-plus-size.jpg" alt="Plus Size Dress Showcase" />
             <AnimatedListingItem src="/showcase-seed-review.jpg" alt="Seedsheet Review Showcase" />
             <AnimatedListingItem src="/showcase-seed-map.jpg" alt="Seedsheet Map Showcase" />

             <AnimatedListingItem src="/showcase-taxzap-1.jpg" alt="TaxZap Showcase 1" />
             <AnimatedListingItem src="/showcase-taxzap-2.jpg" alt="TaxZap Showcase 2" />
             <AnimatedListingItem src="/showcase-pyur-bottle.jpg" alt="Pyur Bottle Showcase" />
             <AnimatedListingItem src="/showcase-pyur-mask.jpg" alt="Pyur Mask Showcase" />
             <AnimatedListingItem src="/showcase-blessties.jpg" alt="Blessties Reviews Showcase" />
          </div>
        </div>
      </div>

      {/* Intro section just scrolls naturally */}
      <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'flex-end', paddingBottom: '5rem', paddingTop: '15vh' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 style={{ color: 'var(--color-lime)', fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', lineHeight: 1 }}>A+ Content</h1>
            <p style={{ color: 'var(--color-grey)', fontSize: '1.3rem', maxWidth: '600px', marginTop: '1.5rem', lineHeight: 1.5 }}>
              A curated showcase of premium, high-converting Amazon A+ content designs. Scroll down to explore.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Pinned Horizontal Scroll Section */}
      <section ref={targetRef} style={{ height: `${aplusItems.length * 100}vh`, position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <motion.div 
            style={{ 
              x, 
              display: 'flex', 
              gap: `${gapVW}vw`,
              width: `${totalWidthVW}vw`, 
              height: '100%',
              padding: `0 ${paddingSideVW}vw`
            }}
          >
            {aplusItems.map((item) => (
              <div 
                key={item.id} 
                className="aplus-carousel-item"
                style={{ 
                  width: `${itemWidthVW}vw`, 
                  height: '100%', 
                  flexShrink: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '2rem 0'
                }}
              >
                <div className="aplus-carousel-card">
                  
                  <div className="aplus-carousel-text">
                    <h2 className="aplus-carousel-title">
                      {item.title}
                    </h2>
                    <p className="aplus-carousel-desc">
                      {item.desc}
                    </p>
                  </div>

                  <div className="aplus-carousel-media">
                    <img 
                      src={item.src} 
                      alt={item.title} 
                      loading="lazy"
                      decoding="async"
                      className="aplus-carousel-img"
                    />
                  </div>

                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <MainImagesSection />

      {/* Storefront Section */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: '15vh', paddingBottom: '20vh' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '8rem', textAlign: 'center' }}
          >
            <h1 style={{ color: 'var(--color-lime)', fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', lineHeight: 1 }}>Storefront</h1>
            <p style={{ color: 'var(--color-grey)', fontSize: '1.3rem', maxWidth: '600px', margin: '1.5rem auto 0', lineHeight: 1.5 }}>
              Immersive, fully-branded Amazon Storefront experiences designed to captivate shoppers and drive multi-product sales.
            </p>
          </motion.div>

          <div className="storefront-list">
            {/* Storefront 1: Hometown Knives */}
            <div style={{ marginBottom: '12rem' }}>
              <motion.h2 
                initial={{ opacity: 0, scale: 0.95, y: 35 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-white)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '5rem', textAlign: 'center', letterSpacing: '-0.02em' }}
              >
                Hometown Knives
              </motion.h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '5rem', alignItems: 'start' }}>
                {/* Home Page Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <motion.h3 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ fontSize: '1.8rem', color: 'var(--color-lime)', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.1em', margin: 0 }}
                  >
                    Home Page
                  </motion.h3>
                  
                  <StorefrontImageCard src="/storefront-hometown-home.jpg" alt="Hometown Knives Home Page" />
                  
                  <StorefrontText desc={<>A highly immersive brand home that establishes <span style={{ color: 'var(--color-lime)' }}>heritage</span> and <span style={{ color: 'var(--color-lime)' }}>authenticity</span>. Seamlessly guiding the shopper through the full knife collection with stunning lifestyle visuals and intuitive navigation.</>} />
                </div>

                {/* Product Page Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <motion.h3 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    style={{ fontSize: '1.8rem', color: 'var(--color-lime)', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.1em', margin: 0 }}
                  >
                    Product Pages
                  </motion.h3>
                  
                  {/* Product 1 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
                    <StorefrontImageCard src="/storefront-hometown-product-1.jpg" alt="Hometown Knives Product Page 1" />
                    <StorefrontText 
                      title="8-inch drop point skinner damascus hunting knife" 
                      desc="An adventurous, rugged design tailored for the outdoorsman. Tactical feature breakdowns and dynamic lifestyle scenes perfectly capture the spirit of survival and exploration." 
                    />
                  </div>

                  {/* Product 2 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <StorefrontImageCard src="/storefront-hometown-product-2.jpg" alt="Hometown Knives Product Page 2" />
                    <StorefrontText 
                      title="7-inch professional chef knife" 
                      desc="A beautifully structured layout focusing on culinary mastery and precise prep work. Rich imagery highlights versatile kitchen applications to maximize cooking confidence and conversion." 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Storefront 2: TANRI */}
            <div style={{ marginBottom: '10rem' }}>
              <motion.h2 
                initial={{ opacity: 0, scale: 0.95, y: 35 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-white)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '5rem', textAlign: 'center', letterSpacing: '-0.02em' }}
              >
                TANRI
              </motion.h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '5rem', alignItems: 'start' }}>
                {/* Home Page Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <motion.h3 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ fontSize: '1.8rem', color: 'var(--color-lime)', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.1em', margin: 0 }}
                  >
                    Home Page
                  </motion.h3>
                  
                  <StorefrontImageCard src="/storefront-tanri-home.jpg" alt="TANRI Home Page" />
                  
                  <StorefrontText desc={<>A vibrant, sun-soaked brand experience that champions <span style={{ color: 'var(--color-lime)' }}>outdoor living</span> and <span style={{ color: 'var(--color-lime)' }}>active protection</span>. Designed to seamlessly introduce the TANRI tribe and their premium skincare lineup.</>} />
                </div>

                {/* Product Page Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <motion.h3 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    style={{ fontSize: '1.8rem', color: 'var(--color-lime)', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.1em', margin: 0 }}
                  >
                    Product Pages
                  </motion.h3>
                  
                  {/* Product 1 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
                    <StorefrontImageCard src="/storefront-tanri-product-1.jpg" alt="TANRI Product Page 1" />
                    <StorefrontText 
                      title="mineral spf 30 sunscreen" 
                      desc="A hydrating, reef-safe formula offering broad-spectrum coverage without the heavy feel. Perfect for everyday outdoor adventures with lightweight tinted protection." 
                    />
                  </div>

                  {/* Product 2 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
                    <StorefrontImageCard src="/storefront-tanri-product-2.jpg" alt="TANRI Product Page 2" />
                    <StorefrontText 
                      title="spf 50+ sunscreen spray" 
                      desc="An aerosol-free, sweat-resistant spray made for miles of trekking. Quick and smooth application keeps your skin protected from the sun without harsh chemicals." 
                    />
                  </div>

                  {/* Product 3 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
                    <StorefrontImageCard src="/storefront-tanri-product-3.jpg" alt="TANRI Product Page 3" />
                    <StorefrontText 
                      title="unscented no-rinse body wipes" 
                      desc="Travel-friendly cleansing for life on the move. Instantly remove sweat and dirt during camping trips or post-workout sessions with gentle, aloe-enriched care." 
                    />
                  </div>

                  {/* Product 4 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <StorefrontImageCard src="/storefront-tanri-product-4.jpg" alt="TANRI Product Page 4" />
                    <StorefrontText 
                      title="spf 50+ sunscreen lotion" 
                      desc="Daily defense for active skin. This moisturizing, water-resistant lotion provides robust UV protection that lasts through rigorous trails and beach days alike." 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Interactive Lenis-style Brand Story Section at the very end */}
      <BrandStorySection />
      <Footer />
      <BackToTopButton />
    </div>
  );
}
const BrandStorySection = () => {
  const containerRef = useRef(null);
  
  // Track scroll for horizontal movement
  const { scrollYProgress } = useScroll({ target: containerRef });

  const brandStoryItems = [
    {
      id: 1,
      title: 'SuperCal',
      desc: 'A minimalist, high-contrast brand story emphasizing cleaner coffee routines. Striking typography and sleek composition instantly establish brand authority.',
      src: '/brand-story-supercal.jpg',
      anim: { initial: { opacity: 0, y: 150, rotateX: -20 }, whileInView: { opacity: 1, y: 0, rotateX: 0 }, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }, style: { perspective: 1000 } }
    },
    {
      id: 2,
      title: 'NE14 pets',
      desc: 'Designed for comfort and convenience. A playful yet structured narrative highlighting family-run values and specialized pet solutions.',
      src: '/brand-story-ne14pets.jpg',
      anim: { initial: { opacity: 0, scale: 0.85 }, whileInView: { opacity: 1, scale: 1 }, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
    },
    {
      id: 3,
      title: 'Superior',
      desc: 'Elevating everyday kitchen essentials. Warm, inviting imagery paired with clear, benefit-driven messaging that speaks directly to the home chef.',
      src: '/brand-story-superior.jpg',
      anim: { initial: { opacity: 0, y: -100, skewX: -15 }, whileInView: { opacity: 1, y: 0, skewX: 0 }, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
    },
    {
      id: 4,
      title: 'SOLEZE',
      desc: 'A refreshing, ocean-inspired layout designed for instant relief. Trust-building certifications and breezy visuals create a calming, confident brand presence.',
      src: '/brand-story-soleze.jpg',
      anim: { initial: { opacity: 0, y: 100, skewX: 15 }, whileInView: { opacity: 1, y: 0, skewX: 0 }, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
    },
    {
      id: 5,
      title: 'Hometown Knives',
      desc: 'Forging tradition into every detail. A rugged, premium showcase of Damascus steel, utilizing rich textures and dramatic lighting to convey generations of craftsmanship.',
      src: '/brand-story-hometown.jpg',
      anim: { initial: { opacity: 0, scale: 1.2, y: 100 }, whileInView: { opacity: 1, scale: 1, y: 0 }, transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] } }
    },
    {
      id: 6,
      title: 'IBYX',
      desc: 'A minimalist, hyper-clean aesthetic that lets the product speak for itself. Highlighting top reviews, key certifications, and a sleek Canadian craftsmanship vibe.',
      src: '/brand-story-ibyx.jpg',
      anim: { initial: { opacity: 0, rotateY: -30, x: 150 }, whileInView: { opacity: 1, rotateY: 0, x: 0 }, transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] }, style: { perspective: 1200 } }
    }
  ];

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Configuration for the carousel spacing
  const itemWidthVW = isMobile ? 86 : 60; // Width of each item
  const gapVW = isMobile ? 5 : 10;       // Gap between items
  const paddingStartVW = isMobile ? 95 : 85; // Start nearly off-screen to the right so the title is clear
  const paddingEndVW = (100 - itemWidthVW) / 2; // Center the last item
  
  const totalWidthVW = (brandStoryItems.length * itemWidthVW) + ((brandStoryItems.length - 1) * gapVW) + paddingStartVW + paddingEndVW;
  const scrollEndVW = totalWidthVW - 100;
  const scrollEndPercent = (scrollEndVW / totalWidthVW) * 100;

  // Delay horizontal movement until 15% scroll progress so the user can read the intro
  const x = useTransform(scrollYProgress, [0, 0.15, 1], ["0%", "0%", `-${scrollEndPercent}%`]);

  // Floating background elements
  const y1 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-150, 150]);

  return (
    <section 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        height: `${brandStoryItems.length * 100}vh`, // Height proportional to items for scrolling
        backgroundColor: 'transparent'
      }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        
        {/* Massive scrolling text in the background */}
        <div style={{ position: 'absolute', top: '10%', left: 0, width: '200%', whiteSpace: 'nowrap', opacity: 0.02, pointerEvents: 'none' }}>
          <motion.div style={{ x: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]), fontSize: '25vw', fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', fontFamily: 'var(--font-heading)', color: 'var(--color-white)' }}>
            BRAND STORY BRAND STORY BRAND STORY
          </motion.div>
        </div>
        <div style={{ position: 'absolute', top: '70%', left: 0, width: '200%', whiteSpace: 'nowrap', opacity: 0.02, pointerEvents: 'none' }}>
          <motion.div style={{ x: useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]), fontSize: '25vw', fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', fontFamily: 'var(--font-heading)', color: 'var(--color-lime)' }}>
            CRAFTED TRADITION CRAFTED TRADITION
          </motion.div>
        </div>

        {/* Floating animated elements scattered */}
        <motion.div style={{ y: y1, position: 'absolute', top: '20%', left: '15%', width: '150px', height: '150px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--color-lime), transparent)', opacity: 0.15, filter: 'blur(40px)' }} />
        <motion.div style={{ y: y2, position: 'absolute', top: '60%', right: '15%', width: '250px', height: '250px', borderRadius: '50%', background: 'linear-gradient(-45deg, var(--color-white), transparent)', opacity: 0.05, filter: 'blur(60px)' }} />

        {/* Massive Title pinned to the left, acting as a splash screen before scrolling in the images */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '8%', 
            y: '-50%', 
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.2, 1], [1, 1, 0, 0]), 
            scale: useTransform(scrollYProgress, [0, 0.1, 0.2, 1], [1, 1, 0.95, 0.95]), 
            zIndex: 5, 
            maxWidth: '800px',
            width: '84vw'
          }}
        >
          <h2 style={{ fontSize: 'clamp(3.5rem, 8vw, 10.5rem)', color: 'var(--color-white)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', lineHeight: 0.88, textAlign: 'left', marginBottom: '2.5rem' }}>
            Amazon <br/><span style={{ color: 'var(--color-lime)' }}>Brand Story</span>
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.6rem)', color: 'var(--color-white)', lineHeight: 1.6, fontWeight: 300, textAlign: 'left', maxWidth: '600px', borderLeft: '3px solid var(--color-lime)', paddingLeft: '1.5rem' }}>
            A powerful visual narrative that transforms your Amazon storefront. We design premium, cohesive modules that highlight your brand's unique identity, build unshakeable customer trust, and drive higher conversion rates.
          </p>
        </motion.div>

        {/* The horizontal scrolling container */}
        <motion.div 
          style={{ 
            x, 
            display: 'flex', 
            gap: `${gapVW}vw`, 
            width: `${totalWidthVW}vw`, 
            padding: `0 ${paddingEndVW}vw 0 ${paddingStartVW}vw`,
            alignItems: 'center',
            position: 'relative',
            zIndex: 10
          }}
        >
          {brandStoryItems.map((item) => (
            <motion.div
              key={item.id}
              initial={item.anim.initial}
              whileInView={item.anim.whileInView}
              viewport={{ once: false, margin: "0px" }}
              transition={item.anim.transition}
              style={{ ...item.anim.style, width: `${itemWidthVW}vw`, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
              <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <img src={item.src} alt={item.title} loading="lazy" decoding="async" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '0 1rem' }}>
                <h3 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', color: 'var(--color-lime)', marginBottom: '1rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', color: 'var(--color-white)', lineHeight: 1.6, fontWeight: 300 }}>
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const CornerReticle = ({ position = 'tl', color = 'var(--color-lime)', size = 12 }) => {
  const classNames = {
    tl: 'corner-reticle reticle-tl',
    tr: 'corner-reticle reticle-tr',
    bl: 'corner-reticle reticle-bl',
    br: 'corner-reticle reticle-br'
  };
  return (
    <div className={classNames[position] || 'corner-reticle'} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
        <path d="M6 0V12M0 6H12" stroke={color} strokeWidth="1.2" strokeLinecap="square" />
      </svg>
    </div>
  );
};

const ReticleCard = ({ children, style = {}, className = '', hover = true, ...props }) => (
  <div 
    className={`${hover ? 'luxury-card-hover' : ''} ${className}`} 
    style={{ position: 'relative', ...style }} 
    {...props}
  >
    <CornerReticle position="tl" />
    <CornerReticle position="tr" />
    <CornerReticle position="bl" />
    <CornerReticle position="br" />
    <div className="laser-edge-sweep" />
    {children}
  </div>
);

const ScrollHighlightText = ({ 
  text, 
  color = '#ffffff', 
  highlights = [], 
  highlightColor = 'var(--color-lime)', 
  delay = 0,
  fontSize = 'clamp(2.5rem, 5vw, 4.5rem)',
  lineHeight = 1.2
}) => {
  const words = text.split(" ");
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.018,
        delayChildren: delay,
      }
    }
  };

  const wordVariants = {
    hidden: { y: "130%", rotate: 4, opacity: 0 },
    visible: { 
      y: "0%", 
      rotate: 0, 
      opacity: 1, 
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const isHighlighted = (word) => {
    if (!highlights || highlights.length === 0) return false;
    const cleanWord = word.toLowerCase().replace(/[^a-z0-9-]/g, '');
    return highlights.some(h => {
      const cleanH = h.toLowerCase().replace(/[^a-z0-9-]/g, '');
      return cleanH === cleanWord || word.toLowerCase().includes(h.toLowerCase());
    });
  };

  return (
    <motion.p
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{
        margin: 0,
        fontFamily: 'var(--font-heading)',
        fontSize: fontSize,
        fontWeight: 450,
        lineHeight: lineHeight,
        letterSpacing: '-0.02em',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.28em',
        color: color,
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      {words.map((word, i) => {
        const highlighted = isHighlighted(word);
        return (
          <span key={i} style={{ display: 'inline-flex', overflow: 'hidden', paddingBottom: '0.15em', paddingTop: '0.15em', margin: '-0.15em 0' }}>
            <motion.span 
              variants={wordVariants} 
              style={{ 
                transformOrigin: 'left bottom', 
                display: 'inline-block',
                color: highlighted ? highlightColor : '#ffffff',
                fontWeight: highlighted ? 650 : 450,
                textShadow: highlighted 
                  ? '0 0 25px rgba(210, 255, 0, 0.45)' 
                  : '0 10px 30px rgba(0, 0, 0, 0.5)',
                transition: 'color 0.3s ease'
              }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </motion.p>
  );
};

function About() {
  const containerRef = useRef(null);
  const portraitSectionRef = useRef(null);

  // Parallax tracking inspired by landonorris.com camera depth
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: portraitScrollProgress } = useScroll({
    target: portraitSectionRef,
    offset: ["start end", "end start"]
  });

  const smoothPortraitProgress = useSpring(portraitScrollProgress, {
    stiffness: 100,
    damping: 28,
    restDelta: 0.001
  });

  // Camera parallax transformations
  const portraitScale = useTransform(smoothPortraitProgress, [0, 0.5, 1], [1.14, 1.05, 0.98]);
  const portraitY = useTransform(smoothPortraitProgress, [0, 1], [-35, 35]);
  const bgCoordsY2 = useTransform(scrollYProgress, [0, 1], [0, 220]);

  const textVariants = {
    hidden: { y: "120%", rotate: 5, opacity: 0 },
    visible: (i) => ({
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.76, 0, 0.24, 1],
        delay: 1.5 + i * 0.04
      }
    })
  };

  const titleText = "I'M AHMAD MALIK";
  const subtitleText = "Creative designer for E commerce brands";

  const stats = [
    {
      id: "STAT // 01",
      number: "04+",
      label: "YEARS OF CRAFT",
      detail: "E-Commerce Strategy & Visual Elevation"
    },
    {
      id: "STAT // 02",
      number: "100+",
      label: "CONVERTING ASSETS",
      detail: "Amazon EBC & TikTok Shop Creatives"
    },
    {
      id: "STAT // 03",
      number: "6-FIG",
      label: "CLIENT REVENUE",
      detail: "Direct & Agency Brand Scale"
    },
    {
      id: "STAT // 04",
      number: "100%",
      label: "BESPOKE ASSETS",
      detail: "Zero Templates • 100% Tailored DNA"
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="page" 
      style={{ 
        position: 'relative', 
        zIndex: 1, 
        paddingTop: '25vh', 
        minHeight: '100vh', 
        overflow: 'hidden' 
      }}
    >
      {/* Background Ambience & Floating Telemetry Grids (Lando Norris Aesthetic) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        <motion.div 
          animate={{ opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ 
            position: 'absolute', 
            top: '8%', 
            right: '12%', 
            width: '45vw', 
            height: '45vw', 
            background: 'radial-gradient(circle, rgba(210, 255, 0, 0.14) 0%, transparent 65%)', 
            filter: 'blur(90px)', 
            borderRadius: '50%' 
          }}
        />
        <motion.div 
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ 
            position: 'absolute', 
            bottom: '12%', 
            left: '8%', 
            width: '55vw', 
            height: '55vw', 
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 65%)', 
            filter: 'blur(110px)', 
            borderRadius: '50%' 
          }}
        />


        <motion.div 
          style={{ 
            position: 'absolute', 
            top: '55%', 
            right: '4%', 
            fontFamily: 'monospace', 
            fontSize: '0.68rem', 
            letterSpacing: '0.18em', 
            color: 'rgba(255, 255, 255, 0.2)', 
            textAlign: 'right', 
            y: bgCoordsY2 
          }}
        >
          [ TELEMETRY // ACTIVE ]<br/>
          REF // AM-2026-ARCHIVE
        </motion.div>

        {/* Subtle Luxury Technical Blueprint Grid */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', 
          backgroundSize: '90px 90px', 
          opacity: 0.6 
        }} />
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        
        {/* Top Eyebrow Telemetry Dossier Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{ marginBottom: '1.75rem' }}
        >
          <div className="luxury-telemetry-pill">
            <motion.span 
              animate={{ opacity: [1, 0.35, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-lime)',
                boxShadow: '0 0 10px var(--color-lime)'
              }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--color-lime)', fontWeight: 600 }}>
              DOSSIER // 001 • LEAD ART DIRECTION & VISUAL SYSTEMS
            </span>
          </div>
        </motion.div>

        {/* Massive Title */}
        <h1 style={{ 
          color: 'var(--color-white)', 
          fontSize: 'clamp(4rem, 12vw, 12rem)', 
          fontFamily: 'var(--font-heading)', 
          textTransform: 'uppercase',
          margin: '0 0 1rem 0',
          lineHeight: 0.85,
          letterSpacing: '-0.04em',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '2vw'
        }}>
          {titleText.split(" ").map((word, wordIndex) => (
            <div key={wordIndex} style={{ display: 'flex', overflow: 'hidden', paddingBottom: '0.1em', paddingTop: '0.1em' }}>
              {word.split("").map((char, charIndex) => {
                const globalIndex = wordIndex * 10 + charIndex;
                return (
                  <motion.span
                    key={charIndex}
                    custom={globalIndex}
                    initial="hidden"
                    animate="visible"
                    variants={textVariants}
                    style={{ display: 'inline-block', transformOrigin: 'left bottom', textShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                  >
                    {char === "'" ? "'" : char}
                  </motion.span>
                );
              })}
            </div>
          ))}
        </h1>

        <div style={{ overflow: 'hidden', paddingBottom: '0.2em', marginBottom: '5rem' }}>
          <motion.h2
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.8, ease: [0.76, 0, 0.24, 1] }}
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: 'clamp(1.35rem, 2.5vw, 2.2rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 400,
              textTransform: 'none',
              letterSpacing: '0.01em',
              margin: 0
            }}
          >
            {subtitleText}
          </motion.h2>
        </div>

        {/* Cinematic High-Budget Portrait Showcase with Parallax Spring Physics */}
        <motion.div
          ref={portraitSectionRef}
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            width: '100%', 
            maxWidth: '1040px', 
            position: 'relative', 
            marginBottom: '4.5rem', 
            marginTop: '1rem',
            padding: '12px'
          }}
        >
          {/* Ambient Lime Studio Glow Aura */}
          <motion.div 
            animate={{ 
              opacity: [0.28, 0.48, 0.28], 
              scale: [1, 1.04, 1] 
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: '112%', 
              height: '112%', 
              background: 'radial-gradient(ellipse at center, rgba(210, 255, 0, 0.24) 0%, rgba(210, 255, 0, 0.06) 45%, transparent 72%)', 
              filter: 'blur(75px)', 
              borderRadius: '36px',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />

          {/* Premium Card Frame with Corner Reticles */}
          <ReticleCard 
            hover={false}
            style={{
              position: 'relative',
              zIndex: 1,
              borderRadius: '26px',
              overflow: 'hidden',
              border: '1px solid rgba(210, 255, 0, 0.32)',
              backgroundColor: '#0c0f07',
              boxShadow: '0 30px 100px -20px rgba(0, 0, 0, 0.95), 0 0 50px -10px rgba(210, 255, 0, 0.22), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
              aspectRatio: '4 / 3',
              maxHeight: '75vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Top Glassmorphic Badges */}
            <div style={{
              position: 'absolute',
              top: '1.25rem',
              left: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.45rem 1.15rem',
              background: 'rgba(5, 5, 5, 0.72)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '999px',
              zIndex: 10,
              pointerEvents: 'none'
            }}>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                color: 'var(--color-lime)',
                fontWeight: 600
              }}>
                [ 01 // IDENTITY ]
              </span>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#ffffff',
                fontWeight: 600
              }}>
                Creative Director & Founder
              </span>
            </div>

            <div style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.45rem 1.15rem',
              background: 'rgba(5, 5, 5, 0.72)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(210, 255, 0, 0.4)',
              borderRadius: '999px',
              zIndex: 10,
              pointerEvents: 'none'
            }}>
              <motion.span 
                animate={{ opacity: [1, 0.4, 1], scale: [1, 1.25, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-lime)',
                  boxShadow: '0 0 10px var(--color-lime)',
                  display: 'inline-block'
                }} 
              />
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-lime)',
                fontWeight: 600
              }}>
                Available Worldwide
              </span>
            </div>

            {/* High Quality Portrait Image with Parallax Depth Scale */}
            <motion.img 
              src="/ahmad-malik-about.jpg" 
              alt="Ahmad Malik - Creative Designer" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                objectPosition: 'center 20%',
                display: 'block',
                scale: portraitScale,
                y: portraitY,
                filter: 'contrast(1.05) brightness(1.02) saturate(1.02)'
              }} 
            />

            {/* Bottom Cinematic Gradient Overlay */}
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              width: '100%', 
              height: '38%', 
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%)', 
              pointerEvents: 'none', 
              zIndex: 5 
            }} />

            {/* Bottom Metadata Bar */}
            <div style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '1.75rem',
              right: '1.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 10,
              pointerEvents: 'none'
            }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.78rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: 600,
                textShadow: '0 2px 10px rgba(0,0,0,0.8)'
              }}>
                AHMAD MALIK // STUDIO ARCHIVE
              </span>
            </div>
          </ReticleCard>
        </motion.div>

        {/* =========================================================================
            High Budget Performance Metrics Dashboard (Inspired by landonorris.com)
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: '1040px',
            marginBottom: '7rem',
            padding: '0 12px'
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            alignItems: 'stretch'
          }}>
            {stats.map((stat, i) => (
              <ReticleCard
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.025)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(210, 255, 0, 0.18)',
                  borderRadius: '18px',
                  padding: '1.75rem 1.4rem',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    color: 'var(--color-lime)',
                    fontWeight: 600
                  }}>
                    {stat.id}
                  </span>
                  <span style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(210, 255, 0, 0.4)'
                  }} />
                </div>

                <div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2.5rem, 4.2vw, 3.6rem)',
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    color: '#ffffff',
                    textShadow: '0 0 25px rgba(210, 255, 0, 0.3)',
                    marginBottom: '0.4rem'
                  }}>
                    {stat.number}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    marginBottom: '0.35rem'
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: '0.78rem',
                    color: 'rgba(255, 255, 255, 0.65)',
                    lineHeight: 1.4
                  }}>
                    {stat.detail}
                  </div>
                </div>
              </ReticleCard>
            ))}
          </div>
        </motion.div>

        {/* Elegant Copy section with Pure White & Lime Green Highlights */}
        <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '0 2rem' }}>
          
          {/* Eyebrow Pill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(210, 255, 0, 0.6))' }} />
            <span className="luxury-telemetry-pill" style={{ color: 'var(--color-lime)', fontSize: '0.74rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-lime)', boxShadow: '0 0 8px var(--color-lime)' }} />
              // 01. STRATEGIC ART DIRECTION
            </span>
            <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, rgba(210, 255, 0, 0.6), transparent)' }} />
          </div>

          <ScrollHighlightText 
            delay={0.1} 
            color="#ffffff"
            text="Over 4 years of experience elevating E-Commerce Brands." 
            highlights={["E-Commerce", "Brands"]}
            fontSize="clamp(2.4rem, 4.6vw, 4rem)"
            lineHeight={1.15}
          />
          <ScrollHighlightText 
            delay={0.2} 
            color="#ffffff"
            text="I specialize in crafting high-converting visuals for Amazon, TikTok, and beyond. My focus is simple: understand your brand's DNA and engineer creatives that communicate, connect, and convert." 
            highlights={["high-converting", "visuals", "Amazon", "TikTok", "DNA", "communicate", "connect", "convert"]}
            fontSize="clamp(1.6rem, 2.8vw, 2.5rem)"
            lineHeight={1.3}
          />
          <ScrollHighlightText 
            delay={0.25} 
            color="#ffffff"
            text="I’ve worked directly with brands and alongside agencies as an outsourced creative partner, creating everything from Amazon listing images, Enhanced Brand Content, Brand Stories, and Storefronts to TikTok Shop listing graphics, product creatives, and advertising visuals." 
            highlights={["brands", "agencies", "outsourced", "creative", "partner", "Amazon", "Enhanced", "Brand", "Content", "Stories", "Storefronts", "TikTok", "Shop", "creatives", "advertising", "visuals"]}
            fontSize="clamp(1.45rem, 2.4vw, 2.1rem)"
            lineHeight={1.4}
          />
        </div>

        {/* Trusted by Top Brands Section */}
        <div style={{ marginTop: '8rem', width: '100%', overflow: 'hidden' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '3.5rem', padding: '0 1rem' }}
          >
            <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
              <span className="luxury-telemetry-pill" style={{ color: 'var(--color-lime)', fontSize: '0.74rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-lime)', boxShadow: '0 0 8px var(--color-lime)' }} />
                // 02. PROVEN CLIENT ROSTER
              </span>
            </div>

            <h2 style={{ 
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', 
              color: 'var(--color-white)', 
              fontFamily: 'var(--font-heading)', 
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              margin: '0 0 1rem 0',
              textShadow: '0 10px 40px rgba(0,0,0,0.8)'
            }}>
              TRUSTED BY TOP BRANDS
            </h2>
          </motion.div>
          
          {/* Telemetry Hairline Divider (Top) */}
          <div style={{ 
            position: 'relative', 
            width: '90%', 
            maxWidth: '1200px', 
            margin: '0 auto', 
            height: '1px', 
            background: 'linear-gradient(90deg, transparent, rgba(210, 255, 0, 0.4) 50%, transparent)' 
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: '8px', 
              height: '8px', 
              backgroundColor: 'var(--color-lime)', 
              borderRadius: '50%', 
              boxShadow: '0 0 10px var(--color-lime)' 
            }} />
          </div>

          {/* Infinite Marquee of Brand Logos (No dark overlay boxes; pure transparent fade via CSS mask) */}
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            overflow: 'hidden', 
            display: 'flex', 
            padding: '2.5rem 0 3.5rem 0',
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
          }}>
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 32 }}
              style={{ display: 'flex', gap: '7rem', width: 'max-content', padding: '0 3rem', alignItems: 'center' }}
            >
              {[
                "/ox.png.png", "/taxzap.png.png", "/boom-beauty.png.png", "/strands-of-faith.png.png",
                "/true-classic.png.png.png", "/natpat.png.png.png", "/tanri.png.png.png", "/seedsheet.png.png.png", "/celzo.png.png.png",
                "/ox.png.png", "/taxzap.png.png", "/boom-beauty.png.png", "/strands-of-faith.png.png",
                "/true-classic.png.png.png", "/natpat.png.png.png", "/tanri.png.png.png", "/seedsheet.png.png.png", "/celzo.png.png.png"
              ].map((img, i) => (
                <div 
                  key={i} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    minWidth: '150px',
                    height: '110px'
                  }}
                >
                  <img 
                    src={img} 
                    alt="Brand Logo" 
                    className="brand-logo-img"
                    style={{ maxHeight: '90px' }}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Telemetry Hairline Divider (Bottom) */}
          <div style={{ 
            width: '90%', 
            maxWidth: '1200px', 
            margin: '0 auto', 
            height: '1px', 
            background: 'linear-gradient(90deg, transparent, rgba(210, 255, 0, 0.25) 50%, transparent)' 
          }} />
        </div>

        {/* Agencies Section on About Me */}
        <div style={{ marginTop: '8rem', width: '100%', maxWidth: '1240px', padding: '0 1.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
              <span className="luxury-telemetry-pill" style={{ color: 'var(--color-lime)', fontSize: '0.74rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-lime)', boxShadow: '0 0 8px var(--color-lime)' }} />
                // 03. OUTSOURCED CREATIVE PARTNER
              </span>
            </div>

            <h3 style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              color: 'var(--color-white)',
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              margin: 0
            }}>
              Agencies I Have Worked With
            </h3>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '1.75rem',
            alignItems: 'stretch'
          }}>
            {[
              { id: "01", name: "Advance Amazon Agency", role: "Amazon Creative Designer", img: "/agency-1.png.jpg" },
              { id: "02", name: "Konsort Social", role: "TikTok Shop Creative Designer", img: "/agency-2.png.jpg" },
              { id: "03", name: "Selliqa", role: "Senior Graphics Designer", img: "/agency-3.png.jpg" },
              { id: "04", name: "creatiWOW", role: "Senior Graphics Designer", img: "/agency-4.png.jpg" },
              { id: "05", name: "Sellonics", role: "Amazon & Tiktok Creative Designer", img: "/sellonics.jpg" }
            ].map((agency, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <ReticleCard 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    textAlign: 'center', 
                    padding: '2.4rem 1.5rem',
                    background: 'rgba(255,255,255,0.025)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    height: '100%',
                    justifyContent: 'space-between',
                    overflow: 'hidden'
                  }}
                >
                  {/* Top Index & Status Pill */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '0.72rem',
                      letterSpacing: '0.12em',
                      color: 'var(--color-lime)',
                      fontWeight: 600
                    }}>
                      [ {agency.id} ]
                    </span>
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '0.66rem',
                      letterSpacing: '0.08em',
                      color: 'rgba(255, 255, 255, 0.4)'
                    }}>
                      PARTNER
                    </span>
                  </div>

                  <div style={{ height: '75px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', overflow: 'hidden' }}>
                    <img 
                      src={agency.img} 
                      alt={agency.name} 
                      style={{ 
                        maxHeight: '100%', 
                        maxWidth: '100%', 
                        objectFit: 'contain',
                        transition: 'transform 0.4s ease'
                      }} 
                    />
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1.2rem', color: 'var(--color-lime)', marginBottom: '0.4rem', fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600 }}>{agency.name}</h4>
                    <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: '1.4', margin: 0 }}>{agency.role}</p>
                  </div>
                </ReticleCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Executive Creative Manifesto Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1140px',
            marginTop: '9rem',
            marginBottom: '4rem',
            padding: '12px'
          }}
        >
          {/* Ambient Neon Lime Aura */}
          <motion.div 
            animate={{ 
              opacity: [0.22, 0.4, 0.22], 
              scale: [1, 1.03, 1] 
            }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: '108%', 
              height: '110%', 
              background: 'radial-gradient(ellipse at center, rgba(210, 255, 0, 0.2) 0%, rgba(210, 255, 0, 0.05) 50%, transparent 70%)', 
              filter: 'blur(80px)', 
              borderRadius: '36px',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />

          {/* High Budget Glassmorphic Cockpit Frame with Corner Reticles */}
          <ReticleCard 
            hover={false}
            style={{
              position: 'relative',
              zIndex: 1,
              borderRadius: '28px',
              border: '1px solid rgba(210, 255, 0, 0.25)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.01) 100%)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              boxShadow: '0 30px 90px -20px rgba(0, 0, 0, 0.9), 0 0 50px -15px rgba(210, 255, 0, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
              padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(2rem, 4.5vw, 3.8rem)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2.5rem',
              overflow: 'hidden'
            }}
          >
            {/* Top HUD Badges */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              flexWrap: 'wrap',
              gap: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '1.75rem'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.4rem 1.1rem',
                background: 'rgba(0, 0, 0, 0.55)',
                border: '1px solid rgba(210, 255, 0, 0.35)',
                borderRadius: '999px'
              }}>
                <motion.span 
                  animate={{ opacity: [1, 0.35, 1], scale: [1, 1.25, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-lime)',
                    boxShadow: '0 0 8px var(--color-lime)'
                  }} 
                />
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-lime)',
                  fontWeight: 600
                }}>
                  // 04. CORE DESIGN PHILOSOPHY
                </span>
              </div>

              <span style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.65)'
              }}>
                [ COMMUNICATE // CONNECT // CONVERT ]
              </span>
            </div>

            {/* The Text with Pure White & Lime Green Highlights */}
            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
              <ScrollHighlightText 
                delay={0.1}
                color="#ffffff"
                text="Having worked both directly with brands and as an outsourced creative partner for agencies, I focus on understanding the brand and turning its products into visuals that communicate, connect, and convert."
                highlights={["brands", "outsourced", "creative", "partner", "agencies", "understanding", "visuals", "communicate", "connect", "convert"]}
                fontSize="clamp(1.7rem, 3.2vw, 2.75rem)"
                lineHeight={1.38}
              />
            </div>

            {/* Bottom Executive Footer / CTA Strip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              flexWrap: 'wrap',
              gap: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '2rem',
              marginTop: '1rem'
            }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.95rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  fontWeight: 600
                }}>
                  Ahmad Malik
                </span>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  letterSpacing: '0.06em',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  CREATIVE DIRECTOR // E-COM SPECIALIST
                </span>
              </div>

              <a
                href="https://calendly.com/ahmadmalik1/creative-visuals-discussion"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1.85rem',
                  borderRadius: '999px',
                  backgroundColor: 'var(--color-lime)',
                  color: 'var(--color-black)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 0 25px rgba(210, 255, 0, 0.35)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 0 35px rgba(210, 255, 0, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(210, 255, 0, 0.35)';
                }}
              >
                <span>Book A Discussion</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            </div>
          </ReticleCard>
        </motion.div>

      </div>
      <Footer />
      <BackToTopButton />
    </div>
  );
}





const ContactPrismWireframe = () => (
  <motion.div 
    className="contact-prism-container"
    animate={{
      y: [0, -10, 0],
      rotate: [0, 2.5, -1, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      {/* Rear perspective rhombus */}
      <path
        d="M 88,14 L 148,60 L 96,112 L 36,66 Z"
        stroke="#FF5522"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.65"
      />
      {/* Receding depth lines */}
      <line x1="62" y1="6" x2="88" y2="14" stroke="#FF5522" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="122" y1="52" x2="148" y2="60" stroke="#FF5522" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="70" y1="104" x2="96" y2="112" stroke="#FF5522" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="10" y1="58" x2="36" y2="66" stroke="#FF5522" strokeWidth="2.2" strokeLinecap="round" />
      {/* Front perspective rhombus */}
      <path
        d="M 62,6 L 122,52 L 70,104 L 10,58 Z"
        stroke="#FF5522"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </motion.div>
);

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText('ahmadmalikcreative@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch("https://formsubmit.co/ajax/ahmadmalikcreative@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New Portfolio Message from ${formData.name}`,
          _captcha: "false",
          _template: "table"
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok || data.success === "true" || data.success === true) {
        setStatus('success');
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
      setErrorMessage('Could not deliver via form server. You can email Ahmad directly at ahmadmalikcreative@gmail.com');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        
        {/* Massive Headline Section with Orange 3D Wireframe Accent */}
        <motion.div 
          className="contact-hero-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="contact-status-pill">
            <span className="contact-beacon-dot" />
            <span className="contact-status-pill-text">AVAILABLE FOR SELECT COMMISSIONS</span>
            <span className="contact-status-pill-divider">•</span>
            <span className="contact-status-pill-meta">EST. REPLY &lt; 24H</span>
          </div>

          <h1 className="contact-hero-title">
            <span className="contact-hero-line">LET'S CONNECT</span>
            <span className="contact-hero-line contact-hero-line-interactive">
              AND COLLABORATE
              <ContactPrismWireframe />
            </span>
            <span className="contact-hero-line">TODAY</span>
          </h1>
        </motion.div>

        {/* 2-Column Main Section */}
        <div className="contact-layout-grid">
          
          {/* Left Column: Form */}
          <motion.div 
            className="contact-form-column"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="contact-card-frame">
              <div className="contact-card-laser-edge" />

              <div className="contact-form-card-header">
                <span className="contact-form-card-title">PROJECT INQUIRY FORM</span>
                <span className="contact-form-card-step">DIRECT INBOX</span>
              </div>

              {status === 'success' ? (
                <motion.div 
                  className="contact-success-banner"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(210, 255, 0, 0.15)',
                    border: '1.5px solid var(--color-lime)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-lime)'
                  }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="contact-success-heading">MESSAGE SENT!</h3>
                  <p className="contact-success-desc">
                    Thank you, <strong style={{ color: 'var(--color-lime)' }}>{formData.name || 'there'}</strong>! Your message has been delivered to <span style={{ color: '#fff' }}>ahmadmalikcreative@gmail.com</span>. Ahmad will review your brief and reply promptly within 24 hours.
                  </p>
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData({ name: '', email: '', message: '' });
                      setStatus('idle');
                    }}
                    className="contact-btn-submit"
                    style={{ marginTop: '0.5rem' }}
                  >
                    <span>Send Another Message</span>
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form-inner" noValidate>
                  {/* Honeypot field for spam prevention */}
                  <input type="text" name="_honey" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />

                  {/* Name Field */}
                  <div className="contact-field-group">
                    <label htmlFor="contact-name" className="contact-field-label">
                      <span className="contact-field-index">01</span>
                      <span>Name</span>
                      <span className="contact-required-star">*</span>
                    </label>
                    <div className="contact-input-box">
                      <input 
                        id="contact-name"
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name" 
                        className="contact-text-input"
                        required
                      />
                      <div className="contact-field-icon">
                        <User size={19} strokeWidth={1.8} />
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="contact-field-group">
                    <label htmlFor="contact-email" className="contact-field-label">
                      <span className="contact-field-index">02</span>
                      <span>Email</span>
                      <span className="contact-required-star">*</span>
                    </label>
                    <div className="contact-input-box">
                      <input 
                        id="contact-email"
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="info@foliohub.com" 
                        className="contact-text-input"
                        required
                      />
                      <div className="contact-field-icon">
                        <Mail size={19} strokeWidth={1.8} />
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="contact-field-group">
                    <label htmlFor="contact-message" className="contact-field-label">
                      <span className="contact-field-index">03</span>
                      <span>Message / Project Details</span>
                      <span className="contact-required-star">*</span>
                    </label>
                    <div className="contact-input-box">
                      <textarea 
                        id="contact-message"
                        name="message" 
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell me about your brand, timeline, deliverables, and vision..." 
                        className="contact-text-area"
                        required
                      />
                      <div className="contact-field-icon-textarea">
                        <Pencil size={19} strokeWidth={1.8} />
                      </div>
                    </div>
                  </div>

                  {/* Error Banner if any */}
                  {status === 'error' && (
                    <div className="contact-error-banner">
                      <span>{errorMessage}</span>
                      <a 
                        href={`mailto:ahmadmalikcreative@gmail.com?subject=Project Inquiry from ${encodeURIComponent(formData.name || 'Visitor')}&body=${encodeURIComponent(formData.message || '')}`}
                        style={{ color: 'var(--color-lime)', textDecoration: 'underline', fontWeight: 600, whiteSpace: 'nowrap' }}
                      >
                        Open Email App →
                      </a>
                    </div>
                  )}

                  {/* Submit Button & Trust Bar */}
                  <div className="contact-submit-row">
                    <button 
                      type="submit" 
                      disabled={status === 'submitting'}
                      className="contact-btn-submit"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>SENDING INQUIRY...</span>
                        </>
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
                          <ArrowRight size={17} />
                        </>
                      )}
                    </button>
                    <div className="contact-trust-note">
                      <ShieldCheck size={15} color="var(--color-lime)" />
                      <span>100% Confidential • NDA Protected</span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right Column: Contact Details */}
          <motion.div 
            className="contact-info-column"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="contact-info-header-tag">
              DIRECT CHANNELS & AVAILABILITY
            </div>

            {/* 1. Email */}
            <div className="contact-info-card">
              <div className="contact-info-icon-wrapper">
                <Mail size={22} strokeWidth={1.8} />
              </div>
              <div className="contact-info-text-group">
                <span className="contact-info-sublabel">Direct Email</span>
                <div className="contact-email-val-wrapper">
                  <a 
                    href="mailto:ahmadmalikcreative@gmail.com" 
                    className="contact-info-mainval"
                    title="Send email to Ahmad Malik"
                  >
                    AHMADMALIKCREATIVE@GMAIL.COM
                  </a>
                  <button 
                    type="button" 
                    onClick={handleCopyEmail}
                    className="contact-copy-pill"
                    title="Copy email address"
                  >
                    {copiedEmail ? <Check size={12} color="var(--color-lime)" /> : <Copy size={12} />}
                    <span>{copiedEmail ? 'COPIED!' : 'COPY'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Phone Number */}
            <div className="contact-info-card">
              <div className="contact-info-icon-wrapper">
                <Phone size={22} strokeWidth={1.8} />
              </div>
              <div className="contact-info-text-group">
                <span className="contact-info-sublabel">Phone & WhatsApp Direct</span>
                <a 
                  href="tel:+923278545547" 
                  className="contact-info-mainval"
                  title="Call Ahmad Malik"
                >
                  +92 3278545547
                </a>
              </div>
            </div>

            {/* 3. Location */}
            <div className="contact-info-card">
              <div className="contact-info-icon-wrapper">
                <MapPin size={22} strokeWidth={1.8} />
              </div>
              <div className="contact-info-text-group">
                <span className="contact-info-sublabel">Primary Headquarters</span>
                <div className="contact-location-val-group">
                  <span className="contact-info-mainval">
                    LAHORE, PAKISTAN
                  </span>
                  <span className="contact-timezone-pill">PKT (GMT+5)</span>
                </div>
              </div>
            </div>

            {/* 4. Availability */}
            <div className="contact-info-card">
              <div className="contact-info-icon-wrapper">
                <Calendar size={22} strokeWidth={1.8} />
              </div>
              <div className="contact-info-text-group">
                <span className="contact-info-sublabel">Client Capacity</span>
                <span className="contact-info-mainval" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span className="contact-pulse-circle" />
                  AVAILABLE NOW
                </span>
                <span className="contact-capacity-desc">Accepting select brand identity & A+ content projects</span>
              </div>
            </div>

            {/* Fast Communication Action Buttons */}
            <div className="contact-quick-actions">
              <a 
                href="https://wa.me/923278545547?text=Hi%20Ahmad,%20I%20saw%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20project!" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-quick-btn contact-quick-whatsapp"
              >
                <MessageCircle size={16} color="#25D366" />
                <span>Chat on WhatsApp</span>
                <ArrowUpRight size={13} className="contact-quick-arrow" />
              </a>
              <a 
                href="https://calendly.com/ahmadmalik1/creative-visuals-discussion" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-quick-btn contact-quick-calendly"
              >
                <Calendar size={16} color="var(--color-lime)" />
                <span>Book A Discussion</span>
                <ArrowUpRight size={13} className="contact-quick-arrow" />
              </a>
            </div>

          </motion.div>

        </div>

      </div>

      <Footer variant="contact" />
      <BackToTopButton />
    </div>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);

  const triggerTransition = () => {
    setTransitionKey(k => k + 1);
  };

  return (
    <Router>
      <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true, syncTouch: true, touchMultiplier: 1.5 }}>
        <ScrollToTop />
        <Preloader transitionKey={transitionKey} />
        <div className="app">
          <GlobalBackground />
          <CustomCursor isMenuOpen={isMenuOpen} />
          <FullscreenMenu 
            isOpen={isMenuOpen} 
            setIsOpen={setIsMenuOpen} 
            triggerTransition={triggerTransition}
          />
          
          {/* Document Top Logo */}
          <motion.div
            className="document-top-logo"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link 
              to="/"
              onClick={() => {
                if (window.location.hash === '#/' || window.location.hash === '') {
                  triggerTransition();
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMenuOpen(false);
              }}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', pointerEvents: 'auto' }}
              aria-label="Ahmad Malik Home"
            >
              <img src="/logo.svg?v=2" alt="Ahmad Scales Logo" style={{ width: '70px', height: 'auto', objectFit: 'contain' }} />
            </Link>
          </motion.div>

          {/* Navigation */}
          <motion.nav 
            className="navbar"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              zIndex: 10000 
            }}
          >
            <Link 
              to="/"
              className="nav-brand" 
              onClick={() => {
                if (window.location.hash === '#/' || window.location.hash === '') {
                  triggerTransition();
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMenuOpen(false); // Close menu if open
              }}
              style={{ 
                cursor: 'pointer', 
                transition: 'opacity 0.3s, color 0.4s ease',
                color: isMenuOpen ? 'var(--color-black)' : 'var(--color-white)',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 0.7}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
            >
              Ahmad Malik
            </Link>
            <button 
              className={`menu-toggle-icon ${isMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              <span className="line top"></span>
              <span className="line bottom"></span>
            </button>
          </motion.nav>

          <PageContentWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </PageContentWrapper>
        </div>
      </ReactLenis>
    </Router>
  );
}
