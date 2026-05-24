// 전 세계 주요 도시 및 타임존 정보 맵핑
const CITY_DATABASE = [
    { nameKo: '서울', nameEn: 'Seoul', timeZone: 'Asia/Seoul' },
    { nameKo: '도쿄', nameEn: 'Tokyo', timeZone: 'Asia/Tokyo' },
    { nameKo: '베이징', nameEn: 'Beijing', timeZone: 'Asia/Shanghai' },
    { nameKo: '싱가포르', nameEn: 'Singapore', timeZone: 'Asia/Singapore' },
    { nameKo: '방콕', nameEn: 'Bangkok', timeZone: 'Asia/Bangkok' },
    { nameKo: '뉴델리', nameEn: 'New Delhi', timeZone: 'Asia/Kolkata' },
    { nameKo: '두바이', nameEn: 'Dubai', timeZone: 'Asia/Dubai' },
    { nameKo: '모스크바', nameEn: 'Moscow', timeZone: 'Europe/Moscow' },
    { nameKo: '이스탄불', nameEn: 'Istanbul', timeZone: 'Europe/Istanbul' },
    { nameKo: '카이로', nameEn: 'Cairo', timeZone: 'Africa/Cairo' },
    { nameKo: '파리', nameEn: 'Paris', timeZone: 'Europe/Paris' },
    { nameKo: '런던', nameEn: 'London', timeZone: 'Europe/London' },
    { nameKo: '뉴욕', nameEn: 'New York', timeZone: 'America/New_York' },
    { nameKo: '시카고', nameEn: 'Chicago', timeZone: 'America/Chicago' },
    { nameKo: '로스앤젤레스', nameEn: 'Los Angeles', timeZone: 'America/Los_Angeles' },
    { nameKo: '시드니', nameEn: 'Sydney', timeZone: 'Australia/Sydney' },
    { nameKo: '오클랜드', nameEn: 'Auckland', timeZone: 'Pacific/Auckland' },
    { nameKo: '상파울루', nameEn: 'Sao Paulo', timeZone: 'America/Sao_Paulo' },
    { nameKo: '호놀룰루', nameEn: 'Honolulu', timeZone: 'Pacific/Honolulu' }
];

