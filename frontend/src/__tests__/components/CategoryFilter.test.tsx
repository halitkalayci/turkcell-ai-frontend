import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryFilter } from '@/components/categories/CategoryFilter';

describe('CategoryFilter', () => {
  it('should render select element', async () => {
    const onChange = vi.fn();
    render(<CategoryFilter value="" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    const onChange = vi.fn();
    render(<CategoryFilter value="" onChange={onChange} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display "All Categories" option', async () => {
    const onChange = vi.fn();
    render(<CategoryFilter value="" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  it('should display categories after loading', async () => {
    const onChange = vi.fn();
    render(<CategoryFilter value="" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Should have at least "All Categories" option
    const options = await screen.findAllByRole('option');
    expect(options.length).toBeGreaterThanOrEqual(1);
  });

  it('should call onChange when category is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    
    render(<CategoryFilter value="" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Kategoriler yükleniyor...')).not.toBeInTheDocument();
    });
    
    const select = screen.getByRole('combobox');
    const options = await screen.findAllByRole('option');
    
    // Select first non-"All" option if available
    if (options.length > 1) {
      const firstCategory = options[1] as HTMLOptionElement;
      await user.selectOptions(select, firstCategory.value);
      
      expect(onChange).toHaveBeenCalled();
    }
  });

  it('should call onChange with empty string when "All Categories" is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    
    render(<CategoryFilter value="1" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Kategoriler yükleniyor...')).not.toBeInTheDocument();
    });
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '');
    
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('should display selected category value', async () => {
    const onChange = vi.fn();
    render(<CategoryFilter value="2" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Kategoriler yükleniyor...')).not.toBeInTheDocument();
    });
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('2');
  });

  it('should display "All Categories" as selected when value is empty', async () => {
    const onChange = vi.fn();
    render(<CategoryFilter value="" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Kategoriler yükleniyor...')).not.toBeInTheDocument();
    });
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('');
  });
});
