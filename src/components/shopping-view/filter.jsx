// src/components/shopping-view/filter.jsx - WITH ACCESSIBILITY IMPROVEMENTS
import { memo, useMemo, useCallback, Fragment, useState } from "react";
import { filterOptions } from "@/config";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Filter, X } from "lucide-react";

// Memoized filter option component with accessibility
const FilterOption = memo(({ option, keyItem, filters, handleFilter }) => {
  const isChecked = useMemo(() => {
    return filters?.[keyItem]?.includes(option.id) || false;
  }, [filters, keyItem, option.id]);

  const handleChange = useCallback(() => {
    handleFilter(keyItem, option.id);
  }, [handleFilter, keyItem, option.id]);

  return (
    <Label
      className="
        flex font-medium items-center gap-3 cursor-pointer 
        hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200
        text-sm sm:text-base
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
      "
      htmlFor={`${keyItem}-${option.id}`}
    >
      <Checkbox
        id={`${keyItem}-${option.id}`}
        checked={isChecked}
        onCheckedChange={handleChange}
        aria-label={`Filter by ${option.label} in ${keyItem} category`}
        aria-describedby={`${keyItem}-${option.id}-desc`}
        className="w-5 h-5"
      />
      <span className="select-none flex-1">{option.label}</span>
      <span id={`${keyItem}-${option.id}-desc`} className="sr-only">
        {isChecked ? "Currently selected" : "Not selected"}
      </span>
    </Label>
  );
});

FilterOption.displayName = "FilterOption";

// Memoized filter category component with accessibility
const FilterCategory = memo(
  ({ keyItem, options, filters, handleFilter, isLast }) => {
    const categoryTitle = useMemo(() => {
      return keyItem.charAt(0).toUpperCase() + keyItem.slice(1);
    }, [keyItem]);

    const selectedCount = useMemo(() => {
      return filters?.[keyItem]?.length || 0;
    }, [filters, keyItem]);

    const filterOptions = useMemo(() => {
      return options.map((option) => (
        <FilterOption
          key={option.id}
          option={option}
          keyItem={keyItem}
          filters={filters}
          handleFilter={handleFilter}
        />
      ));
    }, [options, keyItem, filters, handleFilter]);

    return (
      <Fragment>
        <fieldset className="space-y-4">
          <legend className="text-base sm:text-lg font-bold text-gray-900 border-b pb-2 mb-4">
            {categoryTitle}
            {selectedCount > 0 && (
              <span
                className="ml-2 text-sm font-normal text-blue-600"
                aria-label={`${selectedCount} filters selected in ${categoryTitle}`}
              >
                ({selectedCount} selected)
              </span>
            )}
          </legend>
          <div
            className="space-y-2"
            role="group"
            aria-label={`${categoryTitle} filter options`}
          >
            {filterOptions}
          </div>
        </fieldset>
        {!isLast && <Separator className="my-6" role="separator" />}
      </Fragment>
    );
  }
);

FilterCategory.displayName = "FilterCategory";

// Mobile filter sheet content with accessibility
const MobileFilterContent = memo(
  ({ filters, handleFilter, activeFilterCount, onClearAll }) => {
    const filterCategories = useMemo(() => {
      const categories = Object.keys(filterOptions);

      return categories.map((keyItem, index) => (
        <FilterCategory
          key={keyItem}
          keyItem={keyItem}
          options={filterOptions[keyItem]}
          filters={filters}
          handleFilter={handleFilter}
          isLast={index === categories.length - 1}
        />
      ));
    }, [filters, handleFilter]);

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b bg-gray-50"
          role="banner"
        >
          <h2
            className="text-xl font-bold text-gray-900"
            id="mobile-filter-title"
          >
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2">
              <span
                className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full"
                aria-label={`${activeFilterCount} filters currently active`}
                role="status"
              >
                {activeFilterCount}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                aria-label="Clear all active filters"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Filter Content */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-6"
          role="main"
          aria-labelledby="mobile-filter-title"
        >
          {filterCategories}
        </div>
      </div>
    );
  }
);

MobileFilterContent.displayName = "MobileFilterContent";

// Desktop filter sidebar with accessibility
const DesktopFilter = memo(
  ({ filters, handleFilter, activeFilterCount, onClearAll }) => {
    const filterCategories = useMemo(() => {
      const categories = Object.keys(filterOptions);

      return categories.map((keyItem, index) => (
        <FilterCategory
          key={keyItem}
          keyItem={keyItem}
          options={filterOptions[keyItem]}
          filters={filters}
          handleFilter={handleFilter}
          isLast={index === categories.length - 1}
        />
      ));
    }, [filters, handleFilter]);

    return (
      <aside
        className="bg-background rounded-lg shadow-sm border h-fit sticky top-4"
        role="complementary"
        aria-label="Product filters"
      >
        <div className="p-4 border-b bg-gray-50 rounded-t-lg" role="banner">
          <div className="flex items-center justify-between">
            <h2
              className="text-lg font-extrabold text-gray-900"
              id="desktop-filter-title"
            >
              Filters
            </h2>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <span
                  className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full"
                  aria-label={`${activeFilterCount} filters applied`}
                  role="status"
                >
                  {activeFilterCount}
                </span>
              )}
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs p-1"
                  aria-label="Clear all applied filters"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        <div
          className="p-4 space-y-4 max-h-[80vh] overflow-y-auto"
          role="main"
          aria-labelledby="desktop-filter-title"
        >
          {filterCategories}
        </div>
      </aside>
    );
  }
);

DesktopFilter.displayName = "DesktopFilter";

// Main accessible filter component with mobile support
const ProductFilter = memo(({ filters, handleFilter }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Memoize active filter count
  const activeFilterCount = useMemo(() => {
    if (!filters) return 0;
    return Object.values(filters).reduce((count, filterArray) => {
      return count + (Array.isArray(filterArray) ? filterArray.length : 0);
    }, 0);
  }, [filters]);

  // Clear all filters handler
  const handleClearAll = useCallback(() => {
    Object.keys(filters || {}).forEach((key) => {
      if (filters[key] && Array.isArray(filters[key])) {
        filters[key].forEach((value) => {
          handleFilter(key, value);
        });
      }
    });

    // Announce clearing to screen readers
    const announcement = `All ${activeFilterCount} filters have been cleared`;
    // You could implement a toast notification here or use aria-live region
    console.log(announcement); // Replace with proper announcement mechanism
  }, [filters, handleFilter, activeFilterCount]);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <Sheet
          open={isMobileFilterOpen}
          onOpenChange={setIsMobileFilterOpen}
          aria-label="Mobile filter menu"
        >
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-12"
              aria-label={`Open filters menu. ${activeFilterCount} filters currently active`}
              aria-expanded={isMobileFilterOpen}
              aria-haspopup="dialog"
            >
              <Filter className="w-4 h-4" aria-hidden="true" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span
                  className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full ml-2"
                  aria-hidden="true"
                >
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full max-w-sm p-0"
            aria-label="Filter options"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Product Filters</SheetTitle>
            </SheetHeader>
            <MobileFilterContent
              filters={filters}
              handleFilter={handleFilter}
              activeFilterCount={activeFilterCount}
              onClearAll={handleClearAll}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filter Sidebar */}
      <div className="hidden md:block">
        <DesktopFilter
          filters={filters}
          handleFilter={handleFilter}
          activeFilterCount={activeFilterCount}
          onClearAll={handleClearAll}
        />
      </div>
    </>
  );
});

ProductFilter.displayName = "ProductFilter";

export default ProductFilter;
