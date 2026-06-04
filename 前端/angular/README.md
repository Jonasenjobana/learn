# Angular 12 到 Angular 22 特性演进指南

这份文档面向已经熟悉 Angular 的开发者，不讲组件、服务、依赖注入、路由、表单这些基础概念。\
重点回答一个问题：如果你很熟 Angular 12，那么从 Angular 13 到当前最新 Angular 22，中间到底多了哪些值得关注的新东西？

> 当前确认：本机 `npm view @angular/core version` 和 `npm view @angular/cli version` 返回 `22.0.0`。官方版本页也标注 v22.0 在 2026-06-01 这一周发布。\
> Angular v2 到 v19 已经不在官方支持范围内，实际升级时建议按官方 Update Guide 逐大版本迁移。

## 当前学习入口

- [Day1：Angular 22 Signal Forms Demo](./day1/)

## 快速结论

从 Angular 12 到 Angular 22，最大的变化不是某个 API，而是 Angular 的整体开发范式变了：

| 方向    | Angular 12 时代                     | Angular 22 时代                                        |
| ----- | --------------------------------- | ---------------------------------------------------- |
| 编译/渲染 | Ivy 已默认，但还保留很多 View Engine 时代包袱   | Ivy-only，APF 简化，ngcc 逐步退出历史舞台                        |
| 组织方式  | `NgModule` 是默认心智模型                | Standalone 是默认心智模型，`NgModule` 仍可用                    |
| 响应式   | RxJS + Zone.js + Change Detection | Signals + Zoneless + 更细粒度更新                          |
| 模板语法  | `*ngIf`、`*ngFor`、`ngSwitch`       | 新控制流 `@if`、`@for`、`@switch`                          |
| 懒加载   | Router lazy loading 为主            | Router lazy loading + `@defer` 组件级延迟加载               |
| 表单    | Reactive Forms 基本是 `any`          | Typed Forms，后续出现 Signal Forms                        |
| SSR   | Universal 可用，但体验一般                | Hydration、Event Replay、Incremental Hydration、路由级渲染模式 |
| 构建工具  | webpack builder 为主                | esbuild/Vite 方向，构建和 dev server 明显现代化                 |
| 测试    | Karma/Jasmine 默认心智                | Jest/Vitest 支持逐步增强                                   |
| 部署体验  | 偏传统 SPA/Universal                 | 更重视性能、SSR、SSG、分块加载和 Core Web Vitals                  |

如果你从 Angular 12 直接看 Angular 22，最需要补的不是语法，而是这几条主线：

- Standalone-first
- Signals-first
- Zoneless-ready
- 新模板控制流
- `@defer` 和 hydration
- typed forms / signal forms
- 新构建系统

## 版本总览

| 版本  | 重点变化                                                      | 对 Angular 12 开发者的影响                              |
| --- | --------------------------------------------------------- | ------------------------------------------------ |
| v13 | View Engine 移除、IE11 支持移除、APF 现代化                          | 老库如果还依赖 View Engine/ngcc，会开始暴露兼容问题               |
| v14 | Typed Reactive Forms、Standalone 预览、`inject()` 更实用         | 表单类型安全提升；开始摆脱 `NgModule` 依赖                      |
| v15 | Standalone 稳定、Directive Composition API、函数式 Router API    | 可以认真开始 standalone 迁移                             |
| v16 | Signals 预览、DestroyRef/takeUntilDestroyed、SSR Hydration 预览 | 响应式模型开始变化，生命周期清理更现代                              |
| v17 | 新控制流、`@defer`、新应用默认 standalone、新构建器                       | 模板写法和性能优化方式明显变化                                  |
| v18 | Hydration Event Replay、Zoneless 实验增强                      | SSR 交互体验和无 Zone 方向继续推进                           |
| v19 | Standalone 默认、Incremental Hydration 预览、Signal API 扩展      | 新项目默认不再围绕 `NgModule`                             |
| v20 | Signals 相关 API 进入稳定阶段，Zoneless 继续成熟                       | Signals 可以进入主线架构评估                               |
| v21 | Zoneless 默认、Signal Forms 实验、Vitest/ARIA 等增强               | Zone.js 不再是默认心智模型                                |
| v22 | 当前最新 major，延续 v21+ 新范式                                    | 迁移重点仍是 standalone、signals、zoneless、SSR/hydration |

