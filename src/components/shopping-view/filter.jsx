// src/components/ProductFilter.jsx
import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label"; // Assuming this path
import { Checkbox } from "../ui/checkbox"; // Assuming this path
import { Separator } from "../ui/separator"; // Assuming this path

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem, index) => (
          <Fragment key={keyItem}> {/* Added key for Fragment */}
            <div>
              <h3 className="text-base font-bold">{keyItem}</h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option) => (
                  <Label key={option.id} className="flex font-medium items-center gap-2"> {/* Added key for Label */}
                    <Checkbox
                      checked={
                        // Check if filters exist, then if the category exists, then if the option is in the array
                        filters &&
                        filters[keyItem] &&
                        filters[keyItem].includes(option.id) // Use .includes() for clarity
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            {/* Add Separator only if it's not the last filter category */}
            {index < Object.keys(filterOptions).length - 1 && <Separator />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;