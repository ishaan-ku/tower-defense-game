
// Projectile.js
class Projectile {
    constructor(game, x, y, target, damage, type) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.type = type;
        this.speed = 300; // px per second
        this.markedForDeletion = false;

        this.radius = 4;
        this.color = '#fff';
    }

    update(deltaTime) {
        if (!this.target || this.target.markedForDeletion) {
            this.markedForDeletion = true;
            return;
        }

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const moveDist = (this.speed * deltaTime) / 1000;

        if (dist < moveDist) {
            // Hit
            this.target.takeDamage(this.damage);
            this.markedForDeletion = true;
        } else {
            this.x += (dx / dist) * moveDist;
            this.y += (dy / dist) * moveDist;
        }
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Map.js
class Map {
    constructor(game) {
        this.game = game;
        this.cellSize = 40;
        this.rows = 15;
        this.cols = 20;
        this.level = 1;

        this.maps = {
            1: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 3, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            2: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0],
                [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        };

        this.loadLevel(1);
    }

    loadLevel(level) {
        this.level = level;
        this.grid = this.maps[level] || this.maps[1];
        this.waypoints = this.calculateWaypoints();
    }

    calculateWaypoints() {
        // BFS to find path from 2 (Start) to 3 (End)
        let start = null;
        let end = null;

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.grid[y][x] === 2) start = { x, y };
                if (this.grid[y][x] === 3) end = { x, y };
            }
        }

        if (!start || !end) return [];

        const queue = [[start]];
        const visited = new Set();
        const directions = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];

        while (queue.length > 0) {
            const path = queue.shift();
            const curr = path[path.length - 1];
            const key = `${curr.x},${curr.y}`;

            if (curr.x === end.x && curr.y === end.y) {
                return path.map(p => ({
                    x: p.x * this.cellSize + this.cellSize / 2,
                    y: p.y * this.cellSize + this.cellSize / 2
                }));
            }

            if (visited.has(key)) continue;
            visited.add(key);

            for (const dir of directions) {
                const next = { x: curr.x + dir.x, y: curr.y + dir.y };
                if (next.x >= 0 && next.x < this.cols && next.y >= 0 && next.y < this.rows) {
                    const val = this.grid[next.y][next.x];
                    if (val === 1 || val === 3) {
                        queue.push([...path, next]);
                    }
                }
            }
        }

        return [];
    }

    render(ctx) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cell = this.grid[y][x];
                let color = '#2ecc71'; // Grass
                if (cell === 1) color = '#ecf0f1'; // Path
                if (cell === 2) color = '#e74c3c'; // Start
                if (cell === 3) color = '#3498db'; // End

                ctx.fillStyle = color;
                ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }
}

// Enemy.js
class Enemy {
    constructor(game, type = 'basic') {
        this.game = game;
        this.path = game.map.waypoints;
        this.pathIndex = 0;

        // Start at first waypoint
        this.x = this.path[0].x;
        this.y = this.path[0].y;

        this.type = type;
        this.markedForDeletion = false;

        // Stats based on type
        this.setStats(type);
    }

    setStats(type) {
        switch (type) {
            case 'fast':
                this.speed = 100;
                this.hp = 30;
                this.maxHp = 30;
                this.reward = 15;
                this.color = '#f1c40f'; // Yellow
                this.radius = 8;
                break;
            case 'heavy':
                this.speed = 40;
                this.hp = 150;
                this.maxHp = 150;
                this.reward = 30;
                this.color = '#8e44ad'; // Purple
                this.radius = 12;
                break;
            case 'boss':
                this.speed = 20;
                this.hp = 500;
                this.maxHp = 500;
                this.reward = 100;
                this.color = '#c0392b'; // Red
                this.radius = 15;
                break;
            case 'basic':
            default:
                this.speed = 60;
                this.hp = 50;
                this.maxHp = 50;
                this.reward = 10;
                this.color = '#e67e22'; // Orange
                this.radius = 10;
                break;
        }
    }

    update(deltaTime) {
        const target = this.path[this.pathIndex + 1];
        if (!target) {
            this.game.lives--;
            this.game.ui.updateLives();
            this.markedForDeletion = true;
            return;
        }

        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const moveDist = (this.speed * deltaTime) / 1000;

        if (dist < moveDist) {
            this.x = target.x;
            this.y = target.y;
            this.pathIndex++;
        } else {
            this.x += (dx / dist) * moveDist;
            this.y += (dy / dist) * moveDist;
        }
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.game.money += this.reward;
            this.game.ui.updateMoney();
            this.markedForDeletion = true;
        }
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();

        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 10, this.y - 15, 20, 3);
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.x - 10, this.y - 15, 20 * hpPercent, 3);
    }
}

// Tower.js
class Tower {
    constructor(game, x, y, type = 'basic') {
        this.game = game;
        this.x = x;
        this.y = y; // Grid coordinates
        this.pixelX = x * game.map.cellSize + game.map.cellSize / 2;
        this.pixelY = y * game.map.cellSize + game.map.cellSize / 2;
        this.type = type;
        this.level = 1;

        this.lastShot = 0;
        this.setStats(type);
    }

    setStats(type) {
        switch (type) {
            case 'sniper':
                this.range = 250;
                this.damage = 50;
                this.cooldown = 1500;
                this.cost = 150;
                this.color = '#2980b9';
                break;
            case 'rapid':
                this.range = 100;
                this.damage = 5;
                this.cooldown = 200;
                this.cost = 200;
                this.color = '#f39c12';
                break;
            case 'basic':
            default:
                this.range = 150;
                this.damage = 15;
                this.cooldown = 800;
                this.cost = 50;
                this.color = '#7f8c8d';
                break;
        }
    }

