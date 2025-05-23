import { FormattedUnits } from "~/components/formatted-units";
import { Button } from "~/components/ui/Button";
import { useToast } from "~/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { HypercertFull } from "~/lib/hypercert-full.fragment";
import { BuyFractionalMakerAskParams, MarketplaceOrder } from "~/lib/types";
import {
  decodeFractionalOrderParams,
  formatPrice,
  getCurrencyByAddress,
  getPricePerPercent,
  getPricePerUnit,
} from "~/lib/hypercerts-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { parseUnits } from "viem";
import z from "zod";
import { DEFAULT_NUM_UNITS, DEFAULT_NUM_UNITS_DECIMALS } from "~/lib/hypercerts";
import { useBuyFractionalStrategy } from "~/lib/useBuyFractionalStrategy";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "~/lib/account-store";

export const useBuyFractionalMakerAsk = () => {
    const strategy = useBuyFractionalStrategy();
    const { toast } = useToast();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitError = useStore((state: any) => state.emitError);
  
    return useMutation({
      mutationKey: ["buyFractionalMakerAsk"],
      onError: (e) => {
        toast({
          title: "Error",
          description: e.message,
          duration: 5000,
        });
        emitError(e)
      },
      mutationFn: async (ask: BuyFractionalMakerAskParams) => {
        await strategy().execute(ask);
      },
    });
};

const calculateBigIntPercentage = (
    numerator: bigint | string | null | undefined,
    denominator: bigint | string | null | undefined,
) => {
    if (!numerator || !denominator) {
      return undefined;
    }
    const numeratorBigInt = BigInt(numerator);
    const denominatorBigInt = BigInt(denominator);
    const precision = 10 ** 18;
    const unCorrected = Number(
      (numeratorBigInt * BigInt(100) * BigInt(precision)) / denominatorBigInt,
    );
    return unCorrected / precision;
};

