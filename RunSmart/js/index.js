// $(document).ready(function () {
// 	$('.carousel__inner').slick({
// 		speed: 1200,
// 		prevArrow: '<button type="button" class="slick-prev"><img src="icons/carousel/arrow.png"/></button>',
// 		nextArrow: '<button type="button" class="slick-next"><img src="icons/carousel/arrow.png"/></button>',
// 		responsive: [{
// 			breakpoint: 841,
// 			settings: {
// 				arrows: false,
// 				dots: true
// 			}
// 		}]
// 	});
// });

const slider = tns({
	container: '.carousel__inner',
	mode: 'carousel',
	items: 1,
	slideBy: 'page',
	autoplay: false,
	controls: false,
	nav: true,
	navPosition: "bottom"
});

document.querySelector('.prev').addEventListener('click', function () {
	slider.goTo('prev');
});

document.querySelector('.next').addEventListener('click', function () {
	slider.goTo('next');
});

$(document).ready(function () {

	$('ul.catalog__tabs').on('click', 'li:not(.catalog__tab--active)', function () {
		$(this)
			.addClass('catalog__tab--active').siblings().removeClass('catalog__tab--active')
			.closest('div.container').find('div.catalog__content').removeClass('catalog__content--active')
			.eq($(this).index()).addClass('catalog__content--active');
	});

	$('.catalog-item__link').each(function (i) {
		$(this).on('click', (e) => {
			e.preventDefault();
			$('.catalog-item__content').eq(i).toggleClass('catalog-item__content--active');
			$('.catalog-item__list').eq(i).toggleClass('catalog-item__list--active');
			$('.catalog-item__back').eq(i).toggleClass('catalog-item__back--active');
		});
	});
	$('.catalog-item__back').each(function (i) {
		$(this).on('click', (e) => {
			e.preventDefault();
			$('.catalog-item__content').eq(i).toggleClass('catalog-item__content--active');
			$('.catalog-item__list').eq(i).toggleClass('catalog-item__list--active');
			$('.catalog-item__back').eq(i).toggleClass('catalog-item__back--active');
		});
	});

	$('[data-modal="consultation"]').on('click', function () {

		$("body").css("overflow", "hidden");
		$('.overlay, #consultation').fadeIn("slow");
	});
	$('.modal__close').on('click', function () {
		$("body").css("overflow", "auto");
		$('form').trigger('reset');
		$('.overlay, #consultation, #order, #thanks').fadeOut("slow");
	});


	$('.button--mini').each(function (i) {
		$(this).on('click', function () {
			$("body").css("overflow", "hidden");
			$('#order .modal__descr').text($('.catalog-item__subtitle').eq(i).text());
			$('.overlay, #order').fadeIn("slow");
		});
	});

	function validateForms(form) {
		$(form).validate({
			rules: {
				name: {
					required: true,
					minlength: 3
				},
				phone: "required",
				email: {
					required: true,
					email: true
				}
			},
			messages: {
				name: {
					required: "Пожалуйста, введите свое имя",
					minlength: jQuery.validator.format("Введите {0} символа!")
				},
				phone: "Пожалуйста, введите свой номер телефона",
				email: {
					required: "Пожалуйста, введите свой Email",
					email: "Неправельно введен адрес почты"
				}
			}

		});
	}
	validateForms('#order form');
	validateForms('#consultation form');
	validateForms('#consultation-form form');

	$('input[name=phone]').mask("+38 (999) 999-9999");
	$('form').submit(function (e) {
		e.preventDefault();
		const name = e.target.querySelector('input[name=name]'),
			phone = e.target.querySelector('input[name=phone]'),
			email = e.target.querySelector('input[name=email]');

		if (name.value != "" && phone.value != "", email.value != "") {
			$.ajax({
				type: "POST",
				url: "../mailer/smart.php",
				data: $(this).serialize()
			}).done(function () {
				$(this).find("input").val("");
				$('form').trigger('reset');
				$('#consultation, #order').fadeOut();
				$('overlay, #thanks').fadeIn('slow');
			});
		}
		return false;
	});

	//Smooth scroll and pageup

	$(window).scroll(function () {
		if ($(this).scrollTop() > 1600) {
			$('.pageup').fadeIn();
		} else {
			$('.pageup').fadeOut();
		}
	});

	$('.pageup').click(function () {
		const href = $(this).attr("href");
		$("html, body").animate({
			scrollTop: $(href).offset().top + "px"
		});
		return false;
	});

	const wow = new WOW({
		boxClass: 'wow',
		animateClass: 'animate__animated',
		offset: 0,
		mobile: true,
		live: true
	});

	wow.init();
});