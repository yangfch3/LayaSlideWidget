class SlideItem extends Laya.Sprite implements NSlideWidget.ISlideItem {
    private textField: Laya.Text

    constructor() {
        super();
        this.width = 600;
        this.height = 400;
        this.graphics.drawRect(0, 0, 600, 400, '#ffffff', '#000000');

        let text = new Laya.Text();
        this.textField = text;
        text.color = '#000000';
        text.fontSize = 20;
        text.width = this.width;
        text.height = this.height;
        text.align = 'center';
        text.valign = 'middle';

        this.addChild(text);
    }

    setData(data: {
        txt: string
    }) {
        this.textField.text = data.txt;
    }

    onPreEntry(): void {};
    onEntry(): void {};
    onPreExit(): void {};
    onExit(): void {};
    onClick(): void {};
}
