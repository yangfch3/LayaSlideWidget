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
        var slide = new NSlideWidget.SlideWidget(data, SlideItem, {
            width: 600,
            height: 400,
            x: 75,
            y: 200,
            gap: 60,
            loop: true,
            enableJump: true,
            followCb: function (x) {
                console.log(x);
            },
            animateUpdateCb: function (x) {
                console.log(x);
            }
        });
        Laya.stage.addChild(slide);
        // Laya.DebugPanel.init();
    }
    return GameMain;
}());
new GameMain();