## v13：真正告别 View Engine

Angular 12 已经默认 Ivy，但 v13 开始更彻底地移除旧时代包袱。

重点变化：

- View Engine 不再可用。
- IE11 支持移除。
- Angular Package Format 简化。
- 不再需要维护 View Engine 相关 metadata。
- `ngcc` 的重要性开始下降。
- 新项目默认持久化构建缓存。

对老项目的实际影响：

- 如果项目依赖很老的 Angular 库，升级时最容易卡在库兼容。
- 如果业务还要求 IE11，v13 开始就不是合适选择。
- 企业老项目中常见的私有组件库需要确认是否已发布 Ivy-compatible 版本。

你应该检查：

```bash
npm ls @angular/core
npm ls ngcc
```

重点不是“业务代码要改很多”，而是依赖生态要先过关。

## v14：Typed Forms 和 Standalone 开始登场

v14 对熟手最大的价值是两个：Typed Reactive Forms 和 Standalone Components。

### Typed Reactive Forms

Angular 14 起，Reactive Forms 默认严格类型化。

以前：

```ts
const form = new FormGroup({
  email: new FormControl(''),
});

form.value.email.domain; // 旧版本类型上可能不够安全
```

现在类型会更严格，IDE 自动补全和编译期检查更靠谱。

迁移方式：

```ts
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
```

如果项目太大，可以先用 `Untyped*` 保持旧行为，再逐步替换成 typed forms。

### Standalone Components 预览

开始可以这样写：

```ts
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
})
export class UserCardComponent {}
```

Angular 12 熟手要调整的心智：

- 组件自己声明依赖。
- 不一定需要先创建 `SharedModule`。
- 组件可直接被路由或其他 standalone 组件导入。

### `inject()` 更常见

构造函数 DI 仍然可用，但 `inject()` 开始在函数式 API、工具函数、guard、resolver 中更有价值。

```ts
const userService = inject(UserService);
```

## v15：Standalone 稳定，进入可迁移阶段

v15 是 standalone 从“可以看看”进入“可以认真用”的版本。

重点变化：

- Standalone APIs 稳定。
- `bootstrapApplication()` 进入主流写法。
- Router 支持 standalone lazy loading。
- Directive Composition API。
- Angular Material 基于 MDC 的组件迁移。
- 函数式 guard / resolver 更常用。

### standalone bootstrap

Angular 12 常见：

```ts
platformBrowserDynamic().bootstrapModule(AppModule);
```

新写法：

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
  ],
});
```

### 路由懒加载 standalone component

```ts
export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () =>
      import('./users/users.component').then((m) => m.UsersComponent),
  },
];
```

### Directive Composition API

可以把多个 host directive 组合到一个组件上，适合设计系统和组件库。

```ts
@Component({
  selector: 'app-button',
  hostDirectives: [TooltipDirective],
})
export class ButtonComponent {}
```

对熟手来说，v15 是开始规划“模块瘦身”的关键版本。

## v16：Signals 开始改变 Angular 响应式模型

v16 是 Angular 近几年最关键的版本之一，因为 Signals 进入开发者预览。

### Signals

```ts
const count = signal(0);
const double = computed(() => count() * 2);

count.update((value) => value + 1);
```

Angular 12 时代的主线是：

```text
RxJS Observable -> async pipe -> Zone.js 触发变更检测
```

Signals 之后多了一条主线：

```text
signal -> computed/effect -> 模板精确追踪依赖
```

注意：

- Signals 不是 RxJS 的完全替代品。
- HTTP、WebSocket、复杂异步流，RxJS 依然有价值。
- 组件内部 UI 状态、派生状态、简单 store，Signals 很适合。

### DestroyRef 和 takeUntilDestroyed

Angular 12 常见：

```ts
private destroy$ = new Subject<void>();

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

新写法：

```ts
this.userService.users$
  .pipe(takeUntilDestroyed())
  .subscribe();
```

或者：

```ts
const destroyRef = inject(DestroyRef);
```

