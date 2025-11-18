import React, { useState } from 'react';
import { Search, Filter, ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowSelect?: (row: any) => void;
  onRowAction?: (action: string, row: any) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function DataTable({
  columns,
  data,
  searchable = true,
  filterable = false,
  sortable = true,
  selectable = false,
  pagination = true,
  pageSize = 10,
  onRowSelect,
  onRowAction,
  searchPlaceholder = "검색...",
  emptyMessage = "데이터가 없습니다"
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // 필터링
  const filteredData = data.filter(row => {
    const matchesSearch = searchable ? 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      ) : true;
    
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value || value === '전체') return true;
      return String(row[key]) === value;
    });

    return matchesSearch && matchesFilters;
  });

  // 정렬
  const sortedData = sortColumn ? [...filteredData].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }) : filteredData;

  // 페이지네이션
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = pagination ? 
    sortedData.slice(startIndex, startIndex + pageSize) : sortedData;

  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleSelectRow = (row: any) => {
    if (!selectable) return;
    
    const isSelected = selectedRows.some(selected => selected.id === row.id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter(selected => selected.id !== row.id));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...paginatedData]);
    }
  };

  const getUniqueValues = (columnKey: string) => {
    const values = [...new Set(data.map(row => String(row[columnKey])))];
    return values.filter(Boolean);
  };

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 영역 */}
      {(searchable || filterable) && (
        <div className="flex flex-col md:flex-row gap-4">
          {searchable && (
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}
          
          {filterable && (
            <div className="flex gap-2">
              {columns
                .filter(column => column.filterable)
                .map(column => (
                  <Select
                    key={column.key}
                    value={filters[column.key] || '전체'}
                    onValueChange={(value) => setFilters({...filters, [column.key]: value})}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="전체">전체</SelectItem>
                      {getUniqueValues(column.key).map(value => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
            </div>
          )}
        </div>
      )}

      {/* 선택된 행 정보 */}
      {selectable && selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-600">
            {selectedRows.length}개 항목이 선택되었습니다
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              일괄 처리
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setSelectedRows([])}
            >
              선택 해제
            </Button>
          </div>
        </div>
      )}

      {/* 테이블 */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="w-12 p-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
              )}
              {columns.map(column => (
                <th 
                  key={column.key}
                  className={`text-left p-3 font-medium text-gray-900 ${
                    column.sortable && sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.width || ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`w-3 h-3 ${
                            sortColumn === column.key && sortDirection === 'asc' 
                              ? 'text-blue-600' : 'text-gray-400'
                          }`} 
                        />
                        <ChevronDown 
                          className={`w-3 h-3 ${
                            sortColumn === column.key && sortDirection === 'desc' 
                              ? 'text-blue-600' : 'text-gray-400'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-16 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0) + 1} 
                  className="text-center p-8 text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr 
                  key={row.id || index}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => onRowSelect?.(row)}
                >
                  {selectable && (
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.some(selected => selected.id === row.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(row);
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                  )}
                  {columns.map(column => (
                    <td key={column.key} className="p-3">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowAction?.('menu', row);
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            총 {sortedData.length}개 중 {startIndex + 1}-{Math.min(startIndex + pageSize, sortedData.length)}개 표시
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              이전
            </Button>
            
            {/* 페이지 번호 */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              다음
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// 특정 용도별 테이블 컴포넌트들
interface UserTableProps {
  users: any[];
  onUserSelect?: (user: any) => void;
  onUserAction?: (action: string, user: any) => void;
}

export function UserTable({ users, onUserSelect, onUserAction }: UserTableProps) {
  const columns: Column[] = [
    {
      key: 'name',
      header: '사용자',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={value}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      header: '유형',
      filterable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === '사장님' ? 'bg-blue-100 text-blue-800' :
          value === '이용자' ? 'bg-green-100 text-green-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      header: '상태',
      filterable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === '활성' ? 'bg-green-100 text-green-800' :
          value === '승인대기' ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'joinDate',
      header: '가입일',
      sortable: true
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      searchPlaceholder="사용자 검색..."
      onRowSelect={onUserSelect}
      onRowAction={onUserAction}
      selectable
    />
  );
}