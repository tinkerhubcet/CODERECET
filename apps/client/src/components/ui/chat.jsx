
import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function Chat() {
	useEffect(() => {
		// Apply custom CSS variables to match landing page design
		const style = document.createElement('style');
		style.textContent = `
			:root {
				--chat--color-primary: #2563eb;
				--chat--color-primary-shade-50: #1d4ed8;
				--chat--color-primary-shade-100: #1e40af;
				--chat--color-secondary: #10b981;
				--chat--color-secondary-shade-50: #059669;
				--chat--color-white: #ffffff;
				--chat--color-light: #f8fafc;
				--chat--color-light-shade-50: #f1f5f9;
				--chat--color-light-shade-100: #e2e8f0;
				--chat--color-medium: #cbd5e1;
				--chat--color-dark: #0f172a;
				--chat--color-disabled: #64748b;
				--chat--color-typing: #475569;

				--chat--spacing: 1rem;
				--chat--border-radius: 0.75rem;
				--chat--transition-duration: 0.15s;

				--chat--window--width: 100vw;
				--chat--window--height: 100vh;

				--chat--header-height: auto;
				--chat--header--padding: 1.5rem;
				--chat--header--background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
				--chat--header--color: var(--chat--color-white);
				--chat--header--border-top: none;
				--chat--header--border-bottom: none;
				--chat--heading--font-size: 1.75rem;
				--chat--heading--font-weight: 700;
				--chat--subtitle--font-size: 1rem;
				--chat--subtitle--line-height: 1.6;
				--chat--subtitle--opacity: 0.9;

				--chat--textarea--height: 56px;
				--chat--textarea--border-radius: 0.75rem;
				--chat--textarea--border: 2px solid #e2e8f0;
				--chat--textarea--focus-border: 2px solid #2563eb;

				--chat--message--font-size: 1rem;
				--chat--message--padding: 1rem 1.25rem;
				--chat--message--border-radius: 1rem;
				--chat--message-line-height: 1.6;
				--chat--message--bot--background: var(--chat--color-white);
				--chat--message--bot--color: var(--chat--color-dark);
				--chat--message--bot--border: 1px solid #e2e8f0;
				--chat--message--bot--shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
				--chat--message--user--background: #2563eb;
				--chat--message--user--color: var(--chat--color-white);
				--chat--message--user--border: none;
				--chat--message--user--shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
				--chat--message--pre--background: #f1f5f9;
				--chat--message--pre--border-radius: 0.5rem;

				--chat--toggle--background: #2563eb;
				--chat--toggle--hover--background: #1d4ed8;
				--chat--toggle--active--background: #1e40af;
				--chat--toggle--color: var(--chat--color-white);
				--chat--toggle--size: 64px;
				--chat--toggle--shadow: 0 10px 25px -3px rgba(37, 99, 235, 0.3);
			}
			
			body {
				margin: 0;
				padding: 0;
				overflow: hidden;
			}
			
			#n8n-chat {
				position: fixed !important;
				top: 0 !important;
				left: 0 !important;
				width: 100vw !important;
				height: 100vh !important;
				z-index: 9999 !important;
			}
		`;
		document.head.appendChild(style);

		createChat({
			webhookUrl: 'https://roshin2005.app.n8n.cloud/webhook/339ff846-b04e-4ad9-99f2-9d5c97517cdb/chat',
			mode: 'embedded',
			showWelcomeScreen: true,
			initialMessages: ['Hi there! 👋',
		'I am Vitalis. How can I assist you today?'],
			i18n: {
				en: {
					title: 'Vitalis Chat',
					subtitle: 'Your AI Health Assistant',
					footer: '',
					getStarted: 'Get Started',
					inputPlaceholder: 'Type your message...',
				}
			}
		});
	}, []);

	return (
		<div className="w-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
			{/* Chat will be rendered here by n8n */}
		</div>
	);
}