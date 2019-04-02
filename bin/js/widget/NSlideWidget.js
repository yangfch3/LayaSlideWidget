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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var NSlideWidget;
(function (NSlideWidget) {
    var SlideWidget = /** @class */ (function (_super) {
        __extends(SlideWidget, _super);
        function SlideWidget(data, slideItemContr, options) {
            var _this = _super.call(this) || this;
            _this.touchStartX = 0;
            _this.touchStartY = 0;
            _this.touchStartTime = null;
            _this.total = 0;
            _this.curIndex = 0;
            // 跟手动画时预测下一个索引
            _this.preIndex = null;
            _this.tween = new Laya.Tween();
            _this.isAnimating = false;
            _this.isTouching = false;
            Laya['slideWidget'] = _this;
            if (data.length === 0) {
                console.error('Slide 数据项为空');
                return _this;
            }
            _this.slideItemContr = slideItemContr;
            _this.options = options ? __assign({}, SlideWidget.DEFAULT_OPTIONS, options) : SlideWidget.DEFAULT_OPTIONS;
            _this.data = data;
            _this.tween = new Laya.Tween();
            _this.initView();
            _this.initLogic();
            return _this;
        }
        SlideWidget.prototype.initView = function () {
            var _a = this.options, width = _a.width, height = _a.height, x = _a.x, y = _a.y;
            this.size(width, height);
            this.pos(x, y);
            if (this.options.container) {
                this.options.container.addChild(this);
            }
            this.slideContainer = new Laya.Sprite();
            this.slideContainer.size(width, height);
            this.slideContainer.pos(0, 0);
            this.addChild(this.slideContainer);
        };
        SlideWidget.prototype.initLogic = function () {
            if (this.options.loop) {
                var firstDataItem = this.data[this.data.length - 1];
                var lastDataItem = this.data[0];
                this.data = [firstDataItem].concat(this.data, [lastDataItem]);
                this.curIndex = 1;
            }
            this.total = this.data.length;
            this.slideContainer.width = this.options.width * this.total;
            this.createSlideItems();
            this.bindEvents();
            // loop 时初始的 curIndex 不为 0，要重设容器 x
            this.slideContainer.x = -(this.curIndex * this.options.width + (this.curIndex + 1) * this.options.gap);
        };
        SlideWidget.prototype.createSlideItems = function () {
            var _this = this;
            this.data.forEach(function (data, index) {
                var slideItem = new _this.slideItemContr();
                slideItem.setData(_this.data[index]);
                slideItem.size(_this.options.width, _this.options.height);
                slideItem.pos(index * _this.options.width + (index + 1) * _this.options.gap, 0);
                _this.slideContainer.addChild(slideItem);
            });
        };
        SlideWidget.prototype.bindEvents = function () {
            this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            this.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            this.on(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
        };
        SlideWidget.prototype.unbindEvents = function () {
            this.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            this.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            this.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            this.off(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
        };
        SlideWidget.prototype.onMouseDown = function (e) {
            if (this.isAnimating) {
                return;
            }
            this.isTouching = true;
            e.stopPropagation();
            if (e.touches && e.touches.length) {
                this.touchStartX = e.touches[0].stageX;
                this.touchStartY = e.touches[0].stageY;
            }
            else {
                this.touchStartX = e.stageX;
                this.touchStartY = e.stageY;
            }
            this.touchStartTime = Date.now();
        };
        SlideWidget.prototype.onMouseMove = function (e) {
            if (this.isAnimating || !this.isTouching) {
                return;
            }
            e.stopPropagation();
            var touchEndX = e.stageX;
            var touchEndY = e.stageY;
            var diffX = touchEndX - this.touchStartX;
            var diffY = touchEndY - this.touchStartY;
            // 斜向滑不处理
            if ((diffX > diffY && diffX < diffY) ||
                (diffX < diffY && diffX > -diffY)) {
                return;
            }
            this.slideContainer.x = -(this.curIndex * this.options.width + (this.curIndex + 1) * this.options.gap) + diffX;
            // 跟手处理（例如切换时有一个 scale 的变化过程）
            this.followHandler();
        };
        SlideWidget.prototype.onMouseUp = function (e) {
            if (this.isAnimating || !this.isTouching) {
                return;
            }
            this.isTouching = false;
            e.stopPropagation();
            var touchEndX = e.stageX;
            var diffX = touchEndX - this.touchStartX;
            var distTime = Date.now() - this.touchStartTime;
            // 短距离滑动视为点击
            if (Math.abs(diffX) < 6 && this.options.clickHandler) {
                this.options.clickHandler(this.curIndex);
            }
            if (Math.abs(diffX / this.options.width) > this.options.swipeThreshold) {
                diffX < 0 ? this.next() : this.prev();
            }
            else {
                var dist = this.curIndex * this.options.width + (this.curIndex + 1) * this.options.gap;
                // 直接缓动回弹
                this.doAnimate(dist);
            }
        };
        /**
         * 跟手的处理
         */
        SlideWidget.prototype.followHandler = function () {
            // TODO
        };
        /**
         * 切换到上一个
         */
        SlideWidget.prototype.prev = function () {
            var targetIndex = this.curIndex - 1;
            this.doMove(targetIndex);
        };
        /**
         * 切换到下一个
         */
        SlideWidget.prototype.next = function () {
            var targetIndex = this.curIndex + 1;
            this.doMove(targetIndex);
        };
        /**
         * 剧烈滑动的跳跃式变化，一次性切换多条
         * @param jumpCount
         */
        SlideWidget.prototype.jump = function (jumpCount) {
            // TODO
        };
        SlideWidget.prototype.doMove = function (toIndex) {
            this.curIndex = toIndex;
            var dist = this.curIndex * this.options.width + (this.curIndex + 1) * this.options.gap;
            this.doAnimate(dist);
        };
        SlideWidget.prototype.doAnimate = function (dist) {
            var _this = this;
            this.isAnimating = true;
            this.tween.complete();
            this.tween.to(this.slideContainer, {
                x: -dist
            }, this.options.pageTurnTime, Laya.Ease.sineIn, Laya.Handler.create(this, function () {
                _this.isAnimating = false;
                // 无限循环时对到达了边界时的处理
                if (_this.options.loop) {
                    if (_this.curIndex === 0) {
                        _this.curIndex = _this.total - 1 - 1;
                        _this.slideContainer.x = -(_this.curIndex * _this.options.width + (_this.curIndex + 1) * _this.options.gap);
                    }
                    else if (_this.curIndex === _this.total - 1) {
                        _this.curIndex = 1;
                        _this.slideContainer.x = -(_this.curIndex * _this.options.width + (_this.curIndex + 1) * _this.options.gap);
                    }
                }
            }));
        };
        SlideWidget.prototype.dispose = function () {
            this.unbindEvents();
            this.slideContainer.destroy();
            this.destroy();
        };
        SlideWidget.DEFAULT_OPTIONS = {
            container: Laya.stage,
            width: 750,
            height: 1334,
            loop: true,
            x: 0,
            y: 0,
            gap: 0,
            pageTurnTime: 300,
            delay: 4000,
            swipeThreshold: 0.3,
            clickHandler: null
        };
        return SlideWidget;
    }(Laya.Sprite));
    NSlideWidget.SlideWidget = SlideWidget;
})(NSlideWidget || (NSlideWidget = {}));
