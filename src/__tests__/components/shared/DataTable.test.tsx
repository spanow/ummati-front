import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DataTable from '../../../components/shared/DataTable';

describe('DataTable', () => {
  const mockData = [
    { id: 1, name: 'John', age: 25 },
    { id: 2, name: 'Jane', age: 30 },
  ];

  const mockColumns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'age', header: 'Age', sortable: true },
  ];

  it('renders table with correct data', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('handles sorting when clicking column headers', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    
    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Jane');
    expect(cells[2]).toHaveTextContent('John');
  });

  it('calls onRowClick when clicking a row', () => {
    const onRowClick = vi.fn();
    render(<DataTable data={mockData} columns={mockColumns} onRowClick={onRowClick} />);
    
    const firstRow = screen.getByText('John').closest('tr');
    fireEvent.click(firstRow!);
    
    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('renders custom cell content using render prop', () => {
    const columnsWithRender = [
      ...mockColumns,
      {
        key: 'name',
        header: 'Custom',
        render: (value: string) => <span>Custom-{value}</span>,
      },
    ];

    render(<DataTable data={mockData} columns={columnsWithRender} />);
    
    expect(screen.getByText('Custom-John')).toBeInTheDocument();
    expect(screen.getByText('Custom-Jane')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    const emptyState = <div>No data available</div>;
    render(<DataTable data={[]} columns={mockColumns} emptyState={emptyState} />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});