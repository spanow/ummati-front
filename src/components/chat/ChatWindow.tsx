import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { sendMessage, markMessageAsRead } from '../../store/slices/chatSlice';
import { Send, X, Image, Smile, Paperclip, Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

interface ChatWindowProps {
  receiverId: string;
  onClose: () => void;
}

function ChatWindow({ receiverId, onClose }: ChatWindowProps) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userId } = useSelector((state: RootState) => state.auth);
  
  // Memoize messages selector
  const messages = useSelector((state: RootState) => 
    state.chat.messages.filter(m => 
      (m.senderId === userId && m.receiverId === receiverId) ||
      (m.senderId === receiverId && m.receiverId === userId)
    )
  );
  
  const receiver = useSelector((state: RootState) => 
    state.volunteers.volunteers.find(v => v.id === receiverId)
  );

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
    messages
      .filter(m => m.senderId === receiverId && !m.read)
      .forEach(m => dispatch(markMessageAsRead(m.id)));
  }, [messages, dispatch, receiverId]);

  const handleSend = () => {
    if (!message.trim() || !userId) return;

    dispatch(sendMessage({
      id: `msg-${Date.now()}`,
      senderId: userId,
      receiverId,
      content: message,
      timestamp: new Date().toISOString(),
      read: false,
    }));

    setMessage('');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  return (
    <div 
      className="fixed bottom-0 right-0 sm:bottom-4 sm:right-4 w-full sm:w-96 bg-white rounded-none sm:rounded-xl shadow-xl border-t sm:border border-gray-100 flex flex-col max-h-[100vh] sm:max-h-[600px]"
      role="dialog"
      aria-labelledby="chat-title"
    >
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-t-none sm:rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={receiver?.profilePicture}
              alt={receiver?.firstName}
              className="h-10 w-10 rounded-full object-cover border-2 border-white"
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <span id="chat-title" className="font-medium">
              {receiver?.firstName} {receiver?.lastName}
            </span>
            <p className="text-xs text-white/80">Online</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => {
          const isSender = msg.senderId === userId;
          const showAvatar = !isSender && (!messages[index - 1] || messages[index - 1].senderId !== msg.senderId);
          
          return (
            <div
              key={msg.id}
              className={`flex items-end space-x-2 ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              {!isSender && showAvatar && (
                <img
                  src={receiver?.profilePicture}
                  alt={receiver?.firstName}
                  className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div
                className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl ${
                  isSender
                    ? 'bg-primary-500 text-white rounded-br-none'
                    : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="break-words">{msg.content}</p>
                <div className={`flex items-center space-x-1 text-xs mt-1 ${
                  isSender ? 'text-white/70' : 'text-gray-500'
                }`}>
                  <span>{formatMessageTime(msg.timestamp)}</span>
                  {isSender && (
                    msg.read 
                      ? <CheckCheck className="h-3 w-3" aria-label="Read" />
                      : <Check className="h-3 w-3" aria-label="Sent" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex items-center space-x-2">
            <img
              src={receiver?.profilePicture}
              alt={receiver?.firstName}
              className="h-6 w-6 rounded-full object-cover"
            />
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100 bg-white rounded-b-none sm:rounded-b-xl">
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex space-x-2">
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              aria-label="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              aria-label="Add image"
            >
              <Image className="h-5 w-5" />
            </button>
          </div>
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full border-gray-200 focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            aria-label="Message input"
          />
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 hidden sm:block"
            aria-label="Add emoji"
          >
            <Smile className="h-5 w-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;