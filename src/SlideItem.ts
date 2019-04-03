class SlideItem extends Laya.Sprite implements NSlideWidget.ISlideItem {
    public textField: Laya.Text

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
        text.pivot(this.width / 2, this.height / 2);
        text.pos(this.width / 2, this.height / 2);
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
    onCancelEntry(): void {};
    onEntry(): void {};

    onPreExit(): void {};
    onCancelExit(): void {};
    onExit(): void {};

    onClick(): void {};
}
