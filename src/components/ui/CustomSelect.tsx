// components/ui/CustomSelect.tsx

import { forwardRef, useState, useRef, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X, AlertCircle, Search, Loader2 } from 'lucide-react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

/**
 * TYPE DEFINITIONS
 */

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
  group?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: { message?: string };
  disabled?: boolean;
  loading?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  name?: string;
  id?: string;
  className?: string;
  maxHeight?: number;
  emptyMessage?: string;
  renderOption?: (option: SelectOption) => React.ReactNode;
  renderValue?: (option: SelectOption | SelectOption[]) => React.ReactNode;
}

/**
 * MAIN COMPONENT
 */

const CustomSelect = forwardRef<HTMLButtonElement, CustomSelectProps>(
  (
    {
      options,
      value,
      onChange,
      onBlur,
      placeholder = 'Select an option',
      error,
      disabled = false,
      loading = false,
      multiple = false,
      searchable = false,
      clearable = true,
      name,
      id,
      className = '',
      maxHeight = 300,
      emptyMessage = 'No options found',
      renderValue,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Close on an outside click
    useOnClickOutside(containerRef, () => {
      setIsOpen(false);
      setSearchQuery('');
    });

    // Filter options based on search
    const filteredOptions = searchable
      ? options.filter(
          option =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            option.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

    // Group options if groups are defined
    const groupedOptions = filteredOptions.reduce(
      (acc, option) => {
        const group = option.group || 'default';
        if (!acc[group]) acc[group] = [];
        acc[group].push(option);
        return acc;
      },
      {} as Record<string, SelectOption[]>
    );

    // Get selected option(s)
    const getSelectedOptions = (): SelectOption[] => {
      if (!value) return [];
      if (multiple) {
        return options.filter(opt => (value as string[]).includes(opt.value));
      }
      const selected = options.find(opt => opt.value === value);
      return selected ? [selected] : [];
    };

    const selectedOptions = getSelectedOptions();

    // Handle selection
    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;

      if (multiple) {
        const currentValues = (value as string[]) || [];
        const newValues = currentValues.includes(option.value)
          ? currentValues.filter(v => v !== option.value)
          : [...currentValues, option.value];
        onChange(newValues);
      } else {
        onChange(option.value);
        setIsOpen(false);
      }
      setSearchQuery('');
    };

    // Handle clear
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(multiple ? [] : '');
    };

    // Keyboard navigation
    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setHighlightedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
            break;
          case 'ArrowUp':
            e.preventDefault();
            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
            break;
          case 'Enter':
            e.preventDefault();
            if (filteredOptions[highlightedIndex]) {
              handleSelect(filteredOptions[highlightedIndex]);
            }
            break;
          case 'Escape':
            e.preventDefault();
            setIsOpen(false);
            setSearchQuery('');
            break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, highlightedIndex, filteredOptions]);

    // Focus search input when opened
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    // Reset highlighted index when search changes
    useEffect(() => {
      setHighlightedIndex(0);
    }, [searchQuery]);

    return (
      <div ref={containerRef} className={`relative ${className}`}>
        {/* Hidden input for form libraries */}
        <input
          type='hidden'
          name={name}
          value={multiple ? JSON.stringify(value || []) : value || ''}
        />

        {/* Select Button */}
        <button
          ref={ref}
          id={id}
          type='button'
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onBlur={onBlur}
          disabled={disabled}
          className={`flex w-full items-center justify-between rounded-lg border bg-gray-900 px-4 py-3 transition-all duration-200 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${isOpen ? 'border-purple-500 ring-2 ring-purple-500' : ''} ${error ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'} ${!disabled && !error ? 'hover:bg-gray-800' : ''} `}
          aria-haspopup='listbox'
          aria-expanded={isOpen}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          <div className='flex min-w-0 flex-1 items-center'>
            {loading ? (
              <div className='flex items-center space-x-2'>
                <Loader2 className='h-4 w-4 animate-spin text-gray-400' />
                <span className='text-gray-400'>Loading...</span>
              </div>
            ) : selectedOptions.length > 0 ? (
              renderValue && selectedOptions[0] ? (
                renderValue(multiple ? selectedOptions : selectedOptions[0])
              ) : (
                <div className='flex items-center space-x-2'>
                  {multiple ? (
                    <div className='flex flex-wrap gap-1'>
                      {selectedOptions.map(opt => (
                        <span
                          key={opt.value}
                          className='rounded bg-purple-500/20 px-2 py-1 text-sm text-purple-400'
                        >
                          {opt.label}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <>
                      {selectedOptions[0]?.icon && (
                        <span className='text-gray-400'>{selectedOptions[0].icon}</span>
                      )}
                      <span className='truncate text-white'>{selectedOptions[0]?.label}</span>
                    </>
                  )}
                </div>
              )
            ) : (
              <span className='text-gray-400'>{placeholder}</span>
            )}
          </div>

          <div className='ml-2 flex items-center space-x-2'>
            {clearable && selectedOptions.length > 0 && !disabled && (
              <button
                type='button'
                onClick={handleClear}
                className='rounded p-1 transition-colors hover:bg-gray-700'
                aria-label='Clear selection'
              >
                <X className='h-4 w-4 text-gray-400' />
              </button>
            )}
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} `}
            />
          </div>
        </button>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              id={`${id}-error`}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className='mt-1 flex items-center space-x-1 text-sm text-red-400'
            >
              <AlertCircle className='h-3 w-3' />
              <span>{error.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className='absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-xl'
              style={{ maxHeight }}
            >
              {/* Search Input */}
              {searchable && (
                <div className='border-b border-gray-800 p-2'>
                  <div className='relative'>
                    <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
                    <input
                      ref={searchInputRef}
                      type='text'
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder='Search options...'
                      className='w-full rounded border border-gray-700 bg-gray-800 py-2 pr-3 pl-9 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none'
                      onClick={e => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div
                className='overflow-y-auto'
                style={{ maxHeight: maxHeight - (searchable ? 60 : 0) }}
              >
                {filteredOptions.length === 0 ? (
                  <div className='px-4 py-8 text-center text-gray-500'>{emptyMessage}</div>
                ) : (
                  <div className='py-1'>
                    {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                      <div key={group}>
                        {group !== 'default' && (
                          <div className='px-4 py-2 text-xs font-semibold text-gray-500 uppercase'>
                            {group}
                          </div>
                        )}
                        {groupOptions.map((option, index) => {
                          const isSelected = multiple
                            ? (value as string[])?.includes(option.value)
                            : value === option.value;
                          const isHighlighted = filteredOptions[highlightedIndex] === option;

                          return (
                            <button
                              key={option.value}
                              type='button'
                              onClick={() => handleSelect(option)}
                              disabled={option.disabled}
                              className={`flex w-full items-center justify-between px-4 py-2 transition-colors duration-150 ${option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${isHighlighted ? 'bg-gray-800' : ''} ${!option.disabled && !isHighlighted ? 'hover:bg-gray-800' : ''} `}
                              role='option'
                              aria-selected={isSelected}
                              aria-disabled={option.disabled}
                            >
                              <div className='flex min-w-0 flex-1 items-center space-x-3'>
                                {option.icon && (
                                  <span className='flex-shrink-0 text-gray-400'>{option.icon}</span>
                                )}
                                <div className='flex-1 text-left'>
                                  <div
                                    className={`text-sm ${isSelected ? 'text-purple-400' : 'text-white'}`}
                                  >
                                    {option.label}
                                  </div>
                                  {option.description && (
                                    <div className='mt-1 text-xs text-gray-500'>
                                      {option.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {isSelected && (
                                <Check className='ml-2 h-4 w-4 flex-shrink-0 text-purple-400' />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;

/**
 * USAGE EXAMPLES
 */

// Example 1: Basic Usage with react-hook-form
/*
import { useForm, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';

const projectOptions: SelectOption[] = [
  { value: 'mobile-app', label: 'Mobile App', icon: '📱', description: 'iOS & Android development' },
  { value: 'web-app', label: 'Web Application', icon: '🌐', description: 'Modern web development' },
  { value: 'full-stack', label: 'Full Stack', icon: '🚀', description: 'Complete solution' },
  { value: 'consulting', label: 'Consulting', icon: '💼', description: 'Technical consultation' },
];

function ContactForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="projectType"
        control={control}
        render={({ field, fieldState }) => (
          <CustomSelect
            {...field}
            options={projectOptions}
            placeholder="Select project type"
            error={fieldState.error}
            searchable
            clearable
          />
        )}
      />
    </form>
  );
}
*/

// Example 2: Multi-select with groups
/*
const techStackOptions: SelectOption[] = [
  // Frontend
  { value: 'react', label: 'React', group: 'Frontend' },
  { value: 'vue', label: 'Vue.js', group: 'Frontend' },
  { value: 'angular', label: 'Angular', group: 'Frontend' },

  // Backend
  { value: 'node', label: 'Node.js', group: 'Backend' },
  { value: 'python', label: 'Python', group: 'Backend' },
  { value: 'ruby', label: 'Ruby', group: 'Backend' },

  // Database
  { value: 'postgres', label: 'PostgreSQL', group: 'Database' },
  { value: 'mongo', label: 'MongoDB', group: 'Database' },
  { value: 'redis', label: 'Redis', group: 'Database' },
];

<Controller
  name="techStack"
  control={control}
  render={({ field, fieldState }) => (
    <CustomSelect
      {...field}
      options={techStackOptions}
      placeholder="Select technologies"
      error={fieldState.error}
      multiple
      searchable
      maxHeight={400}
    />
  )}
/>
*/

// Example 3: Custom rendering
/*
const userOptions: SelectOption[] = [
  {
    value: 'user1',
    label: 'John Doe',
    description: 'john@example.com',
    icon: <img src="/avatars/john.jpg" className="w-6 h-6 rounded-full" />
  },
  // ... more users
];

<CustomSelect
  options={userOptions}
  renderValue={(option) => (
    <div className="flex items-center space-x-2">
      {option.icon}
      <div>
        <div className="text-sm font-medium">{option.label}</div>
        <div className="text-xs text-gray-500">{option.description}</div>
      </div>
    </div>
  )}
  renderOption={(option) => (
    <div className="flex items-center space-x-3">
      {option.icon}
      <div>
        <div className="font-medium">{option.label}</div>
        <div className="text-xs text-gray-400">{option.description}</div>
      </div>
    </div>
  )}
/>
*/

// Example 4: Async loading
/*
function AsyncSelect() {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchOptions().then(data => {
      setOptions(data);
      setLoading(false);
    });
  }, []);

  return (
    <CustomSelect
      options={options}
      loading={loading}
      placeholder="Select an option"
      searchable
    />
  );
}
*/
