"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NSlideWidget_1 = require("./NSlideWidget");
var GameMain = /** @class */ (function () {
    function GameMain() {
        Laya.init(750, 1000);
        Laya.stage.scaleMode = "showall";
        Laya.stage.alignV = "middle";
        Laya.stage.alignH = "middle";
        var data = [
            '文本1',
            '文本2',
            '文本3',
            '文本4',
        ];
        var slide = new NSlideWidget_1.default.SlideWidget(data, SlideItem, {
            width: 750,
            height: 400
        });
        Laya.stage.addChild(slide);
        laya.debug.DebugTool.init();
    }
    return GameMain;
}());
new GameMain();
