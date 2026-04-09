class Load extends Phaser.Scene{
    constructor() {
        super('loadScene')
    }

    preload(){
      
    }

    create(){

        //use .launch to start your scenes so they can run in parallel and not interrupt each other - Robert
        this.scene.launch('ShopScene')
        this.scene.launch('MiniGame')
    }

}