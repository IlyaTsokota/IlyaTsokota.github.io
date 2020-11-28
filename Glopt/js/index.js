'use strict';

const menu = document.querySelector('.header__menu'),
	burger = document.querySelector('.header__burger'),
	closeMenu = document.querySelector('.header__close'),
	menuItems = document.querySelectorAll('.header__menu  a');

burger.addEventListener('click', () => {
	menu.classList.add('header__menu--active');
	burger.classList.add('header__burger--active');
	document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', removeMenu);

menuItems.forEach(i => i.addEventListener('click', removeMenu));

function removeMenu() {
	if (menu.classList.contains('header__menu--active')) {
		menu.classList.remove('header__menu--active');
		burger.classList.remove('header__burger--active');
		document.body.style.overflow = 'auto';
	}
}

var mySwiper = new Swiper('.swiper-container', {
	direction: 'horizontal',
	loop: true,
	slidesPerView: 1,
	speed: 600,
	spaceBetween: 0,
	centeredSlides: true,
	navigation: {
		nextEl: '.swiper-next',
		prevEl: '.swiper-prev',
	},
	fadeEffect: {
		crossFade: true
	},
	breakpoints: {
		992: {
			slidesPerView: 3,
			spaceBetween: 0,
		},
	}
});

const firstForm = document.getElementById('form-feed--first'),
	secondForm = document.getElementById('form-question'),
	wrapper = document.querySelector('.wrapper');
firstForm.addEventListener('submit', formSend);
secondForm.addEventListener('submit', formSend);

async function formSend(e) {
	e.preventDefault();
	const error = formValidate(e.target);
	if (error === 0) {
		let user = {
			name: getValue(e.target, 'name'),
			phone: getValue(e.target, 'phone'),
			email: getValue(e.target, 'email'),
			message: getValue(e.target, 'message')
		};
		wrapper.classList.add('_sending');
		document.body.style.overflow = 'hidden';

		let response = await fetch('mailer/sendmail.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		});
		console.log(response);

		if (response.ok) {
			let result = await response.json();
			alert(result.message);
			e.target.reset();
			wrapper.classList.remove('_sending');
			document.body.style.overflow = 'auto';
		} else {
			alert('Ошибка');
			wrapper.classList.remove('_sending');
			document.body.style.overflow = 'auto';
		}
	} else {
		alert('Заполните обязательные поля');
	}
}

function getValue(form, name) {
	const field = form.querySelector(`[name=${name}]`);
	return field != null ? field.value : '';
}

function formValidate(form) {
	let error = 0;
	let formReq = form.querySelectorAll('._req');
	for (let i = 0; i < formReq.length; i++) {
		const input = formReq[i];
		formRemoveError(input);

		if (input.classList.contains('_email')) {
			if (emailTest(input)) {
				formAddError(input);
				error++;
			}
		} else if (input.classList.contains('_phone')) {
			if (input.value.length != 16) {
				formAddError(input);
				error++;
			}
		} else {
			if (input.value === '') {
				formAddError(input);
				error++;
			}
		}
	}
	return error;
}

function formAddError(input) {
	input.classList.add('_error');
}

function formRemoveError(input) {
	input.classList.remove('_error');
}

function emailTest(input) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}


function maskPhones() {
	const maskOptions = {
		mask: '+{7}(000)000-00-00',
		placeholderChar: '_'
	};
	const inputPhones = document.querySelectorAll("._phone");
	inputPhones.forEach(item => {
		const patternMask = IMask(item, maskOptions);
		item.addEventListener('blur', function () {
			if (patternMask.unmaskedValue.length != 11 && patternMask.unmaskedValue.length != 1) {
				patternMask.value = '';
			}
		}, true);
	});

}

function clearInputs() {
	document.querySelectorAll('input').forEach(i => i.value = '');
}

maskPhones();
clearInputs();

window.onscroll = function () {
	scrollFunction();
};

function scrollFunction() {
	const up = document.querySelector('.up');
	if (document.body.scrollTop > 1600 || document.documentElement.scrollTop > 1600) {
		up.classList.add('up--active');
	} else {
		up.classList.remove('up--active');
	}
}

function scrollToBlock() {
	let linkNav = document.querySelectorAll('.anchor'), //выбираем все ссылки к якорю на странице
		speed = 0.3; // скорость, может иметь дробное значение через точку (чем меньше значение - тем больше скорость)
	for (let i = 0; i < linkNav.length; i++) {
		linkNav[i].addEventListener('click', (e) => {
			e.preventDefault();
			let yOffset = window.pageYOffset,
				id = e.target.href.replace(/[^#]*(.*)/, '$1'),
				topOffset = document.querySelector(id).getBoundingClientRect().top;
			window.scrollTo(0, (yOffset + topOffset));//отменяем стандартное поведение
		});
	}
}
document.querySelector('.up').addEventListener('click', (e) => {
	e.preventDefault();
	window.scrollTo(0, 0.2);
});

scrollToBlock();