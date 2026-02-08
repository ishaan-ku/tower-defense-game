
import Tower from './Tower.js';

export default class UI {
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
        // Convert screen coordinates to grid coordinates
        const col = Math.floor(x / this.game.map.cellSize);
        const row = Math.floor(y / this.game.map.cellSize);

        // Check bounds
        if (col < 0 || col >= this.game.map.cols || row < 0 || row >= this.game.map.rows) return;

        // Check if there's already a tower there
        const existingTower = this.game.towers.find(t => t.x === col && t.y === row);

        if (existingTower) {
            this.selectTower(existingTower);
            this.selectedTowerType = null;
            document.querySelectorAll('.tower-btn').forEach(b => b.classList.remove('selected'));
        } else if (this.selectedTowerType) {
            // Check if buildable
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
        document.getElementById('upgrade-cost').innerText = Math.round(t.cost * 1.5); // Next level cost logic mismatch, fixing in next update
        document.getElementById('sell-cost').innerText = Math.round(t.cost * 0.5 * t.level);
    }

    buildTower(col, row) {
        const typeData = this.towerTypes.find(t => t.type === this.selectedTowerType);
        if (this.game.money >= typeData.cost) {
            this.game.money -= typeData.cost;
            this.updateMoney();
            this.game.towers.push(new Tower(this.game, col, row, this.selectedTowerType));
            // Deselect after build? Maybe keep selected for multi-build.
            // keeping selected for multi-build
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
