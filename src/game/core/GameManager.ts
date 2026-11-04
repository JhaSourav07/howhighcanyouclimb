import * as Phaser from 'phaser';
import { GAME_CONFIG } from '@/game/config/gameConfig';
import { MainGameScene } from '@/game/scenes/MainGameScene';

export class GameManager {
  private game: Phaser.Game | null = null;
  private scene: MainGameScene | null = null;

  public init(container: HTMLElement): void {
    if (this.game) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: container,
      width: GAME_CONFIG.SCREEN_WIDTH,
      height: GAME_CONFIG.SCREEN_HEIGHT,
      pixelArt: true, // Nearest-neighbor filtering
      backgroundColor: '#000000',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [MainGameScene],
    };

    this.game = new Phaser.Game(config);

    // Grab scene reference once created
    this.game.events.once(Phaser.Core.Events.READY, () => {
      this.scene = this.game?.scene.getScene('MainGameScene') as MainGameScene;
    });
  }

  public setVirtualInput(left: boolean, right: boolean, jump: boolean): void {
    if (this.scene) {
      this.scene.setVirtualInput(left, right, jump);
    }
  }

  public resetGame(): void {
    if (this.scene) {
      this.scene.resetPlayer();
    }
  }

  public destroy(): void {
    if (this.scene) {
      this.scene.destroyScene();
      this.scene = null;
    }
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }
}
