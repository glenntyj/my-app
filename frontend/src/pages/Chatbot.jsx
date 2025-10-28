import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import ChatScrollButton from '../components/Chatbot/ChatScrollButton.jsx';
import '../index.css';
import botAvatar from '../assets/bot-avatar.jpg';

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [customerText, setCustomerText] = useState('');
  const [thinking, setThinking] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [displayedTime, setDisplayedTime] = useState('');
  const [isTypingAnim, setIsTypingAnim] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const sessionId = useRef(Date.now().toString());
  const chatContainerRef = useRef();
  const canvasRef = useRef(null);
  const bottomRef = useRef();
  const socketRef = useRef();

  const quickReplies = [
    { label: 'Track Order', text: 'Where is my order?' },
    { label: 'Refund', text: 'How do I return an item?' },
    { label: 'Talk to human', text: 'I want to talk to a human' }
  ];

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      // Join session
      socketRef.current.emit('joinSession', sessionId.current, 'customer');
    });

    socketRef.current.on('disconnect', () => setIsConnected(false));

    socketRef.current.on('chatMessage', (msg) => {
      if (msg.from === 'bot') {
        // trigger typing animation
        setThinking(false);
        addBotMessage(msg.text, msg.sessionId);
      }
    });

    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function addBotMessage(fullText, sessionId) {
    setIsTypingAnim(true);
    setDisplayedText('');
    setDisplayedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    for (const char of Array.from(fullText)) {
      setDisplayedText(prev => prev + char);
      await sleep(20);
    }

    setIsTypingAnim(false);

    setMessages(prev => [
      ...prev,
      { from: 'bot', text: fullText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sessionId }
    ]);
  }

  const handleAttachment = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log("Attached file:", file.name);
    // You can later send it to the server or display a preview
  };

  const toggleDictation = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCustomerText(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    }
  };

  const handleCustomerSend = (e, textOverride) => {
    if (thinking || isTypingAnim) return;

    e?.preventDefault();
    const textToSend = textOverride || customerText;
    if (!textToSend.trim()) return;

    const newMsg = {
      from: 'customer',
      text: textToSend,
      sessionId: sessionId.current,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setCustomerText('');
    socketRef.current.emit('chatMessage', newMsg);
    setThinking(true);
  };

  const handleExport = () => {
    if (!messages.length) return;
    const text = messages.map(m => `[${m.time}] ${m.from.toUpperCase()}: ${m.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `chat_${sessionId.current}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div>
          <span>CSBOT</span>
          <span className={`bot-status ${isConnected ? 'online' : 'offline'}`}></span>
        </div>
        <button onClick={handleExport} disabled={!isConnected}>Export Chat</button>
      </div>

      {!isConnected && <div className="chat-connection-status">Server is currently offline. Please try again later.</div>}

      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((m,i) => (
          <div key={i} className={`chat-message ${m.from}`}>
            {m.from === 'bot' && <img src={botAvatar} alt="bot" className="img-avatar" />}
            <div className={`chat-bubble ${m.from}`}>
              {m.from === 'bot' && <span className="bot-name">CSBOT</span>}
              <span>{m.text}</span>
              <span className="chat-time">{m.time}</span>
            </div>
          </div>
        ))}

        {(isTypingAnim || thinking) && (
          <div className="chat-message bot">
            <img src={botAvatar} alt="bot" className="img-avatar" />
            <div className="chat-bubble bot">
              <span className="bot-name">CSBOT</span>
              <span>{thinking ? <div className="thinking-indicator">Thinking...</div> : displayedText}</span>
              <span className="chat-time">{displayedTime}</span>
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {isConnected && (
        <div className="quick-replies">
          {quickReplies.map((q,i) => (
            <button key={i} onClick={() => handleCustomerSend(null, q.text)}>{q.label}</button>
          ))}
        </div>
      )}

      <hr style={{border:'none', borderTop:`1px solid var(--border)`, margin:0}} />

      {/* <form className="chat-input-form" onSubmit={handleCustomerSend}>
        <input value={customerText} onChange={e=>setCustomerText(e.target.value)} placeholder="Type a message..." disabled={!isConnected} />
        <button type="submit" disabled={!isConnected}>Send</button>
      </form> */}

      <form className="chat-input-form" onSubmit={handleCustomerSend}>
        {/* Attachment button */}
        <button className="chat-icon-btn" htmlFor="file-upload" title="Attach a file" disabled={!isConnected}>
          <svg xmlns="http://www.w3.org/2000/svg" 
              fill="none" viewBox="0 0 24 24" 
              strokeWidth="2" stroke="currentColor" 
              className="chat-icon">
            <path strokeLinecap="round" strokeLinejoin="round" 
                  d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <input
          id="file-upload"
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => handleAttachment(e)}
          disabled={!isConnected}
        />

        {/* Text input */}
        <input
          value={customerText}
          onChange={(e) => setCustomerText(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
        />

        {/* Dictate / mic button */}
        <button
          type="button"
          className={`chat-icon-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleDictation}
          disabled={!isConnected}
          title="Start voice input"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
              fill="none" viewBox="0 0 24 24" 
              strokeWidth="2" stroke="currentColor" 
              className="chat-icon mic-icon">
            <path strokeLinecap="round" strokeLinejoin="round" 
                  d="M12 1.5a3 3 0 0 1 3 3v7.5a3 3 0 0 1-6 0V4.5a3 3 0 0 1 3-3Zm6 10.5a6 6 0 0 1-12 0m12 0v3a6 6 0 0 1-6 6m-6-6v-3m6 9v1.5" />
          </svg>
        </button>

        {/* Send button */}
        <button type="submit" className="chat-icon-btn send-btn" disabled={!isConnected} title="Send message">
          <svg xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
              strokeWidth="2" stroke="currentColor"
              className="chat-icon">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 4.5 21 12l-18 7.5v-6l12-1.5L3 7.5V4.5Z" />
          </svg>
        </button>
      </form>

      <ChatScrollButton chatContainerRef={chatContainerRef} />
    </div>
  );
}
