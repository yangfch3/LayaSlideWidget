namespace NSlideWidget {
    export interface ISlideItemConstructor {
        new (): ISlideItem;
    }
    export interface ISlideItem extends Laya.Sprite {
        setData(data: any): void;

        onPreEntry(): void;
        onEntry(): void;
        onPreExit(): void;
        onExit(): void;

        onClick(): void;
    }
}
