import { MessageCircle } from 'lucide-react';

interface GroupChatButtonProps {
  onClick: () => void;
  groupName: string;
  participantCount: number;
}

function GroupChatButton({ onClick, groupName, participantCount }: GroupChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
    >
      <MessageCircle className="h-5 w-5" />
      <span>Group Chat ({participantCount})</span>
    </button>
  );
}

export default GroupChatButton;