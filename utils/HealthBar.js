export default class HealthBar {
    constructor(entity) {
        this.player = entity;
        this.position = { x: 0, y: 0 };

        // World-space bar dimensions and offsets (per class)
        if (entity.classID === 0) {
            // Player ¡ª bar is not drawn in world space; use drawPlayerHUD() instead
            this.width = 0;
            this.height = 0;
            this.dxdy = { dx: 0, dy: 0 };
        } else if (entity.classID === 1) {
            this.width = 40;
            this.height = 4;
            this.dxdy = { dx: 14, dy: 18 };
        } else if (entity.classID === 2) {
            this.width = 52;
            this.height = 5;
            this.dxdy = { dx: 14, dy: 3 };
        } else {
            this.width = 40;
            this.height = 4;
            this.dxdy = { dx: 14, dy: 10 };
        }
    }

    /** Draw the enemy HP bar in world space (above their head). */
    draw(context) {
        if (this.player.classID === 0) return;
        this._renderBar(context, this.position.x, this.position.y, this.width, this.height);
    }

    /**
     * Draw the player HP bar as a fixed HUD element.
     * Call this AFTER c.restore() so coordinates are in screen space.
     */
    drawPlayerHUD(context) {
        const x = 20;
        const y = 20;
        const w = 130;
        const h = 14;

        // "HP" label
        context.font = 'bold 13px monospace';
        context.fillStyle = '#ffffff';
        context.shadowColor = 'rgba(0,0,0,0.8)';
        context.shadowBlur = 4;
        context.fillText('HP', x, y + h - 1);
        context.shadowBlur = 0;

        this._renderBar(context, x + 26, y, w, h);

        // Numeric HP display
        const hp = Math.ceil(this.player.get_HP());
        const max = this.player.get_HP_limit();
        context.font = '11px monospace';
        context.fillStyle = '#dddddd';
        context.fillText(`${hp} / ${max}`, x + 26 + w + 6, y + h - 1);
    }

    /** Shared rendering: dark background + color-gradient fill + border. */
    _renderBar(context, x, y, w, h) {
        const pct = Math.max(0, this.player.get_HP() / this.player.get_HP_limit());

        // Outer border / shadow
        context.fillStyle = 'rgba(0, 0, 0, 0.75)';
        context.fillRect(x - 1, y - 1, w + 2, h + 2);

        // Empty bar background
        context.fillStyle = '#3a0000';
        context.fillRect(x, y, w, h);

        // HP fill ¡ª green above 60 %, yellow around 30 %, red below 15 %
        if (pct > 0) {
            const r = pct < 0.5 ? 255 : Math.round(255 * (1 - pct) * 2);
            const g = pct > 0.5 ? 200 : Math.round(200 * pct * 2);
            context.fillStyle = `rgb(${r}, ${g}, 10)`;
            context.fillRect(x, y, Math.round(w * pct), h);
        }
    }

    update() {
        const p = this.player.get_position();
        this.position.x = p.x + this.dxdy.dx;
        this.position.y = p.y + this.dxdy.dy;
    }
}
