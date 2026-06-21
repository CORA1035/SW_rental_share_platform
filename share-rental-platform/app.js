// ==========================================================================
// 1. Central State & LocalStorage Management (Database Simulation)
// ==========================================================================

const SEED_USERS = [
    { id: 1, email: 'user1@test.com', name: '민정준 (대여소)', passwordHash: 'password123' },
    { id: 2, email: 'user2@test.com', name: '김철수', passwordHash: 'password123' },
    { id: 3, email: 'user3@test.com', name: '이영희', passwordHash: 'password123' }
];

const SEED_ITEMS = [
    {
        id: 1,
        ownerId: 1,
        ownerName: '민정준 (대여소)',
        title: '맥북 프로 14인치 M3 Pro (Space Black)',
        category: '디지털기기',
        description: '최신 M3 Pro 칩셋 탑재 모델입니다. 램 18GB, SSD 512GB 사양이며 영상 편집이나 코딩 작업에 적합합니다. 파우치와 초고속 충전 케이블 같이 대여해 드립니다. 깨끗하게 사용해 주실 분만 신청해 주세요!',
        pricePerDay: 25000,
        startDate: '2026-06-01',
        endDate: '2026-12-31',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 2,
        ownerId: 2,
        ownerName: '김철수',
        title: '감성 캠핑 4인용 텐트 & 테이블 풀세트',
        category: '스포츠/레저',
        description: '주말 가족 및 연인과의 캠핑에 제격인 프리미엄 면텐트와 접이식 원목 테이블 세트입니다. 폴대 및 팩 망치도 함께 포함되어 있으며 원하시는 분께는 릴선(10m)도 무료로 넣어 드립니다. 반납 시 흙먼지만 가볍게 털어주세요.',
        pricePerDay: 18000,
        startDate: '2026-06-10',
        endDate: '2026-10-31',
        imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 3,
        ownerId: 3,
        ownerName: '이영희',
        title: '다이슨 에어랩 멀티 스타일러 롱배럴',
        category: '뷰티/미용',
        description: '다이슨 에어랩 오리지널 패키지입니다. 롱배럴 30mm, 40mm 및 스무딩 브러시 포함 구성입니다. 사용 후 헤드 부분 소독 티슈로 꼼꼼하게 닦아서 위생적으로 관리하고 있습니다. 여행 시 헤어 스타일링용으로 추천합니다.',
        pricePerDay: 9000,
        startDate: '2026-05-01',
        endDate: '2026-09-30',
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13edd793be?auto=format&fit=crop&w=800&q=80'
    }
];

const SEED_RENTALS = [
    { id: 1, itemId: 2, itemTitle: '감성 캠핑 4인용 텐트 & 테이블 풀세트', itemImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', borrowerId: 1, borrowerName: '민정준 (대여소)', ownerId: 2, ownerName: '김철수', startDate: '2026-06-25', endDate: '2026-06-28', status: 'PENDING' }
];

const SEED_MESSAGES = [
    { id: 1, itemId: 2, senderId: 1, senderName: '민정준 (대여소)', receiverId: 2, receiverName: '김철수', message: '안녕하세요! 캠핑 텐트 대여하고 싶어서 문의 드립니다. 6월 25일부터 3일간 대여 가능할까요?', timestamp: '2026-06-21 15:30:20', isRead: 1 },
    { id: 2, itemId: 2, senderId: 2, senderName: '김철수', receiverId: 1, receiverName: '민정준 (대여소)', message: '네, 안녕하세요! 해당 일정 비어 있으니 대여 신청 버튼 눌러주시면 바로 승인해 드리겠습니다.', timestamp: '2026-06-21 15:35:45', isRead: 1 }
];

const Store = {
    users: [],
    items: [],
    rentals: [],
    messages: [],
    currentUser: null,

    init() {
        this.users = JSON.parse(localStorage.getItem('sr_users')) || SEED_USERS;
        this.items = JSON.parse(localStorage.getItem('sr_items')) || SEED_ITEMS;
        this.rentals = JSON.parse(localStorage.getItem('sr_rentals')) || SEED_RENTALS;
        this.messages = JSON.parse(localStorage.getItem('sr_messages')) || SEED_MESSAGES;
        this.currentUser = JSON.parse(localStorage.getItem('sr_current_user')) || null;
        
        this.save();
    },

    save() {
        localStorage.setItem('sr_users', JSON.stringify(this.users));
        localStorage.setItem('sr_items', JSON.stringify(this.items));
        localStorage.setItem('sr_rentals', JSON.stringify(this.rentals));
        localStorage.setItem('sr_messages', JSON.stringify(this.messages));
        localStorage.setItem('sr_current_user', JSON.stringify(this.currentUser));
    },

    registerUser(email, name, password) {
        if (this.users.some(u => u.email === email)) return false;
        const newId = this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
        const newUser = { id: newId, email, name, passwordHash: password };
        this.users.push(newUser);
        this.save();
        return true;
    },

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.passwordHash === password);
        if (user) {
            this.currentUser = user;
            this.save();
            return true;
        }
        return false;
    },

    logout() {
        this.currentUser = null;
        this.save();
    },

    switchUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            this.currentUser = user;
            this.save();
            return true;
        }
        return false;
    },

    addItem(title, category, description, pricePerDay, startDate, endDate, imageUrl) {
        const newId = this.items.length ? Math.max(...this.items.map(u => u.id)) + 1 : 1;
        const fallbackImg = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80';
        const newItem = {
            id: newId,
            ownerId: this.currentUser.id,
            ownerName: this.currentUser.name,
            title,
            category,
            description,
            pricePerDay: parseInt(pricePerDay),
            startDate,
            endDate,
            imageUrl: imageUrl || fallbackImg
        };
        this.items.unshift(newItem);
        this.save();
        return newId;
    },

    requestRental(itemId, startDate, endDate) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return false;
        
        const newId = this.rentals.length ? Math.max(...this.rentals.map(u => u.id)) + 1 : 1;
        const newRental = {
            id: newId,
            itemId,
            itemTitle: item.title,
            itemImage: item.imageUrl,
            borrowerId: this.currentUser.id,
            borrowerName: this.currentUser.name,
            ownerId: item.ownerId,
            ownerName: item.ownerName,
            startDate,
            endDate,
            status: 'PENDING'
        };
        this.rentals.push(newRental);
        this.save();
        return true;
    },

    updateRentalStatus(rentalId, status) {
        const rental = this.rentals.find(r => r.id === rentalId);
        if (rental) {
            rental.status = status;
            this.save();
            return true;
        }
        return false;
    },

    sendMessage(itemId, receiverId, messageText) {
        const newId = this.messages.length ? Math.max(...this.messages.map(u => u.id)) + 1 : 1;
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const newMessage = {
            id: newId,
            itemId,
            senderId: this.currentUser.id,
            senderName: this.currentUser.name,
            receiverId: parseInt(receiverId),
            message: messageText,
            timestamp,
            isRead: 0
        };
        this.messages.push(newMessage);
        this.save();
        return newMessage;
    },

    triggerBotReply(itemId, botId) {
        const botUser = this.users.find(u => u.id === botId);
        if (!botUser) return null;
        
        const replies = [
            "네, 물품 상세 내용 보신 대로 상태 아주 깨끗합니다!",
            "거래 장소와 시간은 대화로 유연하게 조율해요.",
            "신청해 주시면 기간 확인하고 바로 승인해 드리겠습니다.",
            "궁금한 점 있으시면 무엇이든 편하게 물어보세요!",
            "직거래와 택배 거래 둘 다 가능합니다.",
            "네, 말씀하신 대여 일정도 문제없습니다!"
        ];
        const messageText = replies[Math.floor(Math.random() * replies.length)];
        
        const newId = this.messages.length ? Math.max(...this.messages.map(u => u.id)) + 1 : 1;
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        
        const newMessage = {
            id: newId,
            itemId,
            senderId: botId,
            senderName: botUser.name,
            receiverId: this.currentUser.id,
            message: messageText,
            timestamp,
            isRead: 0
        };
        this.messages.push(newMessage);
        this.save();
        return newMessage;
    },

    getMessages(itemId, u1, u2) {
        return this.messages.filter(m => 
            m.itemId === itemId && 
            ((m.senderId === u1 && m.receiverId === u2) || (m.senderId === u2 && m.receiverId === u1))
        );
    },

    markMessagesAsRead(itemId, senderId, receiverId) {
        let changed = false;
        this.messages.forEach(m => {
            if (m.itemId === itemId && m.senderId === senderId && m.receiverId === receiverId && m.isRead === 0) {
                m.isRead = 1;
                changed = true;
            }
        });
        if (changed) this.save();
    },

    getChatRooms(userId) {
        const list = [];
        const seen = new Set();
        
        for (let i = this.messages.length - 1; i >= 0; i--) {
            const m = this.messages[i];
            if (m.senderId === userId || m.receiverId === userId) {
                const partnerId = m.senderId === userId ? m.receiverId : m.senderId;
                const key = `${m.itemId}-${partnerId}`;
                
                if (!seen.has(key)) {
                    seen.add(key);
                    const item = this.items.find(it => it.id === m.itemId) || { title: '삭제된 물품', imageUrl: '' };
                    const partner = this.users.find(u => u.id === partnerId) || { name: '알수없는 사용자' };
                    
                    const unreadCount = this.messages.filter(msg => 
                        msg.itemId === m.itemId && 
                        msg.senderId === partnerId && 
                        msg.receiverId === userId && 
                        msg.isRead === 0
                    ).length;

                    list.push({
                        itemId: m.itemId,
                        itemTitle: item.title,
                        itemImage: item.imageUrl,
                        otherUserId: partnerId,
                        otherUserName: partner.name,
                        lastMessage: m.message,
                        lastTimestamp: m.timestamp,
                        unreadCount
                    });
                }
            }
        }
        return list;
    }
};

