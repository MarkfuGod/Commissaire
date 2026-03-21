export default class HealthBar {
    constructor(entity) {
        this.player = entity;
        this.position = { x: 0, y: 0 };

        // World-space bar sizes and offsets (per class)
        if (entity.classID === 0) {
            // Player uses drawPlayerHUD() ¡ª no world-space bar
            this.width = 0;
            this.height = 0;
            this.dxdy = { dx: 0, dy: 0 };
        } else if (entity.classID === 1) {
            this.width = 40;
            this.height = 4;
            this.dxdy = { dx: 8, dy: -8 };   // above the sprite top
        } else if (entity.classID === 2) {
            this.width = 52;
            this.height = 5;
            this.dxdy = { dx: 5, dy: -10 };  // above the sprite top
        } else {
            this.width = 40;
            this.height = 4;
            this.dxdy = { dx: 8, dy: -8 };
        }
    }

    /** Draw the enemy HP bar in world space (above their head). */
    draw(context) {
        if (this.player.classID === 0) return;
        this._renderBar(context, this.position.x, this.position.y, this.width, this.height);
    }

    /**
     * Draw the player HP bar as a fixed HUD in screen space.
     * Must be called AFTER c.restore() in main.js.
     * Uses save/restore to avoid leaking canvas state.
     */
    drawPlayerHUD(context) {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.shadowBlur = 0;
        context.globalAlpha = 1.0;

        const x = 16;
        const y = 16;
        const w = 150;
        const h = 16;

        // Semi-transparent dark panel behind the HUD row
        context.fillStyle = 'rgba(0, 0, 0, 0.55)';
        context.fillRect(x - 6, y - 5, w + 72, h + 10);

        // "HP" label
        context.font = 'bold 14px monospace';
        context.fillStyle = '#ffffff';
        context.fillText('HP', x, y + h - 2);

        this._renderBar(context, x + 28, y, w, h);

        // Numeric display e.g. "80/100"
        const hp = Math.ceil(this.player.get_HP());
        const max = this.player.get_HP_limit();
        context.font = '12px monospace';
        context.fillStyle = '#dddddd';
        context.fillText(hp + '/' + max, x + 28 + w + 6, y + h - 2);

        context.restore();
    }

    /** Shared bar renderer: dark bg + color-gradient HP fill + border. */
    _renderBar(context, x, y, w, h) {
        const pct = Math.max(0, this.player.get_HP() / this.player.get_HP_limit());

        // Border
        context.fillStyle = 'rgba(0, 0, 0, 0.75)';
        context.fillRect(x - 1, y - 1, w + 2, h + 2);

        // Empty background
        context.fillStyle = '#3a0000';
        context.fillRect(x, y, w, h);

        // HP fill: green (full) -> yellow (half) -> red (low)
        if (pct > 0) {
            const r = pct < 0.5 ? 255 : Math.round(255 * (1 - pct) * 2);
            const g = pct > 0.5 ? 200 : Math.round(200 * pct * 2);
            context.fillStyle = 'rgb(' + r + ',' + g + ',10)';
            context.fillRect(x, y, Math.round(w * pct), h);
        }
    }

    update() {
        const p = this.player.get_position();
        this.position.x = p.x + this.dxdy.dx;
        this.position.y = p.y + this.dxdy.dy;
    }
}
