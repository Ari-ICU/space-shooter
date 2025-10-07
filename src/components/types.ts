export interface Vector2D {
    x: number;
    y: number;
}

export interface Bullet extends Vector2D {
    velocity: number;
}

export interface Asteroid extends Vector2D {
    size: number;
    velocity: number;
    rotation: number;
    rotationSpeed: number;
}

export interface Particle extends Vector2D {
    size: number;
    life: number;
    decay: number;
    color: string;
    velocityX?: number;
    velocityY?: number;
}

export interface Player {
    x: number;
    y: number;
    width: number;
    height: number;
    invulnerable: boolean;
    invulnTimer: number;
}

export interface Star {
    x: number;
    y: number;
    size: number;
    speed: number;
}

export interface GameState {
    player: Player;
    bullets: Bullet[];
    asteroids: Asteroid[];
    particles: Particle[];
    stars: Star[];
    keys: Record<string, boolean>;
    lastShot: number;
    asteroidSpawnTimer: number;
    levelUpTimer: number;
    gameRunning: boolean;
    animationId: number;
    lastTime: number;
}
