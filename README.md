# 微博批量关注 (转移关注列表)
好像并没有什么卵用

## 起因
<img src="https://user-images.githubusercontent.com/26399680/47438989-1b910300-d7de-11e8-9957-b68888426d36.png" width="480"/>

## 使用方法

### 得到 A 账号关注列表

1. 前往微博 H5 版首页 ([https://m.weibo.cn](https://m.weibo.cn))
2. 登录 A 账号
3. 右键 "检查" 打开开发者工具，复制下面的代码，粘贴到控制台，等待结果并复制

> - 关注数量较多时请耐心等待
> - 由于接口限制可能无法获得完整的关注列表

```javascript
(() => {
	const { uid } = config
	const follows = []
	const sleep = time => () => new Promise(resolve => setTimeout(resolve, time))
	const query = page =>
		fetch(`/api/container/getSecond?luicode=10000011&lfid=100505${uid}&uid=${uid}&containerid=100505${uid}_-_FOLLOWERS&page=${page}`)
			.then(response => response.json())
			.then(body => {
				const { data } = body
				if (data.msg === '这里还没有内容') return Promise.reject(new Error('finish'))
				data.cards.forEach(card => follows.push(card.user.id))
			})
	const polling = (page = 1) => query(page).then(sleep(1500)).then(() => polling(page + 1))

	polling()
		.catch(error => console.warn(`${error.message === 'finish' ? '获取完成' : `出错了 (${error.message})` }\n\n${JSON.stringify(follows)}`))
})()
```

### 按列表为 B 账号添加关注
1. 前往 PC 版首页 ([www.weibo.com](https://www.weibo.com))
2. 退出 A 账号，登录 B 账号
3. 右键 "检查" 打开开发者工具，复制下面的代码并填入上一步得到的列表，粘贴到控制台，等待全部关注完成

> 每日关注数量有上限，关注数量较多需要分批(分日)处理

```javascript
(list => {
	let index = 0
	const { length } = list
	const failed = []
	const deviation = () => Math.round(Math.random() * 100)
	const sleep = time => () => new Promise(resolve => setTimeout(resolve, time))
	const follow = uid =>
		fetch(`/aj/f/followed?ajwvr=6&__rnd=${Date.now()}`, {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body: `uid=${uid}&objectid=&f=1&extra=&refer_sort=&refer_flag=1005050001_&location=page_100505_home&oid=${uid}&wforce=1&nogroup=false&fnick=&refer_lflag=&refer_from=profile_headerv6&template=7&special_focus=1&isrecommend=1&is_special=0&_t=0`
		})
			.then(response => response.json())
			.then(data => {
				if (data.code === '100000')
					console.log(`${index}/${length}`, uid, data.data.fnick, '关注成功')
				else {
					console.log(`${index}/${length}`, uid, '关注失败')
					failed.push(uid)
					if (data.code === '100027') return Promise.reject(new Error('captcha is required'))
				}
			})
	const subscribe = () => index < length ? follow(list[index++]).then(sleep(4000 + deviation())).then(subscribe) : Promise.resolve()

	subscribe()
		.catch(error => console.error(`出错了 (${error.message})${list.slice(index).length ? `\n\n以下 ID 还未处理，请之后再试\n\n${JSON.stringify(list.slice(index))}` : ''}`))
		.then(() => failed.length && console.warn(`以下 ID 关注失败，请重试或手动关注\n\n${JSON.stringify(failed)}`))
})(/*上一步的结果*/)
```
