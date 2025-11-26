import {
  ArrowRight,
  Book,
  ChevronDown, ChevronUp,
  Clock,
  FileText,
  Headphones,
  HelpCircle,
  Mail,
  MessageSquare, Phone,
  Search,
  Send,
  Users
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { InteractiveButton } from '../interactions/interactive-button';
import { useNavigation } from '../system/app-router';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export function SupportPage() {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    category: '일반 문의'
  });

  const faqCategories = ['전체', '시작하기', '기능 사용법', '결제/요금', '기술 지원', '계정 관리'];

  const faqData = [
    {
      id: 1,
      category: '시작하기',
      question: 'MyStoreStory는 어떤 서비스인가요?',
      answer: 'MyStoreStory는 코딩 없이 누구나 쉽게 상점 앱을 만들 수 있는 노코드 앱빌더입니다. 주문 관리, 결제 시스템, 고객 관리 등 온라인 비즈니스에 필요한 모든 기능을 제공합니다.'
    },
    {
      id: 2,
      category: '시작하기',
      question: '앱을 만드는데 얼마나 걸리나요?',
      answer: '간단한 상점 앱은 약 10-15분 정도면 완성할 수 있습니다. 복잡한 기능을 추가하더라도 대부분 1시간 이내에 완성 가능합니다.'
    },
    {
      id: 3,
      category: '기능 사용법',
      question: '메뉴는 어떻게 추가하나요?',
      answer: '앱빌더에서 "메뉴 관리" 섹션으로 이동하여 "+ 메뉴 추가" 버튼을 클릭하세요. 메뉴 이름, 가격, 설명, 이미지를 입력하면 자동으로 앱에 반영됩니다.'
    },
    {
      id: 4,
      category: '결제/요금',
      question: '무료 체험이 가능한가요?',
      answer: '네, 7일 무료 체험이 가능합니다. 체험 기간 동안 모든 기능을 제한 없이 사용할 수 있으며, 신용카드 등록 없이도 시작할 수 있습니다.'
    },
    {
      id: 5,
      category: '기술 지원',
      question: '앱이 제대로 작동하지 않아요.',
      answer: '기술적 문제가 발생했다면 다음을 확인해주세요: 1) 인터넷 연결 상태, 2) 브라우저 최신 버전 사용, 3) 캐시 및 쿠키 삭제. 그래도 해결되지 않으면 suhachi02@gmail.com으로 문의주세요.'
    },
    {
      id: 6,
      category: '계정 관리',
      question: '계정 정보를 변경하려면 어떻게 하나요?',
      answer: '로그인 후 우측 상단의 프로필 아이콘을 클릭하여 "계정 설정"으로 이동하세요. 이메일, 비밀번호, 개인정보 등을 변경할 수 있습니다.'
    }
  ];

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === '전체' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 API 호출을 통해 문의를 전송
    console.log('Contact form submitted:', contactForm);
    toast.success('문의가 접수되었습니다. 24시간 내에 답변드리겠습니다.');

    // 폼 초기화
    setContactForm({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: '',
      category: '일반 문의'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-heading-1 text-gray-900 mb-6">
            도움이 필요하신가요?
          </h1>
          <p className="text-body-large text-gray-600 mb-8">
            MyStoreStory 사용에 관한 모든 궁금증을 해결해드립니다
          </p>

          {/* 빠른 연락 옵션 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-primary-blue" />
              </div>
              <h3 className="text-heading-4 text-gray-900 mb-2">실시간 채팅</h3>
              <p className="text-body-small text-gray-600 mb-4">
                평일 09:00-17:00 실시간 상담
              </p>
              <InteractiveButton variant="primary" size="sm" className="w-full">
                채팅 시작하기
              </InteractiveButton>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-success-green" />
              </div>
              <h3 className="text-heading-4 text-gray-900 mb-2">전화 상담</h3>
              <p className="text-body-small text-gray-600 mb-4">
                010-2068-4732
              </p>
              <InteractiveButton variant="secondary" size="sm" className="w-full">
                전화 걸기
              </InteractiveButton>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-warning-yellow" />
              </div>
              <h3 className="text-heading-4 text-gray-900 mb-2">이메일 문의</h3>
              <p className="text-body-small text-gray-600 mb-4">
                suhachi02@gmail.com
              </p>
              <InteractiveButton variant="outline" size="sm" className="w-full">
                이메일 보내기
              </InteractiveButton>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-heading-2 text-gray-900 mb-4">자주 묻는 질문</h2>
            <p className="text-body-large text-gray-600">
              가장 많이 문의하시는 내용들을 확인해보세요
            </p>
          </div>

          {/* 검색 및 필터 */}
          <div className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="궁금한 내용을 검색해보세요"
                className="pl-12 pr-4 py-3 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {faqCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category
                      ? 'bg-primary-blue text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ 목록 */}
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded mb-2">
                      {faq.category}
                    </span>
                    <h3 className="text-body font-medium text-gray-900">{faq.question}</h3>
                  </div>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {expandedFaq === faq.id && (
                  <div className="px-6 pb-4 border-t border-gray-100">
                    <p className="text-body text-gray-600 pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-heading-4 text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-body text-gray-600">
                다른 키워드로 검색하거나 아래 문의 양식을 이용해주세요
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-heading-2 text-gray-900 mb-4">문의하기</h2>
            <p className="text-body-large text-gray-600">
              찾으시는 답변이 없으신가요? 직접 문의해주세요
            </p>
          </div>

          <form onSubmit={handleSubmitContact} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 *
                </label>
                <Input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="홍길동"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 *
                </label>
                <Input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  회사명 (선택)
                </label>
                <Input
                  type="text"
                  value={contactForm.company}
                  onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                  placeholder="회사명을 입력해주세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  문의 유형 *
                </label>
                <select
                  required
                  value={contactForm.category}
                  onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                >
                  <option value="일반 문의">일반 문의</option>
                  <option value="기술 지원">기술 지원</option>
                  <option value="결제 문의">결제 문의</option>
                  <option value="기능 요청">기능 요청</option>
                  <option value="파트너십">파트너십</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <Input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="문의 제목을 입력해주세요"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 *
              </label>
              <Textarea
                required
                rows={6}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="문의 내용을 자세히 입력해주세요"
                className="resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <InteractiveButton
                type="submit"
                variant="primary"
                size="md"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                문의 보내기
              </InteractiveButton>

              <InteractiveButton
                type="button"
                variant="outline"
                size="md"
                onClick={() => navigate('home')}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                홈으로 돌아가기
              </InteractiveButton>
            </div>
          </form>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-heading-2 text-gray-900 mb-4">더 많은 도움말</h2>
            <p className="text-body-large text-gray-600">
              MyStoreStory를 더 효과적으로 활용할 수 있는 리소스들
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Book className="w-6 h-6 text-primary-blue" />
              </div>
              <h3 className="text-heading-4 text-gray-900 mb-2">사용자 가이드</h3>
              <p className="text-body-small text-gray-600 mb-4">
                단계별 사용법 가이드
              </p>
              <InteractiveButton variant="outline" size="sm" className="w-full">
                가이드 보기
              </InteractiveButton>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-success-green" />
              </div>
              <h3 className="text-heading-4 text-gray-900 mb-2">커뮤니티</h3>
              <p className="text-body-small text-gray-600 mb-4">
                사용자들과 정보 공유
              </p>
              <InteractiveButton variant="outline" size="sm" className="w-full">
                커뮤니티 가기
              </InteractiveButton>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-heading-4 text-gray-900 mb-2">웨비나</h3>
              <p className="text-body-small text-gray-600 mb-4">
                라이브 교육 세션 참여
              </p>
              <InteractiveButton variant="outline" size="sm" className="w-full">
                웨비나 신청
              </InteractiveButton>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-warning-yellow" />
              </div>
              <h3 className="text-heading-4 text-gray-900 mb-2">API 문서</h3>
              <p className="text-body-small text-gray-600 mb-4">
                개발자를 위한 문서
              </p>
              <InteractiveButton variant="outline" size="sm" className="w-full">
                문서 보기
              </InteractiveButton>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Hours */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
            <Clock className="w-12 h-12 text-primary-blue mx-auto mb-4" />
            <h3 className="text-heading-3 text-gray-900 mb-4">고객지원 운영시간</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="text-body font-medium text-gray-900 mb-2">전화 상담</h4>
                <p className="text-body-small text-gray-600">
                  평일 09:00 - 17:00<br />
                  주말/공휴일 휴무
                </p>
              </div>
              <div>
                <h4 className="text-body font-medium text-gray-900 mb-2">긴급지원센터</h4>
                <p className="text-body-small text-gray-600">
                  평일 09:00 - 17:00<br />
                  긴급 상황 대응
                </p>
              </div>
              <div>
                <h4 className="text-body font-medium text-gray-900 mb-2">이메일 문의</h4>
                <p className="text-body-small text-gray-600">
                  24시간 접수<br />
                  영업일 기준 24시간 내 답변
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
