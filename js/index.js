	const menu = document.querySelector('.menu'),
		menuItem = document.querySelectorAll('.menu_item'),
		hamburger = document.querySelector('.hamburger');

	hamburger.addEventListener('click', () => {
		toggler();
	});

	menuItem.forEach(item => {
		item.addEventListener('click', () => {
			toggler();
		});
	});

	function toggler() {
		hamburger.classList.toggle('hamburger_active');
		menu.classList.toggle('menu_active');
	}