import { memo, useMemo, useCallback, Fragment } from "react";
import { filterOptions } from "@/config";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

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
      className="flex font-medium items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
      htmlFor={`${keyItem}-${option.id}`}
    >
      <Checkbox
        id={`${keyItem}-${option.id}`}
        checked={isChecked}
        onCheckedChange={handleChange}
        aria-label={`Filter by ${option.label}`}
      />
      <span className="select-none">{option.label}</span>
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
        <div className="space-y-3">
          <h3 className="text-base font-bold text-gray-900 border-b pb-2">
            {categoryTitle}
          </h3>
          <div className="grid gap-1">{filterOptions}</div>
        </div>
        {!isLast && <Separator className="my-4" />}
      </Fragment>
    );
  }
);

FilterCategory.displayName = "FilterCategory";

// Main optimized filter component
const ProductFilter = memo(({ filters, handleFilter }) => {
  // Memoize filter categories to prevent unnecessary re-renders
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

  // Memoize active filter count for performance monitoring
  const activeFilterCount = useMemo(() => {
    if (!filters) return 0;
    return Object.values(filters).reduce((count, filterArray) => {
      return count + (Array.isArray(filterArray) ? filterArray.length : 0);
    }, 0);
  }, [filters]);

  return (
    <aside
      className="bg-background rounded-lg shadow-sm border h-fit sticky top-4"
      role="complementary"
      aria-label="Product filters"
    >
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span
              className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full"
              aria-label={`${activeFilterCount} filters applied`}
            >
              {activeFilterCount}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
        {filterCategories}
      </div>
    </aside>
  );
});

ProductFilter.displayName = "ProductFilter";

export default ProductFilter;