Store.init();


// ==========================================================================
// 2. Global Router & View Engine
// ==========================================================================

const App = {
    appContainer: null,
    
    init() {
        this.appContainer = document.getElementById('app');
        
        window.addEventListener('hashchange', () => this.route());
        window.addEventListener('load', () => this.route());
        
        window.addEventListener('storage', () => {
            Store.init();
            this.renderNav();
            this.route();
        });
        
        this.renderNav();
    },

    route() {
        const hash = window.location.hash || '#/';
        
        if (!Store.currentUser && hash !== '#/signup' && hash !== '#/login') {
            window.location.hash = '#/login';
            return;
        }

        if (hash === '#/login') {
            this.render(LoginView());
        } else if (hash === '#/signup') {
            this.render(SignupView());
        } else if (hash === '#/' || hash.startsWith('#/home')) {
            this.render(HomeView());
        } else if (hash === '#/register-item') {
            this.render(RegisterItemView());
        } else if (hash.startsWith('#/item-detail')) {
            const urlParams = new URLSearchParams(hash.split('?')[1]);
            const itemId = parseInt(urlParams.get('id'));
            this.render(ItemDetailView(itemId));
        } else if (hash === '#/dashboard') {
            this.render(DashboardView());
        } else if (hash.startsWith('#/chat')) {
            const urlParams = new URLSearchParams(hash.split('?')[1]);
            const itemId = parseInt(urlParams.get('item'));
            const otherId = parseInt(urlParams.get('other'));
            this.render(ChatView(itemId, otherId));
        } else {
            this.render(HomeView());
        }
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        this.renderNav();
    },

    render(viewHTML) {
        this.appContainer.innerHTML = viewHTML;
    },

    renderNav() {
        const navLinks = document.getElementById('navLinks');
        const navUser = document.getElementById('navUser');
        
        if (!Store.currentUser) {
            navLinks.innerHTML = '';
            navUser.innerHTML = `
                <a href="#/login" class="btn btn-secondary btn-sm">로그인</a>
                <a href="#/signup" class="btn btn-primary btn-sm">회원가입</a>
            `;
            return;
        }
        
        const unreadCount = Store.getChatRooms(Store.currentUser.id).reduce((sum, r) => sum + r.unreadCount, 0);
        const unreadHTML = unreadCount > 0 ? `<span class="chat-unread-badge" style="position: absolute; top: -8px; right: -12px;">${unreadCount}</span>` : '';
        
        navLinks.innerHTML = `
            <a href="#/" class="nav-link-item ${window.location.hash === '#/' ? 'active' : ''}"><i data-lucide="search" style="display:inline-block; vertical-align:middle; margin-right:4px; width:16px;"></i> 검색/조회</a>
            <a href="#/register-item" class="nav-link-item ${window.location.hash === '#/register-item' ? 'active' : ''}"><i data-lucide="plus-circle" style="display:inline-block; vertical-align:middle; margin-right:4px; width:16px;"></i> 물품 등록</a>
            <a href="#/dashboard" class="nav-link-item ${window.location.hash === '#/dashboard' ? 'active' : ''}"><i data-lucide="layers" style="display:inline-block; vertical-align:middle; margin-right:4px; width:16px;"></i> 대시보드</a>
            <a href="#/chat" class="nav-link-item ${window.location.hash.startsWith('#/chat') ? 'active' : ''}" style="position: relative;">
                <i data-lucide="message-square" style="display:inline-block; vertical-align:middle; margin-right:4px; width:16px;"></i> 채팅
                ${unreadHTML}
            </a>
        `;
        
        const otherUsers = Store.users.filter(u => u.id !== Store.currentUser.id);
        const switcherDropdownHTML = otherUsers.map(u => `
            <a href="javascript:void(0)" onclick="window.switchCurrentUser(${u.id})">${u.name}</a>
        `).join('');

        navUser.innerHTML = `
            <div class="user-switcher">
                <button class="switcher-btn">
                    <i data-lucide="user" style="width:16px;"></i>
                    <span>${Store.currentUser.name}</span>
                    <i data-lucide="chevron-down" style="width:12px;"></i>
                </button>
                <div class="switcher-dropdown">
                    <div style="padding: 0.5rem; font-size: 0.75rem; color: #6b7280; border-bottom: 1px solid var(--border-light); margin-bottom: 0.25rem;">
                        테스트 계정 전환
                    </div>
                    ${switcherDropdownHTML}
                    <a href="javascript:void(0)" onclick="window.logoutUser()" style="border-top: 1px solid var(--border-light); margin-top: 0.25rem; color: #ef4444;">
                        <i data-lucide="log-out" style="width:12px; display:inline-block; vertical-align:middle; margin-right:4px;"></i> 로그아웃
                    </a>
                    <a href="javascript:void(0)" onclick="window.resetDatabase()" style="border-top: 1px solid var(--border-light); margin-top: 0.25rem; color: var(--warning);">
                        <i data-lucide="rotate-ccw" style="width:12px; display:inline-block; vertical-align:middle; margin-right:4px;"></i> 데이터 초기화
                    </a>
                </div>
            </div>
        `;
    },

    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alertContainer');
        const alertId = `alert_${Date.now()}`;
        
        const alertHTML = `
            <div class="alert alert-${type}" id="${alertId}">
                <span>${message}</span>
                <button onclick="document.getElementById('${alertId}').remove()" style="background:none; border:none; color:inherit; cursor:pointer;">
                    <i data-lucide="x" style="width: 16px;"></i>
                </button>
            </div>
        `;
        
        alertContainer.insertAdjacentHTML('beforeend', alertHTML);
        if (window.lucide) window.lucide.createIcons();
        
        setTimeout(() => {
            const el = document.getElementById(alertId);
            if (el) el.remove();
        }, 4000);
    }
};

