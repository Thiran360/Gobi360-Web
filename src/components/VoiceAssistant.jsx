import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, X, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import aiAvatar from '../assets/ai_bot_no_text.png';
import { GoogleGenerativeAI } from '@google/generative-ai';

const VoiceAssistant = () => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleCartVisibility = (e) => {
      setIsHidden(e.detail.isVisible);
    };
    window.addEventListener('cartVisibilityChanged', handleCartVisibility);
    return () => window.removeEventListener('cartVisibilityChanged', handleCartVisibility);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize Speech Recognition once
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognitionRef.current = recognition;
    }
  }, []);

  const speak = useCallback((text) => {
    // Stop listening while speaking to prevent feedback loops
    if (recognitionRef.current) recognitionRef.current.stop();

    if (language === 'ta') {
      // ── TAMIL: Use Google Translate TTS (free, no API key, perfect pronunciation) ──
      // Stop any currently playing Tamil audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Split long text into chunks of max 200 chars (Google TTS limit)
      const chunks = [];
      let remaining = text;
      while (remaining.length > 0) {
        let chunk = remaining.substring(0, 200);
        // Try to split at a natural sentence boundary
        const lastPunct = Math.max(
          chunk.lastIndexOf('.'), chunk.lastIndexOf('?'),
          chunk.lastIndexOf('!'), chunk.lastIndexOf(','),
          chunk.lastIndexOf(' ')
        );
        if (remaining.length > 200 && lastPunct > 100) {
          chunk = chunk.substring(0, lastPunct + 1);
        }
        chunks.push(chunk.trim());
        remaining = remaining.substring(chunk.length).trim();
      }

      // Play chunks sequentially for natural flow
      let chunkIndex = 0;
      const playNextChunk = () => {
        if (chunkIndex >= chunks.length) {
          setIsSpeaking(false);
          return;
        }
        const encodedText = encodeURIComponent(chunks[chunkIndex]);
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=ta&client=tw-ob&ttsspeed=0.9`;
        const audio = new Audio(url);
        audioRef.current = audio;
        setIsSpeaking(true);
        audio.onended = () => {
          chunkIndex++;
          playNextChunk();
        };
        audio.onerror = () => {
          // If Google TTS fails (e.g. offline), fall back silently to text-only
          setIsSpeaking(false);
        };
        audio.play().catch(() => setIsSpeaking(false));
      };
      playNextChunk();

    } else {
      // ── ENGLISH: Use browser's native SpeechSynthesis ──
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();

      const doSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const enVoice =
          voices.find(v => v.lang === 'en-US' && v.localService) ||
          voices.find(v => v.lang === 'en-US') ||
          voices.find(v => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        doSpeak();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.onvoiceschanged = null;
          doSpeak();
        };
      }
    }
  }, [language]);

  const handleAIResponse = useCallback((input) => {
    if (!input) return;
    const text = input.toLowerCase();
    let response = '';

    // Massive Offline Intent Recognition Dictionary
    const intents = {
      en: [
        {
          intent: 'GREETING',
          keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'greetings', 'namaste', 'howdy', 'whatsup', 'yo'],
          responses: [
            "Hello! How can I help you today?",
            "Hi there! Looking for food, groceries, or home services?",
            "Greetings! How may I assist you today?"
          ]
        },
        {
          intent: 'WHO_ARE_YOU',
          keywords: ['who are you', 'what is your name', 'what can you do', 'your name', 'help me', 'what are you', 'features', 'abilities'],
          responses: [
            "I am your smart AI Assistant. I can help you order food, buy groceries, or book home services.",
            "I'm the Thiran360 AI Assistant! Tell me what you need, like 'order biryani' or 'book a plumber'."
          ]
        },
        {
          intent: 'FOOD_DELIVERY',
          keywords: ['food', 'hungry', 'eat', 'order', 'restaurant', 'biryani', 'pizza', 'burger', 'meals', 'dosa', 'idly', 'breakfast', 'lunch', 'dinner', 'swiggy', 'zomato', 'snack', 'cravings', 'delicious', 'tasty', 'menu', 'chicken', 'mutton', 'veg', 'nonveg'],
          responses: [
            "You can order delicious food from our Food Delivery section. We have great offers on Biryani, South Indian, and more!",
            "Hungry? Head over to the Food Delivery page to explore top restaurants near you.",
            "I can help you with that! Just navigate to our Food section and choose your favorite restaurant."
          ]
        },
        {
          intent: 'SUPERMARKET',
          keywords: ['groceries', 'supermarket', 'vegetables', 'fruits', 'milk', 'daily needs', 'shopping', 'beverages', 'instamart', 'blinkit', 'market', 'rice', 'dal', 'spices', 'bread', 'eggs', 'essential'],
          responses: [
            "Need daily essentials? Our Supermarket section delivers fresh groceries right to your door.",
            "You can find fresh vegetables, fruits, and daily needs in our Supermarket app.",
            "Check out our Supermarket for quick delivery of all your grocery needs."
          ]
        },
        {
          intent: 'SERVICES',
          keywords: ['service', 'plumbing', 'plumber', 'electrical', 'electrician', 'ac repair', 'cleaning', 'mechanic', 'carpenter', 'painting', 'home repair', 'fix', 'leak', 'wiring', 'broken', 'maintain', 'install', 'technician', 'expert'],
          responses: [
            "We offer a variety of home services including Plumbing, AC Repair, Electrical, and Cleaning. Just click on a service card to book an expert.",
            "Looking for a professional? We have verified experts for all your home repair and maintenance needs."
          ]
        },
        {
          intent: 'BOOKING',
          keywords: ['book', 'how to book', 'schedule', 'appointment', 'reserve', 'cart', 'checkout', 'pay', 'purchase', 'buy'],
          responses: [
            "To book a service, simply click on the 'Book Now' button on any service provider's profile. For food or groceries, click 'Add to Cart' and checkout."
          ]
        },
        {
          intent: 'PROFILE',
          keywords: ['profile', 'account', 'settings', 'past orders', 'history', 'my orders', 'track', 'login', 'logout', 'password', 'address'],
          responses: [
            "You can view your past orders, track current deliveries, and manage your account in the Profile section."
          ]
        },
        {
          intent: 'CONTACT',
          keywords: ['contact', 'support', 'help desk', 'customer care', 'complaint', 'issue', 'talk to human', 'call', 'refund', 'wrong', 'bad'],
          responses: [
            "If you need direct assistance or have a complaint, please visit our Support page or use the Contact Us section to reach our customer care team."
          ]
        },
        {
          intent: 'FAREWELL',
          keywords: ['bye', 'goodbye', 'see you', 'thanks', 'thank you', 'ok', 'okay', 'great', 'awesome', 'cool'],
          responses: [
            "You're welcome! Let me know if you need anything else.",
            "Goodbye! Have a great day ahead!",
            "Happy to help! See you next time."
          ]
        }
      ],
      ta: [
        {
          intent: 'GREETING',
          keywords: ['வணக்கம்', 'ஹலோ', 'காலை வணக்கம்', 'மாலை வணக்கம்'],
          responses: [
            "வணக்கம்! இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
            "ஹலோ! உணவு, மளிகை அல்லது வீட்டு சேவைகள் வேண்டுமா?"
          ]
        },
        {
          intent: 'WHO_ARE_YOU',
          keywords: ['நீ யார்', 'உன் பெயர் என்ன', 'உன்னால் என்ன செய்ய முடியும்', 'உதவி'],
          responses: [
            "நான் உங்களின் AI உதவியாளர். உணவு ஆர்டர் செய்யவும், மளிகை பொருட்கள் வாங்கவும் அல்லது வீட்டு சேவைகளை பதிவு செய்யவும் நான் உதவுவேன்."
          ]
        },
        {
          intent: 'FOOD_DELIVERY',
          keywords: ['உணவு', 'பசி', 'சாப்பிட', 'சாப்பாடு', 'பிரியாணி', 'ஹோட்டல்', 'ஆர்டர்', 'தோசை', 'இட்லி', 'மதிய உணவு', 'இரவு உணவு', 'சிக்கன்', 'மட்டன்'],
          responses: [
            "எங்கள் உணவு விநியோகப் பக்கத்தில் உங்களுக்கு பிடித்த உணவகங்களில் இருந்து ஆர்டர் செய்யலாம்.",
            "பசியாக உள்ளதா? அருமையான பிரியாணி மற்றும் தென்னிந்திய உணவுகள் காத்திருக்கின்றன!"
          ]
        },
        {
          intent: 'SUPERMARKET',
          keywords: ['மளிகை', 'காய்கறி', 'பழங்கள்', 'பால்', 'கடை', 'சூப்பர் மார்க்கெட்', 'பொருட்கள்', 'அரிசி', 'பருப்பு'],
          responses: [
            "உங்கள் அன்றாட தேவைகளான காய்கறிகள், பழங்கள் மற்றும் மளிகைப் பொருட்களை சூப்பர் மார்க்கெட் பிரிவில் வாங்கலாம்."
          ]
        },
        {
          intent: 'SERVICES',
          keywords: ['சேவை', 'வேலை', 'பிளம்பிங்', 'ஏசி', 'எலக்ட்ரீஷியன்', 'மெக்கானிக்', 'சுத்தம்', 'பழுது', 'சரிசெய்ய'],
          responses: [
            "எங்களிடம் பிளம்பிங், ஏசி மெக்கானிக், எலக்ட்ரீஷியன் போன்ற பல சிறந்த நிபுணர்கள் உள்ளனர்."
          ]
        },
        {
          intent: 'BOOKING',
          keywords: ['பதிவு', 'முன்பதிவு', 'புக்', 'எப்படி', 'வாங்கு'],
          responses: [
            "சேவையை பதிவு செய்ய, சேவை அட்டையில் உள்ள 'புக்' பொத்தானை கிளிக் செய்யவும்."
          ]
        },
        {
          intent: 'PROFILE',
          keywords: ['கணக்கு', 'சுயவிவரம்', 'முந்தைய ஆர்டர்கள்', 'வரலாறு', 'விலாசம்'],
          responses: [
            "உங்கள் முந்தைய ஆர்டர்கள் மற்றும் கணக்கு விவரங்களை Profile பகுதியில் காணலாம்."
          ]
        },
        {
          intent: 'FAREWELL',
          keywords: ['நன்றி', 'வருகிறேன்', 'விடைபெறுகிறேன்', 'சரி'],
          responses: [
            "உதவியதில் மகிழ்ச்சி! மீண்டும் சந்திக்கலாம்.",
            "நன்றி! உங்களுக்கு நல்ல நாள் அமையட்டும்."
          ]
        }
      ]
    };

    const currentLangIntents = language === 'en' ? intents.en : intents.ta;
    let matchedIntent = null;
    let maxScore = 0;
    let recognizedWordsCount = 0;

    // Clean input text (keep alphanumeric and Tamil characters)
    const cleanText = text.replace(/[^\w\s\u0B80-\u0BFF]/g, ' ').trim();
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const totalWords = words.length;

    // Advanced token scoring matching
    for (const intentObj of currentLangIntents) {
      let score = 0;
      for (const keyword of intentObj.keywords) {
        if (keyword.includes(' ')) {
          // Phrase matching: give higher weight if the exact phrase is found
          if (cleanText.includes(keyword)) {
            score += 4;
            recognizedWordsCount += keyword.split(' ').length;
          }
        } else {
          // Exact word match
          if (words.includes(keyword)) {
            score += 2;
            recognizedWordsCount += 1;
          } else {
            // Partial match for plurals/typos (only for words > 3 chars to avoid false positives)
            if (words.some(w => (w.includes(keyword) || keyword.includes(w)) && w.length > 3 && keyword.length > 3)) {
              score += 1;
              recognizedWordsCount += 1;
            }
          }
        }
      }

      if (score > maxScore) {
        maxScore = score;
        matchedIntent = intentObj;
      }
    }

    // Out-of-Domain Detection Logic
    // If the user says a very long sentence but we only recognize 0 or 1 word, it's likely unrelated or slang.
    const recognitionDensity = totalWords > 0 ? (recognizedWordsCount / totalWords) : 0;

    if (totalWords > 5 && recognitionDensity < 0.2 && maxScore < 3) {
      // Slang, complex, or unrelated sentence detected
      if (language === 'en') {
        response = "I only assist with Food Delivery, Groceries, and Home Services. Could you please ask about one of these topics?";
      } else {
        response = "நான் உணவு, மளிகை மற்றும் வீட்டு சேவைகளுக்கு மட்டுமே உதவுகிறேன். தயவுசெய்து இந்த தலைப்புகளில் கேட்க முடியுமா?";
      }
    } else if (matchedIntent && maxScore >= 1) {
      // Pick a random response from the matched intent to sound more natural
      const randomIdx = Math.floor(Math.random() * matchedIntent.responses.length);
      response = matchedIntent.responses[randomIdx];
    } else {
      // Fallback for short unrecognized sentences
      if (language === 'en') {
        response = "I couldn't quite understand that. You can ask me to order food, buy groceries, or book a home service expert.";
      } else {
        response = "மன்னிக்கவும், எனக்கு சரியாக புரியவில்லை. உணவு, மளிகை அல்லது வீட்டு சேவைகள் பற்றி நீங்கள் என்னிடம் கேட்கலாம்.";
      }
    }

    setAiResponse(response);
    speak(response);
  }, [language, speak]);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.onresult = (event) => {
      const resultTranscript = event.results[0][0].transcript;
      setTranscript(resultTranscript);
      setIsListening(false);
      handleAIResponse(resultTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [handleAIResponse]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      setTranscript('');
      setAiResponse('');
      recognition.lang = language === 'en' ? 'en-US' : 'ta-IN';
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error("Failed to start recognition:", e);
      }
    }
  };

  const isSpeechSupported = !!(recognitionRef.current || window.webkitSpeechRecognition);
  if (!isSpeechSupported || isHidden) return null;

  return (
    <div className="voice-assistant-wrapper" style={{
      position: 'fixed',
      bottom: isMobile ? '1rem' : '2rem',
      right: isMobile ? '1rem' : '2rem',
      zIndex: 9999
    }}>
      <style>{`
        body.hide-ai-assistant .voice-assistant-wrapper {
          display: none !important;
        }
      `}</style>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            style={{
              position: 'absolute', bottom: '5.5rem', right: 0,
              width: window.innerWidth <= 425 ? 'calc(100vw - 2rem)' : '320px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)', borderRadius: '2rem',
              padding: '1.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.4)',
              display: 'flex', flexDirection: 'column', gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  backgroundColor: isListening ? '#ef4444' : '#22c55e',
                  boxShadow: isListening ? '0 0 10px #ef4444' : 'none'
                }} />
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b' }}>
                  {isListening ? t('Listening...', 'கவனிக்கிறது...') : t('AI Assistant', 'AI உதவியாளர்')}
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '250px', paddingRight: '5px' }}>
              {transcript && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ alignSelf: 'flex-end', backgroundColor: '#3b82f6', color: 'white', padding: '0.7rem 1rem', borderRadius: '1.25rem 1.25rem 0 1.25rem', fontSize: '0.9rem', fontWeight: '500', maxWidth: '85%' }}>
                  {transcript}
                </motion.div>
              )}
              {aiResponse && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ alignSelf: 'flex-start', backgroundColor: '#f1f5f9', color: '#1e293b', padding: '0.7rem 1rem', borderRadius: '1.25rem 1.25rem 1.25rem 0', fontSize: '0.9rem', fontWeight: '600', border: '1px solid #e2e8f0', maxWidth: '85%' }}>
                  {aiResponse}
                </motion.div>
              )}
              {!transcript && !aiResponse && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1rem' }}>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {t('Tap the microphone and speak to me!', 'மைக்ரோஃபோனைத் தட்டி என்னிடம் பேசுங்கள்!')}
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleListening}
                style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  backgroundColor: isListening ? '#ef4444' : '#3b82f6',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', cursor: 'pointer', boxShadow: isListening ? '0 0 20px rgba(239, 68, 68, 0.4)' : '0 8px 20px rgba(59, 130, 246, 0.3)',
                  position: 'relative'
                }}
              >
                {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                {isListening && (
                  <motion.div
                    animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '3px solid #ef4444' }}
                  />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '6px', paddingRight: isMobile ? '6px' : '20px', borderRadius: '999px',
          boxShadow: '0 20px 40px rgba(59, 130, 246, 0.25)',
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          cursor: 'pointer',
          position: 'relative',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ width: isMobile ? '44px' : '56px', height: isMobile ? '44px' : '56px', borderRadius: '50%', overflow: 'hidden', border: '3px solid white', position: 'relative' }}>
          <img src={aiAvatar} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {isSpeaking && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Volume2 size={isMobile ? 18 : 24} color="white" />
            </motion.div>
          )}
        </div>
        {!isMobile && (
          <div style={{ marginLeft: '12px' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e3a8a', margin: 0 }}>{t('AI Assistant', 'AI உதவியாளர்')}</p>
            <p style={{ fontSize: '0.65rem', color: isListening ? '#ef4444' : '#64748b', fontWeight: '600', margin: 0 }}>
              {isListening ? t('Listening...', 'கவனிக்கிறது...') : t('Online', 'ஆன்லைன்')}
            </p>
          </div>
        )}

        {isOpen && (
          <div style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#0f172a', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
            <X size={12} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VoiceAssistant;
