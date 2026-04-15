//For now entire use of this script is to control the mouse cursor image switching when clicked - Robert
class CursorScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CursorScene' });
    }

    preload() {
        //Cursor images
        this.load.image('cursorDefault', './assets/images/cursor/CursorIdle.png');
        this.load.image('cursorPress', './assets/images/cursor/CursorPressed.png');
    }

    create() {
        // Hide the default browser cursor
        this.input.setDefaultCursor('none');

        // Make sure this scene stays above others
        this.scene.bringToTop();

        // Create cursor image
        this.cursor = this.add.image(0, 0, 'cursorDefault');

        //I know its ugly as fuck and hard coded, my bad. Its so the mouse feels right
        this.cursor.setOrigin(0.62, 0.01);   

        // Keep this scene from pausing accidentally
        this.scene.setVisible(true);

        // Change to pressed texture
        this.input.on('pointerdown', () => {
            this.cursor.setTexture('cursorPress');
        });

        // Change back to idle texture
        this.input.on('pointerup', () => {
            this.cursor.setTexture('cursorDefault');
        });
    }

    update() {
        const pointer = this.input.activePointer;

        this.cursor.x = pointer.x;
        this.cursor.y = pointer.y;

        // Safety: keep this scene above everything
        this.scene.bringToTop();
    }
}