window.switchCurrentUser = (userId) => {
    if (Store.switchUser(userId)) {
        App.showAlert(`${Store.currentUser.name}(으)로 계정을 전환했습니다.`, 'info');
        window.location.hash = '#/';
        App.route();
    }
};

window.logoutUser = () => {
    Store.logout();
    App.showAlert('로그아웃 되었습니다.', 'success');
    window.location.hash = '#/login';
    App.route();
};

window.resetDatabase = () => {
    if (confirm('모든 대여 신청, 등록 물품, 채팅 메시지를 지우고 첫 테스트 상태로 초기화하시겠습니까?')) {
        localStorage.clear();
        location.reload();
    }
};


// ==========================================================================
// 3. Page Views Implementations
// ==========================================================================

// --- View 1: Login ---
function LoginView() {
    window.handleLoginSubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const pw = document.getElementById('loginPassword').value;
        
        if (Store.login(email, pw)) {
            App.showAlert(`${Store.currentUser.name}님 환영합니다!`, 'success');
            window.location.hash = '#/';
        } else {
            App.showAlert('이메일 또는 비밀번호가 올바르지 않습니다.', 'danger');
        }
    };

    return `
        <div style="max-width: 440px; margin: 5rem auto;">
            <div class="glass" style="padding: 2.5rem; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
                <h2 style="font-size: 1.75rem; text-align: center; margin-bottom: 0.5rem; background: var(--primary-grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    로그인
                </h2>
                <p style="text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2.5rem;">
                    이메일 계정으로 안전하게 로그인하세요.
                </p>

                <form onsubmit="handleLoginSubmit(event)">
                    <div class="form-group">
                        <label for="loginEmail" class="form-label">이메일 주소</label>
                        <input type="email" id="loginEmail" class="form-control" placeholder="example@email.com" required>
                    </div>

                    <div class="form-group" style="margin-bottom: 2rem;">
                        <label for="loginPassword" class="form-label">비밀번호</label>
                        <input type="password" id="loginPassword" class="form-control" placeholder="비밀번호를 입력하세요" required>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem;">
                        로그인
                    </button>
                </form>

                <div style="text-align: center; margin-top: 2rem; font-size: 0.9rem; color: var(--text-muted);">
                    아직 계정이 없으신가요? <a href="#/signup" style="color: #7c3aed; text-decoration: none; font-weight: 600;">회원가입</a>
                </div>
                
                <div style="margin-top: 2rem; padding: 1rem; border-radius: 10px; background: rgba(124, 58, 237, 0.05); border: 1px dashed var(--border-glow); font-size: 0.8rem; line-height: 1.5;">
                    <div style="font-weight: 600; color: #a78bfa; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.3rem;">
                        <i data-lucide="help-circle" style="width: 14px;"></i>
                        <span>빠른 테스트용 계정 안내</span>
                    </div>
                    <p style="color: var(--text-muted); margin-bottom: 0.2rem;">첫 실행 시 아래 3개 테스트 계정이 이미 가입되어 있습니다.</p>
                    <ul style="padding-left: 1rem; color: var(--text-muted);">
                        <li>이메일: <strong>user1@test.com</strong> / 비번: <strong>password123</strong></li>
                        <li>이메일: <strong>user2@test.com</strong> / 비번: <strong>password123</strong></li>
                        <li>이메일: <strong>user3@test.com</strong> / 비번: <strong>password123</strong></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// --- View 2: Sign Up ---
function SignupView() {
    window.handleSignupSubmit = (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const pw = document.getElementById('signupPassword').value;
        const pwConfirm = document.getElementById('signupPasswordConfirm').value;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            App.showAlert('올바른 이메일 형식이 아닙니다.', 'danger');
            return;
        }
        
        const hasLetter = /[a-zA-Z]/.test(pw);
        const hasNumber = /[0-9]/.test(pw);
        if (pw.length < 8 || !hasLetter || !hasNumber) {
            App.showAlert('비밀번호는 영문자와 숫자를 포함하여 8자 이상이어야 합니다.', 'danger');
            return;
        }
        
        if (pw !== pwConfirm) {
            App.showAlert('비밀번호가 일치하지 않습니다.', 'danger');
            return;
        }
        
        if (Store.registerUser(email, name, pw)) {
            App.showAlert('회원가입이 완료되었습니다. 로그인해 주세요!', 'success');
            window.location.hash = '#/login';
        } else {
            App.showAlert('이미 사용 중인 이메일 주소입니다.', 'danger');
        }
    };

    return `
        <div style="max-width: 480px; margin: 3rem auto;">
            <div class="glass" style="padding: 2.5rem; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
                <h2 style="font-size: 1.75rem; text-align: center; margin-bottom: 0.5rem; background: var(--primary-grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    회원가입
                </h2>
                <p style="text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem;">
                    ShareRent의 회원이 되어 다양한 물품을 공유해 보세요.
                </p>

                <form onsubmit="handleSignupSubmit(event)">
                    <div class="form-group">
                        <label for="signupName" class="form-label">이름</label>
                        <input type="text" id="signupName" class="form-control" placeholder="홍길동" required>
                    </div>

                    <div class="form-group">
                        <label for="signupEmail" class="form-label">이메일 주소</label>
                        <input type="email" id="signupEmail" class="form-control" placeholder="example@email.com" required>
                    </div>

                    <div class="form-group">
                        <label for="signupPassword" class="form-label">비밀번호</label>
                        <input type="password" id="signupPassword" class="form-control" placeholder="영문+숫자 혼합 8자 이상" required>
                    </div>

                    <div class="form-group">
                        <label for="signupPasswordConfirm" class="form-label">비밀번호 재입력</label>
                        <input type="password" id="signupPasswordConfirm" class="form-control" placeholder="비밀번호 동일하게 입력" required>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem; padding: 0.85rem;">
                        가입하기
                    </button>
                </form>

                <div style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted);">
                    이미 계정이 있으신가요? <a href="#/login" style="color: #7c3aed; text-decoration: none; font-weight: 600;">로그인</a>
                </div>
            </div>
        </div>
    `;
}

// --- View 3: Home ---
let currentCategory = 'ALL';
let currentSearch = '';
let currentMaxPrice = '';
let currentSort = 'latest';

function HomeView() {
    window.selectCategory = (cat) => {
        currentCategory = cat;
        App.route();
    };

    window.handleSearchSubmit = (e) => {
        e.preventDefault();
        currentSearch = document.getElementById('searchQuery').value.trim();
        currentMaxPrice = document.getElementById('maxPriceInput').value;
        App.route();
    };

    window.resetFilters = () => {
        currentCategory = 'ALL';
        currentSearch = '';
        currentMaxPrice = '';
        currentSort = 'latest';
        App.route();
    };

    window.handleSortChange = (e) => {
        currentSort = e.target.value;
        App.route();
    };

    let filteredItems = Store.items;
    
    if (currentSearch) {
        const query = currentSearch.toLowerCase();
        filteredItems = filteredItems.filter(i => 
            i.title.toLowerCase().includes(query) || 
            i.description.toLowerCase().includes(query)
        );
    }
    
    if (currentCategory && currentCategory !== 'ALL') {
        filteredItems = filteredItems.filter(i => i.category === currentCategory);
    }
    
    if (currentMaxPrice) {
        const max = parseInt(currentMaxPrice);
        filteredItems = filteredItems.filter(i => i.pricePerDay <= max);
    }
    
    if (currentSort === 'price_asc') {
        filteredItems.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (currentSort === 'price_desc') {
        filteredItems.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else {
        filteredItems.sort((a, b) => b.id - a.id);
    }

    const itemGridHTML = filteredItems.map(item => `
        <div class="glass glass-hover item-card">
            <a href="#/item-detail?id=${item.id}" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%;">
                <div class="item-img-container">
                    <span class="item-category-tag">${item.category}</span>
                    <img src="${item.imageUrl}" alt="${item.title}" class="item-img">
                </div>
                <div class="item-body">
                    <h3 class="item-title">${item.title}</h3>
                    <p class="item-desc-preview">${item.description}</p>
                    <div class="item-footer">
                        <div class="item-price">${item.pricePerDay.toLocaleString()}<span>원 / 일</span></div>
                        <div class="item-owner">
                            <i data-lucide="user" style="width: 12px; display:inline-block; vertical-align:middle; margin-right:2px;"></i>
                            ${item.ownerName}
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `).join('');

    const emptyGridHTML = `
        <div class="glass" style="padding: 4rem; text-align: center; margin-top: 2rem; width: 100%;">
            <i data-lucide="inbox" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 1rem;"></i>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">등록된 대여 물품이 없습니다</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem;">
                검색 조건을 변경하거나, 첫 대여 물품을 직접 등록해 보세요!
            </p>
        </div>
    `;

    const categories = ['ALL', '디지털기기', '스포츠/레저', '뷰티/미용', '도서', '가구/인테리어', '기타'];
    const chipsHTML = categories.map(cat => {
        const isActive = currentCategory === cat;
        return `
            <button type="button" 
                    class="chip" 
                    onclick="selectCategory('${cat}')"
                    style="background: ${isActive ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.03)'};
                           color: ${isActive ? 'var(--text-main)' : 'var(--text-muted)'};
                           border: 1px solid ${isActive ? 'rgba(124, 58, 237, 0.5)' : 'var(--border-light)'};
                           padding: 0.4rem 0.9rem;
                           border-radius: 999px;
                           font-size: 0.85rem;
                           font-weight: 500;
                           cursor: pointer;
                           margin-right: 0.5rem;
                           margin-bottom: 0.5rem;">
                ${cat === 'ALL' ? '전체' : cat}
            </button>
        `;
    }).join('');

    return `
        <div style="margin-bottom: 2rem;">
            <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h1 style="font-size: 2.25rem; font-weight: 800; background: var(--primary-grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.25rem;">
                        주변의 유용한 물품을 찾아보세요
                    </h1>
                    <p style="color: var(--text-muted); font-size: 0.95rem;">
                        필요한 기간만큼 저렴하게 대여하고, 쓰지 않는 물품은 공유하여 수익을 올려보세요.
                    </p>
                </div>
                <a href="#/register-item" class="btn btn-primary">
                    <i data-lucide="plus" style="width: 18px;"></i>
                    <span>내 물품 등록하기</span>
                </a>
            </div>

            <div class="glass" style="padding: 1.5rem; margin-bottom: 2rem;">
                <form onsubmit="handleSearchSubmit(event)">
                    <div style="display: flex; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
                        <div style="flex-grow: 1; position: relative; min-width: 250px;">
                            <i data-lucide="search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); width: 18px;"></i>
                            <input type="text" id="searchQuery" class="form-control" placeholder="어떤 물품을 대여하고 싶으신가요?" value="${currentSearch}" style="padding-left: 2.75rem;">
                        </div>
                        <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                            검색
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="resetFilters()" style="padding: 0.75rem 1.5rem;">
                            필터 초기화
                        </button>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-light);">
                        <div style="display: flex; flex-wrap: wrap;">
                            ${chipsHTML}
                        </div>

                        <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-size: 0.85rem; color: var(--text-muted);">일일 최대 요금:</span>
                                <input type="number" id="maxPriceInput" class="form-control" placeholder="금액 입력" value="${currentMaxPrice}" style="width: 120px; padding: 0.4rem 0.75rem; font-size: 0.85rem;">
                                <span style="font-size: 0.85rem; color: var(--text-muted);">원</span>
                            </div>

                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-size: 0.85rem; color: var(--text-muted);">정렬:</span>
                                <select onchange="handleSortChange(event)" class="form-control" style="width: 130px; padding: 0.4rem 0.75rem; font-size: 0.85rem;">
                                    <option value="latest" ${currentSort === 'latest' ? 'selected' : ''}>최신순</option>
                                    <option value="price_asc" ${currentSort === 'price_asc' ? 'selected' : ''}>가격 낮은순</option>
                                    <option value="price_desc" ${currentSort === 'price_desc' ? 'selected' : ''}>가격 높은순</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="item-grid">
                ${filteredItems.length ? itemGridHTML : emptyGridHTML}
            </div>
        </div>
    `;
}

// --- View 4: Register Item ---
function RegisterItemView() {
    let uploadedImageBase64 = '';

    window.previewFileImage = (input) => {
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            
            if (!allowed.includes(file.type)) {
                App.showAlert('이미지 파일(.jpg, .png)만 업로드할 수 있습니다.', 'danger');
                input.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImageBase64 = e.target.result;
                const prev = document.getElementById('itemImgPreview');
                const prevContainer = document.getElementById('itemImgPreviewContainer');
                if (prev) prev.src = uploadedImageBase64;
                if (prevContainer) prevContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    };

    window.handleRegisterSubmit = (e) => {
        e.preventDefault();
        
        const title = document.getElementById('regTitle').value.trim();
        const category = document.getElementById('regCategory').value;
        const price = document.getElementById('regPrice').value;
        const start = document.getElementById('regStart').value;
        const end = document.getElementById('regEnd').value;
        const desc = document.getElementById('regDesc').value.trim();
        
        if (end < start) {
            App.showAlert('대여 종료 가능일은 시작일보다 이전일 수 없습니다.', 'danger');
            return;
        }
        
        if (parseInt(price) <= 0) {
            App.showAlert('대여 요금은 0보다 커야 합니다.', 'danger');
            return;
        }

        let finalImageUrl = uploadedImageBase64;
        if (!finalImageUrl) {
            const presets = {
                '디지털기기': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
                '스포츠/레저': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
                '뷰티/미용': 'https://images.unsplash.com/photo-1522337360788-8b13edd793be?auto=format&fit=crop&w=800&q=80'
            };
            finalImageUrl = presets[category] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80';
        }

        const newId = Store.addItem(title, category, desc, price, start, end, finalImageUrl);
        App.showAlert('대여 물품이 성공적으로 등록되었습니다!', 'success');
        window.location.hash = `#/item-detail?id=${newId}`;
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return `
        <div style="max-width: 680px; margin: 2rem auto;">
            <div class="glass" style="padding: 2.5rem; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                    <i data-lucide="plus-circle" style="width: 28px; height: 28px; color: #7c3aed;"></i>
                    <h2 style="font-size: 1.75rem; background: var(--primary-grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        대여 물품 등록
                    </h2>
                </div>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem;">
                    대여해 줄 물품의 상세 스펙과 가능 일정을 공유해 주세요.
                </p>

                <form onsubmit="handleRegisterSubmit(event)">
                    <div class="form-group">
                        <label for="regTitle" class="form-label">물품명</label>
                        <input type="text" id="regTitle" class="form-control" placeholder="예: 소니 노이즈캔슬링 헤드폰 WH-1000XM5" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="regCategory" class="form-label">카테고리</label>
                            <select id="regCategory" class="form-control" required>
                                <option value="" disabled selected>선택하세요</option>
                                <option value="디지털기기">디지털기기</option>
                                <option value="스포츠/레저">스포츠/레저</option>
                                <option value="뷰티/미용">뷰티/미용</option>
                                <option value="도서">도서</option>
                                <option value="가구/인테리어">가구/인테리어</option>
                                <option value="기타">기타</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="regPrice" class="form-label">대여 가격 (1일 기준)</label>
                            <div style="position: relative;">
                                <input type="number" id="regPrice" class="form-control" placeholder="10,000" min="1" required style="padding-right: 2rem;">
                                <span style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.9rem;">원</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="regStart" class="form-label">대여 시작 가능일</label>
                            <input type="date" id="regStart" class="form-control" min="${todayStr}" value="${todayStr}" required>
                        </div>
                        <div class="form-group">
                            <label for="regEnd" class="form-label">대여 종료 가능일</label>
                            <input type="date" id="regEnd" class="form-control" min="${todayStr}" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="regPhoto" class="form-label">물품 사진 업로드 (선택)</label>
                        <div style="border: 1px dashed var(--border-light); padding: 1.5rem; border-radius: 10px; background: rgba(255,255,255,0.01); text-align: center; cursor: pointer; position: relative;">
                            <i data-lucide="image" style="width: 32px; height: 32px; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
                            <p style="font-size: 0.85rem; color: var(--text-muted);">클릭하여 이미지를 선택하세요 (.png, .jpg)</p>
                            <input type="file" id="regPhoto" accept="image/*" class="form-control" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;" onchange="previewFileImage(this)">
                        </div>
                        <div id="itemImgPreviewContainer" style="margin-top: 1rem; display: none; text-align: center;">
                            <img id="itemImgPreview" src="#" alt="미리보기" style="max-height: 200px; border-radius: 8px; border: 1px solid var(--border-light);">
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 2rem;">
                        <label for="regDesc" class="form-label">물품 상세 설명</label>
                        <textarea id="regDesc" class="form-control" rows="6" placeholder="물품 상태(기스, 하자 여부), 동봉 구성품 등 상세 스펙을 기재해 주세요." required></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem;">
                        등록하기
                    </button>
                </form>
            </div>
        </div>
    `;
}

