import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { sendMessage, markMessageAsRead } from '../../store/slices/chatSlice';
import { Send, X, Image, Smile, Paperclip, Users, Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

interface GroupChatWindowProps {
  groupId: string;
  groupType: 'event' | 'organization';
  onClose: () => void;
}

function GroupChatWindow({ groupId, groupType, onClose }: GroupChatWindowProps) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userId } = useSelector((state: RootState) => state.auth);
  
  const messages = useSelector((state: RootState) => 
    state.chat.messages.filter(m => m.groupId === groupId)
  );
  
  const group = useSelector((state: RootState) => 
    groupType === 'event' 
      ? state.events.events.find(e => e.id === groupId)
      : state.organizations.organizations.find(o => o.id === groupId)
  );

  const participants = useSelector((state: RootState) => {
    if (groupType === 'event') {
      const event = state.events.events.find(e => e.id === groupId);
      return state.volunteers.volunteers.filter(v => event?.registeredVolunteers.includes(v.id));
    } else {
      const org = state.organizations.organizations.find(o => o.id === groupId);
      return state.volunteers.volunteers.filter(v => org?.volunteerIds.includes(v.id));
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    messages
      .filter(m => m.senderId !== userId && !m.read)
      .forEach(m => dispatch(markMessageAsRead(m.id)));
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || !userId) return;

    dispatch(sendMessage({
      id: `msg-${Date.now()}`,
      senderId: userId,
      groupId,
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

  const getSender = (senderId: string) => {
    return participants.find(p => p.id === senderId);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {groupType === 'organization' ? (
              <img
                src={(group as any)?.logo}
                alt={group?.name}
                className="h-10 w-10 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-700 border-2 border-white flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
            )}
          </div>
          <div>
            <span className="font-medium">{group?.name}</span>
            <p className="text-xs text-white/80">
              {participants.length} participants
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 space-y-4 h-[400px] overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => {
          const isSender = msg.senderId === userId;
          const sender = getSender(msg.senderId);
          const showAvatar = !isSender && (!messages[index - 1] || messages[index - 1].senderId !== msg.senderId);
          
          return (
            <div
              key={msg.id}
              className={`flex items-end space-x-2 ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              {!isSender && showAvatar && (
                <img
                  src={sender?.profilePicture}
                  alt={sender?.firstName}
                  className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div
                className={`max-w-[70%] p-3 rounded-2xl ${
                  isSender
                    ? 'bg-primary-500 text-white rounded-br-none'
                    : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                }`}
              >
                {!isSender && showAvatar && (
                  <p className="text-xs font-medium mb-1">
                    {sender?.firstName} {sender?.lastName}
                  </p>
                )}
                <p className="break-words">{msg.content}</p>
                <div className={`flex items-center space-x-1 text-xs mt-1 ${
                  isSender ? 'text-white/70' : 'text-gray-500'
                }`}>
                  <span>{formatMessageTime(msg.timestamp)}</span>
                  {isSender && (
                    msg.read 
                      ? <CheckCheck className="h-3 w-3" />
                      : <Check className="h-3 w-3" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
              <Users className="h-4 w-4 text-gray-500" />
            </div>
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

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Paperclip className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Image className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full border-gray-200 focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Smile className="h-5 w-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default GroupChatWindow;