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

class VideoLightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.mediaContainer = this.lightbox.querySelector('.lightbox-media');
        this.caption = this.lightbox.querySelector('.lightbox-caption');
        this.counter = this.lightbox.querySelector('.lightbox-counter');
        this.closeBtn = this.lightbox.querySelector('.lightbox-close');
        this.prevBtn = this.lightbox.querySelector('.lightbox-prev');
        this.nextBtn = this.lightbox.querySelector('.lightbox-next');
        this.fullscreenBtn = document.getElementById('fullscreen-toggle');
        this.volumeBtn = document.getElementById('volume-toggle');
        
        this.videos = [];
        this.currentIndex = 0;
        this.isFullscreen = false;
        
        this.init();
    }
    
    init() {
        this.collectVideos();
        this.setupEventListeners();
        this.setupVideoClickHandlers();
    }
    
    collectVideos() {
        const videoElements = document.querySelectorAll('.portfolio-video');
        
        videoElements.forEach((video, index) => {
            const source = video.querySelector('source');
            if (source) {
                this.videos.push({
                    src: source.src,
                    poster: video.getAttribute('poster'),
                    caption: this.getCaptionForVideo(video),
                    index: index
                });
            }
        });
    }
    
    getCaptionForVideo(video) {
        const galleryItem = video.closest('.gallery-item');
        const section = galleryItem.closest('.gallery-section');
        if (section) {
            const captionElement = section.querySelector('.gallery-caption h3');
            return captionElement ? captionElement.textContent : 'Видеоролик';
        }
        return 'Видеоролик';
    }
    
    setupVideoClickHandlers() {
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            const video = item.querySelector('.portfolio-video');
            if (video) {
                const mediaContainer = item.querySelector('.media-container');
                const overlay = item.querySelector('.media-overlay');
                
                const clickHandler = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const videoIndex = this.videos.findIndex(v => v.index === index);
                    if (videoIndex !== -1) {
                        this.currentIndex = videoIndex;
                        this.open();
                    }
                };
                
                if (mediaContainer) mediaContainer.addEventListener('click', clickHandler);
                if (overlay) overlay.addEventListener('click', clickHandler);
                
                video.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('portfolio-video')) {
                        clickHandler(e);
                    }
                });
            }
        });
    }
    
    setupEventListeners() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.close();
        });
        
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        if (this.fullscreenBtn) {
            this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }
        
        if (this.volumeBtn) {
            this.volumeBtn.addEventListener('click', () => this.toggleVolume());
        }
        
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    if (this.isFullscreen) {
                        this.exitFullscreen();
                    } else {
                        this.close();
                    }
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePlayback();
                    break;
                case 'f':
                case 'F':
                    this.toggleFullscreen();
                    break;
                case 'm':
                case 'M':
                    this.toggleVolume();
                    break;
            }
        });
        
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.updateFullscreenButton();
        });
    }
    
    open() {
        if (this.videos.length === 0) return;
        
        this.loadVideo(this.currentIndex);
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            this.lightbox.style.opacity = '1';
        }, 10);
    }
    
    close() {
        this.lightbox.style.opacity = '0';
        
        setTimeout(() => {
            this.lightbox.classList.remove('active');
            document.body.style.overflow = '';
            
            const video = this.mediaContainer.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
            
            if (this.isFullscreen) {
                this.exitFullscreen();
            }
        }, 300);
    }
    
    loadVideo(index) {
        if (index < 0 || index >= this.videos.length) return;
        
        this.currentIndex = index;
        const videoData = this.videos[index];
        
        this.mediaContainer.innerHTML = '';
        
        const video = document.createElement('video');
        video.className = 'lightbox-video';
        video.controls = true;
        video.autoplay = true;
        video.preload = 'auto';
        video.poster = videoData.poster || '';
        
        const source = document.createElement('source');
        source.src = videoData.src;
        source.type = 'video/mp4';
        
        video.appendChild(source);
        video.innerHTML += 'Ваш браузер не поддерживает видео.';
        
        this.mediaContainer.appendChild(video);
        
        this.caption.textContent = videoData.caption;
        this.counter.textContent = `${index + 1} / ${this.videos.length}`;
        
        this.updateVolumeButton();
        this.updateFullscreenButton();
        
        video.play().catch(e => {
            console.log('Автовоспроизведение заблокировано:', e);
        });
    }
    
    prev() {
        let newIndex = this.currentIndex - 1;
        if (newIndex < 0) newIndex = this.videos.length - 1;
        this.loadVideo(newIndex);
    }
    
    next() {
        let newIndex = this.currentIndex + 1;
        if (newIndex >= this.videos.length) newIndex = 0;
        this.loadVideo(newIndex);
    }
    
    togglePlayback() {
        const video = this.mediaContainer.querySelector('video');
        if (video) {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    }
    
    toggleFullscreen() {
        if (!this.isFullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }
    
    enterFullscreen() {
        const elem = this.mediaContainer;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    
    updateFullscreenButton() {
        if (this.fullscreenBtn) {
            const icon = this.fullscreenBtn.querySelector('i');
            if (icon) {
                icon.className = this.isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
            }
        }
    }
    
    toggleVolume() {
        const video = this.mediaContainer.querySelector('video');
        if (video) {
            video.muted = !video.muted;
            this.updateVolumeButton();
        }
    }
    
    updateVolumeButton() {
        const video = this.mediaContainer.querySelector('video');
        if (this.volumeBtn && video) {
            const icon = this.volumeBtn.querySelector('i');
            if (icon) {
                icon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
            }
        }
    }
}

class VideoManager {
    constructor() {
        this.videos = document.querySelectorAll('.portfolio-video');
        this.observers = new Map();
        
        this.init();
    }
    
    init() {
        this.setupVideoEvents();
        this.setupIntersectionObservers();
        this.addVideoControls();
    }
    
    setupVideoEvents() {
        this.videos.forEach(video => {
            video.addEventListener('play', () => {
                this.pauseOtherVideos(video);
            });
            
            video.addEventListener('click', () => {
                if (video.muted) {
                    video.muted = false;
                }
            });
            
            video.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });
        });
    }
    
    setupIntersectionObservers() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        
        this.videos.forEach(video => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting && !video.paused) {
                        video.pause();
                    }
                });
            }, options);
            
            observer.observe(video);
            this.observers.set(video, observer);
        });
    }
    
    addVideoControls() {
        this.videos.forEach(video => {
            const container = video.closest('.media-container');
            if (container) {
                const controls = document.createElement('div');
                controls.className = 'video-controls';
                controls.innerHTML = `
                    <button class="video-control-btn play-pause-btn" title="Воспроизвести/Пауза">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="video-control-btn mute-btn" title="Звук">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <button class="video-control-btn fullscreen-btn" title="Полный экран">
                        <i class="fas fa-expand"></i>
                    </button>
                `;
                
                container.appendChild(controls);
                
                const playBtn = controls.querySelector('.play-pause-btn');
                const muteBtn = controls.querySelector('.mute-btn');
                const fullscreenBtn = controls.querySelector('.fullscreen-btn');
                
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (video.paused) {
                        video.play();
                        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    } else {
                        video.pause();
                        playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                });
                
                muteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    video.muted = !video.muted;
                    muteBtn.innerHTML = video.muted 
                        ? '<i class="fas fa-volume-mute"></i>' 
                        : '<i class="fas fa-volume-up"></i>';
                });
                
                fullscreenBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    } else if (video.webkitRequestFullscreen) {
                        video.webkitRequestFullscreen();
                    }
                });
                
                video.addEventListener('play', () => {
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                });
                
                video.addEventListener('pause', () => {
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                });
                
                video.addEventListener('volumechange', () => {
                    muteBtn.innerHTML = video.muted 
                        ? '<i class="fas fa-volume-mute"></i>' 
                        : '<i class="fas fa-volume-up"></i>';
                });
            }
        });
    }
    
    pauseOtherVideos(currentVideo) {
        this.videos.forEach(video => {
            if (video !== currentVideo && !video.paused) {
                video.pause();
                const container = video.closest('.media-container');
                if (container) {
                    const playBtn = container.querySelector('.play-pause-btn');
                    if (playBtn) {
                        playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }
            }
        });
    }
    
    destroy() {
        this.observers.forEach((observer, video) => {
            observer.unobserve(video);
        });
        this.observers.clear();
    }
}