// --- View 5: Item Detail ---
function ItemDetailView(itemId) {
    const item = Store.items.find(i => i.id === itemId);
    if (!item) {
        return `
            <div class="glass" style="padding: 4rem; text-align: center;">
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">물품을 찾을 수 없습니다</h3>
                <a href="#/" class="btn btn-primary">홈으로 이동</a>
            </div>
        `;
    }

    const isOwner = item.ownerId === Store.currentUser.id;

    window.calculateTotalDuration = () => {
        const startInput = document.getElementById('rentStart');
        const endInput = document.getElementById('rentEnd');
        const calcDays = document.getElementById('rentCalcDays');
        const calcTotal = document.getElementById('rentCalcTotal');
        
        if (!startInput || !endInput || !startInput.value || !endInput.value) return;
        
        const start = new Date(startInput.value);
        const end = new Date(endInput.value);
        
        const diff = end.getTime() - start.getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24)) + 1;
        
        if (days > 0 && startInput.value <= endInput.value) {
            calcDays.innerText = days;
            calcTotal.innerText = (days * item.pricePerDay).toLocaleString();
        } else {
            calcDays.innerText = '0';
            calcTotal.innerText = '0';
        }
    };

    setTimeout(() => {
        const startInput = document.getElementById('rentStart');
        const endInput = document.getElementById('rentEnd');
        if (startInput && endInput) {
            startInput.addEventListener('change', window.calculateTotalDuration);
            endInput.addEventListener('change', window.calculateTotalDuration);
            window.calculateTotalDuration();
        }
    }, 50);

    window.handleRentSubmit = (e) => {
        e.preventDefault();
        const start = document.getElementById('rentStart').value;
        const end = document.getElementById('rentEnd').value;
        
        if (start > end) {
            App.showAlert('반납일은 시작일보다 이전일 수 없습니다.', 'danger');
            return;
        }
        
        if (start < item.startDate || end > item.endDate) {
            App.showAlert('대여 가능 기간 범위를 초과하였습니다.', 'danger');
            return;
        }
        
        if (Store.requestRental(item.id, start, end)) {
            App.showAlert('대여 신청이 성공적으로 접수되었습니다!', 'success');
            window.location.hash = '#/dashboard';
        } else {
            App.showAlert('대여 신청 처리 중 요류가 발생했습니다.', 'danger');
        }
    };

    return `
        <a href="#/" class="btn btn-secondary" style="margin-bottom: 1.5rem; display: inline-flex; align-items: center; gap: 0.25rem;">
            <i data-lucide="arrow-left" style="width: 16px;"></i>
            <span>목록으로 돌아가기</span>
        </a>

        <div class="detail-layout">
            <div class="glass" style="overflow: hidden; height: fit-content; display: flex; flex-direction: column;">
                <div class="detail-img-box">
                    <img src="${item.imageUrl}" alt="${item.title}">
                </div>
                
                <div class="detail-content">
                    <div class="detail-header">
                        <span class="detail-category">${item.category}</span>
                        <h1 class="detail-title">${item.title}</h1>
                        <div class="detail-price">
                            ${item.pricePerDay.toLocaleString()} <span>원 / 일</span>
                        </div>
                    </div>

                    <div style="margin-bottom: 2rem;">
                        <h3 style="font-size: 1.2rem; margin-bottom: 0.75rem; color: #a78bfa;">물품 상세 정보</h3>
                        <p class="detail-desc" style="white-space: pre-line;">${item.description}</p>
                    </div>

                    <div class="detail-meta-box">
                        <div class="detail-meta-item">
                            <span class="label">등록자(소유자)</span>
                            <span class="val">${item.ownerName}</span>
                        </div>
                        <div class="detail-meta-item" style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.75rem;">
                            <span class="label">대여 가능 기간</span>
                            <span class="val" style="color: #60a5fa;">${item.startDate} ~ ${item.endDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div class="glass booking-card" style="box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
                    ${isOwner ? `
                        <div style="text-align: center; padding: 1.5rem 0;">
                            <i data-lucide="info" style="width: 48px; height: 48px; color: #a78bfa; margin-bottom: 1rem;"></i>
                            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">내가 등록한 물품</h3>
                            <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5;">
                                본인이 등록한 물품입니다. 대여 현황 및 채팅 내역은 대시보드와 채팅 페이지에서 확인하세요.
                            </p>
                            <div style="display: flex; gap: 0.5rem; flex-direction: column; margin-top: 1.5rem;">
                                <a href="#/dashboard" class="btn btn-secondary" style="width: 100%;">대여 신청 확인하기</a>
                                <a href="#/chat" class="btn btn-primary" style="width: 100%;">채팅 목록으로 이동</a>
                            </div>
                        </div>
                    ` : `
                        <h3 style="font-size: 1.35rem; margin-bottom: 1.5rem; text-align: center; font-weight: 700;">
                            대여 신청 및 상담
                        </h3>
                        
                        <form onsubmit="handleRentSubmit(event)">
                            <div class="form-group">
                                <label for="rentStart" class="form-label">대여 시작일</label>
                                <input type="date" id="rentStart" class="form-control" 
                                       min="${item.startDate}" max="${item.endDate}" value="${item.startDate}" required>
                            </div>

                            <div class="form-group" style="margin-bottom: 1.5rem;">
                                <label for="rentEnd" class="form-label">대여 반납일</label>
                                <input type="date" id="rentEnd" class="form-control" 
                                       min="${item.startDate}" max="${item.endDate}" value="${item.endDate}" required>
                            </div>

                            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 0.85rem; color: var(--text-muted);">예상 대여 기간: <strong id="rentCalcDays">0</strong>일</span>
                                <span style="font-weight: 700; color: #a78bfa;">총 <strong id="rentCalcTotal">0</strong>원</span>
                            </div>

                            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; margin-bottom: 0.75rem;">
                                <i data-lucide="check-square" style="width: 18px;"></i>
                                <span>대여 신청하기</span>
                            </button>
                        </form>

                        <a href="#/chat?item=${item.id}&other=${item.ownerId}" class="btn btn-secondary" style="width: 100%; padding: 0.85rem;">
                            <i data-lucide="message-square" style="width: 18px;"></i>
                            <span>판매자와 채팅 문의</span>
                        </a>
                    `}
                </div>
            </div>
        </div>
    `;
}

