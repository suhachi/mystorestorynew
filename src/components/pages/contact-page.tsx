/**
 * Contact Page Component
 * 문의 페이지
 */

import { Building2, Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: 실제 API 연동
    console.log('문의 내용:', formData);

    toast.success('문의가 접수되었습니다', {
      description: '영업일 기준 1-2일 내에 답변드리겠습니다.',
    });

    // 폼 초기화
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">문의하기</h1>
          <p className="text-xl text-gray-600">
            궁금하신 점이 있으시면 언제든지 문의해주세요.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* 연락처 정보 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>연락처</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 전화 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">고객센터</h3>
                    <a
                      href="tel:010-2068-4732"
                      className="text-blue-600 hover:underline"
                    >
                      010-2068-4732
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      평일 09:00 - 17:00
                    </p>
                    <p className="text-sm text-gray-500">
                      주말/공휴일 휴무 (긴급지원센터 운영)
                    </p>
                  </div>
                </div>

                {/* 이메일 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">이메일</h3>
                    <a
                      href="mailto:suhachi02@gmail.com"
                      className="text-blue-600 hover:underline break-all"
                    >
                      suhachi02@gmail.com
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      영업일 기준 1-2일 내 답변
                    </p>
                  </div>
                </div>

                {/* 주소 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">본사 주소</h3>
                    <p className="text-gray-700">
                      경남 양산시 물금읍 범어리 2699-9 202호
                    </p>
                    <a
                      href="https://map.naver.com/v5/search/경남%20양산시%20물금읍%20범어리%202699-9%20202호"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                    >
                      지도에서 보기 →
                    </a>
                  </div>
                </div>

                {/* 운영시간 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">운영시간</h3>
                    <p className="text-gray-700">평일 09:00 - 17:00</p>
                    <p className="text-sm text-gray-500 mt-1">
                      주말 및 공휴일 휴무
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      * 긴급지원센터는 24시간 운영
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 사업자 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  사업자 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  <div className="flex">
                    <dt className="w-32 text-gray-600">회사명</dt>
                    <dd className="text-gray-900">KS컴퍼니</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 text-gray-600">대표자</dt>
                    <dd className="text-gray-900">석경선, 배종수</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 text-gray-600">사업자등록번호</dt>
                    <dd className="text-gray-900">553-17-00098</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 text-gray-600">설립일</dt>
                    <dd className="text-gray-900">2015년 06월 10일</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 text-gray-600">웹사이트</dt>
                    <dd>
                      <a
                        href="https://kscompany.store"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        kscompany.store
                      </a>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          {/* 문의 폼 */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>온라인 문의</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm mb-2">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="홍길동"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm mb-2">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm mb-2">
                      연락처
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="010-1234-5678"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm mb-2">
                      제목 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="문의 제목을 입력하세요"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm mb-2">
                      문의 내용 <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="문의하실 내용을 자세히 적어주세요"
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    문의 보내기
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    보내주신 문의는 영업일 기준 1-2일 내에 답변드립니다.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* 안내 메시지 */}
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>빠른 상담을 원하시나요?</strong>
                  <br />
                  전화 상담이 더 빠를 수 있습니다.
                  <br />
                  고객센터: <a href="tel:010-2068-4732" className="underline">010-2068-4732</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl mb-6">자주 묻는 질문</h2>
          <p className="text-gray-600 mb-4">
            궁금하신 내용은 FAQ에서 먼저 확인해보세요.
          </p>
          <a
            href="/support"
            className="text-blue-600 hover:underline"
          >
            FAQ 바로가기 →
          </a>
        </div>
      </div>
    </div>
  );
}
