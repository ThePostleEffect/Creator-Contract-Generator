/**
 * Text normalization utilities for professional PDF export
 */

/**
 * Capitalize first letter of each word in a name
 */
export function capitalizeName(name: string | undefined): string {
  if (!name) return "";
  return name
    .trim()
    .split(" ")
    .map((word) => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Standardize date format to "Month DD, YYYY"
 */
export function standardizeDate(dateStr: string | undefined): string {
  if (!dateStr) return "";
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Return original if invalid
    
    const options: Intl.DateTimeFormatOptions = { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };
    return date.toLocaleDateString("en-US", options);
  } catch {
    return dateStr;
  }
}

/**
 * Capitalize city and state properly
 */
export function capitalizeCityState(cityState: string | undefined): string {
  if (!cityState) return "";
  
  return cityState
    .trim()
    .split(",")
    .map((part) => {
      return part
        .trim()
        .split(" ")
        .map((word) => {
          if (word.length === 0) return word;
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
    })
    .join(", ");
}

/**
 * Clean and normalize text by removing extra whitespace
 */
export function cleanText(text: string | undefined): string {
  if (!text) return "";
  return text.trim().replace(/\s+/g, " ");
}

/**
 * Check if a value is empty or undefined
 */
export function isEmpty(value: any): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (typeof value === "number") return false;
  return true;
}
