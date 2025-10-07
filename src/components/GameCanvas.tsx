'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, Star } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { updateGame, resetPlayer } from './gameLogic';
import { drawGame } from './rendering';

export default function GameCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gameLoopRef = useRef<((timestamp: number) => void) | null>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isGameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);

    // Helper to generate stars
    const generateStars = (count: number): Star[] =>
        Array.from({ length: count }, () => ({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.2, 
        }));


    const gameRef = useRef<GameState>({
        player: resetPlayer(),
        bullets: [],
        asteroids: [],
        particles: [],
        keys: {},
        lastShot: 0,
        asteroidSpawnTimer: 0,
        levelUpTimer: 0,
        gameRunning: true,
        animationId: 0,
        lastTime: 0,
        stars: generateStars(100),
    });

    // Load high score
    useEffect(() => {
        const savedHighScore = localStorage.getItem('asteroidHighScore');
        if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
    }, []);

    // Save high score
    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('asteroidHighScore', score.toString());
        }
    }, [score, highScore]);

    // Handle keyboard input
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            gameRef.current.keys[e.key] = true;
            if (e.key === ' ' && !isPaused && !isGameOver) e.preventDefault();
            if (e.key === 'p' || e.key === 'P') setIsPaused(prev => !prev);
        },
        [isPaused, isGameOver]
    );

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        gameRef.current.keys[e.key] = false;
    }, []);

    // Game loop
    const gameLoop = useCallback(
        (timestamp: number) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            if (gameRef.current.gameRunning && !isPaused && !isGameOver) {
                const delta = timestamp - (gameRef.current.lastTime || timestamp);
                gameRef.current.lastTime = timestamp;

                updateGame(
                    gameRef.current,
                    delta,
                    level,
                    isPaused,
                    setScore,
                    setLives,
                    setGameOver,
                    setLevel
                );
            }

            drawGame(ctx, gameRef.current, score, highScore, level, lives, isPaused, isGameOver);

            if (gameRef.current.gameRunning) {
                gameRef.current.animationId = requestAnimationFrame(gameLoopRef.current!);
            }
        },
        [isPaused, isGameOver, score, highScore, level, lives]
    );

    // Store latest gameLoop in ref
    useEffect(() => {
        gameLoopRef.current = gameLoop;
    }, [gameLoop]);

    // Restart function
    const handleRestart = useCallback(() => {
        cancelAnimationFrame(gameRef.current.animationId);

        gameRef.current = {
            player: resetPlayer(),
            bullets: [],
            asteroids: [],
            particles: [],
            keys: {},
            lastShot: 0,
            asteroidSpawnTimer: 0,
            levelUpTimer: 0,
            gameRunning: true,
            animationId: 0,
            lastTime: 0,
            stars: generateStars(100),
        };

        setScore(0);
        setLives(3);
        setLevel(1);
        setGameOver(false);
        setIsPaused(false);

        // Start loop safely
        gameRef.current.animationId = requestAnimationFrame(gameLoopRef.current!);
    }, []);

    // Initialize game
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        gameRef.current = {
            player: resetPlayer(),
            bullets: [],
            asteroids: [],
            particles: [],
            keys: {},
            lastShot: 0,
            asteroidSpawnTimer: 0,
            levelUpTimer: 0,
            gameRunning: true,
            animationId: 0,
            lastTime: 0,
            stars: generateStars(100),
        };

        setScore(0);
        setLives(3);
        setLevel(1);
        setGameOver(false);
        setIsPaused(false);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        gameRef.current.animationId = requestAnimationFrame(gameLoopRef.current!);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(gameRef.current.animationId);
        };
    }, [handleKeyDown, handleKeyUp]);

    // Restart with R key
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.key === 'r' || e.key === 'R') && isGameOver) {
                e.preventDefault();
                handleRestart();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isGameOver, handleRestart]);

    return (
        <div className="flex flex-col items-center justify-center bg-gray-900">
            <div className="relative">
                <canvas
                    ref={canvasRef}
                    className="border-2 border-cyan-500 rounded-lg shadow-2xl bg-black"
                    style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
                />
                {/* Pause Overlay */}
                {isPaused && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
                        <div className="text-center p-6 bg-gray-800 rounded-xl border-2 border-cyan-400">
                            <h2 className="text-4xl font-bold text-cyan-400 mb-4">PAUSED</h2>
                            <p className="text-white text-xl">
                                Press <span className="font-bold">P</span> to resume
                            </p>
                        </div>
                    </div>
                )}
                {/* Game Over Overlay */}
                {isGameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded-lg">
                        <div className="text-center p-6 bg-gray-800 rounded-xl border-2 border-red-500">
                            <h2 className="text-4xl font-bold text-red-500 mb-2">GAME OVER</h2>
                            <p className="text-white text-2xl mb-4">
                                Final Score: <span className="font-bold">{score}</span>
                            </p>
                            <button
                                onClick={handleRestart}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
                            >
                                🔄 Restart Game
                            </button>
                            <p className="text-gray-300 mt-4">
                                Press <span className="font-bold">R</span> to restart
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
