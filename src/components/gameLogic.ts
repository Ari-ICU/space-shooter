import { Asteroid, Particle, Player, GameState, Star } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_SIZE, PLAYER_SPEED, BULLET_SPEED, BASE_SPAWN_RATE, MAX_ASTEROIDS } from './constants';

export const createExplosion = (x: number, y: number, color: string): Particle[] => {
    const particles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
        particles.push({
            x,
            y,
            size: Math.random() * 4 + 2,
            life: Math.random() * 30 + 20,
            decay: Math.random() * 0.5 + 0.5,
            color,
            velocityX: (Math.random() - 0.5) * 3,
            velocityY: (Math.random() - 0.5) * 3,
        });
    }
    return particles;
};

export const spawnAsteroid = (level: number): Asteroid => {
    const maxSize = Math.min(60, 30 + level * 5);
    const minSize = Math.max(20, 30 - level * 2);
    const size = Math.random() * (maxSize - minSize) + minSize;
    return {
        x: Math.random() * (CANVAS_WIDTH - size),
        y: -size,
        size,
        velocity: 1 + Math.random() * (2 + level * 0.5),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
    };
};

export const resetPlayer = (): Player => ({
    x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
    y: CANVAS_HEIGHT - 100,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    invulnerable: true,
    invulnTimer: 120,
});

export const updateStars = (stars: Star[]) => {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > CANVAS_HEIGHT) {
            star.y = 0;
            star.x = Math.random() * CANVAS_WIDTH;
        }
    });
};

export const updateGame = (
    state: GameState,
    delta: number,
    level: number,
    isPaused: boolean,
    setScore: (fn: (prev: number) => number) => void,
    setLives: (fn: (prev: number) => number) => void,
    setGameOver: (value: boolean) => void,
    setLevel: (fn: (prev: number) => number) => void
) => {
    if (isPaused) return;

    const { player, bullets, asteroids, particles, keys, stars } = state;
    const deltaSec = delta / 16;

    // Update stars
    updateStars(stars);

    // Player movement
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= PLAYER_SPEED * deltaSec;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += PLAYER_SPEED * deltaSec;
    player.x = Math.max(0, Math.min(player.x, CANVAS_WIDTH - player.width));

    // Shooting
    const now = Date.now();
    if ((keys[' '] || keys['Enter']) && now - state.lastShot > 200) {
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            velocity: BULLET_SPEED
        });
        state.lastShot = now;
    }

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].velocity * deltaSec;
        if (bullets[i].y < 0) bullets.splice(i, 1);
    }

    // Asteroid spawning
    state.asteroidSpawnTimer += delta;
    const spawnThreshold = 1000 / (BASE_SPAWN_RATE * (1 + level * 0.3));
    if (state.asteroidSpawnTimer > spawnThreshold && asteroids.length < MAX_ASTEROIDS) {
        asteroids.push(spawnAsteroid(level));
        state.asteroidSpawnTimer = 0;
    }

    // Update asteroids
    asteroids.forEach(a => {
        a.y += a.velocity * deltaSec;
        a.rotation += a.rotationSpeed * deltaSec;
    });

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= deltaSec;
        p.x += (p.velocityX || 0) * deltaSec;
        p.y += (p.velocityY || 0.5) * deltaSec;
        if (p.life <= 0) particles.splice(i, 1);
    }

    // Player invulnerability
    if (player.invulnerable) {
        player.invulnTimer -= deltaSec;
        if (player.invulnTimer <= 0) player.invulnerable = false;
    }

    // Collision detection
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i];
        let asteroidHit = false;

        // Bullet collisions
        for (let j = bullets.length - 1; j >= 0; j--) {
            const b = bullets[j];
            const dx = (b.x + 2.5) - (a.x + a.size / 2);
            const dy = (b.y + 5) - (a.y + a.size / 2);
            if (Math.sqrt(dx*dx + dy*dy) < a.size/2 + 5) {
                particles.push(...createExplosion(a.x + a.size/2, a.y + a.size/2, '#FFAA00'));
                bullets.splice(j, 1);
                asteroids.splice(i, 1);
                asteroidHit = true;
                setScore(prev => prev + Math.floor(a.size));
                break;
            }
        }
        if (asteroidHit) continue;

        // Player collisions
        if (!player.invulnerable) {
            const dx = (player.x + player.width / 2) - (a.x + a.size / 2);
            const dy = (player.y + player.height / 2) - (a.y + a.size / 2);
            if (Math.sqrt(dx*dx + dy*dy) < player.width/2 + a.size/2) {
                particles.push(...createExplosion(player.x + player.width/2, player.y + player.height/2, '#FF4444'));
                setLives(prev => {
                    const newLives = prev - 1;
                    if (newLives <= 0) {
                        setGameOver(true);
                        state.gameRunning = false;
                    } else {
                        state.player = resetPlayer();
                    }
                    return newLives;
                });
                asteroids.splice(i, 1);
                break;
            }
        }

        if (a.y > CANVAS_HEIGHT) asteroids.splice(i, 1);
    }

    // Level progression
    state.levelUpTimer += delta;
    if (state.levelUpTimer > 30000) {
        setLevel(prev => prev + 1);
        state.levelUpTimer = 0;
    }
};
