import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategorySelect } from '@/components/categories/CategorySelect';

describe('CategorySelect', () => {
  it('should render select element', async () => {
    const onChange = vi.fn();
    render(<CategorySelect value="" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    const onChange = vi.fn();
    render(<CategorySelect value="" onChange={onChange} />);
    
    expect(screen.getByText('Loading categories...')).toBeInTheDocument();
  });

  it('should display categories after loading', async () => {
    const onChange = vi.fn();
    render(<CategorySelect value="" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading categories...')).not.toBeInTheDocument();
    });
    
    // Should have at least one category option
    const options = await screen.findAllByRole('option');
    expect(options.length).toBeGreaterThan(1); // Placeholder + at least 1 category
  });

  it('should call onChange when category is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    
    render(<CategorySelect value="" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Kategoriler yükleniyor...')).not.toBeInTheDocument();
    });
    
    const select = screen.getByRole('combobox');
    const options = await screen.findAllByRole('option');
    
    // Select first non-placeholder option
    if (options.length > 1) {
      const firstOption = options[1] as HTMLOptionElement;
      await user.selectOptions(select, firstOption.value);
      
      expect(onChange).toHaveBeenCalled();
    }
  });

  it('should display selected value', async () => {
    const onChange = vi.fn();
    render(<CategorySelect value="1" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Kategoriler yükleniyor...')).not.toBeInTheDocument();
    });
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('1');
  });

  it('should be disabled when disabled prop is true', async () => {
    const onChange = vi.fn();
    render(<CategorySelect value="" onChange={onChange} disabled />);
    
    await waitFor(() => {
      expect(screen.queryByText('Kategoriler yükleniyor...')).not.toBeInTheDocument();
    });
    
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('should show required attribute when required prop is true', async () => {
    const onChange = vi.fn();
    render(<CategorySelect value="" onChange={onChange} required />);
    
    await waitFor(() => {
      expect(screen.queryByText('Kategoriler yükleniyor...')).not.toBeInTheDocument();
    });
    
    const select = screen.getByRole('combobox');
    expect(select).toBeRequired();
  });

  it('should display placeholder option', async () => {
    const onChange = vi.fn();
    render(<CategorySelect value="" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading categories...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Select a category')).toBeInTheDocument();
  });
});
