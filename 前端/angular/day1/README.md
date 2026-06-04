# Day1：Angular 22 Signal Forms Demo

这个 day1 不是 Angular 入门，而是给熟悉 Angular 12+ 的开发者快速体验 Angular 22 的 Signal Forms。

> Signal Forms 来自 `@angular/forms/signals`。官方文档说明它基于 signals 管理表单状态，提供自动双向同步、类型安全字段访问和 schema-based validation。

## 学习目标

看完并跑通这个 demo 后，你应该能：

- 用 `signal()` 创建 form model。
- 用 `form(model, schema)` 创建 signal form。
- 用 `[formField]` 绑定原生表单控件。
- 用 `required()`、`email()`、`minLength()` 做基础校验。
- 用 `validate()` 做跨字段校验。
- 用 `disabled()`、`hidden()` 做条件表单逻辑。
- 用 `submit()` 处理提交。
- 理解 `form.email().invalid()`、`errors()`、`touched()` 这些字段状态信号。

## 文件说明

- [package.json](./package.json)
- [Angular 配置](./angular.json)
- [入口文件](./src/main.ts)
- [App 配置](./src/app/app.config.ts)
- [Signal Forms 示例组件](./src/app/app.component.ts)
- [模板](./src/app/app.component.html)
- [样式](./src/app/app.component.css)

## 运行方式

Angular 22 要求 Node 版本至少满足：

```text
^22.22.3 || ^24.15.0 || >=26.0.0
```

如果当前是 `v22.22.2`，`npm install` 可以安装，但 `ng build` / `ng serve` 会被 Angular CLI 拦住，需要先升级 Node。

```bash
npm install
npm start
```

然后访问：

```text
http://localhost:4200
```

## Demo 覆盖点

这个 demo 做的是一个注册表单：

- `name`：必填。
- `email`：必填 + 邮箱格式。
- `password`：必填 + 最小长度。
- `confirmPassword`：跨字段校验，必须和密码一致。
- `wantsNewsletter`：是否订阅 newsletter。
- `newsletterEmail`：只有订阅时显示并要求必填。
- `hasReferral`：是否有邀请码。
- `referralCode`：没有邀请码时 disabled，有邀请码时必填。

## 和 Angular 12 Reactive Forms 的差异

| Angular 12 Reactive Forms | Angular 22 Signal Forms |
| --- | --- |
| `FormGroup` / `FormControl` | `signal()` model + `form()` field tree |
| Validator 挂在 control 上 | schema 函数里声明规则 |
| `form.value` 读取快照 | model signal 是单一数据源 |
| 状态多从 control 属性读取 | 字段状态是 signal，例如 `invalid()` |
| 条件逻辑常写在订阅里 | `disabled()`、`hidden()` 等规则内置 reactive logic |

## 注意点

- Signal Forms 是 Angular 新表单方向，和传统 Reactive Forms 思维不完全一样。
- 复杂老项目不要一上来全量替换 Reactive Forms。
- 建议先在新页面、小型表单、内部工具页试用。
- 生产大表单迁移前，要重点验证自定义控件、异步校验、表单库封装和测试策略。

## 官方参考

- Signal Forms overview: <https://angular.dev/guide/forms/signals/overview>
- Form models: <https://angular.dev/guide/forms/signals/models>
- Validation: <https://angular.dev/guide/forms/signals/validation>
- Form logic: <https://angular.dev/guide/forms/signals/form-logic>
- Cross-field logic: <https://angular.dev/guide/forms/signals/cross-field-logic>
