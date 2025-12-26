---
type: "to-read"
id: 20251226081207
created: 2025-12-26T08:18:07
source:
  - "https://getiot.tech/article/server-self-deploy-github/"
tags:
reviewd: false
---
![](https://static.getiot.tech/github-self-hosted-runner-banner.jpg#center)

新手程序员阿牛最近在负责公司一个静态网站开发和部署，一开始每次更新他都是手动通过 SSH、rsync 方式手动操作，有时候一天更新好几次，让他忙得不可开交。后来他了解到 GitHub Actions 有一个 self-hosted runner 功能，从此之后，他每天都能多睡2小时。

## 阿牛的“人肉部署”噩梦

在改造前，阿牛的日常是这样的：

```bash
# 每次更新必经之路
npm run build
rsync -avz build/ user@server:/var/www/html/
ssh user@server "sudo systemctl reload nginx"
```

⚠️ 手动部署带来了一些痛点：

- 凌晨 2 点被领导打电话叫醒：“网站更新后样式没了！”
- 本地环境和服务器环境不一致，构建产物上传后报错。
- 同事问：“上次部署是什么时候？”，只能翻聊天记录。

直到有一次他在 GitHub 开源社区发现了 **self-hosted runner** 这个神器，阿牛的苦日子终于要结束了 💡

## Self-hosted Runner 到底是什么？

Self-hosted runner 即“自托管运行器”，它是 GitHub Actions 的一种运行器类型，用于在你自己提供的服务器上执行 GitHub Actions 工作流。

与 GitHub-hosted runners（GitHub 托管的运行器）相比，Self-hosted runners 运行在你自己的服务器上，而不是由 GitHub 提供和维护，因此可以访问你的私有网络、数据库、Docker 环境等，适合需要访问服务器资源的部署场景。同时，Self-hosted runners 不占用 GitHub 的免费额度。

和传统 rsync 操作相比，Self-hosted runner 相当于一个会主动干活的机器人：

| 操作方式 | 你的角色 | 服务器角色 | 风险点 |
| --- | --- | --- | --- |
| **rsync + SSH** | 你当“快递员” | 被动接收文件 | 漏步骤、权限错误、误删文件 |
| **Self-hosted Runner** | 你当“指挥官” | 主动干活的机器人 | 一次配置，永久省心 |

为什么说 Self-hosted runner 方式更安全？

- 🔒 **不开放 SSH 端口** ：Runner 通过 HTTPS 出站连接 GitHub，无需暴露 22 端口。
- 🔒 **权限精准控制** ：Runner 用专用账号运行，只能执行预定义命令。
- 🔒 **操作全留痕** ：所有命令在 GitHub UI 可追溯，告别 `~/.bash_history` 丢失。

## Self-hosted runner 实践

假如你有一个 Docusaurus 构建的静态网站，源代码仓库放在 GitHub 上，你需要将该网站部署到一台 Ubuntu 24.04 云服务器。一起来看看怎么做吧！

### ① 在 GitHub 创建 Runner

首先，进入 GitHub 仓库，依次选择 **Settings → Actions → Runners → New self-hosted runner** ，创建一个新的运行器。

![](https://static.getiot.tech/github-actions-self-hosted-runner-setup-01.webp)

选择 **Linux** + **x64** ，复制配置命令（含临时 token）

![](https://static.getiot.tech/github-actions-self-hosted-runner-setup-02.webp)

### ② 在云服务器执行（用非 root 用户！）

```bash
# 1. 创建专用目录
sudo -iu ubuntu  # 切换到普通用户
mkdir actions-runner && cd actions-runner

# 2. 下载最新版（替换为 GitHub 提供的链接）
curl -o actions-runner-linux-x64-2.320.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.320.0/actions-runner-linux-x64-2.320.0.tar.gz

# 3. 解压
tar xzf ./actions-runner-linux-x64-2.320.0.tar.gz

# 4. 配置 Runner（粘贴 GitHub 生成的命令）
./config.sh --url https://github.com/yourname/repo --token YOUR_TOKEN

# 按提示操作：
# Runner name: xxx-prod-server  # 建议命名体现用途
# Additional labels: production    # 可以增加标签
# Work folder: [_work]             # 默认即可
```

### ③ 配置为系统服务（开机自启）

```bash
# 创建 systemd 服务
sudo ./svc.sh install ubuntu  # 自动用当前用户权限

# 启动服务
sudo ./svc.sh start

# 验证状态
systemctl status actions.runner.* 
# 看到 Active: active (running) 即成功！
```

回到 GitHub 页面，在仓库的 **Actions → Runners → Self-hosted runners** 页面看到 `xxx-prod-server` ！

![](https://static.getiot.tech/github-actions-self-hosted-runner-setup-03.webp)

⚠️ 注意：

- **绝对不要用 root 运行 Runner** ！
- 防火墙只需开放 **出站 443 端口** （无需入站规则）

### ④ 创建 workflow 文件

要将 Docusaurus 部署到自有云服务器（例如 Nginx），你需要在 GitHub 仓库中创建一个文件 `.github/workflows/deploy.yml` ，内容如下：

```yaml
name: Deploy to My Server  # workflow 名称

on:
  push:
    branches: [ main ]     # 推送到 main 时触发
    paths:
      - 'website/**'       # 仅当 website 目录变化时触发（按你的目录结构调整，如果没有可删除）

jobs:
  deploy:
    runs-on: self-hosted   # 👈 关键！指定使用自托管 Runner
    env:
      # 服务器上的永久部署目录（提前创建好！）
      DEPLOY_PATH: /var/www/html
      # 设置 npm 加速镜像
      NODEJS_ORG_MIRROR: https://npmmirror.com/mirrors/node/
      NPM_CONFIG_REGISTRY: https://registry.npmmirror.com
      
    steps:
      # 1. 获取代码（自动克隆到临时目录）
      - name: Checkout repository
        uses: actions/checkout@v4
      
      # 2. 设置 Node.js 环境
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      # 3. 构建 Docusaurus
      - name: Build Docusaurus
        run: |
          cd website  # 👈 进入你的 Docusaurus 项目目录（如果没有则删除）
          npm ci --prefer-offline
          npm run build
      
      # 4. 同步到服务器永久目录
      - name: Sync files to server
        run: |
          # 确保目标目录存在且权限正确
          sudo mkdir -p ${{ env.DEPLOY_PATH }}
          sudo chown -R $USER:www-data ${{ env.DEPLOY_PATH }}  # 假设 Nginx 用 www-data 用户
          
          # 高效同步（删除多余文件，保留权限）
          rsync -av --delete \
            website/build/ \  # 临时区的构建产物
            ${{ env.DEPLOY_PATH }}/  # 服务器永久目录
      
      # 5. 重载 Nginx
      - name: Reload Nginx
        run: sudo systemctl reload nginx || true  # 失败也不中断流程
```

这个配置如何工作？

1. **首次运行** ：
	- 从官方源下载 Node.js 20 二进制包
	- 安装到 Runner 的 **专属缓存目录** （ `~/.cache/actions-node` ）
	- 同时缓存 `node_modules` （通过 `cache: 'npm'` ）
2. **后续运行** ：
	- 直接复用缓存的 Node.js 和依赖
	- 构建速度提升 **3-5 倍** （实测 Docusaurus 项目：45s → 9s）

另外，由于我们使用国内的云服务器，所以需要设置 npm 加速镜像，否则可能因为无法下载 npm 包而导致失败。

### ⑤ 服务器权限配置

为了确保部署成功，一定要检查当前用户拥有部署目录的读写权限。

```bash
# 1. 创建部署目录
sudo mkdir -p /var/www/html

# 2. 设置权限（Runner 用户为 ubuntu）
sudo chown -R ubuntu:www-data /var/www/html
sudo chmod -R g+rwxs /var/www/html  # 组继承权限

# 3. 免密重载 Nginx（安全限制）
echo "ubuntu ALL=(root) NOPASSWD: /usr/bin/systemctl reload nginx" | \
  sudo tee /etc/sudoers.d/deploy
```

### ⑥ 更新代码到 main 分支

现在，当你更新代码到 main 分支时，就会触发 GitHub Action，你可以在 GitHub 仓库的 Actions 标签页看到构建和部署流程。

![](https://static.getiot.tech/github-self-hosted-runner-geekat-action-ok.webp)

构建完成后，就可以看到新的网站页面啦！

## 结语

Self-hosted Runner 不是玩具，而是开发者的效率核武器。它把重复劳动转化为一行 `git push` ，把焦虑的凌晨变成安稳的睡眠。当你配置好这个 workflow，你收获的不只是省下的时间，更是对技术的掌控感。

**“优秀的开发者不是写更多代码的人，而是让机器替自己工作的人。”** —— 阿牛在 Runner 配置成功的那个清晨，更新了他的签名。