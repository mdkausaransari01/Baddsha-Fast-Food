/* ================================================================
   BADDSHA FAST FOOD — COMPLETE SCRIPT.JS (FULLY FIXED)
   Features: EmailJS, Order Form, Navigation, Animations, Toast
   FIXED: items_html instead of items_list for EmailJS
=============================================================== */

'use strict';

// ================================================================
// 1. EMAILJS CONFIGURATION — 🔴 UPDATE THESE 3 VALUES
// ================================================================
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'fgUukyvGFOlmjZIyM',
    SERVICE_ID: 'service_jprt4a1',
    TEMPLATE_ID: 'template_1pyuiqw'
};

// ================================================================
// 2. EMAILJS INITIALIZATION
// ================================================================
(function initEmailJS() {
    try {
        if (typeof emailjs === 'undefined') {
            console.error('❌ EmailJS SDK not loaded. Check your script tag.');
            return;
        }
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialized successfully');
    } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
    }
})();

// ================================================================
// 3. SHAKE ANIMATION KEYFRAMES (INJECT DYNAMICALLY)
// ================================================================
(function injectAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10% { transform: translateX(-10px); }
            20% { transform: translateX(10px); }
            30% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            50% { transform: translateX(-5px); }
            60% { transform: translateX(5px); }
            70% { transform: translateX(-3px); }
            80% { transform: translateX(3px); }
            90% { transform: translateX(-1px); }
        }
        
        .form-error i {
            color: #f87171;
            font-size: 1.1rem;
        }
        
        .form-success i {
            color: #4ade80;
            font-size: 1.2rem;
        }
        
        .btn-loading {
            display: none !important;
        }
        
        .btn-submit.loading .btn-text {
            display: none !important;
        }
        
        .btn-submit.loading .btn-loading {
            display: inline-flex !important;
            align-items: center;
            gap: 0.5rem;
        }
        
        .order-toast {
            position: fixed;
            left: 50%;
            bottom: 1.8rem;
            transform: translateX(-50%) translateY(120%);
            opacity: 0;
            pointer-events: none;
            background: rgba(14, 9, 6, 0.95);
            color: #f0e8dc;
            padding: 0.95rem 1.4rem;
            border-radius: 999px;
            border: 1px solid rgba(212, 168, 85, 0.25);
            box-shadow: 0 18px 48px rgba(0, 0, 0, 0.32);
            font-size: 0.95rem;
            z-index: 1200;
            transition: transform 0.35s ease, opacity 0.35s ease;
        }
        
        .order-toast.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.65s ease, transform 0.65s ease;
        }
        
        .reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
})();

