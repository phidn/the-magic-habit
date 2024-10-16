import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'

import { Badge } from '@mazic/ui'
import { Button } from '@mazic/ui'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@mazic/ui'

import { BuyMeModal } from '@mazic/components/Modals/BuyMeModal'
import { CONFIG } from '@mazic/config/config'
import { pathRoutes } from '@mazic/config/pathRoutes'
import { useStoreShallow } from '@mazic/store/useStore'

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string
  popular: PopularPlanType
  price: number
  description: string
  buttonText: string
  buttonOnClick?: () => void
  benefitList: string[]
}

export const Pricing = () => {
  const navigate = useNavigate()
  const showModal = useStoreShallow((state) => state.showModal)
  const pricingList: PricingProps[] = [
    {
      title: 'Free',
      popular: 0,
      price: 0,
      description: 'Everything in free, enjoy your life.',
      benefitList: ['Everything in free'],
      buttonText: 'Enjoy for free',
      buttonOnClick: () => {
        navigate(pathRoutes.auth.signUp)
      },
    },
    {
      title: 'Donate',
      popular: 1,
      price: 5,
      description: 'Support us to keep the project alive.',
      benefitList: ['Features of Free plan', 'New Features', 'Priority support'],
      buttonText: 'Support us',
      buttonOnClick: () => {
        showModal({
          open: true,
          showConfirm: false,
          title: 'Buy Me a Coffee',
          description: `Money to sponsor the development of ${CONFIG.appNameShort}`,
          body: <BuyMeModal />,
        })
      },
    },
  ]
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Get
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {' '}
          Unlimited{' '}
        </span>
        Access
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Choose the plan that suits you best.
      </h3>
      <div className="grid md:grid-cols-12 lg:grid-cols-12 gap-8">
        <div className="col-span-2"></div>
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={
              pricing.popular === PopularPlanType.YES
                ? 'col-span-4 drop-shadow-xl shadow-black/10 dark:shadow-white/10'
                : 'col-span-4'
            }
          >
            <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge variant="secondary" className="text-sm text-primary">
                    Support
                  </Badge>
                ) : null}
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">${pricing.price}</span>
                <span className="text-muted-foreground"> /month</span>
              </div>

              <CardDescription>{pricing.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                className="w-full"
                onClick={() => {
                  pricing.buttonOnClick?.()
                }}
              >
                {pricing.buttonText}
              </Button>
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitList.map((benefit: string) => (
                  <span key={benefit} className="flex">
                    <Check className="text-green-500" /> <h3 className="ml-2">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
        <div className="col-span-2"></div>
      </div>
    </section>
  )
}
