
export default class Projectile {
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
