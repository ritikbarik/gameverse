import React, { useState, useEffect } from 'react';
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
  ChevronRight
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

  // Track scroll position for dynamic scroll parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      const sections = ['home', 'roles', 'about'];
      const scrollPos = window.scrollY + 140;

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
    <div className="landing-page-root">
      {/* =========================================================================
          1. STICKY NAVBAR (Professional Blue & White Frosted Glass)
          ========================================================================= */}
      <header className="landing-navbar-sticky">
        <div className="landing-navbar-container">
          {/* Left: Brand Logo */}
          <div
            className="landing-brand"
            onClick={() => scrollToSection('home')}
            style={{ cursor: 'pointer' }}
          >
            <div className="landing-logo-badge">
              <Gamepad2 size={22} color="#FFFFFF" />
            </div>
            <div>
              <div className="landing-brand-name">GameVerse</div>
              <div className="landing-brand-tagline">Centralized Gaming Platform</div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="landing-nav-menu">
            <button
              onClick={() => scrollToSection('home')}
              className={`landing-nav-link ${activeNav === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className={`landing-nav-link ${activeNav === 'roles' ? 'active' : ''}`}
            >
              Unified Roles
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`landing-nav-link ${activeNav === 'about' ? 'active' : ''}`}
            >
              About
            </button>
          </nav>

          {/* Right Action: Launch System Portal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              className="btn btn-primary"
              onClick={onLogin}
              style={{
                padding: '0.55rem 1.35rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.28)'
              }}
            >
              <span>Launch Portal</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. OPTIMIZED HERO SECTION: GAMING CONSOLE & CHILLED COKE CAN SHOWCASE
          ========================================================================= */}
      <section id="home" className="hero-section-wrapper">
        {/* Ambient Parallax Gradient Background Shapes */}
        <div
          className="hero-bg-shapes"
          style={{
            transform: `translate3d(${pX * -12}px, ${pY * -10 + sY * -0.08}px, 0)`
          }}
        >
          <div className="subtle-shape shape-circle-1" />
          <div className="subtle-shape shape-circle-2" />
          <div className="hero-glow-beam" />
        </div>

        <div className="hero-content-container">
          {/* Left Column: Typography, Value Proposition & Actions */}
          <div
            className="hero-text-col"
            style={{
              transform: `translate3d(0, ${sY * 0.04}px, 0)`
            }}
          >
            <div className="hero-kicker-pill">
              <span className="hero-kicker-dot" />
              <span>UNIFIED ARCHITECTURE • MERGED OPERATIONS</span>
            </div>

            <h1 className="hero-main-title">
              Next-Gen Gaming.
              <br />
              Chilled Refreshments.
              <br />
              <span className="hero-title-accent">One Unified Platform.</span>
            </h1>

            <p className="hero-description">
              Power your gaming café with instant console & PC rig allocation, in-seat café orders
              featuring ice-cold Coke & snacks, live hardware session timers, and automated single-ticket checkout.
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
              <button
                className="btn btn-primary"
                onClick={onLogin}
                style={{
                  padding: '0.8rem 1.75rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  boxShadow: '0 8px 22px rgba(37, 99, 235, 0.28)'
                }}
              >
                <span>Enter System Portal</span>
                <ArrowRight size={17} />
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => scrollToSection('roles')}
                style={{
                  padding: '0.8rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem'
                }}
              >
                <span>Explore Unified Roles</span>
                <ChevronDown size={17} color="var(--blue-primary)" />
              </button>
            </div>

            {/* Feature Highlight Chips */}
            <div className="hero-highlight-chips">
              <div className="hero-chip">
                <Gamepad2 size={16} color="var(--blue-primary)" />
                <span>Next-Gen Console & PC Rigs</span>
              </div>
              <div className="hero-chip">
                <Coffee size={16} color="var(--blue-primary)" />
                <span>In-Seat Coke & Food Delivery</span>
              </div>
              <div className="hero-chip">
                <Users size={16} color="var(--blue-primary)" />
                <span>Front Desk & Café Floor Merged</span>
              </div>
              <div className="hero-chip">
                <Receipt size={16} color="var(--blue-primary)" />
                <span>Consolidated Itemized Billing</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Gaming Console & Coke Can 3D Stage */}
          <div className="hero-visual-col">
            <div
              className="hero-stage-container"
              style={{
                transform: `perspective(1000px) rotateY(${pX * 4}deg) rotateX(${-pY * 4}deg) translate3d(0, ${sY * -0.05}px, 0)`
              }}
            >
              {/* Backlight Ambient Glow Ring */}
              <div className="stage-ambient-glow" />

              {/* Master Showcase Card with Console & Coke Can Image */}
              <div className="stage-image-card">
                <img
                  src="/hero-gaming-coke.jpg"
                  alt="GameVerse Next-Gen Gaming Console and Chilled Coca-Cola Setup"
                  className="stage-visual-img"
                  loading="eager"
                />

                {/* Glass Light Sheen Overlay */}
                <div
                  className="stage-glass-sheen"
                  style={{
                    transform: `translate3d(${pX * 25}px, ${pY * 20}px, 0)`
                  }}
                />

                {/* Embedded HUD Badge: Live Gaming Console Status (Top-Left) */}
                <div className="hud-badge hud-badge-top-left">
                  <span className="live-pulse-dot" />
                  <div>
                    <div className="hud-title">Console Station S-03</div>
                    <div className="hud-sub">Aether-X • 4K 120FPS Active</div>
                  </div>
                </div>

                {/* Embedded HUD Badge: Chilled Coke Order (Top-Right) */}
                <div className="hud-badge hud-badge-top-right">
                  <div className="hud-ice-indicator">🥤</div>
                  <div>
                    <div className="hud-title">Chilled Coca-Cola</div>
                    <div className="hud-sub">Delivered In-Seat • Ice Cold</div>
                  </div>
                </div>

                {/* Bottom Consolidated Session Bill HUD Overlay */}
                <div className="stage-bottom-bill-banner">
                  <div className="stage-bill-content">
                    <div className="stage-bill-left">
                      <div className="stage-bill-tag">
                        <Receipt size={13} color="var(--blue-primary)" />
                        <span>SYNCHRONIZED TICKET #GV-842</span>
                      </div>
                      <div className="stage-bill-breakdown">
                        <span>Console Session (01h 30m): ₹150</span>
                        <span className="stage-bill-divider">•</span>
                        <span>1x Chilled Coke + Nachos: ₹110</span>
                      </div>
                    </div>
                    <div className="stage-bill-right">
                      <div className="stage-total-label">Running Total</div>
                      <div className="stage-total-val">₹260.00</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating UI Metric 1: Merged Staff Desk */}
              <div
                className="floating-metric-card float-top-left"
                style={{
                  transform: `translate3d(${pX * -14}px, ${pY * -10 + sY * 0.06}px, 0)`
                }}
              >
                <div className="float-icon-box">
                  <Users size={18} color="var(--blue-primary)" />
                </div>
                <div>
                  <div className="float-val">Café Staff & Receptionist</div>
                  <div className="float-lbl">Merged Operations Desk</div>
                </div>
              </div>

              {/* Floating UI Metric 2: Live Hardware Sync */}
              <div
                className="floating-metric-card float-mid-right"
                style={{
                  transform: `translate3d(${pX * 14}px, ${pY * 12 + sY * -0.06}px, 0)`
                }}
              >
                <div className="float-icon-box">
                  <Monitor size={18} color="var(--blue-primary)" />
                </div>
                <div>
                  <div className="float-val">12 Hardware Stations</div>
                  <div className="float-lbl">PC & Console Live Sync</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll To Unified Roles */}
        <div className="hero-scroll-explore-container">
          <button
            className="hero-scroll-btn"
            onClick={() => scrollToSection('roles')}
            aria-label="Scroll to Unified Roles section"
          >
            <span className="scroll-btn-text">Explore Unified Roles</span>
            <div className="scroll-btn-arrow">
              <ChevronDown size={18} color="var(--blue-primary)" />
            </div>
          </button>
        </div>
      </section>

      {/* =========================================================================
          3. ROLES SECTION (CONSOLIDATED INTO 3 STREAMLINED ROLES)
          Café Staff & Receptionist Combined into One Centralized Section
          ========================================================================= */}
      <section id="roles" className="landing-section bg-section-subtle">
        <div className="landing-container">
          <div className="section-header-centered">
            <div className="section-pill">UNIFIED ACCESS CONTROL</div>
            <h2 className="section-title">Three Roles. Zero Friction.</h2>
            <p className="section-subtitle">
              We have merged front desk reception and café floor operations into a single staff command center,
              giving your team unmatched speed and complete situational awareness.
            </p>
          </div>

          <div className="roles-grid-3">
            {/* Role 1: Customer */}
            <div className="role-card-elevated">
              <div className="role-card-top">
                <div className="role-badge-tag">Gamer Portal</div>
                <div className="role-card-icon-wrap">
                  <Gamepad2 size={24} color="var(--blue-primary)" />
                </div>
              </div>
              <h3 className="role-card-title">Customer & Gamer</h3>
              <p className="role-card-desc">
                Intuitive self-service portal for real-time station availability, advance seat reservations,
                and direct in-session café & gaming gear ordering.
              </p>
              <ul className="role-duties-list">
                <li>Check real-time station availability across PC & Console rigs</li>
                <li>Make instant advance reservations for preferred time slots</li>
                <li>Order refreshments and gaming accessories to their station</li>
                <li>Monitor live session duration and access itemized digital receipts</li>
              </ul>
              <div className="role-card-bottom-scope">
                <span>Role Scope:</span> Self-Service Gamer Interface
              </div>
            </div>

            {/* Role 2: Café Staff & Receptionist (MERGED CENTERPIECE) */}
            <div className="role-card-merged">
              <div className="merged-featured-badge">
                <Sparkles size={13} color="#FFFFFF" />
                <span>MERGED OPERATIONS DESK</span>
              </div>
              <div className="role-card-top">
                <div className="role-badge-tag" style={{ background: 'var(--blue-light)', borderColor: 'var(--blue-border)' }}>
                  Front Desk + Café Floor
                </div>
                <div className="role-card-icon-wrap merged-icon-box">
                  <Users size={20} color="#FFFFFF" />
                  <span style={{ color: '#FFFFFF', fontSize: '0.85rem' }}>+</span>
                  <Coffee size={20} color="#FFFFFF" />
                </div>
              </div>
              <h3 className="role-card-title" style={{ fontSize: '1.35rem', color: 'var(--text-main)' }}>
                Café Staff & Receptionist
              </h3>
              <p className="role-card-desc">
                A single unified terminal combining front-desk check-ins, live hardware session timers,
                kitchen food & beverage orders, gaming accessories sales, inventory tracking, and final cashier billing.
              </p>
              <ul className="role-duties-list">
                <li>
                  <strong>Front-Desk Check-In:</strong> Rapid customer lookup and instant station assignment
                </li>
                <li>
                  <strong>Session Master:</strong> Start, monitor, and end gaming sessions with auto-tariff billing
                </li>
                <li>
                  <strong>Café & Gear Orders:</strong> Receive and dispatch snacks and accessories attached to station IDs
                </li>
                <li>
                  <strong>Inventory Oversight:</strong> Real-time ingredient deductions and stock reorder warnings
                </li>
                <li>
                  <strong>Consolidated Checkout:</strong> Settle gaming duration + orders on a single invoice
                </li>
              </ul>
              <div className="role-card-bottom-scope" style={{ borderColor: 'var(--blue-border)', background: 'var(--blue-light)', color: 'var(--blue-dark)' }}>
                <span>Role Scope:</span> Front Desk • Session Timers • Kitchen • Cashier
              </div>
            </div>

            {/* Role 3: Administrator */}
            <div className="role-card-elevated">
              <div className="role-card-top">
                <div className="role-badge-tag">System Governance</div>
                <div className="role-card-icon-wrap">
                  <ShieldCheck size={24} color="var(--blue-primary)" />
                </div>
              </div>
              <h3 className="role-card-title">System Administrator</h3>
              <p className="role-card-desc">
                High-level governance over gaming hardware setups, employee credentials, hourly pricing structures,
                master inventory (café and accessories), and financial reporting.
              </p>
              <ul className="role-duties-list">
                <li>Configure gaming station specs, hardware types, and hourly rates</li>
                <li>Manage employee accounts, credentials, and access permissions</li>
                <li>Add & manage café items as well as gaming accessories</li>
                <li>Generate real-time revenue analytics, station utilization, and F&B reports</li>
              </ul>
              <div className="role-card-bottom-scope">
                <span>Role Scope:</span> Infrastructure • Security • Business Analytics
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. ABOUT SECTION & SYSTEM ACCESS CTA (NO FOOTER BELOW)
          ========================================================================= */}
      <section id="about" className="landing-section">
        <div className="landing-container">
          <div className="about-panel-clean">
            <div className="about-content">
              <div className="section-pill" style={{ margin: '0 0 1rem 0' }}>ABOUT GAMEVERSE</div>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                Engineered to Unify Fragmented Café Operations
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.975rem', marginBottom: '1rem' }}>
                Traditional gaming cafés lose substantial revenue through disconnected paper registers,
                untracked food chits, and delayed billing reconciliations. GameVerse solves this by merging
                front-desk reception with café floor operations into a synchronized, single-screen command system.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.975rem', marginBottom: '1.75rem' }}>
                Conforming to rigorous operational specifications, GameVerse ensures zero booking conflicts,
                accurate per-minute duration accounting, live inventory depletion, and one-click consolidated checkout.
              </p>

              {/* Key Architectural Highlights */}
              <div className="about-stats-row">
                <div className="about-stat-item">
                  <div className="about-stat-num">3 Roles</div>
                  <div className="about-stat-lbl">Unified Access Model</div>
                </div>
                <div className="about-stat-item">
                  <div className="about-stat-num">100% Merged</div>
                  <div className="about-stat-lbl">Reception Desk & Café Floor</div>
                </div>
                <div className="about-stat-item">
                  <div className="about-stat-num">Real-Time</div>
                  <div className="about-stat-lbl">Cross-Terminal State Sync</div>
                </div>
                <div className="about-stat-item">
                  <div className="about-stat-num">Single Bill</div>
                  <div className="about-stat-lbl">Consolidated Gaming + F&B</div>
                </div>
              </div>

              {/* Integrated Call-To-Action Banner */}
              <div className="about-cta-banner">
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    Ready to Experience GameVerse?
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Access Customer, Merged Staff (Café & Reception), or Administrator portals now.
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={onLogin}
                  style={{
                    padding: '0.75rem 1.75rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 16px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  <span>Enter System Portals</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