// --- View 6: Dashboard ---
let activeDashboardTab = 'borrowing-tab';

function DashboardView() {
    window.switchDashboardTab = (tabName) => {
        activeDashboardTab = tabName;
        App.route();
    };

    window.processRentalAction = (rentalId, action) => {
        let statusText = 'PENDING';
        let alertMsg = '';
        
        if (action === 'approve') {
            statusText = 'APPROVED';
            alertMsg = '대여 신청을 승인하였습니다.';
        } else if (action === 'reject') {
            statusText = 'REJECTED';
            alertMsg = '대여 신청을 거절하였습니다.';
        } else if (action === 'complete') {
            statusText = 'COMPLETED';
            alertMsg = '반납 확인 처리가 완료되었습니다.';
        }
        
        if (Store.updateRentalStatus(rentalId, statusText)) {
            App.showAlert(alertMsg, 'success');
            App.route();
        }
    };

    const borrowed = Store.rentals.filter(r => r.borrowerId === Store.currentUser.id);
    const lended = Store.rentals.filter(r => r.ownerId === Store.currentUser.id);

    const borrowedRowsHTML = borrowed.map(r => `
        <tr>
            <td>
                <div class="dash-item-cell">
                    <img src="${r.itemImage}" alt="" class="dash-item-img">
                    <a href="#/item-detail?id=${r.itemId}" style="color: var(--text-main); font-weight: 600; text-decoration: none;">
                        ${r.itemTitle}
                    </a>
                </div>
            </td>
            <td>${r.ownerName}</td>
            <td>
                <div style="font-size: 0.9rem;">${r.startDate} ~ ${r.endDate}</div>
            </td>
            <td>
                ${r.status === 'PENDING' ? '<span class="badge badge-pending">승인 대기</span>' : ''}
                ${r.status === 'APPROVED' ? '<span class="badge badge-approved">대여 중/승인됨</span>' : ''}
                ${r.status === 'REJECTED' ? '<span class="badge badge-rejected">신청 거절됨</span>' : ''}
                ${r.status === 'COMPLETED' ? '<span class="badge badge-completed">반납 완료</span>' : ''}
            </td>
        </tr>
    `).join('');

    const lendedRowsHTML = lended.map(r => `
        <tr>
            <td>
                <div class="dash-item-cell">
                    <img src="${r.itemImage}" alt="" class="dash-item-img">
                    <a href="#/item-detail?id=${r.itemId}" style="color: var(--text-main); font-weight: 600; text-decoration: none;">
                        ${r.itemTitle}
                    </a>
                </div>
            </td>
            <td>${r.borrowerName}</td>
            <td>
                <div style="font-size: 0.9rem;">${r.startDate} ~ ${r.endDate}</div>
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    ${r.status === 'PENDING' ? `
                        <button class="btn btn-success btn-sm" onclick="processRentalAction(${r.id}, 'approve')">승인</button>
                        <button class="btn btn-danger btn-sm" onclick="processRentalAction(${r.id}, 'reject')">거절</button>
                    ` : ''}
                    ${r.status === 'APPROVED' ? `
                        <span class="badge badge-approved" style="margin-right: 0.5rem;">대여 진행중</span>
                        <button class="btn btn-primary btn-sm" onclick="processRentalAction(${r.id}, 'complete')">반납 수락</button>
                    ` : ''}
                    ${r.status === 'REJECTED' ? '<span class="badge badge-rejected">거절한 대여</span>' : ''}
                    ${r.status === 'COMPLETED' ? '<span class="badge badge-completed">반납 완료 확인됨</span>' : ''}
                </div>
            </td>
        </tr>
    `).join('');

    const emptyHTML = (text) => `
        <div style="text-align: center; padding: 3rem 0; color: var(--text-muted);">
            <i data-lucide="info" style="width: 32px; height: 32px; margin-bottom: 0.75rem;"></i>
            <p>${text}</p>
        </div>
    `;

    return `
        <div style="margin-bottom: 2rem;">
            <h1 style="font-size: 2.25rem; font-weight: 800; background: var(--primary-grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">
                대여 관리 센터
            </h1>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 2rem;">
                내가 신청한 대여 내역과 내 물품에 접수된 대여 건들을 관리합니다.
            </p>

            <div class="dash-tabs">
                <button class="dash-tab-btn ${activeDashboardTab === 'borrowing-tab' ? 'active' : ''}" onclick="switchDashboardTab('borrowing-tab')">
                    <i data-lucide="download" style="width: 16px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>
                    내가 빌린 내역 (${borrowed.length})
                </button>
                <button class="dash-tab-btn ${activeDashboardTab === 'lending-tab' ? 'active' : ''}" onclick="switchDashboardTab('lending-tab')">
                    <i data-lucide="upload" style="width: 16px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>
                    내 물품 대여 신청 관리 (${lended.length})
                </button>
            </div>

            <div id="borrowing-tab" class="dash-tab-content ${activeDashboardTab === 'borrowing-tab' ? 'active' : ''} glass" style="padding: 1.5rem;">
                <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: #a78bfa;">대여 신청 내역</h3>
                ${borrowed.length ? `
                    <div style="overflow-x: auto;">
                        <table class="dash-table">
                            <thead>
                                <tr>
                                    <th>물품 정보</th>
                                    <th>소유자</th>
                                    <th>대여 기간</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${borrowedRowsHTML}
                            </tbody>
                        </table>
                    </div>
                ` : emptyHTML('내가 신청한 대여 내역이 없습니다.')}
            </div>

            <div id="lending-tab" class="dash-tab-content ${activeDashboardTab === 'lending-tab' ? 'active' : ''} glass" style="padding: 1.5rem;">
                <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: #a78bfa;">들어온 대여 신청 목록</h3>
                ${lended.length ? `
                    <div style="overflow-x: auto;">
                        <table class="dash-table">
                            <thead>
                                <tr>
                                    <th>대여 물품</th>
                                    <th>신청자</th>
                                    <th>대여 신청 기간</th>
                                    <th>상태 및 관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${lendedRowsHTML}
                            </tbody>
                        </table>
                    </div>
                ` : emptyHTML('내 물품에 신청된 대여 건이 없습니다.')}
            </div>
        </div>
    `;
}

