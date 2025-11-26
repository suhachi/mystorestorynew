import { ImageIcon, Package, Plus, Save, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Separator } from '../../ui/separator';
import { Switch } from '../../ui/switch';
import { Textarea } from '../../ui/textarea';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function AddProductModal({ isOpen, onClose, children }: AddProductModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    price: '',
    cost: '',
    description: '',
    image: null as File | null,
    isAvailable: true,
    isFeatured: false,
    tags: [] as string[],
    preparation_time: '5',
    nutrition: {
      calories: '',
      fat: '',
      protein: '',
      carbs: ''
    }
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('nutrition.')) {
      const nutritionField = field.replace('nutrition.', '');
      setProductData(prev => ({
        ...prev,
        nutrition: {
          ...prev.nutrition,
          [nutritionField]: value
        }
      }));
    } else {
      setProductData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        toast.error('이미지 파일은 5MB 이하여야 합니다.');
        return;
      }
      setProductData(prev => ({ ...prev, image: file }));
      toast.success('이미지가 업로드되었습니다! 📸');
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag && !productData.tags.includes(tag)) {
      setProductData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleCreateProduct = async () => {
    // 필수 필드 검증
    if (!productData.name || !productData.category || !productData.price) {
      toast.error('상품명, 카테고리, 가격은 필수 입력 항목입니다.');
      return;
    }

    if (parseInt(productData.price) <= 0) {
      toast.error('올바른 가격을 입력해주세요.');
      return;
    }

    setIsCreating(true);

    try {
      // 상품 생성 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`${productData.name} 상품이 성공적으로 등록되었습니다! 🎉`);

      console.log('📦 새 상품 생성:', productData);

      // 폼 리셋
      setProductData({
        name: '',
        category: '',
        price: '',
        cost: '',
        description: '',
        image: null,
        isAvailable: true,
        isFeatured: false,
        tags: [],
        preparation_time: '5',
        nutrition: {
          calories: '',
          fat: '',
          protein: '',
          carbs: ''
        }
      });

      onClose();
    } catch (error) {
      toast.error('상품 등록 중 오류가 발생했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  const popularTags = ['인기', '신메뉴', '베스트', '시즌', '할인', '추천', 'HOT', 'NEW'];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-heading-3">
            <div className="w-10 h-10 rounded-lg bg-primary-blue-50 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary-blue" />
            </div>
            <div>
              <span>새 상품 등록</span>
              <p className="text-body text-gray-600 font-normal mt-1">메뉴에 새로운 상품을 추가하세요</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            고객들에게 제공할 새로운 상품의 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card className="p-6">
            <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-blue" />
              기본 정보
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-body-small font-medium text-gray-700 mb-2 block">
                  상품명 *
                </Label>
                <Input
                  id="name"
                  value={productData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="예: 아메리카노"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-body-small font-medium text-gray-700 mb-2 block">
                  카테고리 *
                </Label>
                <Select
                  value={productData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="커피">커피</SelectItem>
                    <SelectItem value="음료">음료</SelectItem>
                    <SelectItem value="디저트">디저트</SelectItem>
                    <SelectItem value="베이커리">베이커리</SelectItem>
                    <SelectItem value="샐러드">샐러드</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price" className="text-body-small font-medium text-gray-700 mb-2 block">
                  판매가격 (원) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={productData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="4500"
                />
              </div>
              <div>
                <Label htmlFor="cost" className="text-body-small font-medium text-gray-700 mb-2 block">
                  원가 (원)
                </Label>
                <Input
                  id="cost"
                  type="number"
                  value={productData.cost}
                  onChange={(e) => handleInputChange('cost', e.target.value)}
                  placeholder="2000"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="description" className="text-body-small font-medium text-gray-700 mb-2 block">
                상품 설명
              </Label>
              <Textarea
                id="description"
                value={productData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="상품에 대한 자세한 설명을 입력하세요"
                rows={3}
              />
            </div>
          </Card>

          {/* 이미지 업로드 */}
          <Card className="p-6">
            <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary-blue" />
              상품 이미지
            </h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-blue transition-colors">
              {productData.image ? (
                <div className="space-y-4">
                  <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <p className="text-body-small text-gray-600">{productData.image.name}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProductData(prev => ({ ...prev, image: null }))}
                  >
                    <X className="w-4 h-4 mr-2" />
                    이미지 제거
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-body font-medium text-primary-blue hover:text-primary-blue-dark">
                        이미지 업로드
                      </span>
                      <span className="text-body-small text-gray-600"> 또는 드래그하여 추가</span>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-caption text-gray-500">
                    JPG, PNG, GIF 형식, 최대 5MB
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* 추가 설정 */}
          <Card className="p-6">
            <h4 className="text-heading-4 text-gray-900 mb-4">추가 설정</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-body-small font-medium text-gray-700">판매 상태</Label>
                  <p className="text-caption text-gray-500">고객에게 상품을 노출할지 설정</p>
                </div>
                <Switch
                  checked={productData.isAvailable}
                  onCheckedChange={(checked) => handleInputChange('isAvailable', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-body-small font-medium text-gray-700">추천 상품</Label>
                  <p className="text-caption text-gray-500">메인 화면에 추천 상품으로 표시</p>
                </div>
                <Switch
                  checked={productData.isFeatured}
                  onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="preparation_time" className="text-body-small font-medium text-gray-700 mb-2 block">
                  제조 시간 (분)
                </Label>
                <Select
                  value={productData.preparation_time}
                  onValueChange={(value) => handleInputChange('preparation_time', value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5분</SelectItem>
                    <SelectItem value="10">10분</SelectItem>
                    <SelectItem value="15">15분</SelectItem>
                    <SelectItem value="20">20분</SelectItem>
                    <SelectItem value="30">30분</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* 태그 */}
          <Card className="p-6">
            <h4 className="text-heading-4 text-gray-900 mb-4">태그</h4>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {productData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-2" />
                  </Badge>
                ))}
              </div>

              <div>
                <Label className="text-body-small font-medium text-gray-700 mb-2 block">
                  인기 태그 (클릭하여 추가)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className={`px-3 py-1 text-body-small rounded-lg border transition-colors ${productData.tags.includes(tag)
                          ? 'bg-primary-blue text-white border-primary-blue'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* 영양 정보 (선택사항) */}
          <Card className="p-6">
            <h4 className="text-heading-4 text-gray-900 mb-4">영양 정보 (선택사항)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="calories" className="text-body-small font-medium text-gray-700 mb-2 block">
                  칼로리 (kcal)
                </Label>
                <Input
                  id="calories"
                  type="number"
                  value={productData.nutrition.calories}
                  onChange={(e) => handleInputChange('nutrition.calories', e.target.value)}
                  placeholder="250"
                />
              </div>
              <div>
                <Label htmlFor="fat" className="text-body-small font-medium text-gray-700 mb-2 block">
                  지방 (g)
                </Label>
                <Input
                  id="fat"
                  type="number"
                  value={productData.nutrition.fat}
                  onChange={(e) => handleInputChange('nutrition.fat', e.target.value)}
                  placeholder="5.2"
                />
              </div>
              <div>
                <Label htmlFor="protein" className="text-body-small font-medium text-gray-700 mb-2 block">
                  단백질 (g)
                </Label>
                <Input
                  id="protein"
                  type="number"
                  value={productData.nutrition.protein}
                  onChange={(e) => handleInputChange('nutrition.protein', e.target.value)}
                  placeholder="12.5"
                />
              </div>
              <div>
                <Label htmlFor="carbs" className="text-body-small font-medium text-gray-700 mb-2 block">
                  탄수화물 (g)
                </Label>
                <Input
                  id="carbs"
                  type="number"
                  value={productData.nutrition.carbs}
                  onChange={(e) => handleInputChange('nutrition.carbs', e.target.value)}
                  placeholder="35.8"
                />
              </div>
            </div>
          </Card>

          {/* 미리보기 */}
          {productData.name && (
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-primary-blue">
              <h4 className="text-heading-4 text-gray-900 mb-4">상품 미리보기</h4>
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {productData.image ? '🖼️' : '📦'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-body font-medium text-gray-900">{productData.name}</h5>
                      {productData.category && (
                        <Badge variant="outline" className="text-xs">{productData.category}</Badge>
                      )}
                      {productData.isFeatured && (
                        <Badge className="text-xs bg-primary-blue">추천</Badge>
                      )}
                    </div>
                    {productData.description && (
                      <p className="text-body-small text-gray-600 mb-2">{productData.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-body font-medium text-primary-blue">
                        ₩{productData.price ? parseInt(productData.price).toLocaleString() : '0'}
                      </span>
                      <span className="text-caption text-gray-500">
                        {productData.preparation_time}분 소요
                      </span>
                    </div>
                  </div>
                </div>
                {productData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {productData.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <div className="text-body-small text-gray-600">
            * 표시된 항목은 필수 입력 사항입니다
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onClose()} disabled={isCreating}>
              취소
            </Button>
            <Button
              onClick={handleCreateProduct}
              className="bg-primary-blue hover:bg-primary-blue-dark"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  등록 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  상품 등록
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
