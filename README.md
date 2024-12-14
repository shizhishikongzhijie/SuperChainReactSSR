# SuperChainReactSSR
区块链投票系统前端（包含node作为中间件）


## 如果想要监控node的日志(通过 easy-monitor )，请先使用npm下载xprofiler

```node
npm install xprofiler --save --xprofiler_binary_host_mirror=https://npmmirror.com/mirrors/xprofiler
```
详情请见：https://www.yuque.com/hyj1991/easy-monitor/application


# 确保你在正确的分支上
git checkout main

# 撤销所有已跟踪文件的本地更改
git reset --hard HEAD

# 删除所有未跟踪的文件和目录
git clean -fd

# 丢弃未提交的更改
git reset --hard HEAD

# 再次尝试拉取最新更改
git pull origin main