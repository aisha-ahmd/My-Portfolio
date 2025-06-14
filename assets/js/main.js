/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
	const header = document.getElementById('header')
	if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)
/*=============== SERVICES MODAL ===============*/
const	modalViews = document.querySelectorAll('.services__modal'),
		modalBtns = document.querySelectorAll('.services__button'),
		modalClose = document.querySelectorAll('.services__modal-close')

let		modal = function(modalClick){
	modalViews[modalClick].classList.add('active-modal')
}

modalBtns.forEach((mb, i) =>{
	mb.addEventListener('click', () =>{
		modal(i)
	})
})

modalClose.forEach((mc) =>{
	mc.addEventListener('click', () =>{
		modalViews.forEach((mv) =>{
			mv.classList.remove('active-modal')
		})
	})
})

/*=============== MIXITUP FILTER PORTFOLIO ===============*/

let mixerPortfolio = mixitup('.work__container', {
    selectors: {
        target: '.work__card'
    },
    animation: {
        duration: 300
    }
});

/* Link active work */

const linkWork = document.querySelectorAll('.work__item')

function activeWork(){
	linkWork.forEach(L=> L.classList.remove('active-work'))
	this.classList.add('active-work')
}

linkWork.forEach(L => L.addEventListener('click',activeWork))


/*=============== SWIPER TESTIMONIAL ===============*/

let swiperTestimonial = new Swiper(".testimonial__container", {
	spaceBetween: 24,
	loop: true,
	grabCursor: true,

	pagination: {
	  el: ".swiper-pagination",
	  clickable: true,
	},
	breakpoints: {
		576: {
		  slidesPerView: 2,
		},
		768: {
		  slidesPerView: 2,
		  spaceBetween: 48,
		},
	  },
  });

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/

const sections = document.querySelectorAll('section[id]')

function scrollActive(){
	const scrollY = window.pageYOffset

	sections.forEach(current =>{
		const sectionHeight = current.offsetHeight,
		sectionTop = current.offsetTop - 100,
		sectionId = current.getAttribute('id')

		if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
			document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
		}
		else{
			document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
		}
	})
}
window.addEventListener('scroll', scrollActive)

/*=============== LIGHT DARK THEME ===============*/

const themeButton = document.getElementById('theme-button')
const lightTheme = 'light-theme'
const iconTheme = 'bx-sun'

const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

const getCurrentTheme = () => document.body.classList.contains(lightTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx bx-moon' : 'bx bx-sun'

if (selectedTheme) {
	document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](lightTheme)
	themeButton.classList[selectedIcon === 'bx bx-moon' ? 'add' : 'remove'](iconTheme)
}

themeButton.addEventListener('click', () => {
	document.body.classList.toggle(lightTheme)
	themeButton.classList.toggle(iconTheme)

	localStorage.setItem('selected-theme', getCurrentTheme())
	localStorage.setItem('selected-icon', getCurrentIcon())
})



/*=============== SCROLL REVEAL ANIMATION ===============*/

const sr = ScrollReveal({
	origin: 'top',
	distance: '60px',
	duration: 2500,
	delay: 400,
	// reset: true,
})

sr.reveal('.home__data')
sr.reveal('.home__handle', {delay: 700})
sr.reveal('.home__social, .home__scroll', {delay: 900, origin: 'bottom'})

/*=============== TYPED JS ANIMATION ===============*/

let	typed = new Typed(".dynamic__text", {
	strings: ["Visionary Entrepreneur", "Software Developer", "Creative Content Creator", "Motivational Speaker"],
	typeSpeed: 100,
	backSpeed: 100,
	loop: true
})


document.addEventListener('DOMContentLoaded', function () {
	const scriptURL = 'https://script.google.com/macros/s/AKfycbzJwVksUpqHZiD-VXfQsU4sOzepvADIPzr8bH3wkkwRnmKyS8gud5F3aj5kDfUnSUc/exec';
	const form = document.forms['submit-to-google-sheet'];
	const msg = document.getElementById("msg");
  
	form.addEventListener('submit', e => {
	  e.preventDefault();
	  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
		.then(response => {
		  msg.innerHTML = "Got it!";
		  setTimeout(() => msg.innerHTML = "", 10000);
		  form.reset();
		})
		.catch(error => {
		  console.error('Error!', error.message);
		  msg.innerHTML = "Something went wrong! 😢";
		});
	});
  });
  
