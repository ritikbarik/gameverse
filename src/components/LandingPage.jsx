import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gamepad2,
  Monitor,
  CalendarCheck,
  PlaySquare,
  Coffee,
  Receipt,
  FileBarChart,
  ArrowRight,
  ChevronDown,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
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

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'how-it-works', 'roles', 'about'];
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
          1. STICKY NAVBAR
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
              <div className="landing-brand-tagline">Gaming Café Management System</div>
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
              onClick={() => scrollToSection('features')}
              className={`landing-nav-link ${activeNav === 'features' ? 'active' : ''}`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`landing-nav-link ${activeNav === 'how-it-works' ? 'active' : ''}`}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className={`landing-nav-link ${activeNav === 'roles' ? 'active' : ''}`}
            >
              Roles
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`landing-nav-link ${activeNav === 'about' ? 'active' : ''}`}
            >
              About
            </button>
          </nav>

          {/* Right Action: Login */}
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
                gap: '0.45rem'
              }}
            >
              <span>Login</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION
          ========================================================================= */}
      <section id="home" className="landing-section hero-section-wrapper">
        {/* Subtle Background Layer (Parallax Layer 1) */}
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
          {/* Left Column: Headlines */}
          <div className="hero-text-col">
            <div className="hero-kicker-pill">
              <span className="hero-kicker-dot" />
              <span>GAMEVERSE • CENTRALIZED SYSTEM</span>
            </div>

            <h1 className="hero-main-title">
              Your Gaming Café,
              <br />
              <span className="hero-title-accent">Simplified.</span>
            </h1>

            <p className="hero-description">
              Manage stations, reservations, gaming sessions, café orders,
              billing, inventory, and reports from one connected system.
            </p>

            <div className="hero-highlight-chips">
              <div className="hero-chip">
                <CheckCircle2 size={15} color="#C62828" />
                <span>Station Reservations</span>
              </div>
              <div className="hero-chip">
                <CheckCircle2 size={15} color="#C62828" />
                <span>Café Orders & Inventory</span>
              </div>
              <div className="hero-chip">
                <CheckCircle2 size={15} color="#C62828" />
                <span>Consolidated Invoicing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Composition (Parallax Layer 2 & 3) */}
          <div className="hero-visual-col">
            <div
              className="hero-composition"
              style={{
                transform: `translate3d(${pX * 8}px, ${pY * 6}px, 0)`
              }}
            >
              {/* Primary Card: Station S-03 */}
              <div className="hero-station-card">
                <div className="hero-station-header">
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888888', textTransform: 'uppercase' }}>
                      Gaming Station
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      S-03
                    </div>
                  </div>
                  <span className="badge badge-free" style={{ fontSize: '0.75rem' }}>
                    Available
                  </span>
                </div>

                <div className="hero-station-body">
                  <div className="station-meta-row">
                    <span>Hardware Type:</span>
                    <strong>PC Setup (RTX 4070)</strong>
                  </div>
                  <div className="station-meta-row">
                    <span>Hourly Rate:</span>
                    <strong style={{ color: '#C62828', fontSize: '1.05rem' }}>₹100.00 / hr</strong>
                  </div>
                  <div className="station-meta-row">
                    <span>Network:</span>
                    <span>High-Speed LAN</span>
                  </div>
                </div>

                <div className="hero-station-footer">
                  <span style={{ fontSize: '0.75rem', color: '#888888' }}>Ready for Customer Check-in</span>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#2E7D32' }} />
                </div>
              </div>

              {/* Floating UI Card 1: Stations Count */}
              <div
                className="floating-metric-card float-top-left"
                style={{
                  transform: `translate3d(${pX * -15}px, ${pY * -12}px, 0)`
                }}
              >
                <div className="float-icon-box">
                  <Monitor size={18} color="#C62828" />
                </div>
                <div>
                  <div className="float-val">12 Stations</div>
                  <div className="float-lbl">Total Capacity (Demo)</div>
                </div>
              </div>

              {/* Floating UI Card 2: Active Sessions */}
              <div
                className="floating-metric-card float-mid-right"
                style={{
                  transform: `translate3d(${pX * 18}px, ${pY * 14}px, 0)`
                }}
              >
                <div className="float-icon-box">
                  <PlaySquare size={18} color="#C62828" />
                </div>
                <div>
                  <div className="float-val">6 Active Sessions</div>
                  <div className="float-lbl">Ongoing Timers (Demo)</div>
                </div>
              </div>

              {/* Floating UI Card 3: Today's Revenue */}
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
                  <div className="float-val">₹3,240 Revenue</div>
                  <div className="float-lbl">Settled Today (Demo)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Explore - Section 7 Requirement */}
        <div className="hero-scroll-explore-container">
          <button
            className="hero-scroll-btn"
            onClick={() => scrollToSection('features')}
            aria-label="Scroll to Features section"
          >
            <span className="scroll-btn-text">Scroll to Explore</span>
            <div className="scroll-btn-arrow">
              <ChevronDown size={18} color="#C62828" />
            </div>
          </button>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURES SECTION
          ========================================================================= */}
      <section id="features" className="landing-section bg-section-subtle">
        <div className="landing-container">
          <div className="section-header-centered">
            <div className="section-pill">SRS OPERATIONAL MODULES</div>
            <h2 className="section-title">Everything You Need to Run Your Café</h2>
            <p className="section-subtitle">
              GameVerse integrates the complete operational requirements of a modern gaming café into unified workflows.
            </p>
          </div>

          <div className="features-grid-4">
            {/* Card 1: Station Management */}
            <div className="feature-card-clean" onClick={() => scrollToSection('how-it-works')}>
              <div className="feature-card-icon">
                <Monitor size={24} color="#C62828" />
              </div>
              <h3 className="feature-card-title">Station Management</h3>
              <p className="feature-card-desc">
                Monitor station availability, status, type, and hourly rates in real time across PC and console setups.
              </p>
              <div className="feature-card-footer">
                <span>Explore Workflow</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Card 2: Reservations & Sessions */}
            <div className="feature-card-clean" onClick={() => scrollToSection('how-it-works')}>
              <div className="feature-card-icon">
                <CalendarCheck size={24} color="#C62828" />
              </div>
              <h3 className="feature-card-title">Reservations & Sessions</h3>
              <p className="feature-card-desc">
                Book stations in advance, record session start and end events, and calculate session duration accurately.
              </p>
              <div className="feature-card-footer">
                <span>Explore Workflow</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Card 3: Café Orders & Inventory */}
            <div className="feature-card-clean" onClick={() => scrollToSection('how-it-works')}>
              <div className="feature-card-icon">
                <Coffee size={24} color="#C62828" />
              </div>
              <h3 className="feature-card-title">Café Orders & Inventory</h3>
              <p className="feature-card-desc">
                Attach food and drink orders to active customer sessions while maintaining automatic stock reduction and reorder alerts.
              </p>
              <div className="feature-card-footer">
                <span>Explore Workflow</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Card 4: Billing & Reports */}
            <div className="feature-card-clean" onClick={() => scrollToSection('how-it-works')}>
              <div className="feature-card-icon">
                <FileBarChart size={24} color="#C62828" />
              </div>
              <h3 className="feature-card-title">Billing & Reports</h3>
              <p className="feature-card-desc">
                Combine gaming and café charges into single itemized bills with payment recording and managerial analytics.
              </p>
              <div className="feature-card-footer">
                <span>Explore Workflow</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. HOW IT WORKS SECTION
          ========================================================================= */}
      <section id="how-it-works" className="landing-section">
        <div className="landing-container">
          <div className="section-header-centered">
            <div className="section-pill">SYSTEM WORKFLOW</div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              A straightforward 5-step operational lifecycle based strictly on the SRS specification.
            </p>
          </div>

          <div className="workflow-steps-wrapper">
            {/* Visual connecting red line */}
            <div className="workflow-connecting-line" />

            <div className="workflow-steps-grid">
              {/* Step 1 */}
              <div className="workflow-step-item">
                <div className="workflow-step-circle">
                  <span>01</span>
                </div>
                <h4 className="workflow-step-title">Customer Books</h4>
                <p className="workflow-step-desc">
                  Customer reserves an available PC or console station for a designated date and time window.
                </p>
              </div>

              {/* Step 2 */}
              <div className="workflow-step-item">
                <div className="workflow-step-circle">
                  <span>02</span>
                </div>
                <h4 className="workflow-step-title">Session Starts</h4>
                <p className="workflow-step-desc">
                  Receptionist verifies booking, starts the session timer, and automatically flags the station as occupied.
                </p>
              </div>

              {/* Step 3 */}
              <div className="workflow-step-item">
                <div className="workflow-step-circle">
                  <span>03</span>
                </div>
                <h4 className="workflow-step-title">Café Order</h4>
                <p className="workflow-step-desc">
                  Café staff records food and beverage orders attached directly to the customer's ongoing session.
                </p>
              </div>

              {/* Step 4 */}
              <div className="workflow-step-item">
                <div className="workflow-step-circle">
                  <span>04</span>
                </div>
                <h4 className="workflow-step-title">Billing</h4>
                <p className="workflow-step-desc">
                  Session ends, calculating exact duration charges and combining them with café orders into an itemized bill.
                </p>
              </div>

              {/* Step 5 */}
              <div className="workflow-step-item">
                <div className="workflow-step-circle">
                  <span>05</span>
                </div>
                <h4 className="workflow-step-title">Payment & Reports</h4>
                <p className="workflow-step-desc">
                  Payment is collected via Cash, Card, or UPI, and all transactional data updates management reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. ROLES SECTION
          ========================================================================= */}
      <section id="roles" className="landing-section bg-section-subtle">
        <div className="landing-container">
          <div className="section-header-centered">
            <div className="section-pill">ROLE-BASED ACCESS CONTROL</div>
            <h2 className="section-title">One System. Four Roles.</h2>
            <p className="section-subtitle">
              Each user category operates within dedicated, permissions-controlled interfaces to ensure system integrity.
            </p>
          </div>

          <div className="roles-grid-4">
            {/* Customer */}
            <div className="role-card-clean">
              <div className="role-badge-tag">Customer</div>
              <h3 className="role-card-title">Gamer & Visitor</h3>
              <p className="role-card-desc">
                Engages directly with gaming stations and places food/drink orders during gameplay.
              </p>
              <ul className="role-duties-list">
                <li>View station availability in real time</li>
                <li>Make reservations for PC & console setups</li>
                <li>Place café food & beverage orders</li>
                <li>Review itemized bills and receipts</li>
              </ul>
            </div>

            {/* Receptionist */}
            <div className="role-card-clean">
              <div className="role-badge-tag">Receptionist</div>
              <h3 className="role-card-title">Front Desk Operations</h3>
              <p className="role-card-desc">
                Manages walk-ins, station bookings, live player sessions, and final payment collection.
              </p>
              <ul className="role-duties-list">
                <li>Manage customer profile records</li>
                <li>Process reservations and check station status</li>
                <li>Start and end player gaming sessions</li>
                <li>Handle final billing and payment collection</li>
              </ul>
            </div>

            {/* Café Staff */}
            <div className="role-card-clean">
              <div className="role-badge-tag">Café Staff</div>
              <h3 className="role-card-title">Café & Kitchen Floor</h3>
              <p className="role-card-desc">
                Prepares refreshments and maintains café inventory and stock threshold oversight.
              </p>
              <ul className="role-duties-list">
                <li>Process food and drink orders for active sessions</li>
                <li>Update inventory quantities upon stock delivery</li>
                <li>Monitor items approaching reorder thresholds</li>
                <li>Ensure accurate stock consumption logging</li>
              </ul>
            </div>

            {/* Administrator */}
            <div className="role-card-clean">
              <div className="role-badge-tag">Administrator</div>
              <h3 className="role-card-title">System Administrator</h3>
              <p className="role-card-desc">
                Oversees station infrastructure, staff credentials, catalog pricing, and business reports.
              </p>
              <ul className="role-duties-list">
                <li>Configure gaming stations and hourly rates</li>
                <li>Manage employee and user account permissions</li>
                <li>Maintain master inventory records</li>
                <li>Generate revenue, usage, and stock reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. ABOUT SECTION
          ========================================================================= */}
      <section id="about" className="landing-section">
        <div className="landing-container">
          <div className="about-panel-clean">
            <div className="about-content">
              <div className="section-pill" style={{ margin: '0 0 1rem 0' }}>ABOUT GAMEVERSE</div>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                Built to Simplify Gaming Café Operations
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.975rem', marginBottom: '1rem' }}>
                GameVerse is a centralized management system designed to replace paper-based and manually maintained café logs. It connects customer handling, station reservations, session tracking, café orders, billing, inventory, and reporting into one consistent platform.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.975rem', marginBottom: '1.75rem' }}>
                Conforming strictly to the Software Requirements Specification (SRS V1.0), GameVerse ensures that gaming café operators can optimize their workflows, eliminate booking conflicts, and ensure accurate financial reconciliation.
              </p>

              <div className="about-stats-row">
                <div className="about-stat-item">
                  <div className="about-stat-num">100%</div>
                  <div className="about-stat-lbl">SRS Scope Compliant</div>
                </div>
                <div className="about-stat-item">
                  <div className="about-stat-num">4 Roles</div>
                  <div className="about-stat-lbl">Role-Based Access</div>
                </div>
                <div className="about-stat-item">
                  <div className="about-stat-num">Real-Time</div>
                  <div className="about-stat-lbl">State Synchronization</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FOOTER
          ========================================================================= */}
      <footer className="landing-footer-clean">
        <div className="landing-container">
          <div className="footer-top-row">
            <div className="footer-brand-info">
              <div className="landing-brand" style={{ marginBottom: '0.65rem' }}>
                <div className="landing-logo-badge">
                  <Gamepad2 size={20} color="#FFFFFF" />
                </div>
                <div>
                  <div className="landing-brand-name">GameVerse</div>
                  <div className="landing-brand-tagline">Gaming Café Management System</div>
                </div>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#888888', maxWidth: '380px', lineHeight: 1.6 }}>
                A centralized operational system for gaming station management, café food orders, session timing, itemized billing, and management reports.
              </p>
            </div>

            <div className="footer-nav-links">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#171717', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Navigation
              </div>
              <button onClick={() => scrollToSection('home')} className="footer-link-btn">Home</button>
              <button onClick={() => scrollToSection('features')} className="footer-link-btn">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="footer-link-btn">How It Works</button>
              <button onClick={() => scrollToSection('roles')} className="footer-link-btn">Roles</button>
              <button onClick={() => scrollToSection('about')} className="footer-link-btn">About</button>
            </div>

            <div className="footer-action-col">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#171717', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Portal Authentication
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={onLogin}
                style={{ width: '100%', padding: '0.6rem 1rem' }}
              >
                Access System Portals
              </button>
              <div style={{ fontSize: '0.75rem', color: '#888888', marginTop: '0.5rem' }}>
                Customer • Staff • Administrator
              </div>
            </div>
          </div>

          <div className="footer-bottom-row">
            <div style={{ fontSize: '0.75rem', color: '#888888' }}>
              © {new Date().getFullYear()} GameVerse Management System. Academic & Operational Lab Prototype.
            </div>
            <div style={{ fontSize: '0.75rem', color: '#888888' }}>
              Windows 10/11 Local Environment • SRS V1.0 Compliant
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
