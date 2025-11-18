/**
 * Global Footer Component
 * 모든 페이지 하단에 표시되는 회사 정보 및 링크
 */

import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export function GlobalFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* 상단 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* 회사 소개 */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl mb-4">MyStoreStory</h3>
            <p className="text-gray-400 text-sm mb-4">
              배달 수수료 없는 자체 배달앱 구축 플랫폼
            </p>
            <p className="text-gray-400 text-sm">
              노코드로 쉽고 빠르게 나만의 배달앱을 만들어보세요.
            </p>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="mb-4">서비스</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/features" className="hover:text-white transition-colors">
                  기능 소개
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-white transition-colors">
                  요금제
                </a>
              </li>
              <li>
                <a href="/demo" className="hover:text-white transition-colors">
                  데모 체험
                </a>
              </li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h4 className="mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/support" className="hover:text-white transition-colors">
                  고객센터
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  문의하기
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  회사 소개
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-800 my-8" />

        {/* 회사 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 연락처 */}
          <div className="space-y-3">
            <h4 className="mb-4">연락처</h4>
            
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <div>
                <a href="tel:010-2068-4732" className="hover:text-white transition-colors">
                  010-2068-4732
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <div>
                <a href="mailto:suhachi02@gmail.com" className="hover:text-white transition-colors">
                  suhachi02@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-400">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                경남 양산시 물금읍 범어리 2699-9 202호
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-400">
              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p>평일 09:00 ~ 17:00</p>
                <p className="text-xs text-gray-500 mt-1">
                  주말/공휴일 휴무 (긴급지원센터 운영)
                </p>
              </div>
            </div>
          </div>

          {/* 사업자 정보 */}
          <div>
            <h4 className="mb-4">사업자 정보</h4>
            <dl className="space-y-2 text-sm text-gray-400">
              <div className="flex">
                <dt className="w-32 text-gray-500">회사명</dt>
                <dd>KS컴퍼니</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500">대표자</dt>
                <dd>석경선, 배종수</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500">사업자등록번호</dt>
                <dd>553-17-00098</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500">설립일</dt>
                <dd>2015년 06월 10일</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500">웹사이트</dt>
                <dd>
                  <a 
                    href="https://kscompany.store" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    kscompany.store
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-800 my-8" />

        {/* 하단 정보 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          {/* 법적 문서 링크 */}
          <div className="flex flex-wrap gap-4 text-gray-400">
            <a href="/terms" className="hover:text-white transition-colors">
              이용약관
            </a>
            <a href="/privacy" className="hover:text-white transition-colors">
              개인정보처리방침
            </a>
            <a href="/business-info" className="hover:text-white transition-colors">
              사업자정보확인
            </a>
          </div>

          {/* 저작권 */}
          <div className="text-gray-500">
            © 2024 KS컴퍼니. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
