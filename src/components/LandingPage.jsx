import React, { useState, useEffect } from 'react';
import '../dark-landing.css';
import {
  Gamepad2,
  Monitor,
  Coffee,
  Receipt,
  ArrowRight,
  ChevronDown,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Package,
  Layers,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';

export default function LandingPage({ onLogin }) {
  const [activeNav, setActiveNav] = useState('home');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Smooth mouse movement for parallax & 3D tilt
  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  // Track scroll position for dynamic scroll parallax and active nav
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      const sections = ['home', 'hardware', 'experience', 'lifestyle', 'roles'];
      const scrollPos = window.scrollY + 160;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveNav(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pX = prefersReducedMotion ? 0 : mousePos.x;
  const pY = prefersReducedMotion ? 0 : mousePos.y;
  const sY = prefersReducedMotion ? 0 : scrollY;

  return (
    <div className="dark-landing-root">
      {/* =========================================================================
          1. STICKY NAVBAR: Dark Translucent Studio Glass with Coca-Cola Red Accent
          ========================================================================= */}
      <header className="dark-navbar-sticky">
        <div className="dark-navbar-container">
          {/* Left: Brand Monogram */}
          <div
            className="dark-brand"
            onClick={() => scrollToSection('home')}
            style={{ cursor: 'pointer' }}
          >
            <div className="dark-logo-badge">
              <Gamepad2 size={20} color="#FFFFFF" />
            </div>
            <div>
              <div className="dark-brand-name">GameVerse</div>
              <div className="dark-brand-tagline">Gaming Operations Platform</div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="dark-nav-menu">
            <button
              onClick={() => scrollToSection('home')}
              className={`dark-nav-link ${activeNav === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('hardware')}
              className={`dark-nav-link ${activeNav === 'hardware' ? 'active' : ''}`}
            >
              Hardware
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className={`dark-nav-link ${activeNav === 'experience' ? 'active' : ''}`}
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection('lifestyle')}
              className={`dark-nav-link ${activeNav === 'lifestyle' ? 'active' : ''}`}
            >
              Lifestyle
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className={`dark-nav-link ${activeNav === 'roles' ? 'active' : ''}`}
            >
              Unified Roles
            </button>
          </nav>

          {/* Right Action: Launch System Portal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              className="dark-btn-primary"
              onClick={onLogin}
            >
              <span>Launch Portal</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          SCENE 01 — HERO: Black Gaming Console × Realistic Red Coca-Cola Can
          ========================================================================= */}
      <section id="home" className="dark-hero-section">
        {/* Ambient Dark Studio Backlight & Soft Red Glow */}
        <div
          className="dark-hero-ambient"
          style={{
            transform: `translate3d(${pX * -15}px, ${pY * -12 + sY * -0.06}px, 0)`
          }}
        >
          <div className="ambient-red-halo halo-main" />
          <div className="ambient-red-halo halo-subtle" />
        </div>

        <div className="dark-hero-container">
          {/* Left Column: Bold Minimal Typography & Value Proposition */}
          <div
            className="dark-hero-text-col"
            style={{
              transform: `translate3d(0, ${sY * 0.03}px, 0)`
            }}
          >
            <div className="dark-eyebrow-pill">
              <span className="dark-kicker-dot" />
              <span>PLAY WITHOUT LIMITS • UNIFIED OPERATIONS</span>
            </div>

            <h1 className="dark-hero-title">
              PLAY WITHOUT
              <br />
              LIMITS.
              <br />
              <span className="dark-title-accent">Next-Gen Gaming & Café.</span>
            </h1>

            <p className="dark-hero-desc">
              A cinematic operations platform designed for modern gaming cafés.
              Seamlessly unify next-gen console and PC rigs, in-seat Coca-Cola
              refreshment service, real-time hardware timers, and single-ticket checkout.
            </p>

            {/* CTAs */}
            <div className="dark-hero-actions">
              <button
                className="dark-btn-primary dark-btn-hero"
                onClick={onLogin}
              >
                <span>Enter System Portal</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="dark-btn-secondary dark-btn-hero"
                onClick={() => scrollToSection('hardware')}
              >
                <span>Explore Experience</span>
                <ChevronDown size={16} color="#A1A1A1" />
              </button>
            </div>

            {/* Subtle Feature Indicator Chips */}
            <div className="dark-feature-chips">
              <div className="dark-chip">
                <span className="chip-indicator" />
                <span>Onyx Next-Gen Rigs</span>
              </div>
              <div className="dark-chip">
                <span className="chip-indicator" />
                <span>In-Seat Refreshments</span>
              </div>
              <div className="dark-chip">
                <span className="chip-indicator" />
                <span>Consolidated Billing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dark Studio Console & Red Coke Can Presentation */}
          <div className="dark-hero-visual-col">
            <div
              className="dark-stage-wrap"
              style={{
                transform: `perspective(1200px) rotateY(${pX * 4.5}deg) rotateX(${-pY * 4.5}deg) translate3d(0, ${sY * -0.04}px, 0)`
              }}
            >
              {/* Backlight Studio Glow */}
              <div className="dark-stage-glow" />

              {/* Master Studio Presentation Card */}
              <div className="dark-stage-card">
                <img
                  src="/hero-console-coke-dark.jpg"
                  alt="GameVerse Next-Gen Onyx Gaming Console with Chilled Coca-Cola in Dark Studio"
                  className="dark-stage-img"
                  loading="eager"
                />

                {/* Glass Light Sheen */}
                <div
                  className="dark-stage-sheen"
                  style={{
                    transform: `translate3d(${pX * 20}px, ${pY * 18}px, 0)`
                  }}
                />

                {/* HUD Overlay: Console Station Status (Top Left) */}
                <div className="dark-hud-badge dark-hud-top-left">
                  <span className="hud-red-pulse" />
                  <div>
                    <div className="dark-hud-title">Station S-03 • Onyx Console</div>
                    <div className="dark-hud-sub">4K @ 120 FPS • HDR Active</div>
                  </div>
                </div>

                {/* HUD Overlay: In-Seat Coca-Cola Status (Top Right) */}
                <div className="dark-hud-badge dark-hud-top-right">
                  <div className="coke-dot">●</div>
                  <div>
                    <div className="dark-hud-title">Coca-Cola Classic (330ml)</div>
                    <div className="dark-hud-sub">Chilled • Served In-Seat</div>
                  </div>
                </div>

                {/* Bottom Consolidated Session Bill HUD Overlay */}
                <div className="dark-stage-bill-banner">
                  <div className="dark-bill-content">
                    <div className="dark-bill-left">
                      <div className="dark-bill-tag">
                        <Receipt size={12} color="#E50914" />
                        <span>SYNCHRONIZED TICKET #GV-842</span>
                      </div>
                      <div className="dark-bill-breakdown">
                        <span>Console Session (01h 30m): ₹150</span>
                        <span className="dark-bill-sep">•</span>
                        <span>1x Chilled Coke + Nachos: ₹110</span>
                      </div>
                    </div>
                    <div className="dark-bill-right">
                      <div className="dark-bill-label">Consolidated Total</div>
                      <div className="dark-bill-val">₹260.00</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Orbit Card: Merged Operations Desk */}
              <div
                className="dark-floating-pill float-left-card"
                style={{
                  transform: `translate3d(${pX * -12}px, ${pY * -8 + sY * 0.04}px, 0)`
                }}
              >
                <div className="dark-float-icon">
                  <Users size={16} color="#E50914" />
                </div>
                <div>
                  <div className="dark-float-title">Café Staff & Receptionist</div>
                  <div className="dark-float-desc">Merged Operations Desk</div>
                </div>
              </div>

              {/* Floating Orbit Card: Real-Time Hardware Synchronization */}
              <div
                className="dark-floating-pill float-right-card"
                style={{
                  transform: `translate3d(${pX * 12}px, ${pY * 10 + sY * -0.04}px, 0)`
                }}
              >
                <div className="dark-float-icon">
                  <Monitor size={16} color="#E50914" />
                </div>
                <div>
                  <div className="dark-float-title">12 Station Rig Matrix</div>
                  <div className="dark-float-desc">Real-Time Sync • Zero Latency</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Scroll Down Prompt */}
        <div className="dark-scroll-prompt">
          <button
            onClick={() => scrollToSection('hardware')}
            className="dark-scroll-btn"
            aria-label="Scroll to Hardware Architecture"
          >
            <span className="dark-scroll-text">CONTINUE JOURNEY</span>
            <ChevronDown size={14} color="#A1A1A1" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          SCENE 02 — HARDWARE ARCHITECTURE (CONSOLE FOCUS)
          ========================================================================= */}
      <section id="hardware" className="dark-section">
        <div className="dark-container">
          <div className="dark-section-header">
            <div className="dark-section-kicker">SCENE 02 • CONSOLE SPECIFICATIONS</div>
            <h2 className="dark-section-title">Precision Hardware. Zero Latency.</h2>
            <p className="dark-section-subtitle">
              Built to manage ultra-high framerate esports rigs and next-gen console setups
              with microsecond accuracy and automated tariff accounting.
            </p>
          </div>

          <div className="dark-grid-3">
            <div className="dark-card">
              <div className="dark-card-icon-box">
                <Gamepad2 size={22} color="#E50914" />
              </div>
              <h3 className="dark-card-title">4K @ 120Hz Rig Allocation</h3>
              <p className="dark-card-body">
                Instant station mapping for both PC battle-stations and Onyx next-gen console bays.
                Track GPU temperature, active peripheral status, and station occupancy instantly.
              </p>
              <div className="dark-card-metric">
                <span className="metric-num">120 FPS</span>
                <span className="metric-lbl">Ultra High-Refresh Sync</span>
              </div>
            </div>

            <div className="dark-card">
              <div className="dark-card-icon-box">
                <Clock size={22} color="#E50914" />
              </div>
              <h3 className="dark-card-title">Millisecond Session Timers</h3>
              <p className="dark-card-body">
                Automated tariffs calculate exact play duration without human intervention.
                Sessions auto-pause or conclude upon timer expiry with instant hardware lockouts.
              </p>
              <div className="dark-card-metric">
                <span className="metric-num">0.00s</span>
                <span className="metric-lbl">Tariff Discrepancy Rate</span>
              </div>
            </div>

            <div className="dark-card">
              <div className="dark-card-icon-box">
                <ShieldCheck size={22} color="#E50914" />
              </div>
              <h3 className="dark-card-title">Zero Conflict Booking</h3>
              <p className="dark-card-body">
                Advance reservations with instantaneous seat locks. Gamers reserve preferred
                console rigs or PC seats from the mobile portal with 100% schedule reliability.
              </p>
              <div className="dark-card-metric">
                <span className="metric-num">100%</span>
                <span className="metric-lbl">Schedule Lock Integrity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 03 — UNIFIED GAMING EXPERIENCE (SYSTEM SYNCHRONIZATION)
          ========================================================================= */}
      <section id="experience" className="dark-section dark-section-alt">
        <div className="dark-container">
          <div className="dark-section-header">
            <div className="dark-section-kicker">SCENE 03 • CENTRALIZED PLATFORM</div>
            <h2 className="dark-section-title">One Screen. Complete Situational Awareness.</h2>
            <p className="dark-section-subtitle">
              Eliminate disconnected clipboards and lost slips. Front desk check-ins, gaming controllers,
              and café staff operate inside one unified, lightning-fast command environment.
            </p>
          </div>

          <div className="dark-experience-banner">
            <div className="dark-exp-left">
              <div className="dark-exp-badge">
                <Sparkles size={14} color="#E50914" />
                <span>MERGED OPERATIONS DESK</span>
              </div>
              <h3 className="dark-exp-heading">
                Reception Desk & Café Floor Synchronized in Real Time
              </h3>
              <p className="dark-exp-text">
                Every gaming rig communicates with the central desk. Staff view active player IDs,
                running session tariffs, and pending food and beverage orders on a unified live canvas.
              </p>
              <ul className="dark-exp-points">
                <li>
                  <CheckCircle2 size={15} color="#E50914" />
                  <span>Real-time cross-terminal state synchronization with zero delay</span>
                </li>
                <li>
                  <CheckCircle2 size={15} color="#E50914" />
                  <span>Automatic peripheral assignment and gaming gear tracking</span>
                </li>
                <li>
                  <CheckCircle2 size={15} color="#E50914" />
                  <span>Single-click session checkout aggregating gaming time and food orders</span>
                </li>
              </ul>
            </div>

            <div className="dark-exp-right">
              <div className="dark-mock-hud">
                <div className="mock-hud-header">
                  <div className="mock-dot-live" />
                  <span>SYSTEM OVERVIEW • 12 STATIONS ONLINE</span>
                </div>
                <div className="mock-hud-stat-grid">
                  <div className="mock-stat-tile">
                    <div className="mock-stat-val">10 / 12</div>
                    <div className="mock-stat-lbl">Active Rigs</div>
                  </div>
                  <div className="mock-stat-tile">
                    <div className="mock-stat-val">₹4,850</div>
                    <div className="mock-stat-lbl">Today's Gaming</div>
                  </div>
                  <div className="mock-stat-tile">
                    <div className="mock-stat-val">₹2,320</div>
                    <div className="mock-stat-lbl">Café & Refreshments</div>
                  </div>
                  <div className="mock-stat-tile">
                    <div className="mock-stat-val">0</div>
                    <div className="mock-stat-lbl">Pending Conflicts</div>
                  </div>
                </div>
                <div className="mock-hud-footer">
                  <span>Front Desk + Kitchen + Cashier Merged</span>
                  <span style={{ color: '#E50914', fontWeight: 700 }}>100% OPERATIONAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 04 — LIFESTYLE: Chilled Coca-Cola & In-Seat Culinary Refreshment
          ========================================================================= */}
      <section id="lifestyle" className="dark-section">
        <div className="dark-container">
          <div className="dark-section-header">
            <div className="dark-section-kicker">SCENE 04 • REFRESHMENT & LIFESTYLE</div>
            <h2 className="dark-section-title">In-Seat Refreshment. Coca-Cola Lifestyle.</h2>
            <p className="dark-section-subtitle">
              Elevate the gaming night with ice-cold beverages and fresh café bites
              delivered directly to the gamer's station without pausing the match.
            </p>
          </div>

          <div className="dark-grid-3">
            <div className="dark-card">
              <div className="dark-card-icon-box">
                <Coffee size={22} color="#E50914" />
              </div>
              <h3 className="dark-card-title">In-Seat Self-Ordering</h3>
              <p className="dark-card-body">
                Gamers browse the digital café menu directly from their seat. Cold Coca-Cola,
                energy sips, nachos, and hot pizza slices can be ordered in two clicks.
              </p>
              <div className="dark-card-metric">
                <span className="metric-num">2 Clicks</span>
                <span className="metric-lbl">In-Seat Fast Ordering</span>
              </div>
            </div>

            <div className="dark-card">
              <div className="dark-card-icon-box">
                <Zap size={22} color="#E50914" />
              </div>
              <h3 className="dark-card-title">Instant Kitchen Routing</h3>
              <p className="dark-card-body">
                Orders dispatch instantly to the kitchen floor display. Staff receive the station number
                and customer name, delivering chilled cans and hot food in record time.
              </p>
              <div className="dark-card-metric">
                <span className="metric-num">&lt; 4 Mins</span>
                <span className="metric-lbl">Average In-Seat Delivery</span>
              </div>
            </div>

            <div className="dark-card">
              <div className="dark-card-icon-box">
                <Package size={22} color="#E50914" />
              </div>
              <h3 className="dark-card-title">Auto-Depleting Inventory</h3>
              <p className="dark-card-body">
                Stock counts deplete automatically upon order confirmation. Kitchen staff receive
                real-time alerts when Coca-Cola cans or snack supplies fall below par levels.
              </p>
              <div className="dark-card-metric">
                <span className="metric-num">Real-Time</span>
                <span className="metric-lbl">Stock Par Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 05 — UNIFIED SYSTEM ROLES (3 ROLES, ZERO FRICTION) & FINAL CTA
          ========================================================================= */}
      <section id="roles" className="dark-section dark-section-alt">
        <div className="dark-container">
          <div className="dark-section-header">
            <div className="dark-section-kicker">SCENE 05 • ACCESS MODEL</div>
            <h2 className="dark-section-title">Three Roles. Zero Friction.</h2>
            <p className="dark-section-subtitle">
              We have merged front desk reception and café floor operations into a single staff command center,
              giving your team unmatched speed and complete situational awareness.
            </p>
          </div>

          <div className="dark-roles-grid">
            {/* Role 1: Customer & Gamer */}
            <div className="dark-role-card">
              <div className="dark-role-top">
                <span className="dark-role-tag">Gamer Portal</span>
                <div className="dark-role-icon">
                  <Gamepad2 size={20} color="#E50914" />
                </div>
              </div>
              <h3 className="dark-role-title">Customer & Gamer</h3>
              <p className="dark-role-desc">
                Intuitive self-service portal for real-time station availability, advance seat reservations,
                and direct in-session Coca-Cola & gaming gear ordering.
              </p>
              <ul className="dark-role-list">
                <li>Check real-time station availability across PC & Console rigs</li>
                <li>Make instant advance reservations for preferred time slots</li>
                <li>Order chilled refreshments and snacks to their station</li>
                <li>Monitor live session duration and access digital itemized bills</li>
              </ul>
              <div className="dark-role-scope">
                Scope: Gamer Self-Service & In-Seat Orders
              </div>
            </div>

            {/* Role 2: Café Staff & Receptionist (MERGED CENTERPIECE) */}
            <div className="dark-role-card dark-role-featured">
              <div className="dark-featured-pill">
                <Sparkles size={12} color="#FFFFFF" />
                <span>MERGED OPERATIONS DESK</span>
              </div>
              <div className="dark-role-top">
                <span className="dark-role-tag dark-role-tag-red">Front Desk + Café Floor</span>
                <div className="dark-role-icon dark-role-icon-red">
                  <Users size={18} color="#FFFFFF" />
                  <span style={{ color: '#FFFFFF', fontSize: '0.75rem', margin: '0 2px' }}>+</span>
                  <Coffee size={18} color="#FFFFFF" />
                </div>
              </div>
              <h3 className="dark-role-title" style={{ color: '#FFFFFF', fontSize: '1.35rem' }}>
                Café Staff & Receptionist
              </h3>
              <p className="dark-role-desc">
                A single unified terminal combining front-desk check-ins, live hardware session timers,
                kitchen food & beverage orders, gaming accessories sales, inventory tracking, and final cashier billing.
              </p>
              <ul className="dark-role-list">
                <li><strong>Front-Desk Check-In:</strong> Rapid customer lookup and instant station assignment</li>
                <li><strong>Session Master:</strong> Start, monitor, and end gaming sessions with auto-tariff billing</li>
                <li><strong>Café & Gear Orders:</strong> Receive and dispatch snacks and accessories attached to station IDs</li>
                <li><strong>Inventory Oversight:</strong> Real-time ingredient deductions and stock reorder warnings</li>
                <li><strong>Consolidated Checkout:</strong> Settle gaming duration + orders on a single invoice</li>
              </ul>
              <div className="dark-role-scope dark-role-scope-featured">
                Scope: Front Desk • Session Timers • Kitchen • Cashier
              </div>
            </div>

            {/* Role 3: System Administrator */}
            <div className="dark-role-card">
              <div className="dark-role-top">
                <span className="dark-role-tag">System Governance</span>
                <div className="dark-role-icon">
                  <ShieldCheck size={20} color="#E50914" />
                </div>
              </div>
              <h3 className="dark-role-title">System Administrator</h3>
              <p className="dark-role-desc">
                High-level governance over gaming hardware setups, employee credentials, hourly pricing structures,
                master inventory (café and accessories), and financial reporting.
              </p>
              <ul className="dark-role-list">
                <li>Configure gaming station specs, hardware types, and hourly rates</li>
                <li>Manage employee accounts, credentials, and access permissions</li>
                <li>Add & manage café items as well as gaming accessories</li>
                <li>Generate real-time revenue analytics, station utilization, and F&B reports</li>
              </ul>
              <div className="dark-role-scope">
                Scope: Infrastructure • Security • Business Analytics
              </div>
            </div>
          </div>

          {/* Minimal Cinematic Final CTA Banner */}
          <div className="dark-cta-banner">
            <div className="dark-cta-glow" />
            <div className="dark-cta-inner">
              <div className="dark-cta-left">
                <div className="dark-cta-eyebrow">READY TO COMMAND YOUR CAFÉ?</div>
                <h3 className="dark-cta-title">
                  Experience The Unified Platform Today.
                </h3>
                <p className="dark-cta-desc">
                  Access Customer, Merged Staff (Café & Receptionist), or Administrator portals now.
                </p>
              </div>
              <button
                className="dark-btn-primary dark-btn-cta"
                onClick={onLogin}
              >
                <span>Launch System Portal</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
