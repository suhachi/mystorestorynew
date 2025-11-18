// 이 파일은 popular-menu-analysis.tsx 파일의 끝에 추가할 모달 렌더링 부분입니다.

      {/* 프로모션 생성 모달 */}
      {showPromotionModal && selectedMenuForPromotion && (
        <PromotionModal 
          isOpen={showPromotionModal}
          onClose={() => {
            setShowPromotionModal(false);
            setSelectedMenuForPromotion(null);
          }}
          menu={selectedMenuForPromotion}
        />
      )}

      {/* 메뉴 추가 모달 */}
      {showAddMenuModal && (
        <AddProductModal 
          isOpen={showAddMenuModal}
          onClose={() => setShowAddMenuModal(false)}
        />
      )}

      {/* 리포트 미리보기 모달 */}
      <ReportPreviewModal 
        isOpen={showReportPreview}
        onClose={() => setShowReportPreview(false)}
        period={periodFilter}
        data={sortedMenus}
      />
      
      {/* KPI 모달들 */}
      <TotalMenuModal 
        isOpen={showTotalMenuModal}
        onClose={() => setShowTotalMenuModal(false)}
      />
      
      <TodayOrderModal 
        isOpen={showTotalOrderModal}
        onClose={() => setShowTotalOrderModal(false)}
      />
      
      <SalesDetailModal 
        isOpen={showTotalSalesModal}
        onClose={() => setShowTotalSalesModal(false)}
      />
    </div>
  );
}