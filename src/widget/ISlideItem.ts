namespace NSlideWidget {
    export interface ISlideItemConstructor {
        new (slideWidget: NSlideWidget.SlideWidget): ISlideItem
    }
    export interface ISlideItem extends Laya.Sprite {
        slideWidget: NSlideWidget.SlideWidget

        setData(data: any, args?: any): void;

        onClick(): void;
    }
}
