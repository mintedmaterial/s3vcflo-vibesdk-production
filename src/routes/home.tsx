import { useRef, useState, useEffect, useMemo } from 'react';
import { ArrowRight } from 'react-feather';
import { useNavigate } from 'react-router';
import {
	AgentModeToggle,
	type AgentMode,
} from '../components/agent-mode-toggle';
import { useAuthGuard } from '../hooks/useAuthGuard';

// Logo URLs for background animation
const logoPngs = [
	"https://dexscreener.com/favicon.png",
	"https://dd.dexscreener.com/ds-data/dexes/shadow-exchange.png",
	"https://dd.dexscreener.com/ds-data/dexes/wagmi.png",
	"https://dd.dexscreener.com/ds-data/dexes/metropolis.png",
	"https://dd.dexscreener.com/ds-data/dexes/beets.png",
];

export default function Home() {
	const navigate = useNavigate();
	const { requireAuth } = useAuthGuard();
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [agentMode, setAgentMode] = useState<AgentMode>('deterministic');
	
	
	const placeholderPhrases = useMemo(() => [
		"todo list app",
		"F1 fantasy game",
		"personal finance tracker"
	], []);
	const [currentPlaceholderPhraseIndex, setCurrentPlaceholderPhraseIndex] = useState(0);
	const [currentPlaceholderText, setCurrentPlaceholderText] = useState("");
	const [isPlaceholderTyping, setIsPlaceholderTyping] = useState(true);

	const handleCreateApp = (query: string, mode: AgentMode) => {
		const encodedQuery = encodeURIComponent(query);
		const encodedMode = encodeURIComponent(mode);
		const intendedUrl = `/chat/new?query=${encodedQuery}&agentMode=${encodedMode}`;

		if (
			!requireAuth({
				requireFullAuth: true,
				actionContext: 'to create applications',
				intendedUrl: intendedUrl,
			})
		) {
			return;
		}

		// User is already authenticated, navigate immediately
		navigate(intendedUrl);
	};

	// Auto-resize textarea based on content
	const adjustTextareaHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			const scrollHeight = textareaRef.current.scrollHeight;
			const maxHeight = 300; // Maximum height in pixels
			textareaRef.current.style.height =
				Math.min(scrollHeight, maxHeight) + 'px';
		}
	};

	useEffect(() => {
		adjustTextareaHeight();
	}, []);

	// Background animation
	useEffect(() => {
		const canvas = document.getElementById('background-canvas') as HTMLCanvasElement;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const drops: Array<{
			x: number;
			y: number;
			speed: number;
			size: number;
			img: HTMLImageElement;
		}> = [];

		const images: HTMLImageElement[] = [];
		let imagesLoaded = 0;

		logoPngs.forEach((src) => {
			const img = new Image();
			img.src = src;
			img.onload = () => {
				imagesLoaded++;
				if (imagesLoaded === logoPngs.length) {
					initDrops();
				}
			};
			images.push(img);
		});

		function initDrops() {
			const dropCount = Math.floor((window.innerWidth * window.innerHeight) / 8000);
			for (let i = 0; i < dropCount; i++) {
				drops.push({
					x: Math.random() * window.innerWidth,
					y: Math.random() * -window.innerHeight,
					speed: Math.random() * 2 + 1,
					size: Math.random() * 32 + 16,
					img: images[Math.floor(Math.random() * images.length)],
				});
			}
			animate();
		}

		function animate() {
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			drops.forEach((drop) => {
				if (drop.img.complete && ctx) {
					ctx.globalAlpha = 0.15;
					ctx.drawImage(drop.img, drop.x, drop.y, drop.size, drop.size);
				}
				drop.y += drop.speed;
				if (drop.y > canvas.height) {
					drop.y = -drop.size;
					drop.x = Math.random() * canvas.width;
				}
			});

			if (ctx) ctx.globalAlpha = 1;
			requestAnimationFrame(animate);
		}

		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);
	
	// Typewriter effect
	useEffect(() => {
		const currentPhrase = placeholderPhrases[currentPlaceholderPhraseIndex];
		
		if (isPlaceholderTyping) {
			if (currentPlaceholderText.length < currentPhrase.length) {
				const timeout = setTimeout(() => {
					setCurrentPlaceholderText(currentPhrase.slice(0, currentPlaceholderText.length + 1));
				}, 100); // Typing speed
				return () => clearTimeout(timeout);
			} else {
				// Pause before erasing
				const timeout = setTimeout(() => {
					setIsPlaceholderTyping(false);
				}, 2000); // Pause duration
				return () => clearTimeout(timeout);
			}
		} else {
			if (currentPlaceholderText.length > 0) {
				const timeout = setTimeout(() => {
					setCurrentPlaceholderText(currentPlaceholderText.slice(0, -1));
				}, 50); // Erasing speed
				return () => clearTimeout(timeout);
			} else {
				// Move to next phrase
				setCurrentPlaceholderPhraseIndex((prev) => (prev + 1) % placeholderPhrases.length);
				setIsPlaceholderTyping(true);
			}
		}
	}, [currentPlaceholderText, currentPlaceholderPhraseIndex, isPlaceholderTyping, placeholderPhrases]);
	return (
		<div className="flex flex-col items-center size-full relative">
			<div className="absolute inset-0 z-0 opacity-10">
				<canvas id="background-canvas" className="absolute inset-0 w-full h-full pointer-events-none" />
			</div>
			<div className="rounded-md mt-46 w-full max-w-2xl overflow-hidden relative z-10">
				<div className="px-6 p-8 flex flex-col items-center">
					<h1 className="text-shadow-sm text-shadow-red-200 dark:text-shadow-red-900 text-accent font-medium leading-[1.1] tracking-tight text-6xl w-full mb-4 bg-clip-text bg-gradient-to-r from-text-primary to-text-primary/90">
						What should we build today?
					</h1>

					<form
						method="POST"
						onSubmit={(e) => {
							e.preventDefault();
							const query = textareaRef.current!.value;
							handleCreateApp(query, agentMode);
						}}
						className="flex z-10 flex-col w-full min-h-[150px] bg-bg-4 border border-accent/30 dark:border-accent/50 justify-between dark:bg-bg-2 rounded-[18px] shadow-textarea p-5 transition-all duration-200"
					>
						<textarea
							className="w-full resize-none ring-0 z-20 outline-0 placeholder:text-text-primary/60 text-text-primary"
							name="query"
							placeholder={`Create a ${currentPlaceholderText}`}
							ref={textareaRef}
							onChange={adjustTextareaHeight}
							onInput={adjustTextareaHeight}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									const query = textareaRef.current!.value;
									handleCreateApp(query, agentMode);
								}
							}}
						/>
						<div className="flex items-center justify-between mt-4 pt-1">
							{import.meta.env.VITE_AGENT_MODE_ENABLED ? (
								<AgentModeToggle
									value={agentMode}
									onChange={setAgentMode}
									className="flex-1"
								/>
							) : (
								<div></div>
							)}

							<div className="flex items-center justify-end ml-4">
								<button
									type="submit"
									className="bg-accent text-white p-1 rounded-md *:size-5 transition-all duration-200 hover:shadow-md"
								>
									<ArrowRight />
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
