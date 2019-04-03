namespace NSlideWidget {
    export interface ISlideItemConstructor {
        new (): ISlideItem;
    }
    export interface ISlideItem extends Laya.Sprite {
        setData(data: any): void;

        onClick(): void;
    }
}