这对大量订阅清理代码是明显减负。

### Hydration 预览

SSR 场景开始从“服务端吐 HTML，客户端重建 DOM”转向“客户端复用服务端 DOM”。

```ts
provideClientHydration()
```

对 SSR 项目影响很大：

- 减少 flicker。
- 改善 LCP/CLS。
- 但要求服务端和客户端 DOM 结构一致。
- 直接 DOM 操作更容易导致 hydration mismatch。

## v17：新模板语法和 `@defer`

v17 对写模板的人影响非常直接。

### 新控制流

以前：

```html
<div *ngIf="user; else empty">
  {{ user.name }}
</div>

<ng-template #empty>暂无用户</ng-template>
```

现在：

```html
@if (user) {
  <div>{{ user.name }}</div>
} @else {
  <div>暂无用户</div>
}
```

列表：

```html
@for (item of items; track item.id) {
  <app-item [item]="item" />
} @empty {
  <p>暂无数据</p>
}
```

优势：

- 不再依赖微语法。
- 更接近语言级控制流。
- `track` 更明确。
- 模板类型检查和编译优化空间更大。

### `@defer`

组件级延迟加载：

```html
@defer (on viewport) {
  <app-heavy-chart />
} @placeholder {
  <p>图表占位</p>
} @loading {
  <p>加载中...</p>
} @error {
  <p>加载失败</p>
}
```

它会把 `@defer` 里的 standalone 依赖拆成独立 chunk，在触发条件满足时加载。

适合：

- 首屏不需要的重组件。
- 图表。
- 富文本编辑器。
- 低频弹窗。
- 管理后台详情区域。

### 新构建系统

v17 开始新项目更明显走向 esbuild/Vite 方向，开发服务器和生产构建速度都有变化。\
如果你在 Angular 12 中使用了自定义 webpack builder，这里是升级风险点。

## v18：Hydration 和 Zoneless 继续推进

v18 的重点不是模板写法，而是运行时体验。

### Event Replay

SSR 页面在 hydration 完成前，用户可能已经点击了按钮。\
Event Replay 会捕获 hydration 前的事件，hydration 后再重放，减少“点了没反应”的体验问题。

```ts
provideClientHydration(withEventReplay())
```

### Zoneless 实验增强

Angular 开始更认真地摆脱 Zone.js 默认依赖。

传统模式：

```text
异步任务 -> Zone.js 捕获 -> 全局触发变更检测
```

Zoneless 方向：

```text
signal / markForCheck / async pipe 等明确通知 -> 更可控地更新
```

对老项目的影响：

- 大量依赖 Zone.js 隐式刷新的代码需要检查。
- `setTimeout` 后直接改普通字段的写法会变危险。
- OnPush、Signals、AsyncPipe 的重要性上升。

## v19：Standalone 默认化，SSR 更细粒度

v19 继续把新范式推成默认。

重点变化：

- components/directives/pipes 默认 standalone。
- Incremental Hydration 开发者预览。
- 路由级 render mode 开发者预览。
- Signals 生态继续扩展，例如 linkedSignal/resource 方向。

### standalone 默认

以前你要显式写：

```ts
standalone: true
```

v19 后新创建的组件默认 standalone。\
如果你需要非 standalone，需要明确处理。

对 Angular 12 项目影响：

- 老项目不用一次性删 `NgModule`。
- 新功能、新页面可以优先 standalone。
- 共享模块模式可以逐步退场。

### Incremental Hydration

结合 `@defer`，可以让 SSR 页面的一部分先保持 dehydrated，等用户交互、进入视口或空闲时再 hydrate。

示例心智：

```text
SSR 先输出 HTML
首屏关键区域先 hydrate
非关键区域后 hydrate
用户事件可被 replay
```

适合大型内容页、首页、营销页、复杂 dashboard。

## v20：Signals 进入稳定主线

v20 的核心价值是 Signals 相关 API 更适合进入主线架构评估。

重点变化：

- Signals 基础能力趋于稳定。
- `effect`、`toSignal` 等能力成熟。
- `resource` / `httpResource` 这类异步状态 API 进入视野。
- Zoneless 继续增强。
- SSR/hydration 继续完善。