// 로컬 시간 대비 시차 계산
function getTimeDifference(targetTimeZone) {
    try {
        const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (localTimeZone === targetTimeZone) return '홈 타임존';
        
        const now = new Date();
        
        // 각각의 타임존 문자열 생성
        const formatterOpts = { hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        
        const localStr = now.toLocaleString('en-US', { ...formatterOpts, timeZone: localTimeZone });
        const targetStr = now.toLocaleString('en-US', { ...formatterOpts, timeZone: targetTimeZone });
        
        const localDate = new Date(localStr);
        const targetDate = new Date(targetStr);
        
        const diffMs = targetDate - localDate;
        const diffHours = Math.round(diffMs / (1000 * 60 * 60));
        
        if (diffHours === 0) return '동일 시간대';
        return diffHours > 0 ? `서울 대비 +${diffHours}시간` : `서울 대비 ${diffHours}시간`;
    } catch (e) {
        console.error('시차 계산 실패:', e);
        return '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Lucide Icons 초기화
    lucide.createIcons();

    // 초기 활성화된 도시
    const DEFAULT_CITIES = [
        { name: '서울', timeZone: 'Asia/Seoul' },
        { name: '뉴욕', timeZone: 'America/New_York' },
        { name: '런던', timeZone: 'Europe/London' },
        { name: '파리', timeZone: 'Europe/Paris' },
        { name: '도쿄', timeZone: 'Asia/Tokyo' }
    ];

    // 로컬스토리지에서 도시 목록 로드
    let activeCities = JSON.parse(localStorage.getItem('world-clock-cities'));
    if (!activeCities || activeCities.length === 0) {
        activeCities = DEFAULT_CITIES;
        localStorage.setItem('world-clock-cities', JSON.stringify(activeCities));
    }

    const container = document.getElementById('world-clock-container');
    const searchInput = document.getElementById('city-search');
    const searchResults = document.getElementById('search-results');
    let clockElements = [];

    // 시계 엘리먼트 동적 렌더링
    function renderClocks() {
        container.innerHTML = '';
        clockElements = [];

        activeCities.forEach((city, index) => {
            const clockContainer = document.createElement('div');
            clockContainer.className = 'clock-container';
            clockContainer.setAttribute('data-id', index);

            // 삭제 버튼
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i data-lucide="trash-2" style="width:16px;height:16px;"></i>';
            deleteBtn.addEventListener('click', () => deleteCity(index));

            // 카드 헤더
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header';
            const cityName = document.createElement('h2');
            cityName.textContent = city.name;
            const diffBadge = document.createElement('div');
            diffBadge.className = 'time-diff';
            diffBadge.textContent = getTimeDifference(city.timeZone);

            cardHeader.appendChild(cityName);
            cardHeader.appendChild(diffBadge);

            // 아날로그 시계 페이스
            const clockDiv = document.createElement('div');
            clockDiv.className = 'clock';
            clockDiv.innerHTML = `
                <div class="clock-face">
                    <div class="clock-number number-12">12</div>
                    <div class="clock-number number-3">3</div>
                    <div class="clock-number number-6">6</div>
                    <div class="clock-number number-9">9</div>
                    <div class="hand hour-hand"></div>
                    <div class="hand min-hand"></div>
                    <div class="hand second-hand"></div>
                    <div class="center-dot"></div>
                </div>
            `;

            // 아날로그 시계 눈금 동적 추가
            const clockFace = clockDiv.querySelector('.clock-face');
            for (let i = 0; i < 60; i++) {
                if (i % 5 === 0) continue; // 숫자가 있는 주요 지점 제외하고 분 눈금 그리기
                const tick = document.createElement('div');
                tick.className = 'tick tick-minute';
                tick.style.transform = `rotate(${i * 6}deg)`;
                clockFace.appendChild(tick);
            }
            for (let i = 0; i < 12; i++) {
                if (i % 3 === 0) continue; // 12, 3, 6, 9는 숫자로 대체하므로 제외
                const tick = document.createElement('div');
                tick.className = 'tick tick-hour';
                tick.style.transform = `rotate(${i * 30}deg)`;
                clockFace.appendChild(tick);
            }

            // 디지털 및 날짜 출력
            const digitalTime = document.createElement('div');
            digitalTime.className = 'digital-time';
            const dateDiv = document.createElement('div');
            dateDiv.className = 'date';

            clockContainer.appendChild(deleteBtn);
            clockContainer.appendChild(cardHeader);
            clockContainer.appendChild(clockDiv);
            clockContainer.appendChild(digitalTime);
            clockContainer.appendChild(dateDiv);

            container.appendChild(clockContainer);

            clockElements.push({
                city,
                hourHand: clockDiv.querySelector('.hour-hand'),
                minHand: clockDiv.querySelector('.min-hand'),
                secondHand: clockDiv.querySelector('.second-hand'),
                digitalTime,
                dateDiv
            });
        });

        lucide.createIcons(); // 동적으로 추가된 쓰레기통 아이콘 렌더링
    }

    // 도시 추가 로직
    function addCity(city) {
        // 중복 추가 방지
        if (activeCities.some(c => c.timeZone === city.timeZone)) {
            alert('이미 추가된 도시입니다.');
            searchInput.value = '';
            searchResults.classList.add('hidden');
            return;
        }

        activeCities.push({ name: city.nameKo, timeZone: city.timeZone });
        localStorage.setItem('world-clock-cities', JSON.stringify(activeCities));
        renderClocks();
        setDate();
        searchInput.value = '';
        searchResults.classList.add('hidden');
    }

    // 도시 삭제 로직
    function deleteCity(index) {
        activeCities.splice(index, 1);
        localStorage.setItem('world-clock-cities', JSON.stringify(activeCities));
        renderClocks();
        setDate();
    }

    // 도시 검색 입력창 이벤트
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            searchResults.classList.add('hidden');
            return;
        }

        const filtered = CITY_DATABASE.filter(city => 
            city.nameKo.toLowerCase().includes(query) || 
            city.nameEn.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            searchResults.innerHTML = '<li>일치하는 도시가 없습니다.</li>';
        } else {
            searchResults.innerHTML = '';
            filtered.forEach(city => {
                const li = document.createElement('li');
                li.textContent = `${city.nameKo} (${city.nameEn}) - ${city.timeZone}`;
                li.addEventListener('click', () => addCity(city));
                searchResults.appendChild(li);
            });
        }
        searchResults.classList.remove('hidden');
    });

    // 검색창 포커스 아웃 시 닫기
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });

    // 임시 setDate 및 루프 (Task 5에서 업데이트됨)
    function setDate() {
        clockElements.forEach(element => {
            const { city, hourHand, minHand, secondHand, dateDiv } = element;
            const now = new Date(new Date().toLocaleString("en-US", { timeZone: city.timeZone }));

            const seconds = now.getSeconds();
            const secondsDegrees = ((seconds / 60) * 360) + 90;
            secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

            const mins = now.getMinutes();
            const minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
            minHand.style.transform = `rotate(${minsDegrees}deg)`;

            const hour = now.getHours();
            const hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
            hourHand.style.transform = `rotate(${hourDegrees}deg)`;

            const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: city.timeZone };
            dateDiv.textContent = new Intl.DateTimeFormat('ko-KR', dateOptions).format(now);
        });
    }

    renderClocks();
    setInterval(setDate, 1000);
    setDate();
});