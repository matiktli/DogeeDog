interface PriceConfig {
    key: 'ONE_TIME' | 'MONTHLY',
    link: string | undefined,
    priceId: string | undefined,
    price: number,
    duration: '/month' | '/one-time'
  }

export const prices: PriceConfig[] = [
    {
        key: 'MONTHLY',
        link: process.env.NEXT_PUBLIC_PRICE_LINK_MONTH,
        priceId: process.env.PRICE_ID_MONTH,
        price: 5.00,
        duration: '/month'
    },
    {
        key: 'ONE_TIME',
        link: process.env.NEXT_PUBLIC_PRICE_LINK_ONE_TIME,
        priceId: process.env.PRICE_ID_ONE_TIME,
        price: 50.00,
        duration: '/one-time'
      }
] 