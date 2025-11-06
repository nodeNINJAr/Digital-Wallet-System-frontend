import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// loading state




export const loadingHandler = (duration =1000) => {
     
    return new Promise((resolve)=>{
          let loading = true
          
          setTimeout(() => {
                  loading = false
                  resolve(loading)

          }, duration);
    })

}

