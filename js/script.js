// Мобильное меню
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Плавная прокрутка для всех внутренних ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Пропускаем ссылки на другие страницы
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

// Изменение шапки при прокрутке
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

// Анимация при скролле
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.category-card, .education-item, .contact-item, .work-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Инициализация анимации при загрузке
window.addEventListener('load', () => {
    // Устанавливаем начальные стили для анимации
    const elements = document.querySelectorAll('.category-card, .education-item, .contact-item, .work-item');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Запускаем анимацию
    setTimeout(animateOnScroll, 100);
});

// Запуск анимации при скролле
window.addEventListener('scroll', animateOnScroll);

// Текущий год в футере
document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.querySelector('.copyright p');
    if (copyrightElement) {
        copyrightElement.textContent = copyrightElement.textContent.replace('2023', currentYear);
    }
    
    // Обработчики для кнопок категорий
    document.querySelectorAll('.category-card .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            
            // Проверяем, существует ли файл
            if (href && href.includes('.html')) {
                // Проверяем, существует ли файл на сервере
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
    
    // Обработчики для кнопок "Назад" на страницах категорий
    document.querySelectorAll('.back-button .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.getAttribute('href') === 'index.html#projects') {
                // Если есть доступ к истории, используем ее
                if (window.history.length > 1) {
                    e.preventDefault();
                    window.history.back();
                }
            }
        });
    });
});

// Вспомогательная функция для показа сообщений
function showMessage(message) {
    // Создаем красивый попап
    const popup = document.createElement('div');
    popup.className = 'message-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <i class="fas fa-info-circle"></i>
            <p>${message}</p>
            <button class="popup-close">OK</button>
        </div>
    `;
    
    // Добавляем стили
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
    
    // Закрытие попапа
    const closeBtn = popup.querySelector('.popup-close');
    closeBtn.addEventListener('click', () => {
        popup.remove();
        style.remove();
    });
    
    // Закрытие по клику вне попапа
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
            style.remove();
        }
    });
}

// Проверка активной страницы в навигации
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (currentPage === 'index.html' || currentPage === '') {
            // На главной странице
            if (linkHref.includes('#')) {
                const sectionId = linkHref.split('#')[1];
                if (window.location.hash === `#${sectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        } else {
            // На других страницах
            if (linkHref.includes(currentPage)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', setActiveNavLink);