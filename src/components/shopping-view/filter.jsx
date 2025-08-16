// src/components/shopping-view/filter.jsx - COMPLETE FIXED VERSION 📱🔧
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

// Memoized filter option component with responsive text
const FilterOption = memo(({ option, keyItem, filters, handleFilter }) => {
  // ✅ FIX 1: Consistent lowercase key usage throughout
  const isChecked = useMemo(() => {
    return filters?.[keyItem]?.includes(option.id) || false;
  }, [filters, keyItem, option.id]);

  const handleChange = useCallback(() => {
    console.log("🎯 Filter option clicked:", {
      keyItem,
      optionId: option.id,
      currentFilters: filters,
    });
    handleFilter(keyItem, option.id);
  }, [handleFilter, keyItem, option.id]);

  return (
    <Label
      className="
        flex items-center gap-2 sm:gap-3 cursor-pointer 
        hover:bg-gray-50 p-2 sm:p-3 rounded-lg 
        transition-colors duration-200
        text-xs sm:text-sm md:text-base
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
        min-h-[40px] sm:min-h-[44px]
      "
      htmlFor={`${keyItem}-${option.id}`}
    >
      <Checkbox
        id={`${keyItem}-${option.id}`}
        checked={isChecked}
        onCheckedChange={handleChange}
        aria-label={`Filter by ${option.label} in ${keyItem} category`}
        aria-describedby={`${keyItem}-${option.id}-desc`}
        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
      />
      <span className="select-none flex-1 font-medium leading-tight">
        {option.label}
      </span>
      <span id={`${keyItem}-${option.id}-desc`} className="sr-only">
        {isChecked ? "Currently selected" : "Not selected"}
      </span>
    </Label>
  );
});

FilterOption.displayName = "FilterOption";

// Memoized filter category component with responsive text
const FilterCategory = memo(
  ({ keyItem, options, filters, handleFilter, isLast }) => {
    const categoryTitle = useMemo(() => {
      return keyItem.charAt(0).toUpperCase() + keyItem.slice(1);
    }, [keyItem]);

    // ✅ FIX 2: Consistent lowercase key access
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
        <fieldset className="space-y-3 sm:space-y-4">
          <legend
            className="
            text-sm sm:text-base md:text-lg lg:text-xl
            font-bold text-gray-900 
            border-b pb-2 mb-3 sm:mb-4
            w-full flex flex-col sm:flex-row sm:items-center sm:justify-between
            gap-1 sm:gap-2
          "
          >
            <span className="leading-tight">{categoryTitle}</span>
            {selectedCount > 0 && (
              <span
                className="
                  text-xs sm:text-sm font-normal text-blue-600
                  bg-blue-50 px-2 py-0.5 rounded-full
                  w-fit
                "
                aria-label={`${selectedCount} filters selected in ${categoryTitle}`}
              >
                ({selectedCount} selected)
              </span>
            )}
          </legend>
          <div
            className="space-y-1 sm:space-y-2"
            role="group"
            aria-label={`${categoryTitle} filter options`}
          >
            {filterOptions}
          </div>
        </fieldset>
        {!isLast && <Separator className="my-4 sm:my-6" role="separator" />}
      </Fragment>
    );
  }
);

FilterCategory.displayName = "FilterCategory";

// Mobile filter sheet content with responsive text
const MobileFilterContent = memo(
  ({ filters, handleFilter, activeFilterCount, onClearAll }) => {
    // ✅ FIX 3: Consistent key mapping - use lowercase throughout
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
          className="
            flex items-center justify-between 
            p-4 sm:p-6 border-b bg-gray-50
            min-h-[60px] sm:min-h-[72px]
          "
          role="banner"
        >
          <h2
            className="
              text-lg sm:text-xl md:text-2xl 
              font-bold text-gray-900 
              leading-tight
            "
            id="mobile-filter-title"
          >
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                className="
                  bg-primary text-primary-foreground 
                  text-xs sm:text-sm 
                  px-2 py-1 rounded-full
                  min-w-[24px] text-center
                "
                aria-label={`${activeFilterCount} filters currently active`}
                role="status"
              >
                {activeFilterCount}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="
                  text-red-600 hover:text-red-700 hover:bg-red-50
                  text-xs sm:text-sm
                  px-2 sm:px-3 py-1
                  h-auto min-h-[32px]
                "
                aria-label="Clear all active filters"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Filter Content */}
        <div
          className="
            flex-1 overflow-y-auto 
            p-4 sm:p-6 
            space-y-4 sm:space-y-6
          "
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

// Desktop filter sidebar with responsive text
const DesktopFilter = memo(
  ({ filters, handleFilter, activeFilterCount, onClearAll }) => {
    // ✅ FIX 4: Consistent key mapping - use lowercase throughout
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
        className="
          bg-background rounded-lg shadow-sm border 
          h-fit sticky top-4
          w-full min-w-[240px] max-w-[320px]
        "
        role="complementary"
        aria-label="Product filters"
      >
        <div
          className="
            p-3 sm:p-4 border-b bg-gray-50 rounded-t-lg
            min-h-[56px] sm:min-h-[64px]
          "
          role="banner"
        >
          <div className="flex items-center justify-between">
            <h2
              className="
                text-base sm:text-lg md:text-xl
                font-extrabold text-gray-900
                leading-tight
              "
              id="desktop-filter-title"
            >
              Filters
            </h2>
            <div className="flex items-center gap-1 sm:gap-2">
              {activeFilterCount > 0 && (
                <span
                  className="
                    bg-primary text-primary-foreground 
                    text-xs sm:text-sm 
                    px-1.5 sm:px-2 py-0.5 sm:py-1 
                    rounded-full
                    min-w-[20px] sm:min-w-[24px] text-center
                  "
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
                  className="
                    text-red-600 hover:text-red-700 hover:bg-red-50 
                    text-xs sm:text-sm
                    p-1 sm:p-2
                    h-auto min-h-[28px] sm:min-h-[32px]
                  "
                  aria-label="Clear all applied filters"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        <div
          className="
            p-3 sm:p-4 
            space-y-3 sm:space-y-4 
            max-h-[60vh] sm:max-h-[70vh] lg:max-h-[80vh] 
            overflow-y-auto
          "
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

// Main accessible filter component with responsive mobile support
const ProductFilter = memo(({ filters, handleFilter }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // ✅ FIX 5: Improved active filter count calculation with consistent keys
  const activeFilterCount = useMemo(() => {
    if (!filters) return 0;

    console.log("🔍 Calculating active filters:", filters);

    return Object.values(filters).reduce((count, filterArray) => {
      return count + (Array.isArray(filterArray) ? filterArray.length : 0);
    }, 0);
  }, [filters]);

  // ✅ FIX 6: Enhanced clear all filters handler
  const handleClearAll = useCallback(() => {
    console.log("🧹 Clearing all filters, current filters:", filters);

    if (!filters) return;

    // Clear each filter category by toggling all selected options
    Object.keys(filters).forEach((filterKey) => {
      const selectedOptions = filters[filterKey];
      if (Array.isArray(selectedOptions)) {
        selectedOptions.forEach((optionValue) => {
          handleFilter(filterKey, optionValue);
        });
      }
    });

    // Also clear sessionStorage to prevent conflicts
    sessionStorage.removeItem("filters");

    console.log("✅ All filters cleared");
  }, [filters, handleFilter]);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-3 sm:mb-4">
        <Sheet
          open={isMobileFilterOpen}
          onOpenChange={setIsMobileFilterOpen}
          aria-label="Mobile filter menu"
        >
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="
                w-full flex items-center justify-center gap-2 sm:gap-3
                h-10 sm:h-12
                text-sm sm:text-base
                font-medium
              "
              aria-label={`Open filters menu. ${activeFilterCount} filters currently active`}
              aria-expanded={isMobileFilterOpen}
              aria-haspopup="dialog"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span
                  className="
                    bg-primary text-primary-foreground 
                    text-xs sm:text-sm 
                    px-1.5 sm:px-2 py-0.5 sm:py-1 
                    rounded-full ml-1 sm:ml-2
                    min-w-[18px] sm:min-w-[20px] text-center
                  "
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
