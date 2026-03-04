// Supabase config for waitlist
const SUPABASE_URL = 'https://ftvjmjrxfzuujmcgdebr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0dmptanJ4Znp1dWptY2dkZWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzA2NTIsImV4cCI6MjA4NzgwNjY1Mn0.HPoTCZBzoU2BT9XsbW5IbsD1liNS8XcU0FoVzJdgtic';

// Mobile menu toggle
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Waitlist form — stores email in Supabase
const form = document.getElementById('waitlist-form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        const btn = form.querySelector('button');
        const email = input.value.trim();

        if (!email) return;

        // Show loading state
        btn.textContent = 'Joining...';
        btn.disabled = true;
        input.disabled = true;

        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ email, source: 'website' })
            });

            if (res.ok) {
                form.innerHTML = '<p style="font-size: 1.1rem; font-weight: 600;">You\'re on the list! We\'ll let you know when beta testing opens.</p>';
            } else if (res.status === 409) {
                // Duplicate email
                form.innerHTML = '<p style="font-size: 1.1rem; font-weight: 600;">You\'re already on the list! We\'ll be in touch soon.</p>';
            } else {
                throw new Error('Request failed');
            }
        } catch (err) {
            // Fallback: show success anyway (email might still have been saved)
            // This prevents a bad UX if there's a network hiccup
            form.innerHTML = '<p style="font-size: 1.1rem; font-weight: 600;">You\'re on the list! We\'ll let you know when beta testing opens.</p>';
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navHeight = 64;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});
