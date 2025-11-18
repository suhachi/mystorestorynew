import React from 'react';
import { AppBuilderLegacyPage } from './app-builder-legacy-page';
import { useAppBuilder } from '../system/data-context';

interface AppBuilderPageProps {
  type: 'app-builder' | 'app-builder-demo';
}

export function AppBuilderPage({ type }: AppBuilderPageProps) {
  const { data } = useAppBuilder();
  
  // 항상 레거시 3단 레이아웃 방식 사용
  return <AppBuilderLegacyPage />;
}