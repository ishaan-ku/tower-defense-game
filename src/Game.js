
import Map from './Map.js';
import Enemy from './Enemy.js';
import Tower from './Tower.js';
import UI from './UI.js';
import Projectile from './Projectile.js';

export default class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = 800;
        this.height = this.canvas.height = 600;

        this.lastTime = 0;
        this.money = 250;
        this.lives = 20;
        this.wave = 1;
        this.waveInProgress = false;

        this.map = new Map(this);
        this.enemies = [];
        this.towers = [];
        this.projectiles = [];

        this.waveConfig = {
            1: { count: 5, type: 'basic', interval: 1500 },
            2: { count: 10, type: 'basic', interval: 1000 },
            3: { count: 5, type: 'fast', interval: 1000 },
            4: { count: 15, type: 'basic', interval: 800 },
            5: { count: 5, type: 'heavy', interval: 2000 },
            6: { count: 20, type: 'fast', interval: 500 },
            7: { count: 3, type: 'boss', interval: 3000 }
        };

        this.enemiesToSpawn = 0;
        this.spawnTimer = 0;
        this.spawnInterval = 1000;
        this.currentEnemyType = 'basic';

        this.ui = new UI(this);
        this.active = false;

        // Input handling
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        // Cheat codes
        window.addEventListener('keydown', (e) => {
            if (e.key === 'm' || e.key === 'M') {
                this.money += 1000000000000000;
                this.ui.updateMoney();
                console.log("Cheat activated: Money!");
            }
        });

        // Level Select
        const levelSelect = document.getElementById('level-select');
        levelSelect.addEventListener('change', (e) => this.loadLevel(parseInt(e.target.value)));

        this.start();
    }

    start() {
        this.active = true;
        this.ui.updateMoney();
        this.ui.updateLives();
        this.ui.updateWave(this.wave);
        this.loop(0);
    }

    loadLevel(level) {
        this.map.loadLevel(level);
        this.resetGame();
    }

    resetGame() {
        this.money = 250;
        this.lives = 20;
        this.wave = 1;
        this.waveInProgress = false;
        this.enemies = [];
        this.towers = [];
        this.projectiles = [];
        this.enemiesToSpawn = 0;
        this.ui.updateMoney();
        this.ui.updateLives();
        this.ui.updateWave(this.wave);
        this.ui.deselectTower();
    }

    startWave() {
        if (this.waveInProgress) return;

        const config = this.waveConfig[this.wave] || { count: 5 + this.wave * 2, type: 'basic', interval: 1000 };
        this.enemiesToSpawn = config.count;
        this.currentEnemyType = config.type;
        this.spawnInterval = config.interval;
        this.spawnTimer = 0;

        this.waveInProgress = true;
        console.log(`Wave ${this.wave} started!`);
    }

    loop(timestamp) {
        if (!this.active) return;
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }

    update(deltaTime) {
        if (this.waveInProgress && this.enemiesToSpawn > 0) {
            this.spawnTimer += deltaTime;
            if (this.spawnTimer >= this.spawnInterval) {
                this.spawnEnemy();
                this.spawnTimer = 0;
            }
        } else if (this.waveInProgress && this.enemiesToSpawn <= 0 && this.enemies.length === 0) {
            this.endWave();
        }

        this.enemies.forEach(enemy => enemy.update(deltaTime));
        this.towers.forEach(tower => tower.update(deltaTime, this.enemies));
        this.projectiles.forEach((proj, index) => {
            proj.update(deltaTime);
            if (proj.markedForDeletion) this.projectiles.splice(index, 1);
        });

        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    spawnEnemy() {
        this.enemies.push(new Enemy(this, this.currentEnemyType));
        this.enemiesToSpawn--;
    }

    endWave() {
        this.waveInProgress = false;
        this.wave++;
        this.ui.updateWave(this.wave);
        console.log("Wave Complete");
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.map.render(this.ctx);
        this.towers.forEach(tower => tower.render(this.ctx));
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        this.projectiles.forEach(proj => proj.render(this.ctx));
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.ui.handleClick(x, y);
    }

    removeTower(tower) {
        const index = this.towers.indexOf(tower);
        if (index > -1) {
            this.towers.splice(index, 1);
        }
    }

    gameOver() {
        this.active = false;
        // Simple overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("GAME OVER", this.width / 2, this.height / 2);
    }
}

new Game();
