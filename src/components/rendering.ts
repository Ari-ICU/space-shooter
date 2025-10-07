import { GameState } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

export const drawGame = (
    ctx: CanvasRenderingContext2D,
    state: GameState,
    score: number,
    highScore: number,
    level: number,
    lives: number,
    isPaused: boolean,
    isGameOver: boolean
) => {
    const { player, bullets, asteroids, particles, stars } = state;

    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw stars
    ctx.fillStyle = '#FFFFFF';
    stars.forEach(star => {
        ctx.globalAlpha = 0.3 + Math.random() * 0.7;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    ctx.globalAlpha = 1;

    // Draw particles
    particles.forEach(p => {
        ctx.globalAlpha = p.life / 50;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Draw player
    if (!player.invulnerable || Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.fillStyle = '#00FFFF';
        ctx.beginPath();
        ctx.moveTo(player.x + player.width / 2, player.y);
        ctx.lineTo(player.x, player.y + player.height);
        ctx.lineTo(player.x + player.width, player.y + player.height);
        ctx.closePath();
        ctx.fill();

        // Engine glow
        ctx.fillStyle = '#00AAFF';
        ctx.beginPath();
        ctx.arc(player.x + player.width / 2, player.y + player.height + 10, 8, 0, Math.PI);
        ctx.fill();
    }

    // Draw bullets
    ctx.fillStyle = '#FFFF00';
    bullets.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x + 2.5, b.y + 5, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw asteroids
    asteroids.forEach(a => {
        ctx.save();
        ctx.translate(a.x + a.size / 2, a.y + a.size / 2);
        ctx.rotate(a.rotation);
        ctx.fillStyle = '#555555';
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = a.size / 2 * (0.8 + Math.random() * 0.4);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#333333';
        for (let i = 0; i < 3; i++) {
            const cx = (Math.random() - 0.5) * a.size * 0.6;
            const cy = (Math.random() - 0.5) * a.size * 0.6;
            const cr = a.size * (0.1 + Math.random() * 0.15);
            ctx.beginPath();
            ctx.arc(cx, cy, cr, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    });

    // Draw UI
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`High Score: ${highScore}`, 20, 60);
    ctx.fillText(`Level: ${level}`, CANVAS_WIDTH - 120, 30);

    ctx.fillStyle = '#FF5555';
    for (let i = 0; i < lives; i++) {
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH - 40 - i * 30, 50);
        ctx.lineTo(CANVAS_WIDTH - 30 - i * 30, 60);
        ctx.lineTo(CANVAS_WIDTH - 20 - i * 30, 50);
        ctx.lineTo(CANVAS_WIDTH - 30 - i * 30, 40);
        ctx.closePath();
        ctx.fill();
    }

    // Pause overlay
    if (isPaused) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.font = '24px Arial';
        ctx.fillText('Press P to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
        ctx.textAlign = 'left';
    }

    // Game over overlay
    if (isGameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#FF5555';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '28px Arial';
        ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        ctx.font = '24px Arial';
        ctx.fillText('Press R to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
        ctx.textAlign = 'left';
    }
};
