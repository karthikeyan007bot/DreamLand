

document.getElementById('login').addEventListener('click', (e) => {
	let parent = e.target.parentNode.parentNode;
	Array.from(e.target.parentNode.parentNode.classList).find((element) => {
		if(element !== "slide-up") {
			parent.classList.add('slide-up')
		}else{
			document.getElementById('signup').parentNode.classList.add('slide-up')
			parent.classList.remove('slide-up')
		}
	});
});

document.getElementById('signup').addEventListener('click', (e) => {
	let parent = e.target.parentNode;
	Array.from(e.target.parentNode.classList).find((element) => {
		if(element !== "slide-up") {
			parent.classList.add('slide-up')
		}else{
			document.getElementById('login').parentNode.parentNode.classList.add('slide-up')
			parent.classList.remove('slide-up')
		}
	});
});