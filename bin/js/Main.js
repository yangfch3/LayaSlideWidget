var GameMain = /** @class */ (function () {
    function GameMain() {
        Laya.init(750, 1334);
        Laya.stage.graphics.drawRect(0, 0, 750, 1334, '#000000');
        Laya.stage.scaleMode = "showall";
        Laya.stage.alignV = "middle";
        Laya.stage.alignH = "middle";
        var data = [
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
        var perceptualArea = 80;
        var slide1 = new NSlideWidget.SlideWidget(data, SlideItem, {
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
                    context.getSlideItemByIndex(0).textField.scale(1, 1);
                    return;
                }
                var curOn = Math.floor((-x + perceptualArea) / (600 + 60));
                var perceptualLeftX = curOn * (600 + 60) - perceptualArea;
                var perceptualRightX = curOn * (600 + 60) + perceptualArea;
                var perceptualMiddleX = curOn * (600 + 60);
                if (-x >= perceptualLeftX && -x <= perceptualRightX) {
                    var scaleRatio = 1 - Math.abs(-x - perceptualMiddleX) / perceptualArea;
                    context.getSlideItemByIndex(curOn).textField.scale(1 + scaleRatio, 1 + scaleRatio);
                }
                else {
                    context.getSlideItemByIndex(curOn).textField.scale(1, 1);
                    if (curOn + 1 <= context.total - 1) {
                        context.getSlideItemByIndex(curOn + 1).textField.scale(1, 1);
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
                    context.getSlideItemByIndex(0).textField.scale(1, 1);
                    return;
                }
                var curOn = Math.floor((-x + perceptualArea) / (600 + 60));
                var perceptualLeftX = curOn * (600 + 60) - perceptualArea;
                var perceptualRightX = curOn * (600 + 60) + perceptualArea;
                var perceptualMiddleX = curOn * (600 + 60);
                if (-x >= perceptualLeftX && -x <= perceptualRightX) {
                    var scaleRatio = 1 - Math.abs(-x - perceptualMiddleX) / perceptualArea;
                    context.getSlideItemByIndex(curOn).textField.scale(1 + scaleRatio, 1 + scaleRatio);
                }
                else {
                    context.getSlideItemByIndex(curOn).textField.scale(1, 1);
                    if (curOn + 1 <= context.total - 1) {
                        context.getSlideItemByIndex(curOn + 1).textField.scale(1, 1);
                    }
                }
            }
        });
        slide1.getSlideItemByIndex(0).textField.scale(2, 2);
        Laya['slideWidget'] = slide1;
        Laya.stage.addChild(slide1);
        var slide2 = new NSlideWidget.SlideWidget(data, SlideItem, {
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
    return GameMain;
}());
new GameMain();
