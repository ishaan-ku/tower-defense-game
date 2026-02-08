
export default class Enemy {
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
                this.speed = 100; // px per second
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
        // Move towards next waypoint
        const target = this.path[this.pathIndex + 1];
        if (!target) {
            // Reached the end
            this.game.lives--;
            this.game.ui.updateLives();
            this.markedForDeletion = true;
            return;
        }

        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Normalize and move
        const moveDist = (this.speed * deltaTime) / 1000;

        if (dist < moveDist) {
            // Reached waypoint
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

        // Health bar
        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 10, this.y - 15, 20, 3);
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.x - 10, this.y - 15, 20 * hpPercent, 3);
    }
}
