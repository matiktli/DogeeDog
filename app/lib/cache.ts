import { revalidateTag } from 'next/cache'

// Cache tag constants
export const CACHE_TAG_DOG = 'dog'
export const CACHE_TAG_DOGS = 'dogs'

// Add cache tag constant
export const CACHE_TAG_ACTIVITY = 'activity'

export function revalidateDogCache(dogId: string | undefined) {
    if (!dogId) {
        revalidateTag(`${CACHE_TAG_DOG}-${dogId}`)
    }
    revalidateTag(CACHE_TAG_DOGS) // Revalidate the dogs list as well
}

export function revalidateActivityCache() {
    revalidateTag(CACHE_TAG_ACTIVITY)
} 