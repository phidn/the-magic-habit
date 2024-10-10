import { ButtonLink, Input, Label, LinkOutIcon, MomoIcon, PaypalIcon } from '@mazic/ui'

const BUY_ME_LINKS = {
  paypal: 'https://www.paypal.com/paypalme/phidn',
  momo: 'https://me.momo.vn/phidang',
}

export const BuyMeModal = () => {
  return (
    <div>
      <div className="mazic-row items-center pr-4">
        <div className="mazic-col-11">
          <Label htmlFor="paypal_link" className="sr-only">
            Link
          </Label>
          <div className="relative w-full ">
            <PaypalIcon className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
            <Input id="paypal_link" defaultValue={BUY_ME_LINKS.paypal} readOnly className="pl-8 " />
          </div>
        </div>
        <div className="mazic-col-1">
          <ButtonLink href={BUY_ME_LINKS.paypal} target="_blank" size="sm">
            <LinkOutIcon className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
      <div className="mazic-row items-center pr-4">
        <div className="mazic-col-11">
          <Label htmlFor="momo_link" className="sr-only">
            Link
          </Label>
          <div className="relative w-full ">
            <MomoIcon className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
            <Input id="momo_link" defaultValue={BUY_ME_LINKS.momo} readOnly className="pl-8 " />
          </div>
        </div>
        <div className="mazic-col-1">
          <ButtonLink href={BUY_ME_LINKS.momo} target="_blank" size="sm">
            <LinkOutIcon className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}
