const range = document.querySelector('#moji');
const div = document.querySelector('.moji');
const mojis = ['😄','🙂','😐','😑','☹️','😩','😠','😡','😣','😤','😎','😔','😱'];
const rangecrty = document.querySelector('#mojicrty');
const divcrty = document.querySelector('.mojicrty');
const mojiscrty = ['☁','🤔','⛅','👌'];

range.addEventListener('input', (e) => {
  let rangeValue = e.target.value;
  div.textContent = mojis[rangeValue];
});
rangecrty.addEventListener('input', (e) => {
	let rangeValue = e.target.value;
	divcrty.textContent = mojiscrty[rangeValue];
  });