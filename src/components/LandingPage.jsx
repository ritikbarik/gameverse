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
  Layers,
  ChevronRight
} from 'lucide-react';

export default function LandingPage({ onLogin }) {
  const [activeNav, setActiveNav] = useState('home');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Subtle mouse movement for parallax (only if reduced motion is disabled)
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

  // Track active section on scroll (Only home, roles, about)
  useEffect(() => {
    const handleScroll = () => {
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

  return (
    <div className="landing-page-root">
      {/* =========================================================================
          1. STICKY NAVBAR (Clean, Minimal, Modern)
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
              <div className="landing-brand-tagline">Unified Gaming Café Platform</div>
            </div>
          </div>

          {/* Center Navigation Links (Features & How-It-Works Removed) */}
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
                boxShadow: '0 4px 14px rgba(198, 40, 40, 0.25)'
              }}
            >
              <span>Launch Portal</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION (Elevated, State-Of-The-Art Aesthetics)
          ========================================================================= */}
      <section id="home" className="landing-section hero-section-wrapper">
        {/* Subtle Ambient Parallax Gradient Blobs */}
        <div
          className="hero-bg-shapes"
          style={{
            transform: `translate3d(${pX * -12}px, ${pY * -10}px, 0)`
          }}
        >
          <div className="subtle-shape shape-circle-1" />
          <div className="subtle-shape shape-circle-2" />
        </div>

        <div className="hero-content-container">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="hero-text-col">
            <div className="hero-kicker-pill">
              <span className="hero-kicker-dot" />
              <span>UNIFIED ARCHITECTURE • MERGED OPERATIONS</span>
            </div>

            <h1 className="hero-main-title">
              Elevate Your
              <br />
              Gaming Café.
              <br />
              <span className="hero-title-accent">Front Desk & Café, Merged.</span>
            </h1>

            <p className="hero-description">
              Eliminate disjointed logs and paper receipts. GameVerse consolidates station reservations,
              real-time gaming timers, in-seat food orders, inventory tracking, and single-click itemized
              invoicing into one unified operations system.
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
              <button
                className="btn btn-primary"
                onClick={onLogin}
                style={{
                  padding: '0.75rem 1.6rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 22px rgba(198, 40, 40, 0.28)'
                }}
              >
                <span>Enter System Portal</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => scrollToSection('roles')}
                style={{
                  padding: '0.75rem 1.4rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>Explore Unified Roles</span>
                <ChevronDown size={16} color="#C62828" />
              </button>
            </div>

            <div className="hero-highlight-chips">
              <div className="hero-chip">
                <CheckCircle2 size={15} color="#C62828" />
                <span>Café Staff & Receptionist Merged</span>
              </div>
              <div className="hero-chip">
                <CheckCircle2 size={15} color="#C62828" />
                <span>Live Hardware Timers</span>
              </div>
              <div className="hero-chip">
                <CheckCircle2 size={15} color="#C62828" />
                <span>Consolidated Itemized Billing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Composition (Live Merged Operations Preview) */}
          <div className="hero-visual-col">
            <div
              className="hero-composition"
              style={{
                transform: `translate3d(${pX * 8}px, ${pY * 6}px, 0)`
              }}
            >
              {/* Primary Showcase Card: Active Station S-03 with Merged Operations */}
              <div className="hero-station-card">
                <div className="hero-station-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                      <span className="live-pulse-dot" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C62828', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Active Session
                      </span>
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      Station S-03
                    </div>
                  </div>
                  <span className="badge badge-active" style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}>
                    PC Setup • RTX 4070
                  </span>
                </div>

                <div className="hero-station-body">
                  <div className="station-meta-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={13} color="#C62828" /> Session Timer:
                    </span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: '#171717' }}>01h 24m (Active)</strong>
                  </div>
                  <div className="station-meta-row">
                    <span>Active Gamer:</span>
                    <strong>Rohan S. (USR-004)</strong>
                  </div>

                  {/* Merged Order Line Demonstrating Combined Operations */}
                  <div style={{
                    backgroundColor: '#FFF5F5',
                    border: '1px solid #FFCDD2',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    marginTop: '0.35rem',
                    fontSize: '0.8rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#B71C1C', marginBottom: '0.25rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Coffee size={13} color="#C62828" /> Attached Café Order:
                      </span>
                      <span>₹240.00</span>
                    </div>
                    <div style={{ color: '#666666', fontSize: '0.75rem' }}>
                      1x Caramel Cold Brew + 1x Cheesy Nachos
                    </div>
                  </div>

                  {/* Real-time Consolidated Total */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    paddingTop: '0.65rem',
                    borderTop: '1px dashed #E8E8E8'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: '#666666' }}>Running Total (Gaming + Café):</span>
                    <strong style={{ color: '#C62828', fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>₹380.00</strong>
                  </div>
                </div>

                <div className="hero-station-footer">
                  <span style={{ fontSize: '0.75rem', color: '#888888' }}>Front Desk & Café Floor Synchronized</span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2E7D32' }} />
                </div>
              </div>

              {/* Floating UI Card 1: Merged Console Indicator */}
              <div
                className="floating-metric-card float-top-left"
                style={{
                  transform: `translate3d(${pX * -15}px, ${pY * -12}px, 0)`
                }}
              >
                <div className="float-icon-box">
                  <Users size={18} color="#C62828" />
                </div>
                <div>
                  <div className="float-val">Café Staff & Receptionist</div>
                  <div className="float-lbl">Merged Operations Desk</div>
                </div>
              </div>

              {/* Floating UI Card 2: Connected Stations */}
              <div
                className="floating-metric-card float-mid-right"
                style={{
                  transform: `translate3d(${pX * 18}px, ${pY * 14}px, 0)`
                }}
              >
                <div className="float-icon-box">
                  <Monitor size={18} color="#C62828" />
                </div>
                <div>
                  <div className="float-val">12 Hardware Stations</div>
                  <div className="float-lbl">PC & Console Live Sync</div>
                </div>
              </div>

              {/* Floating UI Card 3: Invoicing */}
              <div
                className="floating-metric-card float-bottom-left"
                style={{
                  transform: `translate3d(${pX * -10}px, ${pY * 16}px, 0)`
                }}
              >
                <div className="float-icon-box">
                  <Receipt size={18} color="#C62828" />
                </div>
                <div>
                  <div className="float-val">Unified Itemized Billing</div>
                  <div className="float-lbl">Zero Discrepancy Checkout</div>
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
              <ChevronDown size={18} color="#C62828" />
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
                  <Gamepad2 size={24} color="#C62828" />
                </div>
              </div>
              <h3 className="role-card-title">Customer & Gamer</h3>
              <p className="role-card-desc">
                Intuitive self-service portal for real-time station availability, advance seat reservations,
                and direct in-session café ordering.
              </p>
              <ul className="role-duties-list">
                <li>Check real-time station availability across PC & Console rigs</li>
                <li>Make instant advance reservations for preferred time slots</li>
                <li>Order refreshments delivered directly to their gaming station</li>
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
                <div className="role-badge-tag" style={{ background: '#FFF5F5', borderColor: '#FFCDD2' }}>
                  Front Desk + Café Floor
                </div>
                <div className="role-card-icon-wrap merged-icon-box">
                  <Users size={20} color="#FFFFFF" />
                  <span style={{ color: '#FFFFFF', fontSize: '0.85rem' }}>+</span>
                  <Coffee size={20} color="#FFFFFF" />
                </div>
              </div>
              <h3 className="role-card-title" style={{ fontSize: '1.35rem', color: '#171717' }}>
                Café Staff & Receptionist
              </h3>
              <p className="role-card-desc">
                A single unified terminal combining front-desk check-ins, live hardware session timers,
                kitchen food & beverage orders, inventory tracking, and final cashier billing.
              </p>
              <ul className="role-duties-list">
                <li>
                  <strong>Front-Desk Check-In:</strong> Rapid customer lookup and instant station assignment
                </li>
                <li>
                  <strong>Session Master:</strong> Start, monitor, and end gaming sessions with auto-tariff billing
                </li>
                <li>
                  <strong>In-Seat Café Orders:</strong> Receive and dispatch snacks attached directly to station IDs
                </li>
                <li>
                  <strong>Inventory Oversight:</strong> Real-time ingredient deductions and stock reorder warnings
                </li>
                <li>
                  <strong>Consolidated Checkout:</strong> Settle gaming duration + food orders on a single invoice
                </li>
              </ul>
              <div className="role-card-bottom-scope" style={{ borderColor: '#FFCDD2', background: '#FFF5F5', color: '#B71C1C' }}>
                <span>Role Scope:</span> Front Desk • Session Timers • Kitchen • Cashier
              </div>
            </div>

            {/* Role 3: Administrator */}
            <div className="role-card-elevated">
              <div className="role-card-top">
                <div className="role-badge-tag">System Governance</div>
                <div className="role-card-icon-wrap">
                  <ShieldCheck size={24} color="#C62828" />
                </div>
              </div>
              <h3 className="role-card-title">System Administrator</h3>
              <p className="role-card-desc">
                High-level governance over gaming hardware setups, employee credentials, hourly pricing structures,
                master inventory, and financial reporting.
              </p>
              <ul className="role-duties-list">
                <li>Configure gaming station specs, hardware types, and hourly rates</li>
                <li>Manage employee accounts, credentials, and access permissions</li>
                <li>Oversee master café catalog, procurement, and stock levels</li>
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
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717', marginBottom: '0.35rem' }}>
                    Ready to Experience GameVerse?
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#666666', margin: 0 }}>
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
                    boxShadow: '0 4px 16px rgba(198, 40, 40, 0.25)'
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