function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
    
    document.querySelectorAll('.gallery-caption').forEach(caption => {
        caption.style.opacity = '0';
        caption.style.transform = 'translateY(20px)';
        caption.style.transition = 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s';
        observer.observe(caption);
    });
}

function updateCopyrightYear() {
    const copyrightElement = document.querySelector('.copyright p');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.textContent = copyrightElement.textContent.replace('2026', currentYear);
    }
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (currentPage === 'index.html' || currentPage === '' || currentPage.includes('index')) {
            if (linkHref.includes('#')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        } else if (currentPage === 'video-editing.html') {
            if (linkHref.includes('projects')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCopyrightYear();
    
    setActiveNavLink();
    
    initAnimations();
    
    window.videoLightbox = new VideoLightbox();
    
    window.videoManager = new VideoManager();
    
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.gallery-section, .category-description');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    const elements = document.querySelectorAll('.gallery-section, .category-description');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    setTimeout(animateOnScroll, 100);
    window.addEventListener('scroll', animateOnScroll);
});

window.addEventListener('error', function(e) {
    const target = e.target;
    if (target.tagName === 'VIDEO' || target.tagName === 'SOURCE') {
        console.warn('Видео не загружено:', target.src);
        
        const videoContainer = target.closest('.media-container');
        if (videoContainer && !videoContainer.querySelector('.video-error')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'video-error';
            errorMsg.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>Видео не найдено</p>
                <small>Проверьте файл: ${target.src.split('/').pop()}</small>
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                .video-error {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.95);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    text-align: center;
                    z-index: 5;
                    border-radius: 8px;
                }
                .video-error i {
                    font-size: 2.5rem;
                    color: #ff6b6b;
                    margin-bottom: 15px;
                }
                .video-error p {
                    margin-bottom: 10px;
                    color: #ddd;
                    font-size: 1.1rem;
                }
                .video-error small {
                    color: #aaa;
                    font-size: 0.9rem;
                }
            `;
            
            document.head.appendChild(style);
            videoContainer.appendChild(errorMsg);
        }
    }
}, true);

function checkMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        document.querySelectorAll('.portfolio-video').forEach(video => {
            video.controls = true;
            video.playsInline = true;
            
            const customControls = video.parentElement.querySelector('.video-controls');
            if (customControls) {
                customControls.style.display = 'none';
            }
        });
    }
}

window.addEventListener('load', checkMobile);
window.addEventListener('resize', checkMobile);