### 从 RxJS-only 到 Signals + RxJS

Angular 12 熟手常见状态流：

```ts
readonly vm$ = combineLatest([
  this.user$,
  this.permissions$,
]).pipe(
  map(([user, permissions]) => ({ user, permissions }))
);
```

Signals 后可以把组件局部派生状态写得更直接：

```ts
readonly user = signal<User | null>(null);
readonly isAdmin = computed(() => this.user()?.role === 'admin');
```

建议：

- 跨组件异步流、复杂事件流：继续 RxJS。
- 组件内部 UI 状态：优先 Signals。
- 从 Observable 接入模板状态：考虑 `toSignal()`。

## v21：Zoneless 默认，Signal Forms 出现

v21 是另一个心智变化点：Zoneless 成为默认模型。

官方文档说明：Angular v21+ 默认 zoneless；v20 需要通过 `provideZonelessChangeDetection()` 启用。

### Zoneless 默认

这意味着新项目更强调明确的变更通知来源：

- Signals 更新。
- `AsyncPipe`。
- `markForCheck`。
- 组件事件。
- 框架识别的输入变化。

迁移老项目时要留意：

```ts
setTimeout(() => {
  this.value = 'done';
});
```

如果这个普通字段没有通过 signal、async pipe 或显式标记触发变更，未来在 zoneless 下可能不刷新。

### Signal Forms

v21 引入实验性的 Signal Forms，用 signals 表达表单状态。\
它不是立刻替代 Reactive Forms 的成熟方案，但代表表单方向会更 signal-first。

对大型业务项目建议：

- 生产主线仍可继续 Typed Reactive Forms。
- 新实验页面可以研究 Signal Forms。
- 不建议一上来把复杂表单系统全量迁移。

### 测试和可访问性方向

v21 也继续增强现代测试体验和无样式可访问性基础设施，例如 Vitest、ARIA 相关能力。\
如果你维护组件库，这条线值得持续关注。

## v22：当前最新 major，重点看迁移落地

截至当前环境，npm 上 `@angular/core` 和 `@angular/cli` 最新版本为 `22.0.0`。\
v22 作为最新 major，你从 Angular 12 看过来，重点不是追逐一个孤立 API，而是把 v13-v21 的新范式消化掉：

- 不再以 View Engine/ngcc 为兼容中心。
- 新代码默认 standalone。
- 模板优先考虑 `@if` / `@for` / `@switch`。
- 首屏性能可以用 `@defer`。
- 组件状态优先考虑 Signals。
- SSR 项目重点看 hydration / event replay / incremental hydration。
- 新项目接受 zoneless 心智。
- 构建链路关注 esbuild/Vite builder。

如果你的项目还在 Angular 12，直接跳 v22 不建议“一把梭”。更现实的策略是：

```text
12 -> 13 -> 14 -> 15 -> 16 -> 17 -> 18 -> 19 -> 20 -> 21 -> 22
```

每个 major 通过 `ng update` 和官方 Update Guide 迁移一次。

## 对 Angular 12 老项目的升级优先级

### 1. 先解决环境和依赖

Angular 12 时代常见环境：

```text
Node 12/14
TypeScript 4.2/4.3
RxJS 6
webpack builder
```

Angular 21 官方兼容表要求 Node、TypeScript 都已经大幅升级。\
v22 也应按最新兼容要求处理。

先查：

```bash
node -v
npm -v
ng version
npm ls @angular/core
npm ls typescript
```

### 2. 私有组件库先升级

最容易卡升级的通常不是业务代码，而是：

- 私有 UI 库。
- 老 Angular Material 封装。
- 自定义 webpack builder。
- 老版本 monorepo 工具。
- 依赖 View Engine 包格式的库。

### 3. 表单迁移不要贪快

推荐顺序：

```text
Untyped Forms 保持稳定
-> 关键表单迁移到 Typed Forms
-> 新页面研究 Signal Forms
```

### 4. Standalone 渐进迁移

不用一口气删掉所有 `NgModule`。

推荐：

- 新页面用 standalone。
- 新弹窗、新组件用 standalone。
- 路由懒加载逐步改 `loadComponent`。
- 最后再清理 SharedModule / FeatureModule。

