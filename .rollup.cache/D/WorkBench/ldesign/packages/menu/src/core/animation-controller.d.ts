/**
 * 动画控制器
 */
import type { AnimationType } from '../types';
/**
 * 动画配置
 */
export interface AnimationConfig {
    type: AnimationType;
    duration: number;
    easing: string;
}
/**
 * 动画控制器类
 */
export declare class AnimationController {
    private config;
    private activeAnimations;
    constructor(config?: Partial<AnimationConfig>);
    /**
     * 更新配置
     */
    updateConfig(config: Partial<AnimationConfig>): void;
    /**
     * 播放进入动画
     */
    animateIn(element: HTMLElement, type?: AnimationType): Promise<void>;
    /**
     * 播放退出动画
     */
    animateOut(element: HTMLElement, type?: AnimationType): Promise<void>;
    /**
     * 播放动画
     */
    private playAnimation;
    /**
     * 展开动画（高度）
     */
    expand(element: HTMLElement): Promise<void>;
    /**
     * 收起动画（高度）
     */
    collapse(element: HTMLElement): Promise<void>;
    /**
     * Popup 进入动画
     */
    popupIn(element: HTMLElement, placement: string): Promise<void>;
    /**
     * Popup 退出动画
     */
    popupOut(element: HTMLElement): Promise<void>;
    /**
     * 取消元素的动画
     */
    cancel(element: HTMLElement): void;
    /**
     * 取消所有动画
     */
    cancelAll(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
