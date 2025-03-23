import { MessageCircle } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
  recipientName: string;
}

function ChatButton({ onClick, recipientName }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
    >
      <MessageCircle className="h-5 w-5" />
      <span>Message {recipientName}</span>
    </button>
  );
}

export default ChatButton;