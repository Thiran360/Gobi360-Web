import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import servicesBg from '../assets/services_bg.png';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header Image Section */}
      <div style={{ width: '100%', height: '350px', position: 'relative', marginBottom: '-4rem' }}>
        <img
          src={servicesBg}
          alt="Privacy Policy Header"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)' }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', padding: '3rem', borderRadius: '1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '700', marginBottom: '2.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1.5rem' }}>
            Effective Date: June 2, 2026
          </p>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
              1. About Gobi 360
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75' }}>
              Gobi 360 is a GPS tracking and business technology platform dedicated to providing location tracking, fleet monitoring, and related digital services.
            </p>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginTop: '1rem' }}>
              The application is designed to help users efficiently monitor, manage, and optimize their business operations through real-time tracking, route analysis, geofencing, and reporting features.
            </p>
          </section>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
              2. Information We Collect
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '1.5rem' }}>
              We collect the following types of information to provide and improve our services:
            </p>
            
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#334155', marginBottom: '0.75rem' }}>A. Personal Information</h3>
            <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1.5rem' }}>
              <li>Full Name</li>
              <li>Mobile Number</li>
              <li>Email Address</li>
              <li>Username and Password</li>
              <li>Company or Organization Details</li>
            </ul>

            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#334155', marginBottom: '0.75rem' }}>B. Location Information (Crucial for Functionality)</h3>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '0.5rem' }}>
              Location data is essential for the core functionality of Gobi 360. We use this data to provide fleet monitoring and real-time mapping.
            </p>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              With your explicit permission, we collect:
            </p>
            <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1.5rem' }}>
              <li><strong>Foreground Location:</strong> Real-time location when the app is open and visible on your screen.</li>
              <li><strong>Background Location (PROMINENT DISCLOSURE):</strong> Gobi 360 collects location data to enable continuous fleet tracking, route history recording, and geofencing alerts <strong>even when the app is closed or not in use</strong>. This is required to monitor fleet assets accurately throughout the day.</li>
              <li><strong>Historical Location Data:</strong> Saved routes, travel history, and tracking logs for analytics.</li>
            </ul>

            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#334155', marginBottom: '0.75rem' }}>C. Device Information</h3>
            <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1.5rem' }}>
              <li>Device ID</li>
              <li>Device Model</li>
              <li>Operating System</li>
              <li>IP Address</li>
              <li>Network Information</li>
              <li>App version and crash logs</li>
            </ul>

            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#334155', marginBottom: '0.75rem' }}>D. Usage Data</h3>
            <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
              <li>Login activity</li>
              <li>Feature usage</li>
              <li>Performance and diagnostic data</li>
              <li>User interaction logs</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
              3. How We Use Your Information
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '1rem' }}>We use the collected data for the following purposes:</p>
            <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
              <li>To provide GPS tracking and fleet monitoring services</li>
              <li>To display real-time location and route history</li>
              <li>To enable geofencing alerts and notifications</li>
              <li>To manage user accounts and authentication</li>
              <li>To improve application performance and features</li>
              <li>To provide customer support</li>
              <li>To ensure security and prevent unauthorized access</li>
              <li>To comply with legal requirements</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
              4. Data Sharing and Disclosure
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '1rem' }}>
              We do not sell or trade your personal data.
            </p>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '1rem' }}>
              We may share information only in the following cases:
            </p>
            <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
              <li><strong>Service Providers:</strong> Cloud hosting (e.g., AWS, Firebase), mapping services (e.g., Google Maps API), and analytics providers necessary for app operation.</li>
              <li><strong>Legal Requirements:</strong> When required by law or government authorities to comply with legal processes.</li>
              <li><strong>User Consent:</strong> When you explicitly allow sharing (such as sharing a tracking link).</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset transfer.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
              5. Data Security
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '1rem' }}>
              We implement appropriate technical and organizational security measures to protect your data. <strong>All personal and location data is encrypted in transit</strong> (using SSL/HTTPS) to ensure its safety during transmission to our servers.
            </p>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75' }}>
              However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
              6. Data Retention
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '1rem' }}>
              We retain user data only as long as necessary to:
            </p>
            <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
              <li>Provide services</li>
              <li>Maintain user accounts</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
            </ul>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75' }}>
              After this period, data is securely deleted or anonymized.
            </p>
          </section>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
              7. Your Rights
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '1rem' }}>You have the right to:</p>
            <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
              <li>Access your personal data</li>
              <li>Update or correct your information</li>
              <li>Request deletion of your account and data</li>
              <li>Withdraw location permissions at any time</li>
            </ul>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75' }}>
              Disabling location access may affect app functionality.
            </p>
          </section>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
              8. Account & Data Deletion (Google Play Data Safety)
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '1rem' }}>
              Users have the right to request the complete and permanent deletion of their account and all associated location data.
            </p>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '1rem' }}>
              <strong>How to Request Deletion:</strong> You can request data deletion directly within the mobile application by navigating to <em>Profile Settings &gt; Delete Account</em>, or by emailing us at <a href="mailto:support@gobi360.com" style={{ color: '#3b82f6', textDecoration: 'none' }}>support@gobi360.com</a>.
            </p>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75' }}>
              Upon verification, your data will be permanently deleted from our active systems within 30 days, unless a longer retention period is required by law (e.g., for legal compliance or dispute resolution).
            </p>
          </section>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
              9. Children’s Privacy
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '1rem' }}>
              Gobi 360 services are intended for business and general users above 18 years of age.
            </p>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75' }}>
              We do not knowingly collect personal data from children. If such data is identified, it will be deleted immediately.
            </p>
          </section>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
              10. Changes to This Policy
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '1rem' }}>
              We may update this Privacy Policy from time to time.
            </p>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75' }}>
              Changes will be posted on this page with an updated effective date. Continued use of the application indicates acceptance of the updated policy.
            </p>
          </section>

          <section style={{ backgroundColor: '#f1f5f9', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>
              11. Contact Us
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '1.5rem' }}>
              If you have any questions regarding this Privacy Policy, you may contact us:
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Gobi 360</h3>
              <p style={{ color: '#475569', margin: 0 }}>Tamil Nadu, India</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Founders:</h3>
                <p style={{ color: '#475569', margin: 0 }}><strong>Govindaraju D.E.C.E.</strong> – +91 9842743053</p>
                <p style={{ color: '#475569', margin: 0 }}><strong>Maanicka vasagar</strong> – +91 7708805630</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '1.5rem' }}>
              <p style={{ color: '#475569', fontSize: '1.05rem', margin: '0 0 0.5rem 0' }}>
                <strong style={{ color: '#1e293b' }}>Email:</strong> <a href="mailto:support@gobi360.com" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>support@gobi360.com</a>
              </p>
              <p style={{ color: '#475569', fontSize: '1.05rem', margin: 0 }}>
                <strong style={{ color: '#1e293b' }}>Website:</strong> <a href="https://www.gobi360.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>https://www.gobi360.com</a>
              </p>
            </div>
          </section>

        </motion.div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;

