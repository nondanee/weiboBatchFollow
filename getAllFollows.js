/*
	LOGGING-IN ONLY!

	navigate to https://m.weibo.cn/beta
	press f12, copy following code, paste it into console and wait a moment 
	remember to fill uid
	script will auto run :)
*/

(function getAllFollows(){
	let uid = ?????????? //your own uid
	let allFollows = []
	function getFromFollowPage(page){
		let xhr = new XMLHttpRequest()	
		xhr.onreadystatechange=function()
		{
			if(xhr.readyState==4&&xhr.status==200){
				let data = JSON.parse(xhr.responseText)
				if (data.msg=="这里还没有内容")
					return
				for(let i=0;i<data.cards.length;i++)
					allFollows.push(data.cards[i].user.id)
				getFromFollowPage(page+1)
			}
		}
		xhr.open('GET',"https://m.weibo.cn/api/container/getSecond?luicode=10000011&lfid=100505"+uid+"&uid="+uid+"&containerid=100505"+uid+"_-_FOLLOWERS&page="+page,0)
		xhr.send()
	}
	getFromFollowPage(1)
	return JSON.stringify(allFollows)
})()