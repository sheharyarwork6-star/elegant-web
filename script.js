document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Background Music Toggle --- */
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    bgMusic.volume = 0.3;

    musicBtn.addEventListener('click', () => {
        if(isPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = '🎵 Play Music';
            musicBtn.classList.remove('playing');
        } else {
            bgMusic.play().catch(e => console.log("Audio play failed:", e));
            musicBtn.innerHTML = '⏸️ Pause';
            musicBtn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });

    document.body.addEventListener('click', () => {
        if(!isPlaying) {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicBtn.innerHTML = '⏸️ Pause';
            }).catch(e => {
                // Auto-play was prevented without explicit user interaction
            });
        }
    }, { once: true });


    /* --- 2. Floating Hearts Canvas --- */
    const canvas = document.getElementById('hearts-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let hearts = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    class Heart {
        constructor() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 200;
            this.size = Math.random() * 10 + 10;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 1;
            this.opacity = Math.random() * 0.5 + 0.3;
            const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffffff'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            if (this.y < -50) {
                this.y = height + 50;
                this.x = Math.random() * width;
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            const scale = this.size / 20;
            ctx.scale(scale, scale);
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.bezierCurveTo(0, -5, -10, -10, -15, -5);
            ctx.bezierCurveTo(-25, 5, -15, 20, 0, 30);
            ctx.bezierCurveTo(15, 20, 25, 5, 15, -5);
            ctx.bezierCurveTo(10, -10, 0, -5, 0, 5);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    function initHearts() {
        const heartCount = window.innerWidth < 768 ? 20 : 40;
        hearts = [];
        for (let i = 0; i < heartCount; i++) {
            hearts.push(new Heart());
        }
    }
    function animateHearts() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < hearts.length; i++) {
            hearts[i].update();
            hearts[i].draw();
        }
        requestAnimationFrame(animateHearts);
    }
    initHearts();
    animateHearts();


    /* --- 3. Scroll Reveal Animation --- */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));


    /* --- 4. Love Slider --- */
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 4000); 
    }

    function resetSlider() {
        clearInterval(slideInterval);
        startSlider();
    }

    nextBtn.addEventListener('click', () => { nextSlide(); resetSlider(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetSlider(); });

    const sliderContainer = document.querySelector('.slider-container');
    let touchStartX = 0;

    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetSlider();
        }
    }, { passive: true });

    startSlider();


    /* --- 5. Love Counters --- */
    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        const inc = target / 100;

                        if(count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 20);
                        } else {
                            counter.innerText = target + "+";
                        }
                    };
                    updateCount();
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const counterSection = document.getElementById('counter-section');
    if (counterSection) counterObserver.observe(counterSection);


    /* --- 6. Surprise Modal --- */
    const surpriseBtn = document.getElementById('surprise-btn');
    const modal = document.getElementById('surprise-modal');
    const closeBtn = document.getElementById('close-modal');

    function createFallingHeart() {
        const heart = document.createElement('div');
        Object.assign(heart.style, {
            position: 'fixed',
            left: Math.random() * 100 + 'vw',
            top: '-5vh',
            fontSize: (Math.random() * 20 + 10) + 'px',
            color: '#ff4d6d',
            zIndex: '10000',
            pointerEvents: 'none',
            animation: `fall ${Math.random() * 3 + 2}s linear forwards`
        });
        heart.innerHTML = '❤️';
        document.body.appendChild(heart);
        
        if (!document.getElementById('falling-hearts-style')) {
            const style = document.createElement('style');
            style.id = 'falling-hearts-style';
            style.innerHTML = `
                @keyframes fall {
                    to {
                        transform: translateY(105vh) rotate(${Math.random() * 360}deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    let fallingHeartsInterval;

    surpriseBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        void modal.offsetWidth; 
        modal.classList.add('show');
        
        fallingHeartsInterval = setInterval(createFallingHeart, 150);
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.classList.add('hidden'), 500); 
        clearInterval(fallingHeartsInterval);
    });

    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            closeBtn.click();
        }
    });

});