// --- View 7: Chat Lobby & Active Room thread ---
function ChatView(itemId, otherId) {
    const hasActiveRoom = !isNaN(itemId) && !isNaN(otherId);
    
    let activeRoom = null;
    if (hasActiveRoom) {
        const item = Store.items.find(i => i.id === itemId);
        const otherUser = Store.users.find(u => u.id === otherId);
        
        if (item && otherUser) {
            Store.markMessagesAsRead(itemId, otherId, Store.currentUser.id);
            const messages = Store.getMessages(itemId, Store.currentUser.id, otherId);
            activeRoom = { item, otherUser, messages };
        }
    }

    const rooms = Store.getChatRooms(Store.currentUser.id);

    const roomsHTML = rooms.map(r => {
        const isActive = activeRoom && activeRoom.item.id === r.itemId && activeRoom.otherUser.id === r.otherUserId;
        return `
            <a href="#/chat?item=${r.itemId}&other=${r.otherUserId}" 
               class="chat-room-item ${isActive ? 'active' : ''}">
                <img src="${r.itemImage}" alt="" class="chat-room-img">
                
                <div class="chat-room-info">
                    <div class="chat-room-top">
                        <span class="chat-room-name">${r.otherUserName}</span>
                        <span class="chat-room-time">${r.lastTimestamp ? r.lastTimestamp.substring(11, 16) : ''}</span>
                    </div>
                    <div class="chat-room-bottom">
                        <span class="chat-room-lastmsg">${r.lastMessage}</span>
                        ${r.unreadCount > 0 ? `<span class="chat-unread-badge">${r.unreadCount}</span>` : ''}
                    </div>
                </div>
            </a>
        `;
    }).join('');

    let bubblesHTML = '';
    if (activeRoom) {
        bubblesHTML = activeRoom.messages.map(m => {
            const isSelf = m.senderId === Store.currentUser.id;
            return `
                <div class="chat-bubble-container ${isSelf ? 'self' : 'other'}">
                    <div class="chat-bubble-meta">${isSelf ? '나' : m.senderName}</div>
                    <div class="chat-bubble">${m.message}</div>
                    <div class="chat-bubble-time">
                        ${m.timestamp.substring(11, 16)}
                        ${isSelf ? `<span class="read-receipt" style="color: #a78bfa; margin-left: 4px; font-weight:600;">${m.isRead === 1 ? '읽음' : '1'}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        setTimeout(() => {
            const box = document.getElementById('chatMessagesArea');
            if (box) box.scrollTop = box.scrollHeight;
        }, 50);
    }

    window.triggerBotAutoResponse = () => {
        if (!activeRoom) return;
        const msg = Store.triggerBotReply(itemId, otherId);
        if (msg) {
            App.route();
        }
    };

    window.handleChatSubmit = (e) => {
        e.preventDefault();
        const input = document.getElementById('chatMsgInput');
        const text = input.value.trim();
        if (!text) return;
        
        Store.sendMessage(itemId, otherId, text);
        input.value = '';
        App.route();
    };

    return `
        <div class="glass chat-container" style="box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
            <div class="chat-sidebar">
                <div class="chat-sidebar-header">
                    <h3 style="font-size: 1.15rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="message-square" style="color: #7c3aed; width: 20px;"></i>
                        <span>채팅방 목록</span>
                    </h3>
                </div>
                <div class="chat-room-list">
                    ${rooms.length ? roomsHTML : `
                        <div style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
                            <i data-lucide="message-circle" style="width: 32px; height: 32px; margin-bottom: 0.75rem; opacity: 0.5;"></i>
                            <p style="font-size: 0.85rem;">대화 중인 채팅방이 없습니다.</p>
                        </div>
                    `}
                </div>
            </div>

            <div class="chat-main">
                ${activeRoom ? `
                    <div class="chat-main-header">
                        <div class="chat-main-item-info">
                            <img src="${activeRoom.item.imageUrl}" alt="" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;">
                            <div>
                                <a href="#/item-detail?id=${activeRoom.item.id}" style="color: var(--text-main); font-weight: 600; text-decoration: none; font-size: 0.95rem; display: flex; align-items: center; gap: 0.25rem;">
                                    ${activeRoom.item.title}
                                    <i data-lucide="chevron-right" style="width: 14px;"></i>
                                </a>
                                <div class="chat-main-item-price">
                                    ${activeRoom.item.pricePerDay.toLocaleString()}원 / 일 &middot; 대화 상대: <strong>${activeRoom.otherUser.name}</strong>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-secondary btn-sm" onclick="triggerBotAutoResponse()">
                            <i data-lucide="cpu" style="width: 12px;"></i>
                            <span>상대방 자동 응답 유도</span>
                        </button>
                    </div>

                    <div class="chat-messages-area" id="chatMessagesArea">
                        ${bubblesHTML}
                    </div>

                    <div class="chat-input-area">
                        <form class="chat-input-form" onsubmit="handleChatSubmit(event)">
                            <input type="text" id="chatMsgInput" class="form-control" placeholder="메시지를 입력하세요..." required autocomplete="off">
                            <button type="submit" class="btn btn-primary" style="padding: 0 1.5rem; flex-shrink: 0;">
                                <i data-lucide="send" style="width: 18px;"></i>
                            </button>
                        </form>
                    </div>
                ` : `
                    <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: var(--text-muted); padding: 3rem;">
                        <div style="background: rgba(124, 58, 237, 0.05); border: 1px solid var(--border-glow); padding: 2rem; border-radius: 999px; margin-bottom: 1.5rem;">
                            <i data-lucide="message-square" style="width: 64px; height: 64px; color: #a78bfa;"></i>
                        </div>
                        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-main); font-weight: 700;">
                            선택된 대화방이 없습니다
                        </h3>
                        <p style="font-size: 0.95rem; max-width: 400px; line-height: 1.6; margin-bottom: 1.5rem;">
                            왼쪽 목록에서 활성화된 대화방을 선택하거나, 물품 목록 상세 페이지에서 대여 소유자에게 **'채팅 문의'**를 보내 대화를 시작해 보세요.
                        </p>
                        <div style="padding: 1rem; border-radius: 12px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-light); font-size: 0.8rem; text-align: left; max-width: 450px;">
                            <span style="font-weight:600; color:#a78bfa; display:flex; align-items:center; gap:0.25rem; margin-bottom:0.25rem;">
                                <i data-lucide="help-circle" style="width: 14px;"></i>
                                <span>다중 사용자 채팅 테스트 방법:</span>
                            </span>
                            우측 상단 <strong>계정 이름(예: 민정준)</strong>을 클릭해 **다른 계정(예: 김철수)**으로 전환하면, 본인이 보낸 메시지를 상대방 시점에서 수신하고 대화에 답장하는 흐름을 쉽게 검증할 수 있습니다.
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
}


// ==========================================================================
// 4. App Launch
// ==========================================================================

App.init();
App.route();
