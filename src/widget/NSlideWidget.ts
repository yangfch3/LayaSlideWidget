namespace NSlideWidget {
    export interface SlideOptions {
        container?: Laya.Sprite
        width?: number
        height?: number

        loop?: boolean
        enableJump?: boolean

        x?: number
        y?: number
        gap?: number

        pageTurnTime?: number

        // swipe 阈值，0-1，在阈值内会回弹，不切换
        swipeThreshold?: number

        clickCb?: (index: number) => void
        followCb?: (x: number) => void
        animateUpdateCb?: (x: number) => void
    }

    export class SlideWidget extends Laya.Sprite {
        public static DEFAULT_OPTIONS: SlideOptions = {
            container: Laya.stage,
            width: 750,
            height: 1334,
            loop: true,
            enableJump: false,
            x: 0,
            y: 0,
            gap: 0,
            pageTurnTime: 300,
            swipeThreshold: 0.3,
            clickCb: null,
            followCb: null,
            animateUpdateCb: null
        }

        public static INNER_CONFIG = {
            // px/ms
            averageSpeed: 4,
            maxJumpCount: 2
        }

        private options: SlideOptions;
        private data: any[];
        private slideItemContr: ISlideItemConstructor;

        private slideContainer: Laya.Sprite;

        private touchStartX: number = 0;
        private touchStartY: number = 0;
        private touchStartTime: number = null;

        private total: number = 0;
        private curIndex: number = 0;
        // 跟手动画时预测下一个索引
        private preIndex: number = null;

        private tween: Laya.Tween = new Laya.Tween();

        private isAnimating: boolean = false;
        private isTouching: boolean = false;

        constructor(data: any[], slideItemContr: ISlideItemConstructor, options?: SlideOptions) {
            super();
            Laya['slideWidget'] = this;
            if (data.length === 0) {
                console.error('Slide 数据项为空');
                return this;
            }
            this.slideItemContr = slideItemContr;
            this.options = options ? { ...SlideWidget.DEFAULT_OPTIONS, ...options } : SlideWidget.DEFAULT_OPTIONS;
            this.data = data;
            this.tween = new Laya.Tween();

            this.initView();
            this.initLogic();
        }

        private initView() {
            let {width, height, x, y} = this.options;
            this.size(width, height);
            this.pos(x, y);
            if (this.options.container) {
                this.options.container.addChild(this);
            }

            this.slideContainer = new Laya.Sprite();

            this.slideContainer.size(width, height);
            this.slideContainer.pos(0, 0);
            this.addChild(this.slideContainer);
        }

        private initLogic() {
            if (this.options.loop) {
                let firstDataItem = this.data[this.data.length - 1];
                let lastDataItem = this.data[0];
                this.data = [firstDataItem, ...this.data, lastDataItem];
                this.curIndex = 1;
            }
            this.total = this.data.length;

            this.slideContainer.width = this.options.width * this.total;

            this.createSlideItems();
            this.bindEvents();

            // loop 时初始的 curIndex 不为 0，要重设容器 x
            this.slideContainer.x = -(this.curIndex * this.options.width + this.curIndex * this.options.gap);
        }

        private createSlideItems() {
            this.data.forEach((data, index) => {
                let slideItem = new this.slideItemContr();
                slideItem.setData(this.data[index])
                slideItem.size(this.options.width, this.options.height);
                slideItem.pos(index * this.options.width + index * this.options.gap, 0);
                this.slideContainer.addChild(slideItem);
            })
        }

        private bindEvents() {
            this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            this.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            this.on(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
        }

        private unbindEvents() {
            this.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            this.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            this.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            this.off(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
        }

        private onMouseDown(e: Laya.Event) {
            if (this.isAnimating) {
                return;
            }
            this.isTouching = true;
            e.stopPropagation();
            if (e.touches && e.touches.length) {
                this.touchStartX = e.touches[0].stageX;
                this.touchStartY = e.touches[0].stageY;
            } else {
                this.touchStartX = e.stageX;
                this.touchStartY = e.stageY;
            }
            this.touchStartTime = Date.now();
        }

        private onMouseMove(e: Laya.Event) {
            if (this.isAnimating || !this.isTouching) {
                return;
            }
            e.stopPropagation();

            const touchEndX = e.stageX;
            const touchEndY = e.stageY;
            const diffX = touchEndX - this.touchStartX;
            const diffY = touchEndY - this.touchStartY;

            // 斜向滑不处理
            if ((diffX > diffY && diffX < diffY) ||
                (diffX < diffY && diffX > -diffY)) {
                return;
            }
            this.slideContainer.x = -(this.curIndex * this.options.width + this.curIndex * this.options.gap) + diffX;
            
            // 跟手处理（例如切换时有一个 scale 的变化过程）
            this.followHandler();
        }

        private onMouseUp(e: Laya.Event) {
            if (this.isAnimating || !this.isTouching) {
                return;
            }
            this.isTouching = false;
            e.stopPropagation();

            const touchEndX = e.stageX;
            const diffX = touchEndX - this.touchStartX;
            const distTime = Date.now() - this.touchStartTime;

            console.log(`distTime: ${distTime}`);
            console.log(`diffX: ${diffX}`);

            // 短距离滑动视为点击
            if (Math.abs(diffX) < 6 && this.options.clickCb) {
                this.options.clickCb(this.curIndex);
            }

            if (Math.abs(diffX / this.options.width) <= this.options.swipeThreshold) {
                this.springBack();
            } else {
                // 不循环且到了边界时
                if (this.options.loop === false &&
                    ((this.curIndex === 0 && diffX > 0) ||
                        (this.curIndex === this.total - 1 && diffX < 0))) {
                    this.springBack();
                } else {
                    const speedMutli = Math.ceil((Math.abs(diffX) / distTime) / SlideWidget.INNER_CONFIG.averageSpeed);
                    /**
                     * 以下情况不允许跳跃：
                     * 1. 不允许跳跃
                     * 2. 没有到达超过跳跃速度的下限
                     * 3. 循环开启
                     */
                    if (!this.options.enableJump || speedMutli <= 1 || this.options.loop) {
                        return diffX < 0 ? this.next() : this.prev();
                    }
                    this.jump(diffX < 0 ? speedMutli : -speedMutli);
                }
            }
        }

        private springBack() {
            let dist = this.curIndex * this.options.width + this.curIndex * this.options.gap;
            // 直接缓动回弹
            this.doAnimate(dist);
        }

        /**
         * 跟手的处理
         */
        private followHandler() {
            this.options.followCb && this.options.followCb(this.slideContainer.x);
        }

        /**
         * 切换到上一个
         */
        private prev() {
            let targetIndex = this.curIndex - 1;
            this.doMove(targetIndex)
        }

        /**
         * 切换到下一个
         */
        private next() {
            let targetIndex = this.curIndex + 1;
            this.doMove(targetIndex)
        }

        /**
         * 剧烈滑动的跳跃式变化，一次性切换多条
         * @param jumpCount
         */
        private jump(jumpCount: number) {
            const leftRemainingCount = this.curIndex;
            const rightRemainingCount = this.total - 1 - this.curIndex;
            // 根据允许的最大跳跃数调整跳跃值
            if (Math.abs(jumpCount) > SlideWidget.INNER_CONFIG.maxJumpCount) {
                jumpCount = (jumpCount / Math.abs(jumpCount)) * SlideWidget.INNER_CONFIG.maxJumpCount
            }
            if (jumpCount < 0) {
                Math.abs(jumpCount) < leftRemainingCount ? this.doMove(this.curIndex + jumpCount) : this.doMove(0);
            } else {
                jumpCount < rightRemainingCount ? this.doMove(this.curIndex + jumpCount) : this.doMove(this.total - 1);
            }
        }

        private doMove(toIndex: number) {
            const animateTime = Math.abs(toIndex - this.curIndex) * this.options.pageTurnTime;
            this.curIndex = toIndex;
            const dist = this.curIndex * this.options.width + this.curIndex * this.options.gap;
            this.doAnimate(dist, animateTime);
        }

        private doAnimate(dist: number, time: number = this.options.pageTurnTime) {
            this.isAnimating = true;
            this.tween.complete();
            this.tween.to(this.slideContainer, {
                x: -dist
            }, time, Laya.Ease.quadOut, Laya.Handler.create(this, () => {
                this.isAnimating = false;
                // 无限循环时对到达了边界时的处理
                if (this.options.loop) {
                    if (this.curIndex === 0) {
                        this.curIndex = this.total - 1 - 1;
                        this.slideContainer.x = -(this.curIndex * this.options.width + this.curIndex * this.options.gap);
                    } else if (this.curIndex === this.total - 1) {
                        this.curIndex = 1;
                        this.slideContainer.x = -(this.curIndex * this.options.width + this.curIndex * this.options.gap);
                    }
                }
            }));
            this.options.animateUpdateCb && (this.tween.update = new Laya.Handler(this, function() {
                this.options.animateUpdateCb(this.slideContainer.x);
            }));
        }

        getItemPosByIndex(index: number) {
            return index * this.options.width + (index + 1) * this.options.gap
        }

        public dispose() {
            this.unbindEvents();
            this.slideContainer.destroy();
            this.destroy();
        }
    }
}

