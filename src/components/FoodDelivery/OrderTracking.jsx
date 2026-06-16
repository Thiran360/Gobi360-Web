import React, { useEffect, useState } from 'react';
import { Check, ChefHat, Bike, Home, ArrowLeft, Phone, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderTracking = ({ onBackHome, orderId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [eta, setEta] = useState(25);

  const steps = [
    { icon: <Check size={20} />, title: 'Order Confirmed', time: '12:30 PM' },
    { icon: <ChefHat size={20} />, title: 'Preparing Food', time: '12:35 PM' },
    { icon: <Bike size={20} />, title: 'Out for Delivery', time: '12:45 PM' },
    { icon: <Home size={20} />, title: 'Delivered', time: 'Est. 12:55 PM' }
  ];

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setCurrentStep(1), 3000));
    timers.push(setTimeout(() => setCurrentStep(2), 7000));
    timers.push(setTimeout(() => {
      setCurrentStep(3);
      setEta(0);
    }, 12000));

    // Countdown ETA
    const etaInterval = setInterval(() => {
      setEta(prev => (prev > 0 ? prev - 1 : 0));
    }, 60000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(etaInterval);
    };
  }, []);

  return (
    <div className="fd-tracking-page">
      {/* Simulated Map Background */}
      <div className="fd-tracking-map-bg">
        <button className="fd-tracking-back-btn" onClick={onBackHome}>
          <ArrowLeft size={18} />
        </button>
        {currentStep === 2 && (
          <motion.div 
            className="fd-tracking-bike-marker"
            initial={{ left: '10%', top: '80%' }}
            animate={{ left: '50%', top: '50%' }}
            transition={{ duration: 5, ease: "linear" }}
          >
            <div className="fd-bike-pulse"></div>
            <div className="fd-bike-icon-wrap">
              <Bike size={24} color="#fff" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Tracking Info Card */}
      <motion.div 
        className="fd-tracking-card-container"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="fd-tracking-card">
          
          <div className="fd-tracking-header">
            <div className="fd-tracking-time-info">
              <h2>{currentStep === 3 ? 'Delivered' : 'Arriving in'}</h2>
              {currentStep < 3 && <div className="fd-tracking-eta">{eta} <span>mins</span></div>}
            </div>
            <div className="fd-tracking-order-id">
              Order #{orderId || 'FDE-492019'}
            </div>
          </div>

          <div className="fd-tracking-progress-bar">
            <div className="fd-progress-track">
              <div 
                className="fd-progress-fill" 
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="fd-tracking-steps-list">
            {steps.map((step, index) => {
              const isActive = index <= currentStep;
              const isCurrent = index === currentStep;
              return (
                <div key={index} className={`fd-tracking-step-item ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="fd-step-icon-box">
                    {step.icon}
                  </div>
                  <div className="fd-step-details">
                    <h4>{step.title}</h4>
                    <p>{step.time}</p>
                  </div>
                  {isActive && <div className="fd-step-check"><Check size={14} /></div>}
                </div>
              );
            })}
          </div>

          {currentStep >= 2 && currentStep < 3 && (
            <motion.div 
              className="fd-delivery-partner-card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="fd-partner-info">
                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Delivery Partner" />
                <div>
                  <h4>Rajesh Kumar</h4>
                  <p>Your Delivery Partner</p>
                </div>
              </div>
              <button className="fd-partner-call-btn">
                <Phone size={18} />
              </button>
            </motion.div>
          )}

          <div className="fd-tracking-address-card">
            <div className="fd-address-icon">
              <MapPin size={20} color="#fc8019" />
            </div>
            <div className="fd-address-details">
              <h4>Delivery Address</h4>
              <p>Flat 4B, Signature Towers, Gobichettipalayam, Erode, Tamil Nadu</p>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default OrderTracking;
