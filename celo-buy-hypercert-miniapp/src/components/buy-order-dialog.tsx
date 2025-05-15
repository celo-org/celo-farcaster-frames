import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { OrderFragment } from "~/lib/order.fragment";
import { BuyFractionalOrderForm } from "~/components/buy-fractional-order-form";
import { orderFragmentToMarketplaceOrder } from "~/lib/hypercerts-utils";
import { HypercertFull } from "~/lib/hypercert-full.fragment";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { StepProcessDialogProvider } from "./step-process-dialog";

interface BuyOrderDialogProps {
    order: OrderFragment;
    hypercert: HypercertFull;
    onBuyOrder: (orderId: string) => void;
    onComplete: () => void;
    isProcessing: boolean;
    trigger: React.ReactNode;
}

export function BuyOrderDialog({
    order,
    hypercert,
    onComplete,
    onBuyOrder,
    isProcessing,
    trigger,
}: BuyOrderDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const marketplaceOrder = orderFragmentToMarketplaceOrder(order);

    const handleClose = () => {
        setIsOpen(false);
        onComplete();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="p-6 text-teal-600">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-600">Buy Hypercert Fraction</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-teal-600">Complete your purchase of the Hypercert fraction.</DialogDescription>
                {isProcessing ? (
                    <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <span className="ml-2 text-gray-700">Processing transaction...</span>
                    </div>
                ) : (
                    <StepProcessDialogProvider>
                        <BuyFractionalOrderForm
                            order={marketplaceOrder}
                            hypercert={hypercert}
                            onCompleted={handleClose}
                            onBuyOrder={onBuyOrder}
                        />
                    </StepProcessDialogProvider>
                )}
            </DialogContent>
        </Dialog>
    );
}