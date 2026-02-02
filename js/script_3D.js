const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href.includes('.html') || href === '#') return;
        
        e.preventDefault();
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            header.style.padding = '0';
        } else {
            header.style.backgroundColor = 'var(--secondary-color)';
            header.style.padding = '';
        }
    }
});

const animateOnScroll = () => {
    const elements = document.querySelectorAll('.category-card, .education-item, .contact-item, .work-item, .gallery-section');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('load', () => {
    const elements = document.querySelectorAll('.category-card, .education-item, .contact-item, .work-item, .gallery-section');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    setTimeout(animateOnScroll, 100);
});

window.addEventListener('scroll', animateOnScroll);

document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.querySelector('.copyright p');
    if (copyrightElement) {
        copyrightElement.textContent = copyrightElement.textContent.replace('2023', currentYear);
    }
    
    document.querySelectorAll('.category-card .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            
            if (href && href.includes('.html')) {
                fetch(href, { method: 'HEAD' })
                    .then(response => {
                        if (!response.ok) {
                            e.preventDefault();
                            const categoryName = btn.closest('.category-card').querySelector('h3').textContent;
                            showMessage(`Страница "${categoryName}" находится в разработке. Скоро здесь появятся работы!`);
                        }
                    })
                    .catch(() => {
                        e.preventDefault();
                        const categoryName = btn.closest('.category-card').querySelector('h3').textContent;
                        showMessage(`Страница "${categoryName}" находится в разработке. Скоро здесь появятся работы!`);
                    });
            }
        });
    });
    
    document.querySelectorAll('.back-button .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.getAttribute('href') === 'index.html#projects') {
                if (window.history.length > 1) {
                    e.preventDefault();
                    window.history.back();
                }
            }
        });
    });
    
    initGallery();
});

let currentGalleryIndex = 0;
let isZoomed = false;
let currentScale = 1;
const zoomStep = 0.2;
let allGalleryImages = [];

function initGallery() {
    allGalleryImages = Array.from(document.querySelectorAll('.image-container img'));
    
    allGalleryImages.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            currentGalleryIndex = index;
            createLightbox(img.src, img.alt, index);
        });
        
        img.style.cursor = 'zoom-in';
    });
    
    document.querySelectorAll('.zoom-icon').forEach((icon) => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            const img = icon.closest('.image-container').querySelector('img');
            if (img) {
                currentGalleryIndex = allGalleryImages.indexOf(img);
                createLightbox(img.src, img.alt, currentGalleryIndex);
            }
        });
    });
    
    document.querySelectorAll('.zoom-overlay').forEach((overlay) => {
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            const img = overlay.closest('.image-container').querySelector('img');
            if (img) {
                currentGalleryIndex = allGalleryImages.indexOf(img);
                createLightbox(img.src, img.alt, currentGalleryIndex);
            }
        });
    });
}

