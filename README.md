# 微博批量关注 (转移关注列表)
好像并没有什么卵用

## 起因
<img src="https://user-images.githubusercontent.com/26399680/47438989-1b910300-d7de-11e8-9957-b68888426d36.png" width="480"/>

## 使用方法
### 得到 A 账号关注列表
1. 前往微博 H5 版首页 ([https://m.weibo.cn](https://m.weibo.cn))
2. 登录 A 账号
3. 右键 "检查" 打开开发者工具，复制下面的代码，粘贴到控制台，等待结果并复制
```javascript
(() => {
	let uid = config.uid, follows = []
	const pageQuery = (page = 1) => {
		let xhr = new XMLHttpRequest()	
		xhr.onreadystatechange = () => {
			if(xhr.readyState == 4 && xhr.status == 200){
				let data = JSON.parse(xhr.responseText).data
				if(data.msg == '这里还没有内容') return console.log(JSON.stringify(follows))
				data.cards.forEach(card => follows.push(card.user.id))
				pageQuery(page + 1)
			}
		}
		xhr.open('GET', `/api/container/getSecond?luicode=10000011&lfid=100505${uid}&uid=${uid}&containerid=100505${uid}_-_FOLLOWERS&page=${page}`)
		xhr.send()
	}
	pageQuery()
})()
```
注：由于接口限制可能无法获得完整的关注列表

### 按列表为 B 账号添加关注
1. 前往 PC 版首页 ([www.weibo.com](https://www.weibo.com))
2. 退出 A 账号，登录 B 账号
3. 右键 "检查" 打开开发者工具，复制下面的代码并填入上一步得到的列表，粘贴到控制台，等待全部关注完成
```javascript
(list => {
	let index = -1, length = list.length
	const follow = uid => {
		let xhr = new XMLHttpRequest()
		xhr.onreadystatechange = () => {
			if(xhr.readyState == 4 && xhr.status == 200){
				let data = JSON.parse(xhr.responseText)
				if(data.code == 100000)
					console.log(`${index + 1}/${length}`, uid, data.data.fnick, '关注成功')
				else if(data.code == 100001)
					console.log(`${index + 1}/${length}`, uid, '关注失败')
			}
		}
		xhr.open('POST', `/aj/f/followed?ajwvr=6&__rnd=${Date.now()}`)
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		xhr.send(`uid=${uid}&objectid=&f=1&extra=&refer_sort=&refer_flag=1005050001_&location=page_100505_home&oid=${uid}&wforce=1&nogroup=false&fnick=&refer_lflag=&refer_from=profile_headerv6&_t=0`)
	}
	let scheduled = setInterval(() => {
		index += 1
		follow(list[index])
	}, 2000)
	setTimeout(() => {
		clearTimeout(scheduled)
	}, 2000 * length)
})(/*上一步的结果*/)
```
注：接口似乎完全不管重复关注

