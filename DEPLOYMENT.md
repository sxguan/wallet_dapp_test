# Chainlink Price Feed DApp - Vercel Deployment Guide

这个指南将详细说明如何将您的 Chainlink 价格数据 DApp 部署到 Vercel。

## 项目概述

这是一个基于 Chainlink 价格数据源的去中心化应用程序，包含：
- **后端**: Hardhat 智能合约项目，包含 PriceConsumerV3 合约
- **前端**: React 应用程序，可以与智能合约交互获取 ETH/USD 价格

## 部署前准备

### 1. 智能合约部署

首先需要部署 PriceConsumerV3 智能合约到 Sepolia 测试网：

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 创建 .env 文件并配置
cp .env.example .env
# 编辑 .env 文件，添加您的私钥和 RPC URL
```

在 `backend/.env` 文件中添加：
```
SEPOLIA_RPC_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_wallet_private_key
```

部署合约：
```bash
# 部署到 Sepolia 测试网
npx hardhat run scripts/deploy.js --network sepolia
```

记录输出的合约地址，稍后需要用到。

### 2. 前端配置

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
```

在 `frontend/.env.local` 中更新合约地址：
```
REACT_APP_PRICE_CONSUMER_ADDRESS=your_deployed_contract_address
REACT_APP_NETWORK_NAME=Sepolia
REACT_APP_CHAIN_ID=11155111
```

## Vercel 部署步骤

### 方法一：通过 Vercel Dashboard（推荐）

1. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub、GitLab 或 Bitbucket 账户登录

2. **导入项目**
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 选择您的 GitHub 仓库

3. **配置项目设置**

   在项目配置页面：
   
   **Framework Preset**: `Create React App`
   
   **Root Directory**: `./` (根目录)
   
   **Build and Output Settings**:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `cd frontend && npm install`

4. **环境变量配置**

   在 "Environment Variables" 部分添加：
   ```
   REACT_APP_PRICE_CONSUMER_ADDRESS = your_deployed_contract_address
   REACT_APP_NETWORK_NAME = Sepolia
   REACT_APP_CHAIN_ID = 11155111
   ```

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待构建完成（通常需要 2-5 分钟）

### 方法二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目根目录登录
vercel login

# 部署项目
vercel

# 按照提示回答问题：
# ? Set up and deploy "~/chainlink-dapp-example"? [Y/n] y
# ? Which scope do you want to deploy to? [选择您的账户]
# ? Link to existing project? [N/y] n
# ? What's your project's name? chainlink-price-feed-dapp
# ? In which directory is your code located? ./

# 设置环境变量
vercel env add REACT_APP_PRICE_CONSUMER_ADDRESS
# 输入您的合约地址

vercel env add REACT_APP_NETWORK_NAME
# 输入: Sepolia

vercel env add REACT_APP_CHAIN_ID
# 输入: 11155111

# 重新部署以应用环境变量
vercel --prod
```

## Vercel 配置详解

项目已包含 `vercel.json` 配置文件：

```json
{
  "name": "chainlink-price-feed-dapp",
  "version": 2,
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/build",
  "installCommand": "cd frontend && npm install",
  "devCommand": "cd frontend && npm start",
  "framework": "create-react-app",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 配置说明：

- **buildCommand**: 指定构建命令，进入 frontend 目录并执行 React 构建
- **outputDirectory**: 指定构建输出目录
- **installCommand**: 指定依赖安装命令
- **framework**: 指定使用的框架
- **routes**: 配置路由，确保 SPA 路由正常工作

## 部署后配置

### 1. 域名设置（可选）

如果您有自定义域名：
1. 在 Vercel Dashboard 中选择您的项目
2. 进入 "Settings" > "Domains"
3. 添加您的自定义域名
4. 按照提示配置 DNS 记录

### 2. 环境变量管理

在 Vercel Dashboard 中：
1. 选择项目 > Settings > Environment Variables
2. 可以为不同环境（Development、Preview、Production）设置不同的变量

## 自动部署

Vercel 会自动监听您的 Git 仓库：
- **主分支推送**: 自动部署到生产环境
- **其他分支推送**: 自动创建预览部署
- **Pull Request**: 自动创建预览部署

## 故障排除

### 常见问题

1. **构建失败**
   ```
   解决方案：检查 package.json 中的依赖是否正确
   ```

2. **环境变量未生效**
   ```
   解决方案：确保环境变量名以 REACT_APP_ 开头
   重新部署项目以应用新的环境变量
   ```

3. **路由 404 错误**
   ```
   解决方案：确保 vercel.json 中的路由配置正确
   ```

4. **MetaMask 连接问题**
   ```
   解决方案：确保用户使用 HTTPS 协议访问
   检查网络设置是否为 Sepolia
   ```

### 调试步骤

1. **查看构建日志**
   - 在 Vercel Dashboard 中查看部署日志
   - 检查是否有编译错误

2. **检查环境变量**
   - 确认在 Vercel 中正确设置了所有环境变量
   - 在浏览器开发者工具中检查变量是否正确加载

3. **测试智能合约**
   - 确认合约已正确部署到 Sepolia 网络
   - 使用 Etherscan 验证合约地址

## 项目功能说明

部署成功后，用户可以：

1. **连接 MetaMask 钱包**
2. **查看当前 ETH/USD 价格**（实时从 Chainlink 预言机获取）
3. **存储当前价格**到智能合约
4. **查看之前存储的价格**

## 网络要求

- 支持 Sepolia 测试网
- 需要 MetaMask 或其他 Web3 钱包
- 需要一些 Sepolia ETH 用于交易（可从水龙头获取）

## 安全注意事项

1. **不要在代码中硬编码私钥**
2. **使用环境变量管理敏感信息**
3. **定期更新依赖包**
4. **在主网部署前充分测试**

## 监控和维护

- 使用 Vercel Analytics 监控网站性能
- 定期检查 Chainlink 价格数据源状态
- 监控智能合约的 gas 使用情况

部署完成后，您的 DApp 将在 Vercel 提供的 URL 上可用，通常格式为：`https://your-project-name.vercel.app`