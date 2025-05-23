import { Button } from "~/components/ui/Button";
import { ExternalLink } from "lucide-react";
import type { Chain, TransactionReceipt } from "viem";
import { generateBlockExplorerLink, generateSafeAppLink } from "~/lib/utils";

interface ExtraContentProps {
  message?: React.ReactNode;
  hypercertId: string;
  onClose?: () => void;
  chain: Chain;
  isSafe?: boolean;
  safeAddress?: `0x${string}`;
  receipt?: TransactionReceipt;
}

// TODO: not really reusable for safe. breaks when minting hypercert from safe.
// We should make this reusable for all strategies.
export function ExtraContent({
  message = "Your hypercert has been minted successfully!",
  hypercertId,
  onClose,
  chain,
  isSafe,
  safeAddress,
  receipt,
}: ExtraContentProps) {
  const handleHypercertClick = () => {
    if (onClose) {
      window.location.href = `/hypercerts/${hypercertId}`;
      onClose();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <p className="text-lg font-medium">Success</p>
      <p className="text-sm font-medium">{message}</p>
      <div className="flex space-x-4 py-4 justify-center">
        <Button
          onClick={onClose ? handleHypercertClick : undefined}
          asChild={!onClose}
        >
          {onClose ? (
            "View hypercert"
          ) : (
            <a
              href={`/hypercerts/${hypercertId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View hypercert
            </a>
          )}
        </Button>

        {chain && (
          <Button asChild>
            {isSafe ? (
              <a
                href={generateSafeAppLink(chain, safeAddress!)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Safe <ExternalLink size={14} className="ml-2" />
              </a>
            ) : (
              <a
                href={generateBlockExplorerLink(
                  chain,
                  receipt?.transactionHash ?? "",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                View transaction <ExternalLink size={14} className="ml-2" />
              </a>
            )}
          </Button>
        )}
      </div>
      <p className="text-sm font-medium">
        New ownership will not be immediately visible on the Hypercerts page,
        but will be visible in 5-10 minutes.
      </p>
    </div>
  );
}

// For backwards compatibility
export const createExtraContent = ({
  receipt,
  hypercertId,
  chain,
}: {
  receipt: TransactionReceipt;
  hypercertId?: string;
  chain: Chain;
}) => {
  if (!hypercertId) return null;

  return (
    <ExtraContent hypercertId={hypercertId} chain={chain} receipt={receipt} />
  );
};