const formSchema = z
  .object({
    percentageAmount: z.string(),
    maxPercentageAmount: z.string(),
    minPercentageAmount: z.string(),
    pricePerPercent: z.string(),
    minPricePerPercent: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!(Number(data.percentageAmount) <= Number(data.maxPercentageAmount))) {
      ctx.addIssue({
        path: ["percentageAmount"],
        message: "Must be less than max percentage",
        code: z.ZodIssueCode.custom,
      });
    }
  })
  .superRefine((data, ctx) => {
    if (!(Number(data.percentageAmount) >= Number(data.minPercentageAmount))) {
      ctx.addIssue({
        path: ["percentageAmount"],
        message: "Must be more than min percentage",
        code: z.ZodIssueCode.custom,
      });
    }
  })
  .superRefine((data, ctx) => {
    if (!(Number(data.pricePerPercent) >= Number(data.minPricePerPercent))) {
      ctx.addIssue({
        path: ["pricePerPercent"],
        message: "Must be more than min price",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type BuyFractionalOrderFormValues = z.infer<typeof formSchema>;

export const BuyFractionalOrderForm = ({
  order,
  hypercert,
  onBuyOrder,
  onCompleted,
}: {
  order: MarketplaceOrder;
  hypercert: HypercertFull;
  onBuyOrder: (orderId: string) => void;
  onCompleted?: () => void;
}) => {
  const { minUnitAmount, maxUnitAmount, minUnitsToKeep } =
    decodeFractionalOrderParams(order.additionalParameters);

  const availableUnits = BigInt(hypercert?.units || 0) - BigInt(minUnitsToKeep);
  const maxUnitAmountToBuy =
    availableUnits > maxUnitAmount ? maxUnitAmount : availableUnits;

  const getUnitsToBuy = (percentageAmount: string) => {
    try {
      const hypercertUnits = BigInt(hypercert.units || 0);
      const percentageAsBigInt = parseUnits(
        percentageAmount,
        DEFAULT_NUM_UNITS_DECIMALS,
      );
      const unitsToBuy =
        (hypercertUnits * percentageAsBigInt) /
        (BigInt(100) * DEFAULT_NUM_UNITS);
      return unitsToBuy < BigInt(0) ? BigInt(0) : unitsToBuy;
    } catch (e) {
      console.error(e);
      return BigInt(0);
    }
  };

  const getPercentageForUnits = (units: bigint) => {
    return (units * BigInt(100)) / BigInt(hypercert?.units || 0);
  };

  const currency = getCurrencyByAddress(order.chainId, order.currency);

  if (!currency) {
    throw new Error("Currency not supported");
  }

  const minPercentageAmount = getPercentageForUnits(minUnitAmount).toString();
  const maxPercentageAmount = calculateBigIntPercentage(
    maxUnitAmountToBuy,
    BigInt(hypercert.units || 0),
  )?.toString();
  const minPricePerPercent = getPricePerPercent(
    order.price,
    BigInt(hypercert.units || 0),
  );

  const form = useForm<BuyFractionalOrderFormValues>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    defaultValues: {
      minPercentageAmount,
      maxPercentageAmount,
      percentageAmount: minPercentageAmount,
      minPricePerPercent: minPricePerPercent.toString(),
      pricePerPercent: minPricePerPercent.toString(),
    },
  });

  const { mutateAsync: buyFractionalMakerAsk } = useBuyFractionalMakerAsk();

  const onSubmit = async (values: BuyFractionalOrderFormValues) => {
    const hypercertUnits = BigInt(hypercert.units || 0);

    if (!hypercertUnits) {
      throw new Error("Invalid hypercert units");
    }

    const unitAmount = getUnitsToBuy(values.percentageAmount);
    const pricePerUnit = getPricePerUnit(
      values.pricePerPercent,
      hypercertUnits,
    ).toString();

    onBuyOrder(order.orderNonce);

    try {
      await buyFractionalMakerAsk({
        order,
        unitAmount,
        pricePerUnit,
        hypercertName: hypercert?.metadata?.name,
        totalUnitsInHypercert: hypercertUnits,
      });
      onCompleted?.();
    } catch (error) {
      console.error("Error buying fractional order:", error);
      throw error;
    }
  };

  const percentageAmount = form.watch("percentageAmount");
  const pricePerPercent = form.watch("pricePerPercent");

  const unitsToBuy = getUnitsToBuy(percentageAmount);
  const pricePerUnit = getPricePerUnit(
    pricePerPercent,
    BigInt(hypercert.units || 0),
  );

  const totalPrice = formatPrice(
    order.chainId,
    unitsToBuy * pricePerUnit,
    currency.address,
    true,
  );

  const formattedMinPrice = formatPrice(
    order.chainId,
    BigInt(minPricePerPercent),
    currency.address,
  );

  const disabled = !form.formState.isValid || unitsToBuy === BigInt(0);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="percentageAmount"
          render={({ field }) => (
            <FormItem>
              <h5 className="uppercase text-sm text-teal-600 font-medium tracking-wider">
                How many %?
              </h5>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      field.onChange(value);
                    }
                  }}
                  className="border border-teal-500 focus:border-teal-600 focus:ring focus:ring-teal-200"
                />
              </FormControl>
              <div className="text-sm text-teal-600">
                You will buy{" "}
                <b>
                  <FormattedUnits>{unitsToBuy.toString()}</FormattedUnits>
                </b>{" "}
                units, for a total of <b>{totalPrice}</b>. (min:{" "}
                {minPercentageAmount}%, max: {maxPercentageAmount}%)
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricePerPercent"
          render={({ field }) => (
            <FormItem>
              <h5 className="uppercase text-sm text-teal-600 font-medium tracking-wider">
                Price per %
              </h5>
              <FormControl>
                <Input
                  {...field}
                  value={formatPrice(
                    order.chainId,
                    BigInt(field.value),
                    currency.address,
                  )}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      field.onChange(
                        parseUnits(value, currency.decimals).toString(),
                      );
                    }
                  }}
                  className="border border-teal-500 focus:border-teal-600 focus:ring focus:ring-teal-200"
                />
              </FormControl>
              <div className="text-sm text-teal-600">
                You can voluntarily increase the price. (min:{" "}
                <b>
                  {formattedMinPrice} {currency.symbol}
                </b>
                ).
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="outline" type="submit" disabled={disabled} className="w-full text-bold text-teal-600 border-teal-600">
          Execute order
        </Button>
      </form>
    </Form>
  );
};
