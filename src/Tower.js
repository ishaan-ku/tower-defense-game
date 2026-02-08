
import Projectile from './Projectile.js';

export default class Tower {
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
                this.cooldown = 1500; // ms
                this.cost = 150;
                this.color = '#2980b9'; // Blue
                break;
            case 'rapid':
                this.range = 100;
                this.damage = 5;
                this.cooldown = 200; // ms
                this.cost = 200;
                this.color = '#f39c12'; // Orange
                break;
            case 'basic':
            default:
                this.range = 150;
                this.damage = 15;
                this.cooldown = 800; // ms
                this.cost = 50;
                this.color = '#7f8c8d'; // Grey
                break;
        }
    }

    update(deltaTime, enemies) {
        this.lastShot += deltaTime;

        // Find target
        this.target = this.findTarget(enemies);

        if (this.target && this.lastShot >= this.cooldown) {
            this.shoot(this.target);
            this.lastShot = 0;
        }
    }

    findTarget(enemies) {
        // Find nearest enemy in range
        // Or enemy furthest along path
        // Simple implementation: nearest
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
            this.game.money -= this.cost; // Simple upgrade cost logic
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
        const refund = Math.floor(this.cost * 0.5 * this.level); // Simple logic
        this.game.money += refund;
        this.game.ui.updateMoney();
        // Remove self handling needs to be done in game loop or map
    }

    render(ctx) {
        // Range indicator (only if selected - todo)
        // ctx.beginPath();
        // ctx.arc(this.pixelX, this.pixelY, this.range, 0, Math.PI * 2);
        // ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        // ctx.stroke();

        // Tower base
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pixelX - 15, this.pixelY - 15, 30, 30);

        // Turret (pointing to target)
        ctx.save();
        ctx.translate(this.pixelX, this.pixelY);
        if (this.target) {
            const angle = Math.atan2(this.target.y - this.pixelY, this.target.x - this.pixelX);
            ctx.rotate(angle);
        }
        ctx.fillStyle = '#333';
        ctx.fillRect(0, -5, 20, 10);
        ctx.restore();

        // Level text
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Lv${this.level}`, this.pixelX, this.pixelY - 20);
    }
}
