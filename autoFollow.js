/*
	LOGGING-IN ONLY!

	navigate to https://weibo.com/
	press f12, copy following code, paste it into console and wait a moment 
	remember to fill uid list
	script will auto run :)
*/

(function autoFollow(){
	let list = [...] // fill uid list
	function addFollow(uid){
		let xhr = new XMLHttpRequest()	
		xhr.onreadystatechange=function()
		{
			if(xhr.readyState==4&&xhr.status==200){	
				let data = JSON.parse(xhr.responseText)
				if(data.code==100000){
					console.log(uid.toString(),data.data.fnick,"关注成功")
				}
				else if(data.code==100001){
					console.log(uid.toString(),"关注失败")
				}
			}
		}
		xhr.open('POST', "https://weibo.com/aj/f/followed?ajwvr=6&__rnd="+new Date().getTime(), true)
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		xhr.send("uid="+uid+"&objectid=&f=1&extra=&refer_sort=&refer_flag=1005050001_&location=page_100505_home&oid="+uid+"&wforce=1&nogroup=false&fnick=&refer_lflag=&refer_from=profile_headerv6&_t=0")
	}
	function followByList(index){
		if (index>=list.length){
			console.log("全部完成")
			return
		}
		else{
			console.log(index+1+"/"+list.length)
		}
		addFollow(list[index])
		setTimeout(function(){
			followByList(index+1)
		},2000)
	}
	followByList(0)
})()