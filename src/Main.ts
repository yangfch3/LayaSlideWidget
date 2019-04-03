class GameMain {
    constructor() {
        Laya.init(750, 1334);
        Laya.stage.graphics.drawRect(0, 0, 750, 1334, '#000000');

        Laya.stage.scaleMode = "showall";

        Laya.stage.alignV = "middle";
        Laya.stage.alignH = "middle";

        let data: { txt: string }[] = [
            {
                txt: 'Slide Item 0'
            }, {
                txt: 'Slide Item 1'
            }, {
                txt: 'Slide Item 2'
            }, {
                txt: 'Slide Item 3'
            }
        ];

        // 感知区域范围
        let perceptualArea = 80;
        let slide1: NSlideWidget.SlideWidget = new NSlideWidget.SlideWidget(data, SlideItem, {
            width: 600,
            height: 400,
            x: 75,
            y: 200,
            gap: 60,
            enableJump: true,
            followCb: function (context, x) {
                /**
                 * -x
                 * -∞, -80 中间阶段确保 0 的状态重置
                 * [-80, 80] 改变 0 的大小
                 * 80, 580 中间阶段确保 0, 1 的状态重置
                 * [580, 720] 改变 1 的大小
                 * ...
                 */
                if (-x < -perceptualArea) {
                    context.getSlideItemByIndex(0).textField.scale(1, 1)
                    return
                }
                const curOn = Math.floor((-x + perceptualArea) / (600 + 60))
                const perceptualLeftX = curOn * (600 + 60) - perceptualArea
                const perceptualRightX = curOn * (600 + 60) + perceptualArea
                const perceptualMiddleX = curOn * (600 + 60)
                if (-x >= perceptualLeftX && -x <= perceptualRightX) {
                    const scaleRatio = 1 - Math.abs(-x - perceptualMiddleX) / perceptualArea
                    context.getSlideItemByIndex(curOn).textField.scale(1 + scaleRatio, 1 + scaleRatio)
                } else {
                    context.getSlideItemByIndex(curOn).textField.scale(1, 1)
                    if (curOn + 1 <= context.total - 1) {
                        context.getSlideItemByIndex(curOn + 1).textField.scale(1, 1)
                    }
                }
            },
            animateUpdateCb: function (context, x) {
                /**
                 * -x
                 * -∞, -80 中间阶段确保 0 的状态重置
                 * [-80, 80] 改变 0 的大小
                 * 80, 580 中间阶段确保 0, 1 的状态重置
                 * [580, 720] 改变 1 的大小
                 * ...
                 */
                if (-x < -perceptualArea) {
                    context.getSlideItemByIndex(0).textField.scale(1, 1)
                    return
                }
                const curOn = Math.floor((-x + perceptualArea) / (600 + 60))
                const perceptualLeftX = curOn * (600 + 60) - perceptualArea
                const perceptualRightX = curOn * (600 + 60) + perceptualArea
                const perceptualMiddleX = curOn * (600 + 60)
                if (-x >= perceptualLeftX && -x <= perceptualRightX) {
                    const scaleRatio = 1 - Math.abs(-x - perceptualMiddleX) / perceptualArea
                    context.getSlideItemByIndex(curOn).textField.scale(1 + scaleRatio, 1 + scaleRatio)
                } else {
                    context.getSlideItemByIndex(curOn).textField.scale(1, 1)
                    if (curOn + 1 <= context.total - 1) {
                        context.getSlideItemByIndex(curOn + 1).textField.scale(1, 1)
                    }
                }
            }
        });
        slide1.getSlideItemByIndex(0).textField.scale(2, 2)
        Laya['slideWidget'] = slide1;
        Laya.stage.addChild(slide1);

        let slide2: NSlideWidget.SlideWidget = new NSlideWidget.SlideWidget(data, SlideItem, {
            width: 600,
            height: 400,
            x: 75,
            y: 700,
            gap: 60,
            loop: true
        });
        Laya.stage.addChild(slide2);

        // Laya.DebugPanel.init();
    }
}
new GameMain();