// ================================================================
// 4. DOCUMENT READY — ALL FUNCTIONALITY
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('🍔 Baddsha Fast Food — Website Loaded!');
    console.log('📞 Contact: +91 95084 49216');
    console.log('📍 Location: Phulwari Sharif, Patna, Bihar');

    // ============================================================
    // NAVBAR — Sticky / Scroll Behavior
    // ============================================================
    (function initNavbar() {
        const header = document.getElementById('site-header');
        const navbar = header ? header.querySelector('.navbar') : null;

        if (!navbar) return;

        const onScroll = () => {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    })();

    // ============================================================
    // HAMBURGER MENU — Enhanced Mobile Toggle
    // ============================================================
    (function initHamburger() {
        const toggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        if (!toggle || !navLinks) return;

        function toggleMenu(forceState) {
            const isOpen = typeof forceState === 'boolean' ? forceState : !navLinks.classList.contains('open');
            
            navLinks.classList.toggle('open', isOpen);
            toggle.classList.toggle('open', isOpen);
            toggle.setAttribute('aria-expanded', isOpen.toString());
            
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('open')) {
                const isClickInside = navLinks.contains(e.target) || toggle.contains(e.target);
                if (!isClickInside) toggleMenu(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                toggleMenu(false);
            }
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
                    toggleMenu(false);
                }
            }, 250);
        });
    })();

    // ============================================================
    // SMOOTH SCROLL — All anchor links
    // ============================================================
    (function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                
                const navHeight = document.getElementById('site-header')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    })();

    // ============================================================
    // ACTIVE NAV LINK — Intersection Observer
    // ============================================================
    (function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        link.classList.toggle('active', href === `#${id}`);
                    });
                });
            },
            { rootMargin: '-30% 0px -60% 0px' }
        );

        sections.forEach(s => observer.observe(s));
    })();

    // ============================================================
    // SCROLL REVEAL — Animate elements on enter viewport
    // ============================================================
    (function initScrollReveal() {
        const targets = [
            '.service-card',
            '.why-card',
            '.contact-info',
            '.contact-form-wrap',
            '.section-label',
            '.section-title',
            '.section-subtitle',
        ];

        targets.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, i) => {
                el.classList.add('reveal');
                if (selector === '.service-card' || selector === '.why-card') {
                    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
                }
            });
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    })();

    // ============================================================
    // FLOATING BUTTONS — Staggered entrance on load
    // ============================================================
    (function initFloatBtns() {
        const btns = document.querySelectorAll('.float-btn');
        if (!btns.length) return;

        btns.forEach((btn, i) => {
            btn.style.transition = `opacity 0.5s ease ${0.8 + i * 0.2}s, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${0.8 + i * 0.2}s`;
            setTimeout(() => {
                btn.classList.add('loaded');
            }, (800 + i * 200));
        });
    })();

    // ============================================================
    // HERO CARDS — 3D mouse tilt (desktop only)
    // ============================================================
    (function initHeroTilt() {
        if (window.matchMedia('(max-width: 900px)').matches) return;

        const cards = document.querySelectorAll('.hcard');
        const visual = document.querySelector('.hero-visual');
        if (!visual || !cards.length) return;

        let isTiltActive = false;

        visual.addEventListener('mousemove', (e) => {
            if (isTiltActive) return;
            isTiltActive = true;
            
            requestAnimationFrame(() => {
                const rect = visual.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / rect.width;
                const dy = (e.clientY - cy) / rect.height;

                cards.forEach((card, i) => {
                    const depth = (i + 1) * 4;
                    const baseTransform = card.classList.contains('hcard--back')
                        ? 'rotate(12deg) scale(0.85)'
                        : card.classList.contains('hcard--mid')
                        ? 'rotate(-6deg) scale(0.92)'
                        : 'rotate(2deg)';

                    card.style.transform = `${baseTransform} translateX(${dx * depth}px) translateY(${dy * depth}px)`;
                });
                
                isTiltActive = false;
            });
        });

        visual.addEventListener('mouseleave', () => {
            cards.forEach(card => {
                card.style.transition = 'transform 0.6s ease';
                const baseTransform = card.classList.contains('hcard--back')
                    ? 'rotate(12deg) scale(0.85)'
                    : card.classList.contains('hcard--mid')
                    ? 'rotate(-6deg) scale(0.92)'
                    : 'rotate(2deg)';
                card.style.transform = baseTransform;
                setTimeout(() => { card.style.transition = ''; }, 600);
            });
        });
    })();

    // ============================================================
    // ============================================================
    // ORDER FORM — COMPLETE WITH EMAILJS (FIXED)
    // ============================================================
    // ============================================================

    const form = document.getElementById('OrderForm');
    const submitBtn = document.getElementById('submitBtn');
    const formError = document.getElementById('formError');
    const formSuccess = document.getElementById('formSuccess');
    const itemGrid = document.getElementById('itemGrid');
    const summaryItems = document.getElementById('summaryItems');
    const orderSummary = document.getElementById('orderSummary');
    const totalItemsCount = document.getElementById('totalItemsCount');
    const estimatedTotal = document.getElementById('estimatedTotal');
    const selectedCount = document.getElementById('selectedCount');
    const clearAllBtn = document.getElementById('clearAll');

    if (!form) {
        console.warn('⚠️ Order form not found on this page');
        return;
    }

    // ============================================================
    // TOGGLE ITEM
    // ============================================================
    window.toggleItem = function(header) {
        const checkbox = header.querySelector('.item-check');
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        }
    };

    // ============================================================
    // SELECT PORTION
    // ============================================================
    window.selectPortion = function(label) {
        const radio = label.querySelector('input[type="radio"]');
        if (!radio) return;
        
        const parentGroup = label.closest('.portion-options');
        const allRadios = parentGroup.querySelectorAll('input[type="radio"]');
        allRadios.forEach(r => {
            if (r !== radio) {
                r.checked = false;
                r.closest('.portion-option').classList.remove('selected');
            }
        });
        
        radio.checked = true;
        label.classList.add('selected');
        radio.dispatchEvent(new Event('change'));
    };

    // ============================================================
    // ITEM SELECTION HANDLER
    // ============================================================
    if (itemGrid) {
        itemGrid.addEventListener('change', function(e) {
            const checkbox = e.target.closest('.item-check');
            if (!checkbox) return;

            const itemCard = checkbox.closest('.item-card');
            const portionGroup = itemCard.querySelector('.item-portion-group');

            if (checkbox.checked) {
                itemCard.classList.add('selected');
                portionGroup.style.display = 'block';
                
                const firstRadio = portionGroup.querySelector('input[type="radio"]');
                if (firstRadio) {
                    firstRadio.checked = true;
                    firstRadio.closest('.portion-option').classList.add('selected');
                }
                updateSummary();
            } else {
                itemCard.classList.remove('selected');
                portionGroup.style.display = 'none';
                
                const radios = portionGroup.querySelectorAll('input[type="radio"]');
                radios.forEach(r => {
                    r.checked = false;
                    r.closest('.portion-option').classList.remove('selected');
                });
                updateSummary();
            }
        });

        // Portion selection handler
        itemGrid.addEventListener('change', function(e) {
            const radio = e.target.closest('input[type="radio"]');
            if (!radio) return;

            if (!radio.checked) {
                radio.closest('.portion-option').classList.remove('selected');
                updateSummary();
                return;
            }

            const portionOption = radio.closest('.portion-option');
            const itemCard = radio.closest('.item-card');
            
            const allPortions = itemCard.querySelectorAll('.portion-option');
            allPortions.forEach(p => p.classList.remove('selected'));
            if (portionOption) {
                portionOption.classList.add('selected');
            }
            updateSummary();
        });
    }

    // ============================================================
    // UPDATE SUMMARY
    // ============================================================
    function updateSummary() {
        const checkedItems = document.querySelectorAll('.item-check:checked');
        if (selectedCount) selectedCount.textContent = checkedItems.length;

        if (checkedItems.length === 0) {
            if (orderSummary) orderSummary.style.display = 'none';
            return;
        }

        if (orderSummary) orderSummary.style.display = 'block';
        if (summaryItems) summaryItems.innerHTML = '';
        let total = 0;
        let totalQty = 0;

        checkedItems.forEach((checkbox) => {
            const itemCard = checkbox.closest('.item-card');
            const itemName = itemCard.dataset.item;
            const selectedPortion = itemCard.querySelector('input[type="radio"]:checked');
            
            if (selectedPortion) {
                const portionText = selectedPortion.value;
                const priceMatch = portionText.match(/₹(\d+)/);
                const price = priceMatch ? parseInt(priceMatch[1]) : 0;
                
                total += price;
                totalQty++;

                const div = document.createElement('div');
                div.className = 'summary-item';
                div.innerHTML = `
                    <div class="item-detail">
                        <span class="remove-item" data-item="${itemName}">✕</span>
                        <span>${itemName}</span>
                        <span style="font-size:11px; color:#7a6355; margin-left:4px;">${portionText}</span>
                    </div>
                    <span class="item-price">₹${price}</span>
                `;
                if (summaryItems) summaryItems.appendChild(div);
            }
        });

        if (totalItemsCount) totalItemsCount.textContent = totalQty;
        if (estimatedTotal) estimatedTotal.textContent = total > 0 ? `₹${total}` : '₹0';

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemName = this.dataset.item;
                const checkbox = document.querySelector(`.item-check[value="${itemName}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
        });
    }

    // ============================================================
    // CLEAR ALL
    // ============================================================
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            document.querySelectorAll('.item-check:checked').forEach(cb => {
                cb.checked = false;
                cb.dispatchEvent(new Event('change'));
            });
            if (orderSummary) orderSummary.style.display = 'none';
        });
    }

    // ============================================================
    // 🔴 FIXED: FORM SUBMIT — EmailJS Integration
    // ============================================================
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // ---------- COLLECT DATA ----------
        const items = [];
        document.querySelectorAll('.item-check:checked').forEach(cb => {
            const itemCard = cb.closest('.item-card');
            const itemName = itemCard.dataset.item;
            const selectedPortion = itemCard.querySelector('input[type="radio"]:checked');
            
            if (selectedPortion) {
                const portionText = selectedPortion.value;
                const priceMatch = portionText.match(/₹(\d+)/);
                const price = priceMatch ? `₹${priceMatch[1]}` : '₹0';
                
                items.push({
                    name: itemName,
                    portion: portionText,
                    price: price
                });
            }
        });

        const name = document.getElementById('name')?.value.trim() || '';
        const mobile = document.getElementById('mobile')?.value.trim() || '';
        const message = document.getElementById('message')?.value.trim() || '';

        // ---------- VALIDATION ----------
        if (items.length === 0) {
            showError('Please select at least one item!');
            return;
        }

        if (!name) {
            showError('Please enter your full name!');
            document.getElementById('name')?.focus();
            return;
        }

        if (!mobile) {
            showError('Please enter your mobile number!');
            document.getElementById('mobile')?.focus();
            return;
        }

        // ---------- CALCULATE TOTAL ----------
        let total = 0;
        items.forEach(item => {
            const priceMatch = item.price.match(/₹(\d+)/);
            if (priceMatch) total += parseInt(priceMatch[1]);
        });

        // ============================================================
        // 🔴 FIX: Convert items array to HTML string
        // ============================================================
        let itemsHTML = '';
        items.forEach(item => {
            itemsHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; background:#ffffff; border:1px solid #ede8e0; border-radius:10px; padding:10px 16px; margin-bottom:8px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <span style="font-weight:600; color:#1c130d; font-size:14px;">🍽️ ${item.name}</span>
                    <span style="font-size:12px; color:#7a6355; background:#f4f1eb; padding:2px 14px; border-radius:100px;">${item.portion}</span>
                    <span style="font-weight:700; color:#d4a855; font-size:14px; background:rgba(212,168,85,0.08); padding:2px 14px; border-radius:100px;">${item.price}</span>
                </div>
            `;
        });

        // ============================================================
        // 🔴 FIX: Use items_html instead of items_list
        // ============================================================
        const templateParams = {
            from_name: name,
            from_mobile: mobile,
            from_email: 'akaushar234@gmail.com',
            items_html: itemsHTML,  // 🔴 CHANGED: HTML string instead of array
            total_items: items.length,
            total_amount: `₹${total}`,
            message: message || 'No special requests',
            order_date: new Date().toLocaleString('en-IN', {
                dateStyle: 'full',
                timeStyle: 'medium'
            })
        };

        // ---------- SHOW LOADING ----------
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="btn-loading"><i class="fa-solid fa-circle-notch fa-spin"></i> Sending...</span>
                <span class="btn-text"><i class="fa-solid fa-paper-plane"></i> Place Order Now</span>
            `;
        }

        // ---------- SEND VIA EMAILJS ----------
        console.log('📤 Sending order to EmailJS...', templateParams);

        if (typeof emailjs === 'undefined') {
            console.error('❌ EmailJS not loaded!');
            showError('Email service not available. Please try again later.');
            resetSubmitButton();
            return;
        }

        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
            .then(function(response) {
                console.log('✅ Order sent successfully!', response);
                
                resetSubmitButton();
                
                if (formSuccess) {
                    formSuccess.style.display = 'flex';
                    formSuccess.innerHTML = `
                        <i class="fa-solid fa-circle-check"></i>
                        <span>🎉 Order placed! ${items.map(i => i.name).join(', ')}</span>
                    `;
                }
                
                showToast('✅ Order placed successfully! Ali Anwar will contact you shortly.');
                
                setTimeout(() => {
                    form.reset();
                    document.querySelectorAll('.item-card').forEach(c => c.classList.remove('selected'));
                    document.querySelectorAll('.item-portion-group').forEach(g => g.style.display = 'none');
                    document.querySelectorAll('.portion-option').forEach(p => p.classList.remove('selected'));
                    if (orderSummary) orderSummary.style.display = 'none';
                    if (selectedCount) selectedCount.textContent = '0';
                    if (formSuccess) formSuccess.style.display = 'none';
                }, 5000);
            })
            .catch(function(error) {
                console.error('❌ Failed to send order:', error);
                
                resetSubmitButton();
                
                let errorMessage = '⚠️ Failed to place order. ';
                if (error.status === 412) {
                    errorMessage += 'Precondition failed. Check your EmailJS credentials.';
                } else if (error.status === 429) {
                    errorMessage += 'Too many requests. Please wait a moment.';
                } else if (error.text) {
                    try {
                        const errData = JSON.parse(error.text);
                        errorMessage += errData.message || error.text;
                    } catch (e) {
                        errorMessage += error.text;
                    }
                } else {
                    errorMessage += 'Please try again or call +91 95084 49216.';
                }
                showError(errorMessage);
            });
    });

    // ============================================================
    // HELPER FUNCTIONS
    // ============================================================
    function resetSubmitButton() {
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <span class="btn-text"><i class="fa-solid fa-paper-plane"></i> Place Order Now</span>
                <span class="btn-loading" aria-hidden="true"><i class="fa-solid fa-circle-notch fa-spin"></i> Sending...</span>
            `;
        }
    }

    function showError(message) {
        if (formError) {
            formError.style.display = 'flex';
            formError.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>
                <span>${message}</span>
            `;
            formError.hidden = false;
            setTimeout(() => {
                formError.hidden = true;
                formError.style.display = 'none';
            }, 6000);
        }
    }

    function showToast(message) {
        const toast = document.getElementById('orderToast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 5000);
        }
    }

    // ============================================================
    // ORDER BUTTONS — Quick order from cards
    // ============================================================
    (function initOrderButtons() {
        document.querySelectorAll('.card-order').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const card = button.closest('.service-card');
                const itemName = card?.querySelector('.card-title')?.textContent || 'item';
                
                const formSection = document.getElementById('query');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                
                showToast(`Ready to order ${itemName}? Fill the form below!`);
            });
        });
    })();

    // ============================================================
    // FORM RESET — Clear on page load
    // ============================================================
    (function initFormReset() {
        window.addEventListener('load', () => {
            form.reset();
            if (formSuccess) {
                formSuccess.classList.remove('show');
                formSuccess.style.display = 'none';
            }
            if (formError) {
                formError.hidden = true;
                formError.style.display = 'none';
            }
        });
    })();

    // ============================================================
    // OFFLINE/ONLINE DETECTION
    // ============================================================
    window.addEventListener('online', () => {
        console.log('📶 Network connection restored');
        showToast('📶 Connection restored! You can place your order now.');
    });

    window.addEventListener('offline', () => {
        console.warn('📶 Network connection lost');
        showError('⚠️ You are offline. Please check your internet connection.');
    });

    // ============================================================
    // CONSOLE INFO
    // ============================================================
    console.log('✅ All features initialized successfully!');
    console.log('📧 EmailJS Config:', {
        publicKey: EMAILJS_CONFIG.PUBLIC_KEY.substring(0, 10) + '...',
        serviceId: EMAILJS_CONFIG.SERVICE_ID,
        templateId: EMAILJS_CONFIG.TEMPLATE_ID
    });

}); // END OF DOCUMENT READY