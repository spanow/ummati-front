import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { format } from 'date-fns';
import { Search, Users, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ChatList() {
  const [searchTerm, setSearchTerm] = useState('');
  const { userId } = useSelector((state: RootState) => state.auth);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const volunteers = useSelector((state: RootState) => state.volunteers.volunteers);
  const organizations = useSelector((state: RootState) => state.organizations.organizations);
  const events = useSelector((state: RootState) => state.events.events);

  // Get unique chat participants
  const chatParticipants = new Set([
    ...messages
      .filter(m => m.senderId === userId || m.receiverId === userId)
      .map(m => m.senderId === userId ? m.receiverId : m.senderId)
      .filter(Boolean) as string[]
  ]);

  // Get group chats
  const groupChats = new Set([
    ...messages
      .filter(m => m.groupId)
      .map(m => m.groupId)
      .filter(Boolean) as string[]
  ]);

  const filteredParticipants = Array.from(chatParticipants)
    .map(id => volunteers.find(v => v.id === id))
    .filter(v => 
      v && (
        v.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const filteredGroups = Array.from(groupChats)
    .map(id => {
      const event = events.find(e => e.id === id);
      if (event) return { id, type: 'event', name: event.title };
      
      const org = organizations.find(o => o.id === id);
      if (org) return { id, type: 'organization', name: org.name };
      
      return null;
    })
    .filter(g => g && g.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const getLastMessage = (participantId: string) => {
    return messages
      .filter(m => 
        (m.senderId === userId && m.receiverId === participantId) ||
        (m.senderId === participantId && m.receiverId === userId)
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };

  const getGroupLastMessage = (groupId: string) => {
    return messages
      .filter(m => m.groupId === groupId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };

  return (
    <div className="bg-white h-full">
      <div className="sticky top-0 p-4 bg-white border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {filteredGroups.map((group) => {
            if (!group) return null;
            const lastMessage = getGroupLastMessage(group.id);
            
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 truncate">{group.name}</p>
                      {lastMessage && (
                        <span className="text-xs text-gray-500">
                          {format(new Date(lastMessage.timestamp), 'h:mm a')}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredParticipants.map((participant) => {
            if (!participant) return null;
            const lastMessage = getLastMessage(participant.id);
            
            return (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={participant.profilePicture}
                    alt={`${participant.firstName} ${participant.lastName}`}
                    className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 truncate">
                        {participant.firstName} {participant.lastName}
                      </p>
                      {lastMessage && (
                        <span className="text-xs text-gray-500">
                          {format(new Date(lastMessage.timestamp), 'h:mm a')}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredParticipants.length === 0 && filteredGroups.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No chats found</h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ChatList;