import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function Chat() {
	useEffect(() => {
		

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
		<div >
			{/* Chat will be rendered here by n8n */}
		</div>
	);
}