### 5. Signals 先从局部状态开始

适合先迁移：

- loading。
- selectedTab。
- filter keyword。
- derived view model。
- UI 展开/收起状态。

不建议第一步就动：

- 全局 store。
- 复杂 RxJS 数据流。
- websocket stream。
- 权限系统。

### 6. Zoneless 要先审计隐式刷新

重点搜索：

```text
setTimeout
setInterval
addEventListener
Promise.then
第三方回调
直接 DOM 操作
NgZone.onStable
NgZone.run
```

这些地方在 zoneless 或 hydration 场景中都可能成为问题点。

## 新旧写法对照

### 模块启动 vs standalone 启动

```ts
// Angular 12 常见
platformBrowserDynamic().bootstrapModule(AppModule);
```

```ts
// 新范式
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ],
});
```

### `*ngIf` vs `@if`

```html
<div *ngIf="user; else empty">{{ user.name }}</div>
<ng-template #empty>暂无用户</ng-template>
```

```html
@if (user) {
  <div>{{ user.name }}</div>
} @else {
  <div>暂无用户</div>
}
```

### RxJS 局部状态 vs Signals 局部状态

```ts
readonly count$ = new BehaviorSubject(0);
readonly double$ = this.count$.pipe(map((count) => count * 2));
```

```ts
readonly count = signal(0);
readonly double = computed(() => this.count() * 2);
```

### Router module lazy load vs standalone component lazy load

```ts
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
}
```

```ts
{
  path: 'admin',
  loadComponent: () => import('./admin/admin.component').then((m) => m.AdminComponent),
}
```

### 手写懒加载 vs `@defer`

```ts
const { ChartComponent } = await import('./chart.component');
```

```html
@defer (on viewport) {
  <app-chart />
} @placeholder {
  <app-chart-skeleton />
}
```

## 最值得优先研究的 8 个主题

如果你已经很熟 Angular，建议按这个顺序补：

1. Standalone APIs：`bootstrapApplication`、`provideRouter`、`provideHttpClient`。
2. Typed Forms：先让表单摆脱 `any`。
3. Signals：`signal`、`computed`、`effect`、`toSignal`。
4. 新控制流：`@if`、`@for`、`@switch`。
5. `@defer`：组件级 lazy loading。
6. Hydration：SSR 项目的核心升级点。
7. Zoneless：未来 Angular 性能模型的关键。
8. 新构建系统：esbuild/Vite builder 与自定义 webpack 的替代方案。

## 推荐迁移路线

```text
第一阶段：跑通升级
- 按 major 逐步 ng update
- 修 Node/TS/RxJS 兼容
- 修第三方库和私有库
- 保持业务行为不变

第二阶段：现代化工程
- 引入 standalone 新页面
- 迁移部分 lazy route 到 loadComponent
- typed forms 逐步替换 Untyped
- 更新构建配置

第三阶段：响应式现代化
- 局部 UI 状态改 signals
- Observable -> signal 边界治理
- 去掉不必要的手动订阅
- 引入 takeUntilDestroyed

第四阶段：性能和 SSR
- 新控制流替代复杂微语法
- @defer 拆重组件
- SSR 项目启用 hydration
- 研究 incremental hydration

第五阶段：zoneless-ready
- 审计隐式变更检测
- 减少对 NgZone 稳定事件的依赖
- 全面 OnPush/signals/async pipe 化
```

## 参考入口

- Angular version compatibility：<https://angular.dev/reference/versions>
- Angular releases：<https://angular.dev/reference/releases>
- Angular Update Guide：<https://angular.dev/update>
- Signals guide：<https://angular.dev/guide/signals>
- Typed Forms guide：<https://angular.dev/guide/forms/typed-forms>
- Standalone migration：<https://angular.dev/reference/migrations/standalone>
- Deferred loading with `@defer`：<https://angular.dev/guide/templates/defer>
- Hydration guide：<https://angular.dev/guide/hydration>
- Incremental Hydration：<https://angular.dev/guide/incremental-hydration>
- Zoneless guide：<https://angular.dev/guide/zoneless>