function createLightbox(src, alt, index) {
    const existingLightbox = document.querySelector('.lightbox');
    if (existingLightbox) {
        document.body.removeChild(existingLightbox);
    }
    
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close">&times;</button>
        <div class="lightbox-nav">
            <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
            <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="lightbox-content">
            <div class="lightbox-img-container">
                <img class="lightbox-img" src="${src}" alt="${alt}">
            </div>
            <div class="lightbox-caption">${alt}</div>
        </div>
        <div class="lightbox-tools">
            <button class="lightbox-tool" id="zoom-in" title="Приблизить">
                <i class="fas fa-search-plus"></i>
            </button>
            <button class="lightbox-tool" id="zoom-out" title="Отдалить">
                <i class="fas fa-search-minus"></i>
            </button>
            <button class="lightbox-tool" id="zoom-reset" title="Сбросить масштаб">
                <i class="fas fa-expand-alt"></i>
            </button>
        </div>
        <div class="lightbox-counter">${index + 1} / ${allGalleryImages.length}</div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const zoomInBtn = lightbox.querySelector('#zoom-in');
    const zoomOutBtn = lightbox.querySelector('#zoom-out');
    const zoomResetBtn = lightbox.querySelector('#zoom-reset');
    const counter = lightbox.querySelector('.lightbox-counter');
    const caption = lightbox.querySelector('.lightbox-caption');
    
    function updateImage(newIndex) {
        if (newIndex >= 0 && newIndex < allGalleryImages.length) {
            currentGalleryIndex = newIndex;
            const img = allGalleryImages[newIndex];
            
            resetZoom();
            
            lightboxImg.style.opacity = '0.3';
            lightboxImg.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                caption.textContent = img.alt;
                counter.textContent = `${newIndex + 1} / ${allGalleryImages.length}`;
                
                lightboxImg.style.opacity = '1';
            }, 200);
        }
    }
    
    function zoomIn() {
        if (currentScale < 3) {
            currentScale += zoomStep;
            updateZoom();
        }
    }
    
    function zoomOut() {
        if (currentScale > 0.5) {
            currentScale -= zoomStep;
            updateZoom();
        }
    }
    
    function resetZoom() {
        currentScale = 1;
        isZoomed = false;
        lightboxImg.style.transform = 'scale(1)';
        lightboxImg.style.transformOrigin = 'center center';
        lightboxImg.classList.remove('zoomed');
        lightboxImg.style.cursor = 'zoom-in';
    }
    
    function updateZoom() {
        lightboxImg.style.transform = `scale(${currentScale})`;
        lightboxImg.style.transformOrigin = 'center center';
        isZoomed = currentScale !== 1;
        lightboxImg.classList.toggle('zoomed', isZoomed);
        
        lightboxImg.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
    }
    
    function zoomToPoint(e) {
        const rect = lightboxImg.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        currentScale = 2;
        isZoomed = true;
        lightboxImg.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        lightboxImg.style.transform = `scale(${currentScale})`;
        lightboxImg.classList.add('zoomed');
        lightboxImg.style.cursor = 'zoom-out';
    }
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(lightbox);
        document.body.style.overflow = 'auto';
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox && !isZoomed) {
            document.body.removeChild(lightbox);
            document.body.style.overflow = 'auto';
        }
    });
    
    function lightboxKeyHandler(e) {
        if (e.key === 'Escape' && document.querySelector('.lightbox')) {
            document.body.removeChild(lightbox);
            document.body.style.overflow = 'auto';
            document.removeEventListener('keydown', lightboxKeyHandler);
        }
    }
    document.addEventListener('keydown', lightboxKeyHandler);
    
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let newIndex = currentGalleryIndex - 1;
        if (newIndex < 0) newIndex = allGalleryImages.length - 1;
        updateImage(newIndex);
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let newIndex = currentGalleryIndex + 1;
        if (newIndex >= allGalleryImages.length) newIndex = 0;
        updateImage(newIndex);
    });
    
    zoomInBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        zoomIn();
    });
    
    zoomOutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        zoomOut();
    });
    
    zoomResetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetZoom();
    });
    
    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (isZoomed) {
            resetZoom();
        } else {
            zoomToPoint(e);
        }
    });
    
    lightboxImg.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.ctrlKey) {
            if (e.deltaY < 0) {
                zoomIn();
            } else {
                zoomOut();
            }
        }
    });
    
    function keydownHandler(e) {
        if (!document.querySelector('.lightbox')) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                let prevIndex = currentGalleryIndex - 1;
                if (prevIndex < 0) prevIndex = allGalleryImages.length - 1;
                updateImage(prevIndex);
                break;
                
            case 'ArrowRight':
                e.preventDefault();
                let nextIndex = currentGalleryIndex + 1;
                if (nextIndex >= allGalleryImages.length) nextIndex = 0;
                updateImage(nextIndex);
                break;
                
            case '+':
            case '=':
                e.preventDefault();
                zoomIn();
                break;
                
            case '-':
                e.preventDefault();
                zoomOut();
                break;
                
            case '0':
                e.preventDefault();
                resetZoom();
                break;
        }
    }
    
    document.addEventListener('keydown', keydownHandler);
    
    resetZoom();
}

function showMessage(message) {
    const popup = document.createElement('div');
    popup.className = 'message-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <i class="fas fa-info-circle"></i>
            <p>${message}</p>
            <button class="popup-close">OK</button>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .message-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        }
        
        .popup-content {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        }
        
        .popup-content i {
            font-size: 3rem;
            color: var(--secondary-color);
            margin-bottom: 15px;
        }
        
        .popup-content p {
            font-size: 1.1rem;
            margin-bottom: 20px;
            color: var(--text-color);
        }
        
        .popup-close {
            background-color: var(--secondary-color);
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 5px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
        }
        
        .popup-close:hover {
            background-color: var(--text-color);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(popup);
    
    const closeBtn = popup.querySelector('.popup-close');
    closeBtn.addEventListener('click', () => {
        popup.remove();
        style.remove();
    });
    
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
            style.remove();
        }
    });
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (currentPage === 'index.html' || currentPage === '') {
            if (linkHref.includes('#')) {
                const sectionId = linkHref.split('#')[1];
                if (window.location.hash === `#${sectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        } else {
            if (linkHref.includes(currentPage)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveNavLink);