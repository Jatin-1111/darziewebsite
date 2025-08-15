// src/components/shopping-view/filter.jsx - MOBILE RESPONSIVE VERSION
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

// Memoized filter option component
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
      "
      htmlFor={`${keyItem}-${option.id}`}
    >
      <Checkbox
        id={`${keyItem}-${option.id}`}
        checked={isChecked}
        onCheckedChange={handleChange}
        aria-label={`Filter by ${option.label}`}
        className="w-5 h-5"
      />
      <span className="select-none flex-1">{option.label}</span>
    </Label>
  );
});

FilterOption.displayName = "FilterOption";

// Memoized filter category component
const FilterCategory = memo(
  ({ keyItem, options, filters, handleFilter, isLast }) => {
    const categoryTitle = useMemo(() => {
      return keyItem.charAt(0).toUpperCase() + keyItem.slice(1);
    }, [keyItem]);

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
        <div className="space-y-4">
          <h3
            className="
            text-base sm:text-lg font-bold text-gray-900 
            border-b pb-2 mb-4
          "
          >
            {categoryTitle}
          </h3>
          <div className="space-y-2">{filterOptions}</div>
        </div>
        {!isLast && <Separator className="my-6" />}
      </Fragment>
    );
  }
);

FilterCategory.displayName = "FilterCategory";

// Mobile filter sheet content
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
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filterCategories}
        </div>
      </div>
    );
  }
);

MobileFilterContent.displayName = "MobileFilterContent";

// Desktop filter sidebar
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
        <div className="p-4 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-gray-900">Filters</h2>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <span
                  className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full"
                  aria-label={`${activeFilterCount} filters applied`}
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
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {filterCategories}
        </div>
      </aside>
    );
  }
);

DesktopFilter.displayName = "DesktopFilter";

// Main optimized filter component with mobile support
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
  }, [filters, handleFilter]);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-12"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full ml-2">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-sm p-0">
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
