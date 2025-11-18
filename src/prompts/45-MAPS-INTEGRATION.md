# 45 - Maps Integration

## 📌 목표
지도 API 통합을 구축합니다. (이미 maps-api-system.tsx 존재)

**결과물**:
- maps-api-system.tsx (이미 존재) - 확인 및 문서화

**총 1개 파일 (확인)**

---

## 🔄 STEP 1: Maps API System 확인

### 프롬프트 템플릿

```
/components/system/maps-api-system.tsx 파일이 이미 존재합니다. 확인하고 문서화합니다.

## 기존 파일 확인

파일 위치: /components/system/maps-api-system.tsx

주요 기능:
- 카카오맵 / 네이버맵 / 구글맵 연동
- 주소 검색 (Geocoding)
- 좌표 → 주소 변환 (Reverse Geocoding)
- 거리 계산
- 배달 가능 지역 확인

## 카카오맵 연동

```typescript
// 1. 카카오맵 스크립트 로드
useEffect(() => {
  const script = document.createElement('script');
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_MAP_KEY}&libraries=services`;
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    console.log('카카오맵 로드 완료');
    initMap();
  };
}, []);

// 2. 지도 초기화
function initMap() {
  const mapContainer = document.getElementById('map');
  const mapOption = {
    center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
    level: 3
  };
  
  const map = new kakao.maps.Map(mapContainer, mapOption);
  
  // 마커 추가
  const markerPosition = new kakao.maps.LatLng(37.5665, 126.9780);
  const marker = new kakao.maps.Marker({
    position: markerPosition
  });
  marker.setMap(map);
}

// 3. 주소 검색
function searchAddress(address: string) {
  const geocoder = new kakao.maps.services.Geocoder();
  
  geocoder.addressSearch(address, (result, status) => {
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      console.log('좌표:', coords);
      return { lat: result[0].y, lng: result[0].x };
    }
  });
}

// 4. 좌표 → 주소 변환
function coord2Address(lat: number, lng: number) {
  const geocoder = new kakao.maps.services.Geocoder();
  
  geocoder.coord2Address(lng, lat, (result, status) => {
    if (status === kakao.maps.services.Status.OK) {
      const address = result[0].address.address_name;
      console.log('주소:', address);
      return address;
    }
  });
}
```

## 네이버맵 연동

```typescript
// 1. 네이버맵 스크립트 로드
<script 
  type="text/javascript" 
  src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NAVER_MAP_CLIENT_ID}`}
/>

// 2. 지도 초기화
function initNaverMap() {
  const map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(37.5665, 126.9780),
    zoom: 15
  });

  // 마커 추가
  const marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(37.5665, 126.9780),
    map: map
  });
}

// 3. 주소 검색 (네이버 Geocoding API)
async function naverGeocode(address: string) {
  const response = await fetch(
    `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`,
    {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_MAP_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': process.env.NAVER_MAP_CLIENT_SECRET
      }
    }
  );

  const data = await response.json();
  
  if (data.addresses && data.addresses.length > 0) {
    const { x, y } = data.addresses[0];
    return { lat: parseFloat(y), lng: parseFloat(x) };
  }
}

// 4. 좌표 → 주소 변환
async function naverReverseGeocode(lat: number, lng: number) {
  const response = await fetch(
    `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lng},${lat}&output=json`,
    {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_MAP_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': process.env.NAVER_MAP_CLIENT_SECRET
      }
    }
  );

  const data = await response.json();
  
  if (data.results && data.results.length > 0) {
    return data.results[0].region.area1.name + ' ' + 
           data.results[0].region.area2.name + ' ' +
           data.results[0].region.area3.name;
  }
}
```

## 거리 계산 (Haversine Formula)

```typescript
function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371; // 지구 반지름 (km)
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance; // km
}

// 사용 예시
const storeCoords = { lat: 37.5665, lng: 126.9780 }; // 가게 위치
const customerCoords = { lat: 37.5700, lng: 126.9850 }; // 고객 위치

const distance = calculateDistance(
  storeCoords.lat,
  storeCoords.lng,
  customerCoords.lat,
  customerCoords.lng
);

console.log(`배달 거리: ${distance.toFixed(2)}km`);

// 배달 가능 여부 확인
const MAX_DELIVERY_DISTANCE = 3; // 3km 이내만 배달
const isDeliverable = distance <= MAX_DELIVERY_DISTANCE;
```

## 배달 범위 표시

```typescript
function drawDeliveryZone(map: any, storeCoords: { lat: number; lng: number }, radius: number) {
  // 카카오맵 원 그리기
  const circle = new kakao.maps.Circle({
    center: new kakao.maps.LatLng(storeCoords.lat, storeCoords.lng),
    radius: radius * 1000, // km to meters
    strokeWeight: 2,
    strokeColor: '#2563EB',
    strokeOpacity: 0.8,
    fillColor: '#2563EB',
    fillOpacity: 0.2
  });
  
  circle.setMap(map);
  
  return circle;
}

// 사용 예시
const deliveryZone = drawDeliveryZone(map, { lat: 37.5665, lng: 126.9780 }, 3); // 3km 반경
```

## 주소 검색 UI

```typescript
function AddressSearchModal({ isOpen, onClose, onSelect }: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: string, coords: { lat: number; lng: number }) => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    
    setIsSearching(true);
    
    try {
      const geocoder = new kakao.maps.services.Geocoder();
      
      geocoder.addressSearch(query, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          setResults(result);
        } else {
          toast.error('주소를 찾을 수 없습니다');
        }
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>주소 검색</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* 검색 */}
          <div className="flex gap-2">
            <Input
              placeholder="주소를 입력하세요 (예: 강남구 테헤란로 123)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? '검색중...' : '검색'}
            </Button>
          </div>

          {/* 검색 결과 */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {results.map((result, index) => (
              <button
                key={index}
                className="w-full text-left p-3 hover:bg-slate-50 rounded border"
                onClick={() => {
                  onSelect(result.address_name, {
                    lat: parseFloat(result.y),
                    lng: parseFloat(result.x)
                  });
                  onClose();
                }}
              >
                <p className="font-medium">{result.address_name}</p>
                {result.road_address && (
                  <p className="text-sm text-slate-600">(도로명) {result.road_address.address_name}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

IMPORTANT:
- 카카오맵 / 네이버맵 API 키 필요
- 주소 → 좌표, 좌표 → 주소 변환
- 배달 거리 계산 (Haversine)
- 배달 범위 시각화
- 주소 검색 UI
```

---

## 📝 핵심 포인트

### 지도 기능
1. **주소 검색**: 사용자가 입력한 주소를 좌표로 변환
2. **현재 위치**: GPS로 현재 위치 가져오기
3. **거리 계산**: 가게-고객 간 거리 계산
4. **배달 범위**: 배달 가능 지역 표시
5. **마커**: 가게/고객 위치 마커

### API 선택
- **카카오맵**: 한국 지도 정확도 높음
- **네이버맵**: 상세한 POI 정보
- **구글맵**: 글로벌 서비스

---

## ✅ 완료 체크리스트

- [ ] maps-api-system.tsx 확인
- [ ] 지도 API 문서화

---

## 📝 다음 단계

**46-SOCIAL-LOGIN.md**로 이동합니다.
