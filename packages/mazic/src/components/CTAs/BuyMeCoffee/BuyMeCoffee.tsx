import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CoffeeIcon,
} from '@mazic/ui'
import { BuyMeModal } from '@mazic/components/Modals/BuyMeModal'
import { CONFIG } from '@mazic/config/config'
import { useStoreShallow } from '@mazic/store/useStore'

export const BuyMeCoffee = () => {
  const showModal = useStoreShallow((state) => state.showModal)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Enjoying your habit?</CardTitle>
        <CardDescription>Money to sponsor the development of {CONFIG.appNameShort}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="colored"
          onClick={() => {
            showModal({
              open: true,
              showConfirm: false,
              title: 'Buy Me a Coffee',
              description: `Money to sponsor the development of ${CONFIG.appNameShort}`,
              body: <BuyMeModal />,
            })
          }}
        >
          <CoffeeIcon className="mr-1" />
          <span>Buy Me a Coffee</span>
        </Button>
      </CardContent>
    </Card>
  )
}
