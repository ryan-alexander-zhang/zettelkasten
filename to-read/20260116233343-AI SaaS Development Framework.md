---
type: to-read
id: 20260116230143
created: 2026-01-16T23:33:43
source:
  - https://shipany.ai/zh/docs/payment/paypal
tags:
  - business
reviewd: false
---
[支付](https://shipany.ai/zh/docs/payment)

## Paypal

ShipAny 集成了 [Paypal](https://www.paypal.com/) 作为支付服务供应商，只需简单配置即可接入使用。

## 接入 Paypal 支付

按照以下步骤为你的项目接入 Paypal 支付。

开通 Paypal 商户

参考 [Paypal 商家入驻指南](https://www.paypal.com/c2/webapps/mpp/how-to-guides/sign-up-business-account) 开通 Paypal 商户。

查看 API 密钥

使用正式的 Paypal 商户账号和密码，登录 [Paypal 商户后台](https://www.paypal.com/merchantapps/setup/checkout/advanced) ，查看支付密钥。

`API Credentials` 下面的 `API Key` 和 `Secret` 是 Paypal 收款的 API 密钥。

`Sandbox credentials` 下面的 `Username` 和 `Password` 是 Paypal 测试环境的账号和密码。

本地测试时，请切换到 `Sandbox` 环境，正式上线时，切换到 `Live` 环境。

![](https://cdn.shipany.ai/imgs/e4a8993dc1c1f0370b1e520866be4c4e.png)

配置 Paypal 支付

在项目管理后台，进入 `Settings -> Payment -> Paypal` 面板，在 `Paypal Client ID` 和 `Paypal Client Secret` 字段分别填入上一步设置的 `API Key` 和 `Secret` 。

`Paypal Webhook ID` 是验证支付通知的签名密钥，可以先留空，等在后续步骤配置了支付通知后再填入。

![](https://cdn.shipany.ai/imgs/e5fd9a1fc7dbc7e0dffa9a75effb4892.png)

获取 Paypal 测试账号

使用正式的 Paypal 商户账号和密码，登录 [Paypal 开发者后台](https://developer.paypal.com/dashboard/accounts) ，进入 `Testing Tools -> Sandbox Accounts` 页面，选择 `Personal` 类型的账号，点击进入复制 `Email` 和 `Password` ，可以用作测试环境 `Paypal` 支付调试。

![](https://cdn.shipany.ai/imgs/0d48e43d6bb9050e67667d6ee71cd22b.png)

支付验证

访问项目的 `/pricing` 页面，查看默认的价格表，选择一个价格方案，点击下单按钮。

![](https://cdn.shipany.ai/imgs/56f6b29a88aff27d3bdf258c75386f62.png)

在弹出的支付方式选择框选择 `Paypal` ，如果能正常跳转到 Paypal 支付页面，说明支付配置成功。

在 `Paypal` 支付页面，使用上一步获取的 Paypal 测试账户登录，验证 Paypal 支付功能。

查看交易记录

使用第二步 `Sandbox credentials` 下的 `Username` 和 `Password` 登录 [Paypal 测试商户后台](https://www.sandbox.paypal.com/unifiedtransactions/) ，查看测试环境的交易订单。

如果是正式环境，则使用正式的商户账号和密码登录 [Paypal 商户后台](https://www.paypal.com/unifiedtransactions) 查看真实的交易订单。

## 设计价格表

默认的价格表配置在 `src/config/locale/messages/{locale}/pages/pricing.json` 文件中，支持多语言，每个 `locale` 对应一个独立的价格表配置。

项目价格表跟支付供应商无关。接入 Paypal 支付时，价格表设计可参考 Stripe 支付的： [设计价格表](https://shipany.ai/zh/docs/payment/stripe#%E8%AE%BE%E8%AE%A1%E4%BB%B7%E6%A0%BC%E8%A1%A8) 。

## 配置支付回调

用户在价格表页面选择价格方案下单成功后，会跳转到 Paypal 支付页面，支付成功后，会跳转到项目的回调接口： `/api/payment/callback` 。

在回调接口中，会根据订单号更新订单状态，再跳转到配置的 `callbackUrl` 。

这个配置的 `callbackUrl` 是在下单接口： `/api/payment/checkout` 中指定的：

```
const callbackUrl =

  paymentType === PaymentType.SUBSCRIPTION

    ? \`${callbackBaseUrl}/settings/billing\`

    : \`${callbackBaseUrl}/settings/payments\`;
```

按照默认配置，如果是一次性支付，最终会跳转到 `/settings/payments` 页面；如果是订阅支付，最终会跳转到 `/settings/billing` 页面。

你可以根据项目需求，自行修改用户支付完成后的跳转地址。

> 注意：支付回调是同步跳转的，如果用户在 Paypal 支付页面确认支付，在页面跳转前关闭了浏览器，未能正常跳转到项目回调接口，订单状态无法更新，用户在个人中心无法看到已支付的订单。此类情况叫做： `丢单` 。

为了避免支付回调的 `丢单` 情况，建议项目上线运营时，在 Paypal 后台配置支付通知。

## 配置支付通知

添加支付通知地址

登录 [Paypal 开发者后台](https://developer.paypal.com/dashboard/applications/sandbox) ，进入 `Apps & Credentials` 页面，选择默认的应用，划到最底部，点击 `Add Webhook` 按钮，添加支付通知地址。

- `Webhook URL` 输入接收通知的地址。必须是可以公网访问的 `https` 地址。格式为：

```
https://{your-domain.com}/api/payment/notify/paypal
```

把 `{your-domain.com}` 替换为你的项目域名，可以是根域名，也可以是子域名。

- `Event types` 点击 `All Events` 选择全部事件。

或者也可以只勾选其中一部分事件。ShipAny 项目中支持处理的支付通知事件包括：

```
CHECKOUT.ORDER.APPROVED               # 单次付款已授权（可选，用于pending状态）

CHECKOUT.ORDER.COMPLETED              # 单次付款成功

BILLING.SUBSCRIPTION.ACTIVATED        # 订阅激活

BILLING.SUBSCRIPTION.CANCELLED        # 订阅取消

BILLING.SUBSCRIPTION.PAYMENT.FAILED   # 续费失败

PAYMENT.SALE.COMPLETED                # 订阅续费成功

PAYMENT.CAPTURE.REFUNDED              # 单次付款退款

PAYMENT.SALE.REFUNDED                 # 订阅退款
```

填写完配置后，点击 `Save` 按钮，添加支付通知地址。

![](https://cdn.shipany.ai/imgs/69a8e5a025d2a21d2cb235c2eadf01e1.png)

复制支付通知签名密钥

创建完支付通知地址后，在支付通知列表页面，复制 `Webhook ID` ，这是支付通知的签名密钥。

配置支付通知签名密钥

在项目管理后台，进入 `Settings -> Payment -> Paypal` 面板，在 `Paypal Webhook ID` 字段填入上一步复制的支付通知签名密钥。

![](https://cdn.shipany.ai/imgs/e5fd9a1fc7dbc7e0dffa9a75effb4892.png)

## 本地调试支付通知

不同的支付供应商，本地调试支付通知的步骤一致。核心思路都是通过 `内网穿透` ，把一个公网地址映射到本地开发机，然后在支付供应商后台配置支付通知地址时，填入这个公网地址。

比如通过 [ngrok](https://ngrok.com/) 实现 `内网穿透` 后，填入到 Paypal 后台的支付通知地址示例：

```
https://xxx.ngrok-free.app/api/payment/notify/paypal
```

具体步骤可参考 Stripe 支付的： [本地调试支付通知](https://shipany.ai/zh/docs/payment/stripe#%E6%9C%AC%E5%9C%B0%E8%B0%83%E8%AF%95%E6%94%AF%E4%BB%98%E9%80%9A%E7%9F%A5) 。

## 参考

- [Paypal 官方文档](https://developer.paypal.com/docs/)
- [ngrok 官网](https://ngrok.com/)[Creem](https://shipany.ai/zh/docs/payment/creem)

[

Previous Page

](https://shipany.ai/zh/docs/payment/creem)[

Cloudflare R2

Next Page

](https://shipany.ai/zh/docs/storage/cloudflare-r2)