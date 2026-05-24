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
    const cities = [
        { name: '서울', timeZone: 'Asia/Seoul' },
        { name: '뉴욕', timeZone: 'America/New_York' },
        { name: '런던', timeZone: 'Europe/London' },
        { name: '파리', timeZone: 'Europe/Paris' },
        { name: '도쿄', timeZone: 'Asia/Tokyo' }
    ];

    const container = document.getElementById('world-clock-container');
    const clockElements = [];

    // Create clock elements once
    cities.forEach(city => {
        const clockContainer = document.createElement('div');
        clockContainer.className = 'clock-container';

        const cityName = document.createElement('h2');
        cityName.textContent = city.name;

        const clockDiv = document.createElement('div');
        clockDiv.className = 'clock';
        clockDiv.innerHTML = `
            <div class="clock-face">
                <div class="hand hour-hand"></div>
                <div class="hand min-hand"></div>
                <div class="hand second-hand"></div>
                <div class="center-dot"></div>
            </div>
        `;

        const dateDiv = document.createElement('div');
        dateDiv.className = 'date';

        clockContainer.appendChild(cityName);
        clockContainer.appendChild(clockDiv);
        clockContainer.appendChild(dateDiv);

        container.appendChild(clockContainer);

        clockElements.push({
            city,
            hourHand: clockDiv.querySelector('.hour-hand'),
            minHand: clockDiv.querySelector('.min-hand'),
            secondHand: clockDiv.querySelector('.second-hand'),
            dateDiv
        });
    });

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

    setInterval(setDate, 1000);
    setDate();
});