import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { AiAgentService, AgentExecutionResult } from '../store/aiAgentService';
import { SheffieldLogo } from './SheffieldLogo';

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionType?: string;
  success?: boolean;
}

interface AiAssistantWidgetProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onToast: (msg: string, isError?: boolean) => void;
}

export const AiAssistantWidget: React.FC<AiAssistantWidgetProps> = ({ user, onNavigate, onToast }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState<boolean>(true);

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello ${firstName}! I'm your Sheffield workplace assistant. You can speak into your microphone or type any request—such as booking holidays, submitting hours, approving leave, or posting vacancies. How may I help you today?`,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Support opening via custom event from Topbar or anywhere in the app
  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-sheffield-ai', handleOpenEvent);
    return () => window.removeEventListener('open-sheffield-ai', handleOpenEvent);
  }, []);

  // Setup Web Speech API for voice dictation in English
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-GB';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          onToast('Microphone access was denied. Please allow microphone permissions or type your request.', true);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition setup error:', e);
      setSpeechSupported(false);
    }
  }, [onToast]);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      onToast('Speech recognition is not available in this browser. Please type your request.', true);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        onToast('Listening... Speak your request naturally in English.', false);
      } catch (e) {
        console.warn('Could not start recognition:', e);
      }
    }
  };

  const speakText = (text: string) => {
    if (!voiceSpeechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Clean up markdown characters for clean speech synthesis
      const clean = text.replace(/[*_#•]/g, '').slice(0, 200);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'en-GB';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    if (!user) {
      onToast('Please sign in to access workplace actions.', true);
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsgId = `user-${Date.now()}`;
    const userMsg: MessageItem = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const result: AgentExecutionResult = AiAgentService.executeCommand(query, user);

      const assistantMsgId = `asst-${Date.now()}`;
      const assistantMsg: MessageItem = {
        id: assistantMsgId,
        sender: 'assistant',
        text: result.message,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        actionType: result.actionType,
        success: result.success,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakText(result.message);

      if (result.targetPage) {
        onNavigate(result.targetPage);
      }
    }, 280);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    '📅 Book 3 days holiday',
    "✓ Approve Daniel's leave",
    '⏱ Submit weekly timesheet',
    '💼 Post Care Coordinator vacancy',
    '£ Calculate October payroll',
    '👤 Switch to Helen Walker',
  ];

  return (
    <>
      {/* Floating Widget Launcher (Bottom Right) */}
      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 8,
          }}
        >
          <button
            onClick={() => setIsOpen(true)}
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 22px',
              background: 'linear-gradient(135deg, #005A36, #0D3826)',
              color: '#FFFFFF',
              border: '1px solid #1E7B50',
              borderRadius: 30,
              boxShadow: '0 8px 24px rgba(0, 90, 54, 0.35)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 14,
              fontFamily: 'Manrope, sans-serif',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            title="Open Sheffield Assistant"
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: '#4ADE80',
                boxShadow: '0 0 8px #4ADE80',
              }}
            />
            <span style={{ fontSize: 16 }}>✦</span>
            <span>Sheffield Assistant</span>
          </button>
        </div>
      )}

      {/* Expanded Friendly Conversational Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 'min(440px, 94vw)',
            height: 'min(580px, 84vh)',
            background: '#FFFFFF',
            borderRadius: 16,
            boxShadow: '0 20px 50px rgba(10, 35, 60, 0.22), 0 0 0 1px rgba(0, 90, 54, 0.12)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'DM Sans', sans-serif",
            animation: 'fadeInUp 0.2s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, #005A36, #0A2F1F)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #165637',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <SheffieldLogo size="sm" variant="white" showText={false} />
              <div>
                <strong style={{ display: 'block', fontSize: 14, fontFamily: 'Manrope, sans-serif' }}>
                  Sheffield Assistant
                </strong>
                <span style={{ fontSize: 11, color: '#A3D9BE', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: isListening ? '#EF4444' : '#4ADE80',
                    }}
                  />
                  {isListening ? 'Listening to speech...' : 'Always ready to help'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Voice Readout Toggle */}
              <button
                type="button"
                onClick={() => setVoiceSpeechEnabled(!voiceSpeechEnabled)}
                title={voiceSpeechEnabled ? 'Mute assistant voice response' : 'Enable assistant voice response'}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: 6,
                  padding: '6px 8px',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                {voiceSpeechEnabled ? '🔊' : '🔇'}
              </button>

              {/* Minimize/Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize Assistant"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: 6,
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div
            style={{
              padding: '8px 12px',
              background: '#F4F7FB',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              gap: 6,
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none',
            }}
          >
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p.replace(/^[^\s]+\s/, ''))}
                style={{
                  padding: '5px 12px',
                  background: '#FFFFFF',
                  border: '1px solid #D5E1EC',
                  borderRadius: 16,
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#1E3A5F',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#E8F3EE')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div
            style={{
              flex: 1,
              padding: 16,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              background: '#FAFCFE',
            }}
          >
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '11px 15px',
                      borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      background: isUser ? '#005A36' : '#FFFFFF',
                      color: isUser ? '#FFFFFF' : '#172C46',
                      border: isUser ? 'none' : '1px solid #E2E8F0',
                      boxShadow: isUser
                        ? '0 2px 8px rgba(0,90,54,0.18)'
                        : '0 2px 8px rgba(20,50,80,0.04)',
                      fontSize: 13.5,
                      lineHeight: 1.55,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {m.text}
                  </div>

                  <span
                    style={{
                      fontSize: 10,
                      color: '#8A99AD',
                      marginTop: 3,
                      padding: '0 4px',
                    }}
                  >
                    {m.timestamp}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Listening Pulse Bar */}
          {isListening && (
            <div
              style={{
                padding: '8px 16px',
                background: '#FEF2F2',
                borderTop: '1px solid #FCA5A5',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                color: '#991B1B',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#DC2626',
                  animation: 'pulse 1s infinite',
                }}
              />
              <span>Listening to your voice... Speak your request</span>
              <button
                type="button"
                onClick={() => {
                  if (recognitionRef.current) recognitionRef.current.stop();
                  setIsListening(false);
                }}
                style={{
                  marginLeft: 'auto',
                  padding: '3px 8px',
                  background: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                Stop
              </button>
            </div>
          )}

          {/* Input Area */}
          <div
            style={{
              padding: 12,
              background: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'Stop recording voice' : 'Speak your request with microphone'}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: 'none',
                background: isListening ? '#DC2626' : '#E8F3EE',
                color: isListening ? '#FFFFFF' : '#005A36',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                fontSize: 16,
                flexShrink: 0,
                transition: 'background 0.2s',
                boxShadow: isListening ? '0 0 12px rgba(220,38,38,0.4)' : 'none',
              }}
            >
              {isListening ? '⏹' : '🎤'}
            </button>

            {/* Natural English Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening...' : 'Ask me anything in English...'}
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1px solid #D5E1EC',
                borderRadius: 22,
                outline: 'none',
                fontSize: 13,
                background: '#F9FBFC',
              }}
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: 'none',
                background: inputText.trim() ? '#005A36' : '#E2E8F0',
                color: inputText.trim() ? '#FFFFFF' : '#94A3B8',
                cursor: inputText.trim() ? 'pointer' : 'default',
                display: 'grid',
                placeItems: 'center',
                fontSize: 14,
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
              title="Send to Sheffield Assistant"
            >
              ➔
            </button>
          </div>
        </div>
      )}
    </>
  );
};
