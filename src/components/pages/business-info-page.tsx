/**
 * Business Info Page Component
 * 사업자 정보 확인 페이지 (법적 필수 페이지)
 */

import { Building2, User, Calendar, MapPin, Phone, Mail, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function BusinessInfoPage() {
  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">사업자 정보 확인</h1>
          <p className="text-gray-600">
            통신판매업 신고 및 사업자 정보
          </p>
        </div>

        {/* 사업자 정보 카드 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              사업자 기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 회사명 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <dt className="text-sm text-gray-500 mb-1">회사명</dt>
                <dd className="text-lg">KS컴퍼니</dd>
              </div>
            </div>

            {/* 대표자 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <dt className="text-sm text-gray-500 mb-1">대표자</dt>
                <dd className="text-lg">석경선, 배종수</dd>
                <dd className="text-sm text-gray-600 mt-1">
                  • 석경선 (경영, 운영)
                  <br />
                  • 배종수 (개발, 연구)
                </dd>
              </div>
            </div>

            {/* 사업자등록번호 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <dt className="text-sm text-gray-500 mb-1">사업자등록번호</dt>
                <dd className="text-lg">553-17-00098</dd>
                <dd className="text-sm text-gray-600 mt-1">
                  <a
                    href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=5531700098"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    사업자정보 확인하기 →
                  </a>
                </dd>
              </div>
            </div>

            {/* 설립일 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <dt className="text-sm text-gray-500 mb-1">설립일</dt>
                <dd className="text-lg">2015년 06월 10일</dd>
                <dd className="text-sm text-gray-600 mt-1">
                  사업 경력: 9년 (2015 - 2024)
                </dd>
              </div>
            </div>

            {/* 주소 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <dt className="text-sm text-gray-500 mb-1">본사 소재지</dt>
                <dd className="text-lg">경남 양산시 물금읍 범어리 2699-9 202호</dd>
                <dd className="text-sm text-gray-600 mt-1">
                  <a
                    href="https://map.naver.com/v5/search/경남%20양산시%20물금읍%20범어리%202699-9%20202호"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    지도에서 보기 →
                  </a>
                </dd>
              </div>
            </div>

            {/* 연락처 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <dt className="text-sm text-gray-500 mb-1">연락처</dt>
                <dd className="text-lg">
                  <a href="tel:010-2068-4732" className="text-blue-600 hover:underline">
                    010-2068-4732
                  </a>
                </dd>
                <dd className="text-sm text-gray-600 mt-1">
                  평일 09:00 - 17:00 (주말/공휴일 휴무)
                </dd>
              </div>
            </div>

            {/* 이메일 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <dt className="text-sm text-gray-500 mb-1">이메일</dt>
                <dd className="text-lg">
                  <a
                    href="mailto:suhachi02@gmail.com"
                    className="text-blue-600 hover:underline break-all"
                  >
                    suhachi02@gmail.com
                  </a>
                </dd>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 사업 정보 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>사업 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500 mb-1">업태</dt>
                <dd>IT 서비스업, 소프트웨어 개발</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 mb-1">종목</dt>
                <dd>웹/모바일 애플리케이션 개발, SaaS 플랫폼, IT 컨설팅</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 mb-1">주요 서비스</dt>
                <dd>
                  MyStoreStory - 노코드 배달앱 구축 플랫폼
                  <br />
                  <span className="text-sm text-gray-600">
                    소상공인을 위한 배달 수수료 없는 자체 배달앱 제작 서비스
                  </span>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* 통신판매업 신고 정보 (필요 시) */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">통신판매업 신고</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800">
              해당 사업자는 전자상거래 등에서의 소비자보호에 관한 법률에 따라
              통신판매업 신고를 진행 예정입니다.
            </p>
            <p className="text-sm text-blue-600 mt-2">
              * 통신판매업 신고번호는 서비스 정식 오픈 시 공개됩니다.
            </p>
          </CardContent>
        </Card>

        {/* 법적 안내 */}
        <Card>
          <CardHeader>
            <CardTitle>법적 안내</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <p>
              본 정보는 전자상거래 등에서의 소비자보호에 관한 법률 및
              통신판매에 관한 법률에 따라 제공되는 사업자 정보입니다.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2">
                <strong>소비자 피해 보상 및 분쟁 처리</strong>
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>고객센터: 010-2068-4732</li>
                <li>이메일: suhachi02@gmail.com</li>
                <li>한국소비자원: 국번없이 1372 (www.ccn.go.kr)</li>
                <li>공정거래위원회: www.ftc.go.kr</li>
              </ul>
            </div>
            <p>
              위 정보에 대한 문의사항이 있으시면 언제든지 고객센터로 연락주시기 바랍니다.
            </p>
          </CardContent>
        </Card>

        {/* 링크 */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-600">더 자세한 정보가 필요하신가요?</p>
          <div className="flex justify-center gap-4">
            <a href="/about" className="text-blue-600 hover:underline">
              회사 소개
            </a>
            <a href="/contact" className="text-blue-600 hover:underline">
              문의하기
            </a>
            <a href="/terms" className="text-blue-600 hover:underline">
              이용약관
            </a>
            <a href="/privacy" className="text-blue-600 hover:underline">
              개인정보처리방침
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
