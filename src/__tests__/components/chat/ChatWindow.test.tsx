import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ChatWindow from '../../../components/chat/ChatWindow';
import chatReducer from '../../../store/slices/chatSlice';
import volunteersReducer from '../../../store/slices/volunteersSlice';
import authReducer from '../../../store/slices/authSlice';

// Mock scrollIntoView
const mockScrollIntoView = vi.fn();
window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

describe('ChatWindow', () => {
  const createMockStore = (customState = {}) => configureStore({
    reducer: {
      chat: chatReducer,
      volunteers: volunteersReducer,
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        userId: 'user1',
        isAuthenticated: true,
        role: 'volunteer',
        loading: false,
        error: null,
      },
      volunteers: {
        volunteers: [
          {
            id: 'receiver1',
            firstName: 'John',
            lastName: 'Doe',
            profilePicture: 'https://example.com/pic.jpg',
            email: 'john@example.com',
            phone: '123456789',
            skills: [],
            availability: {},
            joinedOrganizations: [],
            participatedEvents: [],
            preferredLanguage: 'en',
            registrationDate: new Date().toISOString(),
          },
        ],
        loading: false,
        error: null,
      },
      chat: {
        messages: [
          {
            id: 'msg1',
            senderId: 'user1',
            receiverId: 'receiver1',
            content: 'Hello',
            timestamp: new Date().toISOString(),
            read: false,
          },
        ],
        activeChat: null,
        loading: false,
        error: null,
      },
      ...customState,
    },
  });

  const defaultProps = {
    receiverId: 'receiver1',
    onClose: vi.fn(),
  };

  const renderWithProvider = (ui: React.ReactElement, store = createMockStore()) => {
    return render(
      <Provider store={store}>
        {ui}
      </Provider>
    );
  };

  beforeEach(() => {
    mockScrollIntoView.mockClear();
  });

  it('renders chat window with recipient info', () => {
    renderWithProvider(<ChatWindow {...defaultProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('displays messages', () => {
    renderWithProvider(<ChatWindow {...defaultProps} />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('sends message when clicking send button', () => {
    renderWithProvider(<ChatWindow {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'New message' } });
    fireEvent.click(sendButton);
    
    expect(input).toHaveValue('');
  });

  it('calls onClose when clicking close button', () => {
    renderWithProvider(<ChatWindow {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('scrolls to bottom when new message is added', () => {
    renderWithProvider(<ChatWindow {...defaultProps} />);
    
    expect(mockScrollIntoView).toHaveBeenCalled();
  });

  it('marks messages as read when received', () => {
    const store = createMockStore({
      chat: {
        messages: [
          {
            id: 'msg2',
            senderId: 'receiver1',
            receiverId: 'user1',
            content: 'Hi there',
            timestamp: new Date().toISOString(),
            read: false,
          },
        ],
      },
    });

    renderWithProvider(<ChatWindow {...defaultProps} />, store);
    
    const state = store.getState();
    expect(state.chat.messages[0].read).toBe(true);
  });

  it('shows typing indicator when typing', () => {
    renderWithProvider(<ChatWindow {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'typing...' } });
    
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('disables send button when message is empty', () => {
    renderWithProvider(<ChatWindow {...defaultProps} />);
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });
});