    update(deltaTime, enemies) {
        this.lastShot += deltaTime;
        this.target = this.findTarget(enemies);

        if (this.target && this.lastShot >= this.cooldown) {
            this.shoot(this.target);
            this.lastShot = 0;
        }
    }

    findTarget(enemies) {
        let nearest = null;
        let minDist = Infinity;

        for (const enemy of enemies) {
            const dx = enemy.x - this.pixelX;
            const dy = enemy.y - this.pixelY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= this.range && dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        }
        return nearest;
    }

    shoot(target) {
        this.game.projectiles.push(new Projectile(this.game, this.pixelX, this.pixelY, target, this.damage, this.type));
    }

    upgrade() {
        if (this.game.money >= this.cost) {
            this.game.money -= this.cost;
            this.level++;
            this.damage *= 1.2;
            this.range *= 1.1;
            this.cost = Math.floor(this.cost * 1.5);
            this.game.ui.updateMoney();
            return true;
        }
        return false;
    }

    sell() {
        const refund = Math.floor(this.cost * 0.5 * this.level);
        this.game.money += refund;
        this.game.ui.updateMoney();
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pixelX - 15, this.pixelY - 15, 30, 30);

        ctx.save();
        ctx.translate(this.pixelX, this.pixelY);
        if (this.target) {
            const angle = Math.atan2(this.target.y - this.pixelY, this.target.x - this.pixelX);
            ctx.rotate(angle);
        }
        ctx.fillStyle = '#333';
        ctx.fillRect(0, -5, 20, 10);
        ctx.restore();

        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Lv${this.level}`, this.pixelX, this.pixelY - 20);
    }
}

// UI.js
class UI {
    constructor(game) {
        this.game = game;
        this.selectedTowerType = null;
        this.selectedTower = null;

        this.towerTypes = [
            { type: 'basic', name: 'Basic', cost: 50 },
            { type: 'rapid', name: 'Rapid', cost: 200 },
            { type: 'sniper', name: 'Sniper', cost: 150 }
        ];

        this.setupTowerSelection();
        this.setupControls();
    }

    setupTowerSelection() {
        const container = document.getElementById('tower-selection');
        this.towerTypes.forEach(t => {
            const btn = document.createElement('div');
            btn.className = 'tower-btn';
            btn.innerHTML = `<span>${t.name}</span><span>$${t.cost}</span>`;
            btn.onclick = () => this.selectTowerType(t.type, btn);
            container.appendChild(btn);
        });
    }

    setupControls() {
        document.getElementById('start-wave-btn').onclick = () => this.game.startWave();

        document.getElementById('upgrade-btn').onclick = () => {
            if (this.selectedTower) {
                if (this.selectedTower.upgrade()) {
                    this.updateUpgradePanel();
                }
            }
        };

        document.getElementById('sell-btn').onclick = () => {
            if (this.selectedTower) {
                this.selectedTower.sell();
                this.game.removeTower(this.selectedTower);
                this.deselectTower();
            }
        };
    }

    selectTowerType(type, btnElement) {
        if (this.selectedTowerType === type) {
            this.selectedTowerType = null;
            btnElement.classList.remove('selected');
        } else {
            this.selectedTowerType = type;
            document.querySelectorAll('.tower-btn').forEach(b => b.classList.remove('selected'));
            btnElement.classList.add('selected');
            this.deselectTower();
        }
    }

    deselectTower() {
        this.selectedTower = null;
        document.getElementById('upgrade-panel').classList.add('hidden');
    }

    handleClick(x, y) {
        const col = Math.floor(x / this.game.map.cellSize);
        const row = Math.floor(y / this.game.map.cellSize);

        if (col < 0 || col >= this.game.map.cols || row < 0 || row >= this.game.map.rows) return;

        const existingTower = this.game.towers.find(t => t.x === col && t.y === row);

        if (existingTower) {
            this.selectTower(existingTower);
            this.selectedTowerType = null;
            document.querySelectorAll('.tower-btn').forEach(b => b.classList.remove('selected'));
        } else if (this.selectedTowerType) {
            if (this.game.map.grid[row][col] === 0) {
                this.buildTower(col, row);
            }
        } else {
            this.deselectTower();
        }
    }

    selectTower(tower) {
        this.selectedTower = tower;
        this.updateUpgradePanel();
        document.getElementById('upgrade-panel').classList.remove('hidden');
    }

    updateUpgradePanel() {
        if (!this.selectedTower) return;
        const t = this.selectedTower;
        document.getElementById('tower-level').innerText = t.level;
        document.getElementById('tower-damage').innerText = Math.round(t.damage);
        document.getElementById('tower-range').innerText = Math.round(t.range);
        document.getElementById('upgrade-cost').innerText = Math.round(t.cost * 1.5);
        document.getElementById('sell-cost').innerText = Math.round(t.cost * 0.5 * t.level);
    }

    buildTower(col, row) {
        const typeData = this.towerTypes.find(t => t.type === this.selectedTowerType);
        if (this.game.money >= typeData.cost) {
            this.game.money -= typeData.cost;
            this.updateMoney();
            this.game.towers.push(new Tower(this.game, col, row, this.selectedTowerType));
        } else {
            console.log("Not enough money");
        }
    }

    updateMoney() {
        document.getElementById('money').innerText = Math.floor(this.game.money);
    }

    updateLives() {
        document.getElementById('lives').innerText = this.game.lives;
    }

    updateWave(wave) {
        document.getElementById('wave').innerText = wave;
    }
}

// Game.js
class Game {
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

        this.canvas.addEventListener('click', (e) => this.handleClick(e));

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
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("GAME OVER", this.width / 2, this.height / 2);
    }
}

new Game();
