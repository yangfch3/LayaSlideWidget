var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SlideItem = /** @class */ (function (_super) {
    __extends(SlideItem, _super);
    function SlideItem(slideWidget) {
        var _this = _super.call(this) || this;
        _this.slideWidget = slideWidget;
        _this.width = 600;
        _this.height = 400;
        _this.graphics.drawRect(0, 0, 600, 400, '#ffffff', '#000000');
        var text = new Laya.Text();
        _this.textField = text;
        text.color = '#000000';
        text.fontSize = 20;
        text.width = _this.width;
        text.height = _this.height;
        text.pivot(_this.width / 2, _this.height / 2);
        text.pos(_this.width / 2, _this.height / 2);
        text.align = 'center';
        text.valign = 'middle';
        _this.addChild(text);
        return _this;
    }
    SlideItem.prototype.setData = function (data) {
        this.textField.text = data.txt;
    };
    SlideItem.prototype.onPreEntry = function () { };
    ;
    SlideItem.prototype.onCancelEntry = function () { };
    ;
    SlideItem.prototype.onEntry = function () { };
    ;
    SlideItem.prototype.onPreExit = function () { };
    ;
    SlideItem.prototype.onCancelExit = function () { };
    ;
    SlideItem.prototype.onExit = function () { };
    ;
    SlideItem.prototype.onClick = function () { };
    ;
    return SlideItem;
}(Laya.Sprite));
