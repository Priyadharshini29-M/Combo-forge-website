/* Interactivity & Micro-Animations */

document.addEventListener('DOMContentLoaded', () => {
    // Reveal Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('reveal'); // Ensure base class is present
        revealObserver.observe(el);
    });

    // Latency Simulation
    const latencyEl = document.getElementById('latency');
    const latencyBars = document.getElementById('latency-bars');

    if (latencyEl && latencyBars) {
        setInterval(() => {
            const val = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
            latencyEl.textContent = `${val}ms`;
            
            // Randomize bar heights a bit
            const bars = latencyBars.children;
            for (let bar of bars) {
                bar.style.height = `${Math.random() * 100}%`;
            }
        }, 3000);
    }

    // Revenue/Stats Counter Animation Simulation
    const revenueVal = document.getElementById('revenue-val');
    if (revenueVal) {
        let currentRev = 14204.00;
        setInterval(() => {
            currentRev += (Math.random() * 20);
            revenueVal.textContent = `$${currentRev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }, 5000);
    }

    // Sticky Bar Scroll Effect
    const stickyBar = document.getElementById('sticky-bar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            stickyBar.classList.remove('translate-y-full');
            stickyBar.style.transform = 'translate(-50%, 0)';
            stickyBar.style.opacity = '1';
        } else {
            stickyBar.style.transform = 'translate(-50%, 150%)';
            stickyBar.style.opacity = '0';
        }
        
        lastScroll = currentScroll;
    });

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hover effect for feature cards
    document.querySelectorAll('.bg-surface-container-high').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.borderColor = 'rgba(126, 75, 134, 0.3)';
            card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.borderColor = 'transparent';
        });
    });
});
